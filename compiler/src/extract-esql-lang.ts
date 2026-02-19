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
  type: string
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

// ---------------------------------------------------------------------------
// Extract @FunctionInfo from a parsed Java file
// ---------------------------------------------------------------------------

function extractFunctionDefs (tree: Parser.Tree, filePath: string): FunctionDef[] {
  const results: FunctionDef[] = []
  const root = tree.rootNode

  const classNode = findAll(root, 'class_declaration')[0]
  const classIdent = classNode?.children.find(c => c.type === 'type_identifier')
  const className = classIdent?.text ?? path.basename(filePath, '.java')

  const constructors = findAll(root, 'constructor_declaration')
  for (const ctor of constructors) {
    const mods = ctor.children.find(c => c.type === 'modifiers')
    if (mods == null) continue

    const annotations = findAll(mods, 'annotation')
    const funcInfoAnn = annotations.find(a => getAnnotationName(a) === 'FunctionInfo')
    if (funcInfoAnn == null) continue

    const pairs = getAnnotationPairs(funcInfoAnn)

    const returnTypes = pairs.has('returnType') ? resolveStringArray(pairs.get('returnType')!) : []
    const description = pairs.has('description') ? resolveString(pairs.get('description')!) : ''
    const kind = pairs.has('type') ? resolveEnum(pairs.get('type')!).toLowerCase() : 'scalar'
    const preview = pairs.has('preview') ? resolveBool(pairs.get('preview')!) : false
    const since = pairs.has('since') ? resolveString(pairs.get('since')!) || undefined : undefined

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
      name: className.toUpperCase(),
      kind,
      description,
      params,
      mapParams,
      returnTypes,
      aliases: [],
      preview,
      since
    })
  }

  return results
}

// ---------------------------------------------------------------------------
// Extract @Param
// ---------------------------------------------------------------------------

function extractParam (ann: SyntaxNode): FunctionParam | null {
  const pairs = getAnnotationPairs(ann)

  const name = pairs.has('name') ? resolveString(pairs.get('name')!) : ''
  if (!name) return null

  const types = pairs.has('type') ? resolveStringArray(pairs.get('type')!) : []
  const description = pairs.has('description') ? resolveString(pairs.get('description')!) : ''
  const optional = pairs.has('optional') ? resolveBool(pairs.get('optional')!) : false

  return { name, types, description, optional }
}

// ---------------------------------------------------------------------------
// Extract @MapParam
// ---------------------------------------------------------------------------

function extractMapParam (ann: SyntaxNode): MapParamDef | null {
  const pairs = getAnnotationPairs(ann)

  const name = pairs.has('name') ? resolveString(pairs.get('name')!) : ''
  const description = pairs.has('description') ? resolveString(pairs.get('description')!) : ''
  const optional = pairs.has('optional') ? resolveBool(pairs.get('optional')!) : false

  const entries: MapParamEntry[] = []

  const paramsNode = pairs.get('params')
  if (paramsNode != null) {
    const entryAnnotations = findAll(paramsNode, 'annotation').filter(a =>
      getAnnotationName(a).includes('MapParamEntry')
    )
    for (const entryAnn of entryAnnotations) {
      const ep = getAnnotationPairs(entryAnn)
      const eName = ep.has('name') ? resolveString(ep.get('name')!) : ''
      if (!eName) continue

      const eType = ep.has('type') ? resolveString(ep.get('type')!) : ''
      const eValueHint = ep.has('valueHint') ? resolveStringArray(ep.get('valueHint')!) : []
      const eDesc = ep.has('description') ? resolveString(ep.get('description')!) : ''

      entries.push({ name: eName, type: eType, valueHint: eValueHint, description: eDesc })
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
      const defs = extractFunctionDefs(tree, file)
      allFunctions.push(...defs)
    }
  }

  const registryFiles = findFiles(esqlSrc, /EsqlFunctionRegistry\.java$/)
  for (const file of registryFiles) {
    const registry = parseRegistry(file)
    for (const func of allFunctions) {
      const entry = registry.get(func.name)
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

  const withMapParams = allFunctions.filter(f => f.mapParams.length > 0)
  if (withMapParams.length > 0) {
    console.log(`  (${withMapParams.length} with map params)`)
  }

  const withPreview = allFunctions.filter(f => f.preview)
  if (withPreview.length > 0) {
    console.log(`  (${withPreview.length} marked preview)`)
  }

  const reportPath = path.join(outDir, '..', 'extraction-report.json')
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify({
    extractedAt: new Date().toISOString(),
    elasticsearchPath: esPath,
    totalFunctions: allFunctions.length,
    functions: allFunctions.sort((a, b) => a.name.localeCompare(b.name))
  }, null, 2))

  console.log(`\nWrote extraction report to: ${reportPath}`)
  console.log('\nReview the report and manually update the TypeScript specification files.')
  console.log('The TypeScript files under specification/esql/_lang/ are the source of truth')
  console.log('for the schema.json output -- the extraction is a maintenance aid, not a generator.')
}

main()
