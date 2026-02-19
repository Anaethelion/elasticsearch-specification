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

/**
 * Supporting types for ES|QL command clause shapes.
 * These represent the structural categories of arguments that commands accept.
 */

/** An index pattern, possibly with cluster prefix and wildcards. */
export type EsqlIndexPattern = string

/** A list of field names (qualified names). */
export type EsqlFieldList = string[]

/** A list of field name patterns that may include wildcards. */
export type EsqlFieldPatternList = string[]

/** A list of aggregate field expressions, optionally with WHERE filters. */
export type EsqlAggFields = string[]

/** A list of sort expressions with optional ASC/DESC and NULLS FIRST/LAST. */
export type EsqlSortExpressionList = string[]

/** A general-purpose expression (boolean, value, or constant). */
export type EsqlExpression = string

/** A string pattern (e.g. dissect or grok pattern). */
export type EsqlStringPattern = string

/** A map expression: key-value options passed via WITH {...}. */
export type EsqlMapExpression = Record<string, unknown>

/** A list of rename clauses: old AS new. */
export type EsqlRenameClauseList = string[]

/** A list of sub-query pipelines for FORK. */
export type EsqlSubQueryList = string[]
