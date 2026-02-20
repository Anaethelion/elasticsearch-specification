#!/usr/bin/env ts-node
/**
 * CLI entry point for ES|QL extraction.
 *
 * Usage:
 *   npx ts-node src/esql/extract.ts --es-path /path/to/elasticsearch
 *
 * Or via the Makefile:
 *   make extract-esql-lang es=/path/to/elasticsearch
 */

import * as fs from 'fs'
import * as path from 'path'
import {
  findFiles, readFile, tsParser,
  extractFunctionDefs, parseRegistry,
  subdirToTsFile, collectUsedTypes, syncDataTypes, generateTsFile,
  parseGrammar, syncCommandsTs,
  FunctionDef
} from './extract-lib'

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
  console.error('Usage: npx ts-node src/esql/extract.ts --es-path /path/to/elasticsearch [--out /path/to/spec/esql/_lang]')
  process.exit(1)
}

const invocationCwd = process.env.INIT_CWD ?? process.cwd()
esPath = path.resolve(invocationCwd, esPath)

if (!outDir) {
  outDir = path.join(__dirname, '..', '..', '..', 'specification', 'esql', '_lang')
} else {
  outDir = path.resolve(invocationCwd, outDir)
}

const esqlPlugin = path.join(esPath, 'x-pack', 'plugin', 'esql')
const esqlSrc = path.join(esqlPlugin, 'src', 'main', 'java')

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

  const byFile = new Map<string, FunctionDef[]>()
  for (const func of allFunctions) {
    const tsFile = subdirToTsFile(func.sourceSubdir)
    if (!byFile.has(tsFile)) byFile.set(tsFile, [])
    byFile.get(tsFile)!.push(func)
  }

  const allTypes = collectUsedTypes(allFunctions)
  const dataTypesPath = path.join(outDir, 'data_types.ts')
  const addedTypes = syncDataTypes(allTypes, dataTypesPath)
  if (addedTypes.length > 0) {
    console.log(`\nAdded ${addedTypes.length} new data types to data_types.ts:`)
    for (const t of addedTypes) {
      console.log(`  ${t}`)
    }
  }

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

  // --- Grammar parsing and command sync ---
  console.log(`\nParsing ANTLR grammar...`)
  const grammarInfo = parseGrammar(esPath)
  console.log(`  Source commands: ${grammarInfo.sourceCommands.join(', ')}`)
  console.log(`  Processing commands: ${grammarInfo.processingCommands.join(', ')}`)
  console.log(`  Aggregate context: ${grammarInfo.aggregateContextCommands.join(', ')}`)
  console.log(`  Grouping context: ${grammarInfo.groupingContextCommands.join(', ')}`)

  const commandsPath = path.join(outDir, 'commands.ts')
  if (fs.existsSync(commandsPath)) {
    const currentCommands = fs.readFileSync(commandsPath, 'utf-8')
    const { content: updatedCommands, added, removed } = syncCommandsTs(grammarInfo, currentCommands)
    if (added.length > 0) {
      console.log(`\nAdded ${added.length} new commands: ${added.join(', ')}`)
    }
    if (removed.length > 0) {
      console.log(`\nRemoved ${removed.length} stale commands: ${removed.join(', ')}`)
    }
    fs.writeFileSync(commandsPath, updatedCommands)
    console.log(`\nSynced commands.ts with grammar.`)
  } else {
    console.log(`\nWarning: ${commandsPath} not found, skipping command sync.`)
  }

  console.log(`\nDone. Generated ${sortedFiles.length} files with ${allFunctions.length} functions.`)
}

main()
