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

import {
  ClassDeclaration,
  FunctionDeclaration,
  Node,
  Project,
  TypeAliasDeclaration,
  ts,
  ParameterDeclaration,
  SourceFile,
  PropertyDeclaration
} from 'ts-morph'
import * as model from './metamodel'
import { parseJsDocTags, parseJsDocTagsAllowDuplicates } from './utils'

/**
 * Parses a leading /** ... *​/ comment on a parameter into a description and
 * pseudo-JSDoc tags. ParameterDeclaration in ts-morph doesn't support getJsDocs(),
 * so we parse leading trivia manually.
 */
function parseParamComment (param: ParameterDeclaration): { description: string, tags: Record<string, string> } {
  const fullText = param.getSourceFile().getFullText()
  const ranges = ts.getLeadingCommentRanges(fullText, param.getFullStart())
  const tags: Record<string, string> = {}
  let description = ''

  if (ranges != null) {
    for (const range of ranges) {
      if (range.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
        let text = fullText.slice(range.pos, range.end)
        // Strip /** and */
        text = text.replace(/^\/\*\*?/, '').replace(/\*\/$/, '')
        // Strip leading * on each line
        text = text.replace(/^[ \t]*\*[ \t]?/gm, '')

        const lines = text.split('\n')
        const descLines: string[] = []
        for (const line of lines) {
          const tagMatch = line.match(/^\s*@(\w+)\s*(.*)$/)
          if (tagMatch != null) {
            tags[tagMatch[1]] = tagMatch[2].trim()
          } else {
            descLines.push(line)
          }
        }
        description = descLines.join('\n').trim()
      }
    }
  }

  return { description, tags }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function compileEsqlLanguageModel (project: Project): model.EsqlLanguageModel | undefined {
  const langFiles = project.getSourceFiles().filter(sf =>
    sf.getFilePath().includes('esql/_lang/')
  )

  if (langFiles.length === 0) return undefined

  const result: model.EsqlLanguageModel = {
    dataTypes: [],
    commands: [],
    operators: [],
    functions: []
  }

  for (const sf of langFiles) {
    compileEsqlSourceFile(sf, result)
  }

  result.dataTypes.sort((a, b) => a.name.localeCompare(b.name))
  result.commands.sort((a, b) => a.name.localeCompare(b.name))
  result.operators.sort((a, b) => a.name.localeCompare(b.name))
  result.functions.sort((a, b) => a.name.localeCompare(b.name))

  return result
}

// ---------------------------------------------------------------------------
// Per-file visitor
// ---------------------------------------------------------------------------

function compileEsqlSourceFile (sf: SourceFile, result: model.EsqlLanguageModel): void {
  for (const decl of sf.getTypeAliases()) {
    const tags = parseJsDocTags(decl.getJsDocs())
    if (tags.esql_data_type !== undefined) {
      result.dataTypes.push(compileDataType(decl, tags))
    }
  }

  for (const decl of sf.getClasses()) {
    const tags = parseJsDocTags(decl.getJsDocs())
    if (tags.esql_command !== undefined) {
      result.commands.push(compileCommand(decl, tags))
    } else if (tags.esql_operator !== undefined) {
      result.operators.push(compileOperator(decl, tags))
    } else if (tags.esql_map_param_type !== undefined) {
      // Collected by reference from function parameters; skip here
    }
  }

  // getFunctions() skips declarations without bodies (overload signatures),
  // so we iterate all statements and filter for FunctionDeclaration nodes.
  for (const stmt of sf.getStatements()) {
    if (!Node.isFunctionDeclaration(stmt)) continue
    const decl = stmt as FunctionDeclaration
    const tags = parseJsDocTags(decl.getJsDocs())
    if (tags.esql_function !== undefined) {
      result.functions.push(compileFunction(decl, tags, sf))
    }
  }
}

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

function compileDataType (decl: TypeAliasDeclaration, tags: Record<string, string>): model.EsqlDataType {
  return {
    name: decl.getName(),
    description: getDescription(decl.getJsDocs()),
    sourceCapable: tags.esql_source_capable !== undefined ? true : undefined,
    resultCapable: tags.esql_result_capable !== undefined ? true : undefined
  }
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function compileCommand (decl: ClassDeclaration, tags: Record<string, string>): model.EsqlCommand {
  const dupTags = parseJsDocTagsAllowDuplicates(decl.getJsDocs())
  const name = decl.getName() ?? ''
  const position = tags.esql_command as model.EsqlCommandPosition

  const commandKinds = buildAcceptedFunctionKinds(dupTags.esql_function_context)

  const command: model.EsqlCommand = {
    name,
    position,
    description: getDescription(decl.getJsDocs()),
    clauses: [],
    acceptedFunctionKinds: commandKinds,
    availability: parseAvailability(dupTags),
    preview: tags.esql_preview !== undefined ? true : undefined
  }

  let mainArgSet = false
  for (const member of decl.getMembers()) {
    if (!Node.isPropertyDeclaration(member)) continue
    const memberTags = parseJsDocTags(member.getJsDocs())
    if (memberTags.esql_clause !== undefined) {
      const memberDupTags = parseJsDocTagsAllowDuplicates(member.getJsDocs())
      command.clauses.push(compileClause(member, memberTags, memberDupTags))
    } else if (!mainArgSet) {
      command.mainArgument = {
        kind: 'instance_of',
        type: { name: getPropertyTypeName(member), namespace: 'esql._lang' }
      }
      mainArgSet = true
    }
  }

  return command
}

function compileClause (member: PropertyDeclaration, tags: Record<string, string>, dupTags: Record<string, string[]>): model.EsqlCommandClause {
  const clauseKinds = buildAcceptedFunctionKinds(dupTags.esql_function_context)
  return {
    keyword: tags.esql_clause,
    description: getDescription(member.getJsDocs()),
    required: !member.hasQuestionToken(),
    type: {
      kind: 'instance_of',
      type: { name: getPropertyTypeName(member), namespace: 'esql._lang' }
    },
    acceptedFunctionKinds: clauseKinds
  }
}

/**
 * Build the acceptedFunctionKinds array from @esql_function_context tags.
 * Always includes 'scalar'. Returns undefined if only scalar (the default).
 */
function buildAcceptedFunctionKinds (contextTags: string[] | undefined): model.EsqlFunctionKind[] | undefined {
  if (contextTags == null || contextTags.length === 0) return undefined
  const kinds = new Set<model.EsqlFunctionKind>([model.EsqlFunctionKind.scalar])
  for (const tag of contextTags) {
    const trimmed = tag.trim()
    if (Object.values(model.EsqlFunctionKind).includes(trimmed as model.EsqlFunctionKind)) {
      kinds.add(trimmed as model.EsqlFunctionKind)
    }
  }
  if (kinds.size === 1) return undefined
  return Array.from(kinds)
}

// ---------------------------------------------------------------------------
// Operators
// ---------------------------------------------------------------------------

function compileOperator (decl: ClassDeclaration, tags: Record<string, string>): model.EsqlOperator {
  const dupTags = parseJsDocTagsAllowDuplicates(decl.getJsDocs())
  const name = decl.getName() ?? ''

  const params: model.EsqlOperatorParam[] = []
  let returnType: string[] = []

  for (const member of decl.getMembers()) {
    if (!Node.isPropertyDeclaration(member)) continue
    const memberTags = parseJsDocTags(member.getJsDocs())
    if (memberTags.esql_return_type !== undefined) {
      returnType = flattenUnionType(member.getTypeNode())
    } else {
      params.push({
        name: member.getName(),
        types: flattenUnionType(member.getTypeNode()),
        description: getDescription(member.getJsDocs())
      })
    }
  }

  return {
    name,
    symbol: tags.esql_symbol ?? name,
    fixity: tags.esql_operator as model.EsqlOperatorFixity,
    precedenceGroup: parseInt(tags.esql_precedence ?? '0', 10),
    description: getDescription(decl.getJsDocs()),
    params,
    returnType,
    availability: parseAvailability(dupTags)
  }
}

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

function compileFunction (decl: FunctionDeclaration, tags: Record<string, string>, sf: SourceFile): model.EsqlFunctionDefinition {
  const dupTags = parseJsDocTagsAllowDuplicates(decl.getJsDocs())
  const name = decl.getName() ?? ''

  const params: model.EsqlFunctionParam[] = []
  const mapParams: model.EsqlMapParam[] = []

  for (const param of decl.getParameters()) {
    const { tags: paramTags } = parseParamComment(param)
    if (paramTags.esql_map_param !== undefined) {
      const mapParam = compileMapParam(param, sf)
      if (mapParam != null) mapParams.push(mapParam)
    } else {
      params.push(compileFunctionParam(param))
    }
  }

  const returnType = flattenUnionType(decl.getReturnTypeNode())
  const aliases = tags.esql_alias?.split(/\s*,\s*/).filter(Boolean)

  const funcDef: model.EsqlFunctionDefinition = {
    name,
    kind: tags.esql_function as model.EsqlFunctionKind,
    description: getDescription(decl.getJsDocs()),
    params,
    returnType,
    availability: parseAvailability(dupTags),
    preview: tags.esql_preview !== undefined ? true : undefined
  }

  if (aliases != null && aliases.length > 0) funcDef.aliases = aliases
  if (mapParams.length > 0) funcDef.mapParams = mapParams

  return funcDef
}

function compileFunctionParam (param: ParameterDeclaration): model.EsqlFunctionParam {
  const { description, tags } = parseParamComment(param)
  const isOptional = param.hasQuestionToken() || param.hasInitializer() || tags.esql_optional !== undefined
  const isRest = param.isRestParameter()

  let types: string[]
  const typeNode = param.getTypeNode()
  if (isRest && typeNode != null) {
    types = flattenArrayElementType(typeNode)
  } else {
    types = flattenUnionType(typeNode)
  }

  return {
    name: param.getName(),
    types,
    description: description !== '' ? description : undefined,
    optional: isOptional,
    since: tags.esql_since,
    hint: parseParamHint(tags)
  }
}

function compileMapParam (param: ParameterDeclaration, sf: SourceFile): model.EsqlMapParam | null {
  const typeName = param.getTypeNode()?.getText() ?? ''
  const classDecl = sf.getClass(typeName)

  if (classDecl == null) return null

  const entries: model.EsqlMapParamEntry[] = []
  for (const member of classDecl.getMembers()) {
    if (!Node.isPropertyDeclaration(member)) continue
    entries.push({
      name: member.getName(),
      types: flattenUnionType(member.getTypeNode()),
      description: getDescription(member.getJsDocs()),
      optional: member.hasQuestionToken()
    })
  }

  const { description } = parseParamComment(param)
  return {
    name: param.getName(),
    entries,
    description: description !== '' ? description : undefined,
    optional: param.hasQuestionToken()
  }
}

// ---------------------------------------------------------------------------
// Availability parsing
// ---------------------------------------------------------------------------

function parseAvailability (dupTags: Record<string, string[]>): model.Availabilities | undefined {
  const avails = dupTags.availability
  if (avails == null || avails.length === 0) return undefined

  const result: model.Availabilities = {}
  for (const raw of avails) {
    const parts = raw.trim().split(/\s+/)
    const flavor = parts[0] as string
    const kv: Record<string, string> = {}
    for (let i = 1; i < parts.length; i++) {
      const [k, v] = parts[i].split('=')
      kv[k] = v
    }
    result[flavor] = {
      since: kv.since,
      stability: kv.stability as model.Stability
    }
  }
  return result
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDescription (jsDocs: Node[]): string | undefined {
  if (jsDocs.length === 0) return undefined
  const doc = jsDocs[0]
  if (!Node.isJSDoc(doc)) return undefined
  const desc = doc.getDescription()?.replace(/\r/g, '').trim()
  return desc !== '' ? desc : undefined
}

function getPropertyTypeName (member: PropertyDeclaration): string {
  const typeNode = member.getTypeNode()
  return typeNode?.getText() ?? 'unknown'
}

function flattenUnionType (typeNode: Node | undefined): string[] {
  if (typeNode == null) return []

  if (Node.isUnionTypeNode(typeNode)) {
    return typeNode.getTypeNodes().flatMap(child => flattenUnionType(child))
  }

  if (Node.isTypeReference(typeNode)) {
    return [typeNode.getText()]
  }

  if (typeNode.getKind() === ts.SyntaxKind.BooleanKeyword) return ['boolean']
  if (typeNode.getKind() === ts.SyntaxKind.StringKeyword) return ['string']
  if (typeNode.getKind() === ts.SyntaxKind.NumberKeyword) return ['number']

  return [typeNode.getText()]
}

function flattenArrayElementType (typeNode: Node): string[] {
  if (Node.isTypeReference(typeNode)) {
    const text = typeNode.getText()
    const match = text.match(/^Array<(.+)>$/)
    if (match != null) {
      const inner = match[1]
      return inner.split('|').map(t => t.trim())
    }
  }
  return flattenUnionType(typeNode)
}

function parseParamHint (tags: Record<string, string>): model.EsqlParamHint | undefined {
  if (tags.esql_entity_type == null && tags.esql_constraint == null) return undefined
  const constraints: Array<{ name: string, value: string }> = []
  if (tags.esql_constraint != null) {
    for (const part of tags.esql_constraint.split(';')) {
      const [k, v] = part.split('=')
      if (k != null && v != null) constraints.push({ name: k.trim(), value: v.trim() })
    }
  }
  return {
    entityType: tags.esql_entity_type,
    constraints: constraints.length > 0 ? constraints : undefined
  }
}
