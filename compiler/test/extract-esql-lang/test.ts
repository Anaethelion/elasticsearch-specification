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
 */

import { join } from 'path'
import { readFileSync } from 'fs'
import test from 'ava'
import {
  sanitizeDescription,
  camelToUpperSnake,
  lifecycleToStability,
  subdirToTsFile,
  parseRegistryContent,
  extractFunctionDefs,
  collectUsedTypes,
  generateTsFile,
  resolveCommandKeyword,
  parseAlternatives,
  splitTopLevelAlternatives,
  syncCommandsTs,
  tsParser,
  FunctionDef,
  GrammarInfo
} from '../../src/esql/extract-lib'

const fixturesDir = join(__dirname, 'fixtures')

function parseFixture (name: string) {
  const filePath = join(fixturesDir, name)
  const content = readFileSync(filePath, 'utf-8')
  return tsParser.parse(content)
}

// ---------------------------------------------------------------------------
// sanitizeDescription
// ---------------------------------------------------------------------------

test('sanitizeDescription: wikipedia link', t => {
  const input = 'Returns the {wikipedia}/Inverse_trigonometric_functions[arccosine] of n.'
  const result = sanitizeDescription(input)
  t.is(result, 'Returns the arccosine (https://en.wikipedia.org/wiki/Inverse_trigonometric_functions) of n.')
})

test('sanitizeDescription: unknown attribute link', t => {
  const input = 'See {es-docs}/some/path[the docs] for details.'
  t.is(sanitizeDescription(input), 'See the docs for details.')
})

test('sanitizeDescription: asciidoc cross-ref with display text', t => {
  const input = 'Perform a <<query-dsl-match-query,match query>> on a field.'
  t.is(sanitizeDescription(input), 'Perform a match query on a field.')
})

test('sanitizeDescription: asciidoc cross-ref without display text', t => {
  const input = 'Similar to <<esql-mv_max>>.'
  t.is(sanitizeDescription(input), 'Similar to esql mv_max.')
})

test('sanitizeDescription: docs-content markdown link', t => {
  const input = 'Use an [inference endpoint](docs-content://explore-analyze/inference-api.md) to generate embeddings.'
  t.is(sanitizeDescription(input), 'Use an inference endpoint to generate embeddings.')
})

test('sanitizeDescription: /reference/ markdown link', t => {
  const input = 'See [STATS](/reference/query-languages/esql/commands/stats-by.md) command.'
  t.is(sanitizeDescription(input), 'See STATS command.')
})

test('sanitizeDescription: literal backslash-n', t => {
  const input = 'First line.\\nSecond line.'
  t.is(sanitizeDescription(input), 'First line. Second line.')
})

test('sanitizeDescription: collapses whitespace', t => {
  const input = '  too   many   spaces  '
  t.is(sanitizeDescription(input), 'too many spaces')
})

test('sanitizeDescription: combined', t => {
  const input = 'The {wikipedia}/Atan2[angle] between\\nthe x-axis and <<some-ref,the ray>>.'
  t.is(sanitizeDescription(input), 'The angle (https://en.wikipedia.org/wiki/Atan2) between the x-axis and the ray.')
})

// ---------------------------------------------------------------------------
// camelToUpperSnake
// ---------------------------------------------------------------------------

test('camelToUpperSnake: single word', t => {
  t.is(camelToUpperSnake('Abs'), 'ABS')
})

test('camelToUpperSnake: two words', t => {
  t.is(camelToUpperSnake('CountDistinct'), 'COUNT_DISTINCT')
})

test('camelToUpperSnake: multi word', t => {
  t.is(camelToUpperSnake('HistogramPercentile'), 'HISTOGRAM_PERCENTILE')
})

test('camelToUpperSnake: acronym prefix', t => {
  t.is(camelToUpperSnake('URLDecode'), 'URL_DECODE')
})

test('camelToUpperSnake: with digits', t => {
  t.is(camelToUpperSnake('Atan2'), 'ATAN2')
})

test('camelToUpperSnake: acronym in middle', t => {
  t.is(camelToUpperSnake('FromAggregateMetricDouble'), 'FROM_AGGREGATE_METRIC_DOUBLE')
})

// ---------------------------------------------------------------------------
// lifecycleToStability
// ---------------------------------------------------------------------------

test('lifecycleToStability: GA -> stable', t => {
  t.is(lifecycleToStability('GA'), 'stable')
})

test('lifecycleToStability: BETA -> beta', t => {
  t.is(lifecycleToStability('BETA'), 'beta')
})

test('lifecycleToStability: PREVIEW -> experimental', t => {
  t.is(lifecycleToStability('PREVIEW'), 'experimental')
})

test('lifecycleToStability: DEVELOPMENT -> experimental', t => {
  t.is(lifecycleToStability('DEVELOPMENT'), 'experimental')
})

test('lifecycleToStability: DEPRECATED -> undefined (skipped)', t => {
  t.is(lifecycleToStability('DEPRECATED'), undefined)
})

test('lifecycleToStability: COMING -> undefined (skipped)', t => {
  t.is(lifecycleToStability('COMING'), undefined)
})

test('lifecycleToStability: DISCONTINUED -> undefined (skipped)', t => {
  t.is(lifecycleToStability('DISCONTINUED'), undefined)
})

test('lifecycleToStability: UNAVAILABLE -> undefined (skipped)', t => {
  t.is(lifecycleToStability('UNAVAILABLE'), undefined)
})

// ---------------------------------------------------------------------------
// subdirToTsFile
// ---------------------------------------------------------------------------

test('subdirToTsFile: empty string', t => {
  t.is(subdirToTsFile(''), 'scalar_misc')
})

test('subdirToTsFile: scalar root', t => {
  t.is(subdirToTsFile('scalar'), 'scalar_misc')
})

test('subdirToTsFile: scalar/math', t => {
  t.is(subdirToTsFile('scalar/math'), 'scalar_math')
})

test('subdirToTsFile: scalar/string/regex merges', t => {
  t.is(subdirToTsFile('scalar/string/regex'), 'scalar_string')
})

test('subdirToTsFile: aggregate', t => {
  t.is(subdirToTsFile('aggregate'), 'aggregate')
})

test('subdirToTsFile: fulltext', t => {
  t.is(subdirToTsFile('fulltext'), 'fulltext')
})

// ---------------------------------------------------------------------------
// parseRegistryContent
// ---------------------------------------------------------------------------

test('parseRegistryContent: extracts canonical names and aliases', t => {
  const content = readFileSync(join(fixturesDir, 'registry.java'), 'utf-8')
  const registry = parseRegistryContent(content)

  t.is(registry.size, 4)

  const simple = registry.get('SIMPLEFUNCTION')
  t.truthy(simple)
  t.is(simple!.canonicalName, 'ABS')
  t.deepEqual(simple!.aliases, [])

  const bucket = registry.get('BUCKET')
  t.truthy(bucket)
  t.is(bucket!.canonicalName, 'BUCKET')
  t.deepEqual(bucket!.aliases, ['BIN'])

  const toBool = registry.get('TOBOOLEAN')
  t.truthy(toBool)
  t.is(toBool!.canonicalName, 'TO_BOOLEAN')
  t.deepEqual(toBool!.aliases, ['TO_BOOL'])
})

// ---------------------------------------------------------------------------
// extractFunctionDefs: SimpleFunction
// ---------------------------------------------------------------------------

test('extractFunctionDefs: simple function', t => {
  const tree = parseFixture('SimpleFunction.java')
  const defs = extractFunctionDefs(tree, join(fixturesDir, 'SimpleFunction.java'), fixturesDir)

  t.is(defs.length, 1)
  const f = defs[0]
  t.is(f.name, 'SIMPLE_FUNCTION')
  t.is(f.kind, 'scalar')
  t.is(f.description, 'Returns the absolute value.')
  t.deepEqual(f.returnTypes, ['double'])
  t.is(f.preview, false)
  t.is(f.params.length, 1)
  t.is(f.params[0].name, 'number')
  t.deepEqual(f.params[0].types, ['double', 'integer', 'long'])
  t.is(f.params[0].optional, false)
})

// ---------------------------------------------------------------------------
// extractFunctionDefs: MultiParamFunction
// ---------------------------------------------------------------------------

test('extractFunctionDefs: multi-param with optional and preview', t => {
  const tree = parseFixture('MultiParamFunction.java')
  const defs = extractFunctionDefs(tree, join(fixturesDir, 'MultiParamFunction.java'), fixturesDir)

  t.is(defs.length, 1)
  const f = defs[0]
  t.is(f.kind, 'scalar')
  t.is(f.preview, true)
  t.deepEqual(f.returnTypes, ['double', 'integer', 'long'])
  t.is(f.params.length, 3)
  t.is(f.params[2].name, 'max')
  t.is(f.params[2].optional, true)
})

// ---------------------------------------------------------------------------
// extractFunctionDefs: MapParamFunction
// ---------------------------------------------------------------------------

test('extractFunctionDefs: map params with identifier names', t => {
  const tree = parseFixture('MapParamFunction.java')
  const defs = extractFunctionDefs(tree, join(fixturesDir, 'MapParamFunction.java'), fixturesDir)

  t.is(defs.length, 1)
  const f = defs[0]
  t.is(f.params.length, 2)
  t.is(f.params[0].name, 'field')
  t.is(f.params[1].name, 'query')

  t.is(f.mapParams.length, 1)
  const mp = f.mapParams[0]
  t.is(mp.name, 'options')
  t.is(mp.optional, true)
  t.is(mp.entries.length, 2)
  t.is(mp.entries[0].name, 'analyzer')
  t.deepEqual(mp.entries[0].types, ['keyword'])
  t.is(mp.entries[1].name, 'boost')
  t.deepEqual(mp.entries[1].types, ['float'])
})

// ---------------------------------------------------------------------------
// extractFunctionDefs: AvailabilityFunction
// ---------------------------------------------------------------------------

test('extractFunctionDefs: availability entries', t => {
  const tree = parseFixture('AvailabilityFunction.java')
  const defs = extractFunctionDefs(tree, join(fixturesDir, 'AvailabilityFunction.java'), fixturesDir)

  t.is(defs.length, 1)
  const f = defs[0]
  t.is(f.kind, 'aggregate')
  t.is(f.availability.length, 2)
  t.is(f.availability[0].lifecycle, 'GA')
  t.is(f.availability[0].version, '8.11.0')
  t.is(f.availability[1].lifecycle, 'PREVIEW')
  t.is(f.availability[1].version, '8.10.0')
})

// ---------------------------------------------------------------------------
// extractFunctionDefs: CamelCase class name -> UPPER_SNAKE_CASE
// ---------------------------------------------------------------------------

test('extractFunctionDefs: camel case class name', t => {
  const tree = parseFixture('HistogramPercentile.java')
  const defs = extractFunctionDefs(tree, join(fixturesDir, 'HistogramPercentile.java'), fixturesDir)

  t.is(defs.length, 1)
  t.is(defs[0].name, 'HISTOGRAM_PERCENTILE')
  t.is(defs[0].javaClassName, 'HISTOGRAMPERCENTILE')
})

// ---------------------------------------------------------------------------
// extractFunctionDefs: sourceSubdir
// ---------------------------------------------------------------------------

test('extractFunctionDefs: computes sourceSubdir from path', t => {
  const tree = parseFixture('SimpleFunction.java')
  const functionDir = '/fake/function'
  const filePath = '/fake/function/scalar/math/SimpleFunction.java'
  const defs = extractFunctionDefs(tree, filePath, functionDir)

  t.is(defs[0].sourceSubdir, 'scalar/math')
})

// ---------------------------------------------------------------------------
// collectUsedTypes
// ---------------------------------------------------------------------------

test('collectUsedTypes: collects from params, returns, and mapParams', t => {
  const funcs: FunctionDef[] = [{
    name: 'TEST', kind: 'scalar', description: '',
    params: [{ name: 'a', types: ['double', 'integer'], description: '', optional: false }],
    mapParams: [{
      name: 'opts', description: '', optional: true,
      entries: [{ name: 'x', types: ['keyword'], valueHint: [], description: '' }]
    }],
    returnTypes: ['boolean'],
    aliases: [], preview: false, availability: [], sourceSubdir: '', javaClassName: 'TEST'
  }]

  const types = collectUsedTypes(funcs)
  t.deepEqual(Array.from(types).sort(), ['boolean', 'double', 'integer', 'keyword'])
})

// ---------------------------------------------------------------------------
// generateTsFile
// ---------------------------------------------------------------------------

test('generateTsFile: produces valid structure', t => {
  const funcs: FunctionDef[] = [{
    name: 'ABS', kind: 'scalar',
    description: 'Returns the absolute value.',
    params: [{ name: 'number', types: ['double', 'integer'], description: '', optional: false }],
    mapParams: [],
    returnTypes: ['double'],
    aliases: ['ABSOLUTE'],
    preview: false,
    availability: [{ lifecycle: 'GA', version: '8.11.0' }],
    sourceSubdir: 'scalar/math',
    javaClassName: 'ABS'
  }]

  const output = generateTsFile(funcs)
  t.true(output.includes('// @ts-nocheck'))
  t.true(output.includes("import { double, integer } from '@esql/_lang/data_types'"))
  t.true(output.includes(' * Returns the absolute value.'))
  t.true(output.includes(' * @esql_function scalar'))
  t.true(output.includes(' * @esql_alias ABSOLUTE'))
  t.true(output.includes(' * @availability stack since=8.11.0 stability=stable'))
  t.true(output.includes(' * @availability serverless stability=stable'))
  t.true(output.includes('export function ABS(number: double | integer): double'))
})

test('generateTsFile: preview function with PREVIEW lifecycle', t => {
  const funcs: FunctionDef[] = [{
    name: 'BETA', kind: 'scalar', description: 'Beta function.',
    params: [], mapParams: [], returnTypes: ['double'],
    aliases: [], preview: true,
    availability: [{ lifecycle: 'PREVIEW', version: '8.15.0' }],
    sourceSubdir: '', javaClassName: 'BETA'
  }]

  const output = generateTsFile(funcs)
  t.true(output.includes(' * @availability stack since=8.15.0 stability=experimental'))
  t.true(output.includes(' * @availability serverless stability=experimental'))
  t.true(output.includes(' * @esql_preview'))
  t.true(output.includes('export function BETA(): double'))
})

test('generateTsFile: skipped lifecycles not emitted', t => {
  const funcs: FunctionDef[] = [{
    name: 'OLD', kind: 'scalar', description: 'Deprecated function.',
    params: [], mapParams: [], returnTypes: ['keyword'],
    aliases: [], preview: false,
    availability: [{ lifecycle: 'DEPRECATED', version: '7.0.0' }],
    sourceSubdir: '', javaClassName: 'OLD'
  }]

  const output = generateTsFile(funcs)
  t.false(output.includes('@availability'))
})

test('generateTsFile: map param class', t => {
  const funcs: FunctionDef[] = [{
    name: 'MATCH', kind: 'scalar', description: 'Match query.',
    params: [{ name: 'field', types: ['keyword'], description: '', optional: false }],
    mapParams: [{
      name: 'options', description: '', optional: true,
      entries: [
        { name: 'analyzer', types: ['keyword'], valueHint: [], description: 'Analyzer to use.' },
        { name: 'boost', types: ['float'], valueHint: [], description: '' }
      ]
    }],
    returnTypes: ['boolean'],
    aliases: [], preview: false, availability: [], sourceSubdir: '', javaClassName: 'MATCH'
  }]

  const output = generateTsFile(funcs)
  t.true(output.includes('export class MATCHOptions {'))
  t.true(output.includes('  /** Analyzer to use. */'))
  t.true(output.includes('  analyzer?: keyword'))
  t.true(output.includes('  boost?: float'))
  t.true(output.includes('/** @esql_map_param */'))
  t.true(output.includes('options?: MATCHOptions'))
})

test('generateTsFile: builtin types not imported', t => {
  const funcs: FunctionDef[] = [{
    name: 'FOO', kind: 'scalar', description: '',
    params: [{ name: 'x', types: ['boolean'], description: '', optional: false }],
    mapParams: [], returnTypes: ['string'],
    aliases: [], preview: false, availability: [], sourceSubdir: '', javaClassName: 'FOO'
  }]

  const output = generateTsFile(funcs)
  t.false(output.includes("from '@esql/_lang/data_types'"))
  t.true(output.includes('x: boolean'))
  t.true(output.includes('): string'))
})

// ---------------------------------------------------------------------------
// splitTopLevelAlternatives
// ---------------------------------------------------------------------------

test('splitTopLevelAlternatives: simple alternatives', t => {
  const result = splitTopLevelAlternatives('fromCommand | rowCommand | showCommand')
  t.is(result.length, 3)
  t.is(result[0].trim(), 'fromCommand')
  t.is(result[1].trim(), 'rowCommand')
  t.is(result[2].trim(), 'showCommand')
})

test('splitTopLevelAlternatives: pipe inside parentheses not split', t => {
  const result = splitTopLevelAlternatives('type=(A | B | C) JOIN target')
  t.is(result.length, 1)
  t.is(result[0].trim(), 'type=(A | B | C) JOIN target')
})

// ---------------------------------------------------------------------------
// resolveCommandKeyword
// ---------------------------------------------------------------------------

test('resolveCommandKeyword: simple command', t => {
  t.is(resolveCommandKeyword('FROM indexPatternAndMetadataFields'), 'FROM')
})

test('resolveCommandKeyword: multi-word keeps underscore token', t => {
  t.is(resolveCommandKeyword('INLINE INLINE_STATS stats=aggFields? (BY grouping=fields)?'), 'INLINE_STATS')
})

test('resolveCommandKeyword: SHOW INFO picks SHOW', t => {
  t.is(resolveCommandKeyword('SHOW INFO  #showInfo'), 'SHOW')
})

test('resolveCommandKeyword: DEV_ prefix stripped', t => {
  t.is(resolveCommandKeyword('DEV_LOOKUP tableName=indexPattern ON matchFields=qualifiedNamePatterns'), 'LOOKUP')
})

test('resolveCommandKeyword: type assignment with parens', t => {
  t.is(resolveCommandKeyword('type=(JOIN_LOOKUP | DEV_JOIN_LEFT | DEV_JOIN_RIGHT) JOIN joinTarget joinCondition'), 'JOIN')
})

test('resolveCommandKeyword: underscore command', t => {
  t.is(resolveCommandKeyword('MV_EXPAND qualifiedName'), 'MV_EXPAND')
  t.is(resolveCommandKeyword('CHANGE_POINT value=qualifiedName (ON key=qualifiedName)?'), 'CHANGE_POINT')
})

// ---------------------------------------------------------------------------
// parseAlternatives
// ---------------------------------------------------------------------------

test('parseAlternatives: extracts rule names', t => {
  const body = 'fromCommand | rowCommand | showCommand'
  const result = parseAlternatives(body)
  t.is(result.length, 3)
  t.is(result[0].ruleName, 'fromCommand')
  t.is(result[0].devGated, false)
})

test('parseAlternatives: detects dev-gated', t => {
  const body = 'evalCommand | {this.isDevVersion()}? lookupCommand'
  const result = parseAlternatives(body)
  t.is(result.length, 2)
  t.is(result[0].devGated, false)
  t.is(result[1].ruleName, 'lookupCommand')
  t.is(result[1].devGated, true)
})

// ---------------------------------------------------------------------------
// syncCommandsTs
// ---------------------------------------------------------------------------

test('syncCommandsTs: adds missing commands', t => {
  const grammar: GrammarInfo = {
    sourceCommands: ['FROM', 'NEW_CMD'],
    processingCommands: [],
    aggregateContextCommands: [],
    groupingContextCommands: [],
    commands: [
      { name: 'FROM', position: 'source', devGated: false, clauses: [], usesAggFields: false, hasByClause: false },
      { name: 'NEW_CMD', position: 'source', devGated: true, clauses: [],
        mainArg: { grammarType: 'fields' },
        usesAggFields: false, hasByClause: false }
    ]
  }

  const existing = [
    '// Source commands',
    '/**',
    ' * @esql_command source',
    ' */',
    'export class FROM {',
    '  index: EsqlIndexPattern',
    '}'
  ].join('\n')

  const { content, added, removed } = syncCommandsTs(grammar, existing)
  t.deepEqual(added, ['NEW_CMD'])
  t.deepEqual(removed, [])
  t.true(content.includes('export class NEW_CMD {'))
  t.true(content.includes('@esql_preview'))
  t.true(content.includes('EsqlFieldList'))
})

test('syncCommandsTs: removes stale commands', t => {
  const grammar: GrammarInfo = {
    sourceCommands: ['FROM'],
    processingCommands: [],
    aggregateContextCommands: [],
    groupingContextCommands: [],
    commands: [
      { name: 'FROM', position: 'source', devGated: false, clauses: [], usesAggFields: false, hasByClause: false }
    ]
  }

  const existing = [
    '// Source commands',
    '/**',
    ' * @esql_command source',
    ' */',
    'export class FROM {',
    '  index: EsqlIndexPattern',
    '}',
    '',
    '/**',
    ' * @esql_command source',
    ' */',
    'export class OLD_CMD {',
    '  x: EsqlExpression',
    '}'
  ].join('\n')

  const { content, removed } = syncCommandsTs(grammar, existing)
  t.deepEqual(removed, ['OLD_CMD'])
  t.false(content.includes('export class OLD_CMD'))
  t.true(content.includes('export class FROM'))
})

test('syncCommandsTs: patches aggregate annotations', t => {
  const grammar: GrammarInfo = {
    sourceCommands: [],
    processingCommands: ['STATS'],
    aggregateContextCommands: ['STATS'],
    groupingContextCommands: ['STATS'],
    commands: [
      { name: 'STATS', position: 'processing', devGated: false,
        clauses: [{ keyword: 'BY', grammarType: 'fields', optional: true }],
        mainArg: { grammarType: 'aggFields' },
        usesAggFields: true, hasByClause: true }
    ]
  }

  const existing = [
    '/**',
    ' * @esql_command processing',
    ' */',
    'export class STATS {',
    '  aggregates: EsqlAggFields',
    '  /**',
    '   * @esql_clause BY',
    '   */',
    '  by?: EsqlFieldList',
    '}'
  ].join('\n')

  const { content } = syncCommandsTs(grammar, existing)
  t.true(content.includes('@esql_function_context aggregate'))
  t.true(content.includes('@esql_function_context time_series_aggregate'))
  t.true(content.includes('@esql_function_context grouping'))
})

test('syncCommandsTs: idempotent', t => {
  const grammar: GrammarInfo = {
    sourceCommands: ['FROM'],
    processingCommands: ['STATS'],
    aggregateContextCommands: ['STATS'],
    groupingContextCommands: ['STATS'],
    commands: [
      { name: 'FROM', position: 'source', devGated: false, clauses: [], usesAggFields: false, hasByClause: false },
      { name: 'STATS', position: 'processing', devGated: false,
        clauses: [{ keyword: 'BY', grammarType: 'fields', optional: true }],
        mainArg: { grammarType: 'aggFields' },
        usesAggFields: true, hasByClause: true }
    ]
  }

  const existing = [
    '// Source commands',
    '/**',
    ' * @esql_command source',
    ' */',
    'export class FROM {',
    '}',
    '// Processing commands',
    '/**',
    ' * @esql_command processing',
    ' * @esql_function_context aggregate',
    ' * @esql_function_context time_series_aggregate',
    ' */',
    'export class STATS {',
    '  /**',
    '   * @esql_clause BY',
    '   * @esql_function_context grouping',
    '   */',
    '  by?: EsqlFieldList',
    '}'
  ].join('\n')

  const { content, added, removed } = syncCommandsTs(grammar, existing)
  t.deepEqual(added, [])
  t.deepEqual(removed, [])
  const { content: content2 } = syncCommandsTs(grammar, content)
  t.is(content, content2)
})
