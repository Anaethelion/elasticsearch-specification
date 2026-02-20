/**
 * ES|QL extraction library — reusable functions for parsing Java source
 * and generating TypeScript function files.
 *
 * This module is side-effect-free and can be imported by tests.
 * The CLI entry point lives in ./extract.ts.
 */

import * as fs from 'fs'
import * as path from 'path'
import Parser from 'tree-sitter'
import Java from 'tree-sitter-java'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MapParamEntry {
  name: string
  types: string[]
  valueHint: string[]
  description: string
}

export interface MapParamDef {
  name: string
  description: string
  entries: MapParamEntry[]
  optional: boolean
}

export interface FunctionParam {
  name: string
  types: string[]
  description: string
  optional: boolean
}

export interface AvailabilityEntry {
  lifecycle: string
  version: string
}

export interface FunctionDef {
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

export interface RegistryEntry {
  /** Canonical ES|QL function name (uppercased) from the registry's first string arg */
  canonicalName: string
  /** Additional names (uppercased) */
  aliases: string[]
}

// ---------------------------------------------------------------------------
// tree-sitter parser (initialised once)
// ---------------------------------------------------------------------------

export const tsParser = new Parser()
tsParser.setLanguage(Java)

type SyntaxNode = Parser.SyntaxNode

// ---------------------------------------------------------------------------
// File-system helpers
// ---------------------------------------------------------------------------

export function findFiles (dir: string, pattern: RegExp): string[] {
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

export function readFile (filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

// ---------------------------------------------------------------------------
// AST helpers
// ---------------------------------------------------------------------------

export function findAll (node: SyntaxNode, type: string): SyntaxNode[] {
  const results: SyntaxNode[] = []
  if (node.type === type) results.push(node)
  for (let i = 0; i < node.childCount; i++) {
    results.push(...findAll(node.child(i)!, type))
  }
  return results
}

export function getAnnotationName (ann: SyntaxNode): string {
  const nameNode = ann.childForFieldName('name')
  return nameNode?.text ?? ''
}

/** Return a Map of attribute-name to value-node for direct element_value_pair children. */
export function getAnnotationPairs (ann: SyntaxNode): Map<string, SyntaxNode> {
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
export function resolveString (node: SyntaxNode): string {
  if (node.type === 'string_literal') {
    const text = node.text
    if (text.startsWith('"""')) {
      return resolveTextBlock(text)
    }
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

export function resolveTextBlock (raw: string): string {
  const inner = raw.slice(3, -3)
  const lines = inner.split('\n')
  if (lines.length > 0 && lines[0].trim() === '') lines.shift()
  const indents = lines.filter(l => l.trim().length > 0).map(l => l.match(/^(\s*)/)![1].length)
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0
  return lines.map(l => l.slice(minIndent)).join('\n').trim()
}

/** Resolve an array value: `{ "a", "b" }` or a single `"value"`. */
export function resolveStringArray (node: SyntaxNode): string[] {
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
export function resolveEnum (node: SyntaxNode): string {
  if (node.type === 'field_access') {
    const ids = findAll(node, 'identifier')
    return ids.length > 0 ? ids[ids.length - 1].text : node.text
  }
  if (node.type === 'string_literal') {
    return resolveString(node)
  }
  return node.text
}

export function resolveBool (node: SyntaxNode): boolean {
  return node.type === 'true'
}

/** Resolve a param/entry name: string literals are unquoted; bare identifiers (Java constants) are lowercased. */
export function resolveParamName (node: SyntaxNode): string {
  if (node.type === 'string_literal') return resolveString(node)
  return node.text.toLowerCase()
}

/** Strip Asciidoc markup, doc-system placeholders, and stray whitespace from Java descriptions. */
export function sanitizeDescription (text: string): string {
  return text
    .replace(/\{wikipedia\}\/([^\[]+)\[([^\]]+)\]/g, '$2 (https://en.wikipedia.org/wiki/$1)')
    .replace(/\{[a-zA-Z_-]+\}\/[^\[]*\[([^\]]+)\]/g, '$1')
    .replace(/<<[^,>]+,([^>]+)>>/g, '$1')
    .replace(/<<([^>]+)>>/g, (_, anchor: string) => anchor.replace(/-/g, ' '))
    .replace(/\[([^\]]+)\]\((docs-content:\/\/|\/reference\/)[^)]*\)/g, '$1')
    .replace(/\\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** Convert PascalCase class name to UPPER_SNAKE_CASE: HistogramPercentile -> HISTOGRAM_PERCENTILE */
export function camelToUpperSnake (name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toUpperCase()
}

/** Map Java FunctionAppliesToLifecycle to metamodel Stability. Returns undefined for skipped lifecycles. */
export function lifecycleToStability (lifecycle: string): string | undefined {
  switch (lifecycle) {
    case 'GA': return 'stable'
    case 'BETA': return 'beta'
    case 'PREVIEW': return 'experimental'
    case 'DEVELOPMENT': return 'experimental'
    default: return undefined
  }
}

// ---------------------------------------------------------------------------
// Extract @FunctionInfo from a parsed Java file
// ---------------------------------------------------------------------------

export function extractFunctionDefs (tree: Parser.Tree, filePath: string, functionDir: string): FunctionDef[] {
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

export function extractParam (ann: SyntaxNode): FunctionParam | null {
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

export function extractMapParam (ann: SyntaxNode): MapParamDef | null {
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

export function parseRegistryContent (content: string): Map<string, RegistryEntry> {
  const entries = new Map<string, RegistryEntry>()

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

export function parseRegistry (registryPath: string): Map<string, RegistryEntry> {
  if (!fs.existsSync(registryPath)) return new Map()
  return parseRegistryContent(readFile(registryPath))
}

// ---------------------------------------------------------------------------
// Java subdir -> TypeScript filename mapping
// ---------------------------------------------------------------------------

export function subdirToTsFile (subdir: string): string {
  if (subdir === '') return 'scalar_misc'
  if (subdir === 'scalar') return 'scalar_misc'
  if (subdir.startsWith('scalar/')) {
    const rest = subdir.slice(7)
    const topLevel = rest.split('/')[0]
    return 'scalar_' + topLevel
  }
  return subdir.replace(/\//g, '_')
}

// Types that are built-in to TypeScript and should not be declared in or imported from data_types.ts
export const TS_BUILTIN_TYPES = new Set(['boolean', 'string', 'object'])

// ---------------------------------------------------------------------------
// Collect all types used by a set of functions
// ---------------------------------------------------------------------------

export function collectUsedTypes (funcs: FunctionDef[]): Set<string> {
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

export function syncDataTypes (allTypes: Set<string>, dataTypesPath: string): string[] {
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

export const LICENSE_HEADER = `// @ts-nocheck \u2014 body-less function declarations are intentional (TS2391)
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

export function generateTsFile (funcs: FunctionDef[]): string {
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

    const jsdocLines: string[] = []
    if (func.description) {
      const descLine = func.description.split('\n')[0].trim()
      if (descLine) jsdocLines.push(descLine)
    }
    jsdocLines.push(`@esql_function ${func.kind}`)
    for (const alias of func.aliases) {
      jsdocLines.push(`@esql_alias ${alias}`)
    }

    const emittable = func.availability.filter(a => lifecycleToStability(a.lifecycle) != null)
    const gaEntry = emittable.find(a => a.lifecycle === 'GA')
    const bestEntry = gaEntry ?? emittable[0]
    if (bestEntry != null) {
      const stability = lifecycleToStability(bestEntry.lifecycle)!
      const sincePart = bestEntry.version ? ` since=${bestEntry.version}` : ''
      jsdocLines.push(`@availability stack${sincePart} stability=${stability}`)
      jsdocLines.push(`@availability serverless stability=${stability}`)
    }

    if (func.preview || (emittable.length > 0 && gaEntry == null)) {
      jsdocLines.push('@esql_preview')
    }

    lines.push('/**')
    for (const jl of jsdocLines) {
      lines.push(` * ${jl}`)
    }
    lines.push(' */')

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
// ANTLR grammar parser
// ---------------------------------------------------------------------------

export interface GrammarCommandDef {
  name: string
  position: 'source' | 'processing'
  devGated: boolean
  mainArg?: { label?: string, grammarType: string }
  clauses: Array<{
    keyword: string
    label?: string
    grammarType: string
    optional: boolean
  }>
  usesAggFields: boolean
  hasByClause: boolean
}

export interface GrammarInfo {
  sourceCommands: string[]
  processingCommands: string[]
  aggregateContextCommands: string[]
  groupingContextCommands: string[]
  commands: GrammarCommandDef[]
}

const GRAMMAR_TYPE_MAP: Record<string, string> = {
  fields: 'EsqlFieldList',
  aggFields: 'EsqlAggFields',
  qualifiedNamePatterns: 'EsqlFieldPatternList',
  indexPattern: 'EsqlIndexPattern',
  indexPatternAndMetadataFields: 'EsqlIndexPattern',
  orderExpression: 'EsqlSortExpressionList',
  string: 'EsqlStringPattern',
  mapExpression: 'EsqlMapExpression',
  renameClause: 'EsqlRenameClauseList',
  forkSubQueries: 'EsqlSubQueryList'
}

function mapGrammarType (grammarType: string): string {
  return GRAMMAR_TYPE_MAP[grammarType] ?? 'EsqlExpression'
}

/**
 * Strip block and line comments from an ANTLR grammar file.
 * Also strips @header{...} and options{...} blocks.
 */
function stripGrammarBoilerplate (text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/@header\s*\{[\s\S]*?\}/g, '')
    .replace(/options\s*\{[\s\S]*?\}/g, '')
}

/**
 * Parse an ANTLR grammar file (and its imports) into a rule map: ruleName -> body text.
 */
function parseGrammarRules (grammarDir: string, mainFile: string): Map<string, string> {
  const rules = new Map<string, string>()

  function parseFile (filePath: string): void {
    if (!fs.existsSync(filePath)) return
    const content = stripGrammarBoilerplate(fs.readFileSync(filePath, 'utf-8'))

    const importMatch = content.match(/import\s+([\s\S]*?);/)
    if (importMatch != null) {
      const imports = importMatch[1].split(',').map(s => s.trim()).filter(Boolean)
      for (const imp of imports) {
        parseFile(path.join(grammarDir, 'parser', imp + '.g4'))
      }
    }

    const ruleRegex = /^([a-zA-Z_]\w*)\s*\n?\s*:([\s\S]*?);/gm
    let m: RegExpExecArray | null
    while ((m = ruleRegex.exec(content)) != null) {
      rules.set(m[1], m[2].trim())
    }
  }

  parseFile(path.join(grammarDir, mainFile))
  return rules
}

/**
 * Given the body of a sourceCommand or processingCommand rule, extract each alternative's
 * rule name and whether it is dev-gated.
 */
export function parseAlternatives (body: string): Array<{ ruleName: string, devGated: boolean }> {
  const results: Array<{ ruleName: string, devGated: boolean }> = []
  for (const line of splitTopLevelAlternatives(body)) {
    const trimmed = line.replace(/#\w+/g, '').trim()
    if (trimmed === '') continue
    const devGated = trimmed.includes('isDevVersion()')
    const ruleMatch = trimmed.match(/(?:\{[^}]*\}\??\s*)?(\w+Command)\b/i)
    if (ruleMatch != null) {
      results.push({ ruleName: ruleMatch[1], devGated })
    }
  }
  return results
}

/**
 * Resolve the uppercase keyword from a command rule body.
 * E.g. "FROM indexPatternAndMetadataFields" → "FROM"
 * E.g. "INLINE INLINE_STATS stats=aggFields ..." → "INLINE_STATS"
 * Dev-prefixed tokens (DEV_LOOKUP, DEV_INSIST, DEV_MMR, DEV_EXPLAIN) are cleaned.
 */
/**
 * Split a rule body by top-level | (not inside parentheses).
 */
export function splitTopLevelAlternatives (body: string): string[] {
  const alts: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < body.length; i++) {
    if (body[i] === '(') depth++
    else if (body[i] === ')') depth--
    else if (body[i] === '|' && depth === 0) {
      alts.push(body.slice(start, i))
      start = i + 1
    }
  }
  alts.push(body.slice(start))
  return alts
}

export function resolveCommandKeyword (ruleBody: string): string {
  let firstAlt = splitTopLevelAlternatives(ruleBody)[0].trim()

  // Strip #label alternatives
  firstAlt = firstAlt.replace(/#\w+/g, '')

  // Repeatedly strip innermost parenthesized groups (handles nesting)
  let prev = ''
  while (prev !== firstAlt) {
    prev = firstAlt
    firstAlt = firstAlt.replace(/\([^()]*\)/g, '')
  }

  // Strip label= assignments and optional markers
  firstAlt = firstAlt.replace(/\w+=/g, ' ')
  firstAlt = firstAlt.replace(/[?*]/g, ' ')

  const tokens = firstAlt.trim().split(/\s+/)
  const keywords: string[] = []
  for (const tok of tokens) {
    if (/^[A-Z][A-Z_0-9]*$/.test(tok)) {
      keywords.push(tok)
    } else {
      break
    }
  }

  if (keywords.length === 0) return ''

  // For multi-keyword sequences (e.g., INLINE INLINE_STATS, SHOW INFO),
  // prefer the first token with an underscore (the compound name),
  // otherwise use the first token.
  let name = keywords[0]
  for (const kw of keywords) {
    if (kw.includes('_') && !kw.startsWith('DEV_')) {
      name = kw
      break
    }
  }

  if (name.startsWith('DEV_')) name = name.slice(4)
  return name
}

/**
 * Parse a command rule body to extract main argument and clauses.
 */
function parseCommandStructure (ruleBody: string): {
  mainArg?: { label?: string, grammarType: string }
  clauses: GrammarCommandDef['clauses']
  usesAggFields: boolean
  hasByClause: boolean
} {
  const firstAlt = splitTopLevelAlternatives(ruleBody)[0].trim()
  const usesAggFields = /\baggFields\b/.test(firstAlt)
  const hasByClause = /\bBY\b/.test(firstAlt)

  const clauses: GrammarCommandDef['clauses'] = []
  let mainArg: { label?: string, grammarType: string } | undefined

  const clauseRegex = /\(?\s*(BY|ON|WITH|AS|METADATA|SCORE\s+BY|KEY\s+BY|GROUP\s+BY)\s+(?:(\w+)=)?(\w+)/g
  let cm: RegExpExecArray | null
  const clauseKeywords = new Set<string>()
  while ((cm = clauseRegex.exec(firstAlt)) != null) {
    const keyword = cm[1].replace(/\s+/g, '_')
    if (clauseKeywords.has(keyword)) continue
    clauseKeywords.add(keyword)
    const label = cm[2]
    const grammarType = cm[3]
    const regionBefore = firstAlt.slice(0, cm.index)
    const optional = regionBefore.endsWith('(') || firstAlt[cm.index + cm[0].length]?.includes('?') || /\(\s*$/.test(regionBefore)
    clauses.push({ keyword, label, grammarType, optional })
  }

  const tokensAfterKeyword = firstAlt.replace(/^\s*\w+\s+/, '')
  if (tokensAfterKeyword.length > 0) {
    const argMatch = tokensAfterKeyword.match(/^(?:(\w+)=)?(\w+)/)
    if (argMatch != null) {
      const argGrammarType = argMatch[2]
      if (!['BY', 'ON', 'WITH', 'AS', 'METADATA'].includes(argGrammarType.toUpperCase())) {
        mainArg = { label: argMatch[1], grammarType: argGrammarType }
      }
    }
  }

  return { mainArg, clauses, usesAggFields, hasByClause }
}

/**
 * Parse the ANTLR grammar from an Elasticsearch checkout and extract command structure.
 */
export function parseGrammar (esPath: string): GrammarInfo {
  const grammarDir = path.join(esPath, 'x-pack/plugin/esql/src/main/antlr')
  const rules = parseGrammarRules(grammarDir, 'EsqlBaseParser.g4')

  const sourceBody = rules.get('sourceCommand') ?? ''
  const processingBody = rules.get('processingCommand') ?? ''

  const sourceAlts = parseAlternatives(sourceBody)
  const processingAlts = parseAlternatives(processingBody)

  const commands: GrammarCommandDef[] = []

  for (const { ruleName, devGated } of sourceAlts) {
    const body = rules.get(ruleName) ?? ''
    const keyword = resolveCommandKeyword(body)
    if (keyword === '') continue
    const struct = parseCommandStructure(body)
    commands.push({
      name: keyword,
      position: 'source',
      devGated,
      ...struct
    })
  }

  for (const { ruleName, devGated } of processingAlts) {
    const body = rules.get(ruleName) ?? ''
    const keyword = resolveCommandKeyword(body)
    if (keyword === '') continue
    const struct = parseCommandStructure(body)
    commands.push({
      name: keyword,
      position: 'processing',
      devGated,
      ...struct
    })
  }

  const sourceCommands = commands.filter(c => c.position === 'source').map(c => c.name)
  const processingCommands = commands.filter(c => c.position === 'processing').map(c => c.name)
  const aggregateContextCommands = commands.filter(c => c.usesAggFields).map(c => c.name)
  const groupingContextCommands = commands.filter(c => c.hasByClause && c.usesAggFields).map(c => c.name)

  return {
    sourceCommands,
    processingCommands,
    aggregateContextCommands,
    groupingContextCommands,
    commands
  }
}

// ---------------------------------------------------------------------------
// Sync commands.ts
// ---------------------------------------------------------------------------

/**
 * Given grammar info and the current commands.ts content, produce updated content
 * with new commands added, stale commands removed, and @esql_function_context
 * annotations patched.
 *
 * Returns { content, added, removed } for logging.
 */
export function syncCommandsTs (
  grammar: GrammarInfo,
  currentContent: string
): { content: string, added: string[], removed: string[] } {
  const grammarNames = new Set(grammar.commands.map(c => c.name))

  const existingNames = new Set<string>()
  const classRegex = /export class (\w+)\s*\{/g
  let cm: RegExpExecArray | null
  while ((cm = classRegex.exec(currentContent)) != null) {
    existingNames.add(cm[1])
  }

  const added: string[] = []
  const removed: string[] = []

  let content = currentContent

  // --- Remove stale commands ---
  for (const name of existingNames) {
    if (!grammarNames.has(name)) {
      content = removeClassBlock(content, name)
      removed.push(name)
    }
  }

  // --- Add new commands ---
  for (const cmd of grammar.commands) {
    if (existingNames.has(cmd.name)) continue

    const skeleton = generateCommandSkeleton(cmd)
    const section = cmd.position === 'source'
      ? '// Source commands'
      : '// Processing commands'

    const sectionIdx = content.lastIndexOf(section)
    if (sectionIdx >= 0) {
      const insertIdx = content.indexOf('\n', sectionIdx) + 1
      content = content.slice(0, insertIdx) + '\n' + skeleton + '\n' + content.slice(insertIdx)
    } else {
      content = content.trimEnd() + '\n\n' + skeleton + '\n'
    }
    added.push(cmd.name)
  }

  // --- Patch @esql_function_context annotations ---
  content = patchFunctionContextAnnotations(content, grammar)

  // --- Update imports ---
  content = updateCommandImports(content)

  return { content, added, removed }
}

/**
 * Remove a class block and its preceding JSDoc from the content.
 */
function removeClassBlock (content: string, className: string): string {
  const lines = content.split('\n')
  const result: string[] = []
  let i = 0
  while (i < lines.length) {
    if (lines[i].match(new RegExp(`^export class ${className}\\s*\\{`))) {
      // Walk back to remove preceding JSDoc
      while (result.length > 0 && result[result.length - 1].trim() === '') result.pop()
      if (result.length > 0 && result[result.length - 1].trim() === '*/') {
        while (result.length > 0 && !result[result.length - 1].trim().startsWith('/**')) {
          result.pop()
        }
        if (result.length > 0) result.pop() // remove the /** line
      }
      // Skip forward past the class closing brace
      let braceDepth = 0
      while (i < lines.length) {
        if (lines[i].includes('{')) braceDepth++
        if (lines[i].includes('}')) braceDepth--
        i++
        if (braceDepth === 0) break
      }
      // Skip trailing blank lines
      while (i < lines.length && lines[i].trim() === '') i++
      continue
    }
    result.push(lines[i])
    i++
  }
  return result.join('\n')
}

function generateCommandSkeleton (cmd: GrammarCommandDef): string {
  const lines: string[] = []
  lines.push('/**')
  lines.push(` * @esql_command ${cmd.position}`)
  if (cmd.devGated) lines.push(' * @esql_preview')
  lines.push(' */')
  lines.push(`export class ${cmd.name} {`)

  if (cmd.mainArg != null) {
    const tsType = mapGrammarType(cmd.mainArg.grammarType)
    const label = cmd.mainArg.label ?? cmd.mainArg.grammarType
    lines.push(`  ${label}: ${tsType}`)
  }

  for (const clause of cmd.clauses) {
    const tsType = mapGrammarType(clause.grammarType)
    const propName = (clause.label ?? clause.keyword).toLowerCase()
    lines.push(`  /** @esql_clause ${clause.keyword} */`)
    lines.push(`  ${propName}${clause.optional ? '?' : ''}: ${tsType}`)
  }

  lines.push('}')
  return lines.join('\n')
}

function patchFunctionContextAnnotations (content: string, grammar: GrammarInfo): string {
  const aggSet = new Set(grammar.aggregateContextCommands)
  const groupSet = new Set(grammar.groupingContextCommands)

  const lines = content.split('\n')
  const result: string[] = []
  let currentClass = ''

  // First pass: strip existing @esql_function_context annotations
  for (const line of lines) {
    if (/^\s*\*\s*@esql_function_context\s+/.test(line)) continue
    result.push(line)
  }

  // Second pass: insert annotations in the right places
  const output: string[] = []
  for (let i = 0; i < result.length; i++) {
    const line = result[i]
    output.push(line)

    // Track which class we're about to enter (look ahead for export class)
    const classMatch = line.match(/^export class (\w+)\s*\{/)
    if (classMatch != null) {
      currentClass = classMatch[1]
    }

    // After @esql_command line, insert aggregate/time_series_aggregate if applicable
    const cmdMatch = line.match(/^\s*\*\s*@esql_command\s+(source|processing)\s*$/)
    if (cmdMatch != null) {
      // Look ahead to find which class this JSDoc belongs to
      for (let j = i + 1; j < result.length; j++) {
        const ahead = result[j].match(/^export class (\w+)\s*\{/)
        if (ahead != null) {
          if (aggSet.has(ahead[1])) {
            output.push(' * @esql_function_context aggregate')
            output.push(' * @esql_function_context time_series_aggregate')
          }
          break
        }
      }
    }

    // After @esql_clause BY, insert grouping if the containing class is in groupSet
    if (/^\s*\*\s*@esql_clause BY\s*$/.test(line)) {
      // Find the containing class by looking back
      for (let j = i; j >= 0; j--) {
        const cm = result[j].match(/^export class (\w+)\s*\{/)
        if (cm != null) {
          if (groupSet.has(cm[1])) {
            output.push('   * @esql_function_context grouping')
          }
          break
        }
      }
    }
  }

  return output.join('\n')
}

function updateCommandImports (content: string): string {
  const usedTypes = new Set<string>()
  const typePattern = /:\s*(Esql\w+)/g
  let tm: RegExpExecArray | null
  while ((tm = typePattern.exec(content)) != null) {
    usedTypes.add(tm[1])
  }

  if (usedTypes.size === 0) return content

  const sorted = Array.from(usedTypes).sort()
  const importBlock = `import {\n  ${sorted.join(',\n  ')}\n} from '@esql/_lang/_types'`

  const existingImport = content.match(/import\s*\{[\s\S]*?\}\s*from\s*'@esql\/_lang\/_types'/)
  if (existingImport != null) {
    content = content.replace(existingImport[0], importBlock)
  }

  return content
}
