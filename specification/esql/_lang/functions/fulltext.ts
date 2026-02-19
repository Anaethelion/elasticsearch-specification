// @ts-nocheck — body-less function declarations are intentional (TS2391)
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
  boolean, keyword, text, double, integer, long, unsigned_long, float,
  date, date_nanos, ip, version
} from '@esql/_lang/data_types'

/**
 * Options for the MATCH function.
 * @esql_map_param_type
 */
export class MATCHOptions {
  /** Analyzer used to convert the text in the query value into tokens. */
  analyzer?: keyword
  /** If true, match phrase queries are auto-created for multi-term synonyms. */
  auto_generate_synonyms_phrase_query?: boolean
  /** Maximum edit distance allowed for matching. */
  fuzziness?: keyword
  /** Floating point number to increase or decrease relevance scores. */
  boost?: float
  /** If true, edits for fuzzy matching include transpositions. */
  fuzzy_transpositions?: boolean
  /** Method used to rewrite the query. */
  fuzzy_rewrite?: keyword
  /** If false, format-based errors are returned. */
  lenient?: boolean
  /** Maximum number of terms to expand to. */
  max_expansions?: integer
  /** Minimum number of clauses that must match. */
  minimum_should_match?: keyword
  /** Boolean logic used to interpret text in the query value. */
  operator?: keyword
  /** Number of beginning characters left unchanged for fuzzy matching. */
  prefix_length?: integer
  /** Indicates whether all or no documents are returned if analyzer removes all tokens. */
  zero_terms_query?: keyword
}

/**
 * Performs a match query on the specified field.
 * @esql_function scalar
 * @availability stack since=9.0.0
 * @availability serverless
 */
export function MATCH(
  field: keyword | text | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version,
  query: keyword | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version,
  /** @esql_map_param */
  options?: MATCHOptions
): boolean

/**
 * Performs a match_phrase query on the specified field.
 * @esql_function scalar
 * @availability stack since=9.1.0
 * @availability serverless
 */
export function MATCH_PHRASE(
  field: keyword | text,
  query: keyword | text
): boolean

/**
 * Performs a multi_match query across multiple fields.
 * @esql_function scalar
 * @availability stack since=9.1.0
 * @availability serverless
 */
export function MULTI_MATCH(
  query: keyword | text,
  ...fields: Array<keyword | text>
): boolean

/**
 * Performs a KQL (Kibana Query Language) query.
 * @esql_function scalar
 * @availability stack since=8.17.0
 * @availability serverless
 */
export function KQL(query: keyword | text): boolean

/**
 * Performs a query_string query.
 * @esql_function scalar
 * @availability stack since=8.17.0
 * @availability serverless
 */
export function QUERY_STRING(query: keyword | text): boolean

/**
 * Returns the relevance score of the current row.
 * @esql_function scalar
 * @availability stack since=9.1.0
 * @availability serverless
 */
export function SCORE(): double
