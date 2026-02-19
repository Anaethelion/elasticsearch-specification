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

import * as model from '../model/metamodel'
import { ValidationErrors } from '../validation-errors'

const validFunctionKinds = ['scalar', 'aggregate', 'grouping', 'time_series_aggregate']
const validFixities = ['prefix', 'infix', 'postfix']
const validPositions = ['source', 'processing']

export default async function validateEsqlModel (apiModel: model.Model, errors: ValidationErrors): Promise<model.Model> {
  const esql = apiModel.esql
  if (esql == null) return apiModel

  const dataTypeNames = new Set(esql.dataTypes.map(dt => dt.name))

  // Validate data types
  for (const dt of esql.dataTypes) {
    if (dt.name === '') {
      errors.addGeneralError('ES|QL: Data type has empty name')
    }
  }

  // Validate commands
  for (const cmd of esql.commands) {
    if (cmd.name === '') {
      errors.addGeneralError('ES|QL: Command has empty name')
    }
    if (!validPositions.includes(cmd.position)) {
      errors.addGeneralError(`ES|QL ${cmd.name}: Invalid command position: ${cmd.position}`)
    }
    if (cmd.name !== cmd.name.toUpperCase()) {
      errors.addGeneralError(`ES|QL ${cmd.name}: Command name should be uppercase`)
    }
  }

  // Validate operators
  for (const op of esql.operators) {
    if (op.name === '') {
      errors.addGeneralError('ES|QL: Operator has empty name')
    }
    if (!validFixities.includes(op.fixity)) {
      errors.addGeneralError(`ES|QL ${op.name}: Invalid operator fixity: ${op.fixity}`)
    }
    if (op.symbol === '') {
      errors.addGeneralError(`ES|QL ${op.name}: Operator has empty symbol`)
    }
    if (op.params.length === 0) {
      errors.addGeneralError(`ES|QL ${op.name}: Operator has no parameters`)
    }
    if (op.returnType.length === 0) {
      errors.addGeneralError(`ES|QL ${op.name}: Operator has no return type`)
    }
  }

  // Validate functions
  const functionNames = new Set<string>()
  for (const func of esql.functions) {
    if (func.name === '') {
      errors.addGeneralError('ES|QL: Function has empty name')
      continue
    }
    if (functionNames.has(func.name)) {
      errors.addGeneralError(`ES|QL ${func.name}: Duplicate function name`)
    }
    functionNames.add(func.name)

    if (!validFunctionKinds.includes(func.kind)) {
      errors.addGeneralError(`ES|QL ${func.name}: Invalid function kind: ${func.kind}`)
    }
    if (func.returnType.length === 0) {
      errors.addGeneralError(`ES|QL ${func.name}: Function has no return type`)
    }
    if (func.name !== func.name.toUpperCase()) {
      errors.addGeneralError(`ES|QL ${func.name}: Function name should be uppercase`)
    }
  }

  console.log(`ES|QL model: ${esql.dataTypes.length} data types, ${esql.commands.length} commands, ${esql.operators.length} operators, ${esql.functions.length} functions`)

  return apiModel
}
