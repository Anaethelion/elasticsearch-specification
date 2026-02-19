#!/usr/bin/env ts-node
/**
 * Extract ES|QL language metadata from the Elasticsearch Java source.
 *
 * This script parses:
 *   - Function classes annotated with @FunctionInfo/@Param/@MapParam
 *   - EsqlFunctionRegistry.java for function aliases and registry
 *   - EsqlBaseParser.g4 for command grammar
 *   - Expression.g4 for operator grammar
 *   - DataType.java for the type catalog
 *
 * It generates/updates TypeScript files under specification/esql/_lang/.
 *
 * Usage:
 *   npx ts-node src/extract-esql-lang.ts --es-path /path/to/elasticsearch
 *
 * Or via the Makefile:
 *   make extract-esql-lang es=/path/to/elasticsearch
 *
 * The script expects the Elasticsearch repository to be checked out locally.
 */

import * as fs from 'fs'
import * as path from 'path'
import Parser from 'tree-sitter'
import Java from 'tree-sitter-java'

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
let esPath = ''
let outDir = ''

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--es-path' && args[i + 1]) {
    esPath = args[++i]
  } else if (args[i] === '--out' && args[i + 1]) {
    outDir = args[++i]
  }
}

if (!esPath) {
  console.error('Usage: npx ts-node src/extract-esql-lang.ts --es-path /path/to/elasticsearch [--out /path/to/spec/esql/_lang]')
  process.exit(1)
}

// npm sets cwd to the package directory; resolve relative paths against the
// original working directory so that `make extract-esql-lang es=../elasticsearch` works.
const invocationCwd = process.env.INIT_CWD ?? process.cwd()
esPath = path.resolve(invocationCwd, esPath)

if (!outDir) {
  outDir = path.join(__dirname, '..', '..', 'specification', 'esql', '_lang')
} else {
  outDir = path.resolve(invocationCwd, outDir)
}

const esqlPlugin = path.join(esPath, 'x-pack', 'plugin', 'esql')
const esqlSrc = path.join(esqlPlugin, 'src', 'main', 'java')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MapParamEntry {
  name: string
  types: string[]
  valueHint: string[]
  description: string
}

interface MapParamDef {
  name: string
  description: string
  entries: MapParamEntry[]
  optional: boolean
}

interface FunctionParam {
  name: string
  types: string[]
  description: string
  optional: boolean
}

interface AvailabilityEntry {
  lifecycle: string
  version: string
}

interface FunctionDef {
  name: string
  kind: string
  description: string
  params: FunctionParam[]
  mapParams: MapParamDef[]
  returnTypes: string[]
  aliases: string[]
  preview: boolean
  since?: string
  availability: AvailabilityEntry[]
  sourceSubdir: string
  /** Raw Java class name (uppercase), used for registry lookups */
  javaClassName: string
}

// ---------------------------------------------------------------------------
// tree-sitter parser (initialised once)
// ---------------------------------------------------------------------------

const tsParser = new Parser()
tsParser.setLanguage(Java)

type SyntaxNode = Parser.SyntaxNode

// ---------------------------------------------------------------------------
// File-system helpers
// ---------------------------------------------------------------------------

function findFiles (dir: string, pattern: RegExp): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findFiles(full, pattern))
    } else if (pattern.test(entry.name)) {
      results.push(full)
    }
  }
  return results
}

function readFile (filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

// ---------------------------------------------------------------------------
// AST helpers
// ---------------------------------------------------------------------------

function findAll (node: SyntaxNode, type: string): SyntaxNode[] {
  const results: SyntaxNode[] = []
  if (node.type === type) results.push(node)
  for (let i = 0; i < node.childCount; i++) {
    results.push(...findAll(node.child(i)!, type))
  }
  return results
}

function getAnnotationName (ann: SyntaxNode): string {
  const nameNode = ann.childForFieldName('name')
  return nameNode?.text ?? ''
}

/** Return a Map of attribute-name to value-node for direct element_value_pair children. */
function getAnnotationPairs (ann: SyntaxNode): Map<string, SyntaxNode> {
  const pairs = new Map<string, SyntaxNode>()
  const argList = ann.children.find(c => c.type === 'annotation_argument_list')
  if (argList == null) return pairs

  for (let i = 0; i < argList.childCount; i++) {
    const child = argList.child(i)!
    if (child.type === 'element_value_pair') {
      const key = child.childForFieldName('key')?.text
      const value = child.childForFieldName('value')
      if (key != null && value != null) {
        pairs.set(key, value)
      }
    }
  }
  return pairs
}

/** Resolve a string value node, handling string_literal, text blocks, and binary_expression (+concat). */
function resolveString (node: SyntaxNode): string {
  if (node.type === 'string_literal') {
    const text = node.text
    // Text block: """..."""
    if (text.startsWith('"""')) {
      return resolveTextBlock(text)
    }
    // Regular string: strip surrounding quotes
    return text.slice(1, -1)
  }

  if (node.type === 'binary_expression') {
    const parts: string[] = []
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i)!
      if (child.type === 'string_literal' || child.type === 'binary_expression') {
        parts.push(resolveString(child))
      }
    }
    return parts.join('')
  }

  return node.text
}

function resolveTextBlock (raw: string): string {
  const inner = raw.slice(3, -3)
  const lines = inner.split('\n')
  if (lines.length > 0 && lines[0].trim() === '') lines.shift()
  const indents = lines.filter(l => l.trim().length > 0).map(l => l.match(/^(\s*)/)![1].length)
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0
  return lines.map(l => l.slice(minIndent)).join('\n').trim()
}

/** Resolve an array value: `{ "a", "b" }` or a single `"value"`. */
function resolveStringArray (node: SyntaxNode): string[] {
  if (node.type === 'element_value_array_initializer') {
    const results: string[] = []
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i)!
      if (child.type === 'string_literal' || child.type === 'binary_expression') {
        results.push(resolveString(child))
      }
    }
    return results
  }

  if (node.type === 'string_literal' || node.type === 'binary_expression') {
    return [resolveString(node)]
  }

  return []
}

/** Resolve an enum constant (`FunctionType.AGGREGATE`) or quoted string. */
function resolveEnum (node: SyntaxNode): string {
  if (node.type === 'field_access') {
    const ids = findAll(node, 'identifier')
    return ids.length > 0 ? ids[ids.length - 1].text : node.text
  }
  if (node.type === 'string_literal') {
    return resolveString(node)
  }
  return node.text
}

function resolveBool (node: SyntaxNode): boolean {
  return node.type === 'true'
}

/** Resolve a param/entry name: string literals are unquoted; bare identifiers (Java constants) are lowercased. */
function resolveParamName (node: SyntaxNode): string {
  if (node.type === 'string_literal') return resolveString(node)
  return node.text.toLowerCase()
}

/** Strip Asciidoc markup, doc-system placeholders, and stray whitespace from Java descriptions. */
function sanitizeDescription (text: string): string {
  return text
    // {wikipedia}/Page_Name[display text] -> display text (https://en.wikipedia.org/wiki/Page_Name)
    .replace(/\{wikipedia\}\/([^\[]+)\[([^\]]+)\]/g, '$2 (https://en.wikipedia.org/wiki/$1)')
    // {attr}/path[display text] for any other attribute -> display text
    .replace(/\{[a-zA-Z_-]+\}\/[^\[]*\[([^\]]+)\]/g, '$1')
    // <<anchor,display text>> -> display text
    .replace(/<<[^,>]+,([^>]+)>>/g, '$1')
    // <<anchor>> -> anchor with hyphens as spaces
    .replace(/<<([^>]+)>>/g, (_, anchor: string) => anchor.replace(/-/g, ' '))
    // [text](docs-content://...) or [text](/reference/...) -> text
    .replace(/\[([^\]]+)\]\((docs-content:\/\/|\/reference\/)[^)]*\)/g, '$1')
    // literal \n -> space
    .replace(/\\n/g, ' ')
    // collapse multiple whitespace
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** Convert PascalCase class name to UPPER_SNAKE_CASE: HistogramPercentile -> HISTOGRAM_PERCENTILE */
function camelToUpperSnake (name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toUpperCase()
}

// ---------------------------------------------------------------------------
// Extract @FunctionInfo from a parsed Java file
// ---------------------------------------------------------------------------

function extractFunctionDefs (tree: Parser.Tree, filePath: string, functionDir: string): FunctionDef[] {
  const results: FunctionDef[] = []
  const root = tree.rootNode

  const classNode = findAll(root, 'class_declaration')[0]
  const classIdent = classNode?.children.find(c => c.type === 'type_identifier')
  const className = classIdent?.text ?? path.basename(filePath, '.java')

  const rel = path.relative(functionDir, filePath)
  const parts = rel.split(path.sep)
  parts.pop()
  const sourceSubdir = parts.join('/')

  const constructors = findAll(root, 'constructor_declaration')
  for (const ctor of constructors) {
    const mods = ctor.children.find(c => c.type === 'modifiers')
    if (mods == null) continue

    const annotations = findAll(mods, 'annotation')
    const funcInfoAnn = annotations.find(a => getAnnotationName(a) === 'FunctionInfo')
    if (funcInfoAnn == null) continue

    const pairs = getAnnotationPairs(funcInfoAnn)

    const returnTypes = pairs.has('returnType') ? resolveStringArray(pairs.get('returnType')!) : []
    const description = pairs.has('description') ? sanitizeDescription(resolveString(pairs.get('description')!)) : ''
    const kind = pairs.has('type') ? resolveEnum(pairs.get('type')!).toLowerCase() : 'scalar'
    const preview = pairs.has('preview') ? resolveBool(pairs.get('preview')!) : false
    const since = pairs.has('since') ? resolveString(pairs.get('since')!) || undefined : undefined

    const availability: AvailabilityEntry[] = []
    const appliesToNode = pairs.get('appliesTo')
    if (appliesToNode != null) {
      const ftaAnns = findAll(appliesToNode, 'annotation').filter(a =>
        getAnnotationName(a) === 'FunctionAppliesTo'
      )
      for (const fta of ftaAnns) {
        const ftaPairs = getAnnotationPairs(fta)
        const lcNode = ftaPairs.get('lifeCycle')
        const verNode = ftaPairs.get('version')
        if (lcNode != null) {
          availability.push({
            lifecycle: resolveEnum(lcNode).toUpperCase(),
            version: verNode != null ? resolveString(verNode) : ''
          })
        }
      }
    }

    const formalParams = findAll(ctor, 'formal_parameter')
    const params: FunctionParam[] = []
    const mapParams: MapParamDef[] = []

    for (const fp of formalParams) {
      const fpMods = fp.children.find(c => c.type === 'modifiers')
      if (fpMods == null) continue

      const fpAnnotations = findAll(fpMods, 'annotation')
      for (const ann of fpAnnotations) {
        const name = getAnnotationName(ann)
        if (name === 'Param') {
          const p = extractParam(ann)
          if (p != null) params.push(p)
        } else if (name === 'MapParam') {
          const mp = extractMapParam(ann)
          if (mp != null) mapParams.push(mp)
        }
      }
    }

    results.push({
      name: camelToUpperSnake(className),
      kind,
      description,
      params,
      mapParams,
      returnTypes,
      aliases: [],
      preview,
      since,
      availability,
      sourceSubdir,
      javaClassName: className.toUpperCase()
    })
  }

  return results
}

// ---------------------------------------------------------------------------
// Extract @Param
// ---------------------------------------------------------------------------

function extractParam (ann: SyntaxNode): FunctionParam | null {
  const pairs = getAnnotationPairs(ann)

  const nameNode = pairs.get('name')
  const name = nameNode != null ? resolveParamName(nameNode) : ''
  if (!name) return null

  const types = pairs.has('type') ? resolveStringArray(pairs.get('type')!) : []
  const description = pairs.has('description') ? sanitizeDescription(resolveString(pairs.get('description')!)) : ''
  const optional = pairs.has('optional') ? resolveBool(pairs.get('optional')!) : false

  return { name, types, description, optional }
}

// ---------------------------------------------------------------------------
// Extract @MapParam
// ---------------------------------------------------------------------------

function extractMapParam (ann: SyntaxNode): MapParamDef | null {
  const pairs = getAnnotationPairs(ann)

  const nameNode = pairs.get('name')
  const name = nameNode != null ? resolveParamName(nameNode) : ''
  const description = pairs.has('description') ? sanitizeDescription(resolveString(pairs.get('description')!)) : ''
  const optional = pairs.has('optional') ? resolveBool(pairs.get('optional')!) : false

  const entries: MapParamEntry[] = []

  const paramsNode = pairs.get('params')
  if (paramsNode != null) {
    const entryAnnotations = findAll(paramsNode, 'annotation').filter(a =>
      getAnnotationName(a).includes('MapParamEntry')
    )
    for (const entryAnn of entryAnnotations) {
      const ep = getAnnotationPairs(entryAnn)
      const eNameNode = ep.get('name')
      const eName = eNameNode != null ? resolveParamName(eNameNode) : ''
      if (!eName) continue

      const eTypes = ep.has('type') ? resolveStringArray(ep.get('type')!) : []
      const eValueHint = ep.has('valueHint') ? resolveStringArray(ep.get('valueHint')!) : []
      const eDesc = ep.has('description') ? sanitizeDescription(resolveString(ep.get('description')!)) : ''

      entries.push({ name: eName, types: eTypes, valueHint: eValueHint, description: eDesc })
    }
  }

  return { name, description, entries, optional }
}

// ---------------------------------------------------------------------------
// Parse function registry for aliases
// ---------------------------------------------------------------------------

interface RegistryEntry {
  /** Canonical ES|QL function name (uppercased) from the registry's first string arg */
  canonicalName: string
  /** Additional names (uppercased) */
  aliases: string[]
}

function parseRegistry (registryPath: string): Map<string, RegistryEntry> {
  const entries = new Map<string, RegistryEntry>()
  if (!fs.existsSync(registryPath)) return entries

  const content = readFile(registryPath)

  // Match: def(ClassName.class, <optional constructor ref>, "name1", "name2", ...)
  const defRegex = /def\s*\(\s*(\w+)\.class\s*,[^"]*?((?:"[^"]*"\s*,?\s*)+)\)/g
  let match: RegExpExecArray | null

  while ((match = defRegex.exec(content)) !== null) {
    const className = match[1].toUpperCase()
    const names = match[2].match(/"([^"]*)"/g)?.map(n => n.slice(1, -1).toUpperCase()) ?? []
    if (names.length > 0) {
      entries.set(className, {
        canonicalName: names[0],
        aliases: names.slice(1)
      })
    }
  }

  return entries
}

// ---------------------------------------------------------------------------
// Java subdir -> TypeScript filename mapping
// ---------------------------------------------------------------------------

function subdirToTsFile (subdir: string): string {
  if (subdir === '') return 'scalar_misc'
  if (subdir === 'scalar') return 'scalar_misc'
  if (subdir.startsWith('scalar/')) {
    const rest = subdir.slice(7)
    // Merge deeper nesting into the parent: scalar/string/regex -> scalar_string
    const topLevel = rest.split('/')[0]
    return 'scalar_' + topLevel
  }
  return subdir.replace(/\//g, '_')
}

// Types that are built-in to TypeScript and should not be declared in or imported from data_types.ts
const TS_BUILTIN_TYPES = new Set(['boolean', 'string', 'object'])

// ---------------------------------------------------------------------------
// Collect all types used by a set of functions
// ---------------------------------------------------------------------------

function collectUsedTypes (funcs: FunctionDef[]): Set<string> {
  const types = new Set<string>()
  for (const f of funcs) {
    for (const t of f.returnTypes) types.add(t)
    for (const p of f.params) {
      for (const t of p.types) types.add(t)
    }
    for (const mp of f.mapParams) {
      for (const e of mp.entries) {
        for (const t of e.types) types.add(t)
      }
    }
  }
  return types
}

// ---------------------------------------------------------------------------
// Sync missing types to data_types.ts
// ---------------------------------------------------------------------------

function syncDataTypes (allTypes: Set<string>, dataTypesPath: string): string[] {
  let content = readFile(dataTypesPath)
  const existing = new Set<string>()
  const re = /^export type (\w+)\s*=/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(content)) !== null) {
    existing.add(m[1])
  }

  const added: string[] = []
  const sorted = [...allTypes].sort()
  for (const t of sorted) {
    if (!existing.has(t) && !TS_BUILTIN_TYPES.has(t)) {
      content += `\n/**\n * @esql_data_type\n */\nexport type ${t} = '${t}'\n`
      added.push(t)
    }
  }

  if (added.length > 0) {
    fs.writeFileSync(dataTypesPath, content)
  }
  return added
}

// ---------------------------------------------------------------------------
// TypeScript file generation
// ---------------------------------------------------------------------------

const LICENSE_HEADER = `// @ts-nocheck \u2014 body-less function declarations are intentional (TS2391)
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */`

function generateTsFile (funcs: FunctionDef[]): string {
  const sorted = [...funcs].sort((a, b) => a.name.localeCompare(b.name))

  const usedTypes = collectUsedTypes(sorted)
  const importList = [...usedTypes].filter(t => !TS_BUILTIN_TYPES.has(t)).sort()

  const lines: string[] = [LICENSE_HEADER, '']

  if (importList.length > 0) {
    if (importList.length <= 4) {
      lines.push(`import { ${importList.join(', ')} } from '@esql/_lang/data_types'`)
    } else {
      lines.push('import {')
      for (let i = 0; i < importList.length; i += 6) {
        const chunk = importList.slice(i, i + 6)
        lines.push('  ' + chunk.join(', ') + (i + 6 < importList.length ? ',' : ''))
      }
      lines.push("} from '@esql/_lang/data_types'")
    }
  }

  for (const func of sorted) {
    lines.push('')

    // Emit MapParam options class before the function
    for (const mp of func.mapParams) {
      const optClassName = func.name + 'Options'
      lines.push('/**')
      lines.push(` * Options for the ${func.name} function.`)
      lines.push(' * @esql_map_param_type')
      lines.push(' */')
      lines.push(`export class ${optClassName} {`)
      for (const entry of mp.entries) {
        if (entry.description) {
          lines.push(`  /** ${entry.description} */`)
        }
        const entryType = entry.types.length > 0 ? entry.types.join(' | ') : 'keyword'
        lines.push(`  ${entry.name}${mp.optional || entry.name !== mp.entries[0]?.name ? '?' : ''}: ${entryType}`)
      }
      lines.push('}')
      lines.push('')
    }

    // JSDoc block
    const jsdocLines: string[] = []
    if (func.description) {
      const descLine = func.description.split('\n')[0].trim()
      if (descLine) jsdocLines.push(descLine)
    }
    jsdocLines.push(`@esql_function ${func.kind}`)
    for (const alias of func.aliases) {
      jsdocLines.push(`@esql_alias ${alias}`)
    }

    const gaEntry = func.availability.find(a => a.lifecycle === 'GA')
    const previewEntry = func.availability.find(a => a.lifecycle === 'PREVIEW')
    if (gaEntry?.version) {
      jsdocLines.push(`@availability stack since=${gaEntry.version}`)
      jsdocLines.push('@availability serverless')
    } else if (previewEntry?.version) {
      jsdocLines.push(`@availability stack since=${previewEntry.version}`)
      jsdocLines.push('@availability serverless')
    }

    if (func.preview || (func.availability.length > 0 && gaEntry == null)) {
      jsdocLines.push('@esql_preview')
    }

    lines.push('/**')
    for (const jl of jsdocLines) {
      lines.push(` * ${jl}`)
    }
    lines.push(' */')

    // Function declaration
    const returnUnion = func.returnTypes.join(' | ') || 'void'
    const paramStrs: string[] = []

    for (const p of func.params) {
      const typeUnion = p.types.join(' | ') || 'keyword'
      paramStrs.push(`${p.name}${p.optional ? '?' : ''}: ${typeUnion}`)
    }

    for (const mp of func.mapParams) {
      const optClassName = func.name + 'Options'
      paramStrs.push(`/** @esql_map_param */\n  ${mp.name}${mp.optional ? '?' : ''}: ${optClassName}`)
    }

    if (paramStrs.length === 0) {
      lines.push(`export function ${func.name}(): ${returnUnion}`)
    } else if (paramStrs.length <= 2 && !func.mapParams.length) {
      const inline = paramStrs.join(', ')
      const sig = `export function ${func.name}(${inline}): ${returnUnion}`
      if (sig.length <= 120) {
        lines.push(sig)
      } else {
        lines.push(`export function ${func.name}(`)
        for (let i = 0; i < paramStrs.length; i++) {
          lines.push(`  ${paramStrs[i]}${i < paramStrs.length - 1 ? ',' : ''}`)
        }
        lines.push(`): ${returnUnion}`)
      }
    } else {
      lines.push(`export function ${func.name}(`)
      for (let i = 0; i < paramStrs.length; i++) {
        lines.push(`  ${paramStrs[i]}${i < paramStrs.length - 1 ? ',' : ''}`)
      }
      lines.push(`): ${returnUnion}`)
    }
  }

  lines.push('')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main (): void {
  console.log(`Extracting ES|QL metadata from: ${esPath}`)
  console.log(`Output directory: ${outDir}`)
  console.log()

  const functionDir = path.join(esqlSrc, 'org', 'elasticsearch', 'xpack', 'esql', 'expression', 'function')
  const javaFiles = findFiles(functionDir, /\.java$/)
  console.log(`Found ${javaFiles.length} Java files in function directory`)

  const allFunctions: FunctionDef[] = []
  for (const file of javaFiles) {
    const content = readFile(file)
    if (content.includes('@FunctionInfo')) {
      const tree = tsParser.parse(content)
      const defs = extractFunctionDefs(tree, file, functionDir)
      allFunctions.push(...defs)
    }
  }

  const registryFiles = findFiles(esqlSrc, /EsqlFunctionRegistry\.java$/)
  for (const file of registryFiles) {
    const registry = parseRegistry(file)
    for (const func of allFunctions) {
      const entry = registry.get(func.javaClassName)
      if (entry != null) {
        func.name = entry.canonicalName
        func.aliases = entry.aliases
      }
    }
  }

  console.log(`Extracted ${allFunctions.length} function definitions`)

  const byKind = new Map<string, FunctionDef[]>()
  for (const func of allFunctions) {
    const kind = func.kind
    if (!byKind.has(kind)) byKind.set(kind, [])
    byKind.get(kind)!.push(func)
  }

  for (const [kind, funcs] of byKind.entries()) {
    console.log(`  ${kind}: ${funcs.length}`)
  }

  // Group functions by target TS file
  const byFile = new Map<string, FunctionDef[]>()
  for (const func of allFunctions) {
    const tsFile = subdirToTsFile(func.sourceSubdir)
    if (!byFile.has(tsFile)) byFile.set(tsFile, [])
    byFile.get(tsFile)!.push(func)
  }

  // Sync missing data types
  const allTypes = collectUsedTypes(allFunctions)
  const dataTypesPath = path.join(outDir, 'data_types.ts')
  const addedTypes = syncDataTypes(allTypes, dataTypesPath)
  if (addedTypes.length > 0) {
    console.log(`\nAdded ${addedTypes.length} new data types to data_types.ts:`)
    for (const t of addedTypes) {
      console.log(`  ${t}`)
    }
  }

  // Generate TS files
  const functionsDir = path.join(outDir, 'functions')
  fs.mkdirSync(functionsDir, { recursive: true })

  console.log(`\nGenerating TypeScript files:`)
  const sortedFiles = [...byFile.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  for (const [tsFile, funcs] of sortedFiles) {
    const content = generateTsFile(funcs)
    const filePath = path.join(functionsDir, `${tsFile}.ts`)
    fs.writeFileSync(filePath, content)
    console.log(`  ${tsFile}.ts: ${funcs.length} functions`)
  }

  console.log(`\nDone. Generated ${sortedFiles.length} files with ${allFunctions.length} functions.`)
}

main()
