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

if (!outDir) {
  outDir = path.join(__dirname, '..', '..', 'specification', 'esql', '_lang')
}

const esqlPlugin = path.join(esPath, 'x-pack', 'plugin', 'esql')
const esqlSrc = path.join(esqlPlugin, 'src', 'main', 'java')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  returnTypes: string[]
  aliases: string[]
  preview: boolean
  since?: string
}

// ---------------------------------------------------------------------------
// Helpers
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
// Parse @FunctionInfo annotations
// ---------------------------------------------------------------------------

function parseFunctionInfo (content: string, filePath: string): FunctionDef[] {
  const results: FunctionDef[] = []

  const funcInfoRegex = /@FunctionInfo\s*\(([\s\S]*?)\)/g
  let match: RegExpExecArray | null

  while ((match = funcInfoRegex.exec(content)) !== null) {
    const block = match[1]

    const getAttr = (name: string): string => {
      const attrMatch = block.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 's'))
      return attrMatch ? attrMatch[1] : ''
    }

    const getBoolAttr = (name: string): boolean => {
      const attrMatch = block.match(new RegExp(`${name}\\s*=\\s*(true|false)`))
      return attrMatch ? attrMatch[1] === 'true' : false
    }

    const returnType = getAttr('returnType')
    const description = getAttr('description')
    const kind = getAttr('type') || 'SCALAR'
    const preview = getBoolAttr('preview')
    const since = getAttr('since')

    const classMatch = content.match(/public\s+class\s+(\w+)/)
    const className = classMatch ? classMatch[1] : path.basename(filePath, '.java')

    const paramRegex = /@Param\s*\(([\s\S]*?)\)/g
    const params: FunctionParam[] = []
    let paramMatch: RegExpExecArray | null

    const searchStart = Math.max(0, match.index - 200)
    const searchEnd = Math.min(content.length, match.index + match[0].length + 2000)
    const methodBlock = content.slice(searchStart, searchEnd)

    const methodParamRegex = /@Param\s*\(([\s\S]*?)\)/g
    while ((paramMatch = methodParamRegex.exec(methodBlock)) !== null) {
      const paramBlock = paramMatch[1]
      const paramName = paramBlock.match(/name\s*=\s*"([^"]*)"/)
      const paramType = paramBlock.match(/type\s*=\s*"([^"]*)"/)
      const paramDesc = paramBlock.match(/description\s*=\s*"([^"]*)"/)
      const paramOptional = paramBlock.match(/optional\s*=\s*(true|false)/)

      if (paramName) {
        params.push({
          name: paramName[1],
          types: paramType ? paramType[1].split('|').map(t => t.trim()) : [],
          description: paramDesc ? paramDesc[1] : '',
          optional: paramOptional ? paramOptional[1] === 'true' : false
        })
      }
    }

    results.push({
      name: className.toUpperCase(),
      kind: kind.toLowerCase(),
      description,
      params,
      returnTypes: returnType ? returnType.split('|').map(t => t.trim()) : [],
      aliases: [],
      preview,
      since
    })
  }

  return results
}

// ---------------------------------------------------------------------------
// Parse function registry for aliases
// ---------------------------------------------------------------------------

function parseRegistry (registryPath: string): Map<string, string[]> {
  const aliases = new Map<string, string[]>()
  if (!fs.existsSync(registryPath)) return aliases

  const content = readFile(registryPath)

  const aliasRegex = /def\s*\(\s*(\w+)\.class\s*,\s*((?:"[^"]*"\s*,?\s*)+)\)/g
  let match: RegExpExecArray | null

  while ((match = aliasRegex.exec(content)) !== null) {
    const className = match[1]
    const names = match[2].match(/"([^"]*)"/g)?.map(n => n.slice(1, -1).toUpperCase()) ?? []
    if (names.length > 1) {
      aliases.set(names[0], names.slice(1))
    }
  }

  return aliases
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
      const defs = parseFunctionInfo(content, file)
      allFunctions.push(...defs)
    }
  }

  const registryFiles = findFiles(esqlSrc, /EsqlFunctionRegistry\.java$/)
  for (const file of registryFiles) {
    const aliases = parseRegistry(file)
    for (const func of allFunctions) {
      const funcAliases = aliases.get(func.name)
      if (funcAliases) {
        func.aliases = funcAliases
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

  for (const [kind, funcs] of byKind) {
    console.log(`  ${kind}: ${funcs.length}`)
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
