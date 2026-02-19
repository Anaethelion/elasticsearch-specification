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
  date, date_nanos, double, float, integer, ip,
  keyword, long, text, unsigned_long, version
} from '@esql/_lang/data_types'

/**
 * Options for the KQL function.
 * @esql_map_param_type
 */
export class KQLOptions {
  /** If true, performs case-insensitive matching for keyword fields. Defaults to false. */
  case_insensitive?: boolean
  /** UTC offset or IANA time zone used to interpret date literals in the query string. */
  time_zone?: keyword
  /** Default field to search if no field is provided in the query string. Supports wildcards (*). */
  default_field?: keyword
  /** Floating point number used to decrease or increase the relevance scores of the query. Defaults to 1.0. */
  boost?: float
}

/**
 * Performs a KQL query. Returns true if the provided KQL query string matches the row.
 * @esql_function scalar
 * @availability stack since=9.1.0
 * @availability serverless
 */
export function KQL(
  query: keyword | text,
  /** @esql_map_param */
  options?: KQLOptions
): boolean

/**
 * Options for the MATCH function.
 * @esql_map_param_type
 */
export class MATCHOptions {
  /** Analyzer used to convert the text in the query value into token. Defaults to the index-time analyzer mapped for the field. If no analyzer is mapped, the index’s default analyzer is used. */
  analyzer?: keyword
  /** If true, match phrase queries are automatically created for multi-term synonyms. Defaults to true. */
  auto_generate_synonyms_phrase_query?: boolean
  /** Maximum edit distance allowed for matching. */
  fuzziness?: keyword
  /** Floating point number used to decrease or increase the relevance scores of the query. Defaults to 1.0. */
  boost?: float
  /** If true, edits for fuzzy matching include transpositions of two adjacent characters (ab → ba). Defaults to true. */
  fuzzy_transpositions?: boolean
  /** Method used to rewrite the query. See the rewrite parameter for valid values and more information. If the fuzziness parameter is not 0, the match query uses a fuzzy_rewrite method of top_terms_blended_freqs_${max_expansions} by default. */
  fuzzy_rewrite?: keyword
  /** If false, format-based errors, such as providing a text query value for a numeric field, are returned. Defaults to false. */
  lenient?: boolean
  /** Maximum number of terms to which the query will expand. Defaults to 50. */
  max_expansions?: integer
  /** Minimum number of clauses that must match for a document to be returned. */
  minimum_should_match?: integer
  /** Boolean logic used to interpret text in the query value. Defaults to OR. */
  operator?: keyword
  /** Number of beginning characters left unchanged for fuzzy matching. Defaults to 0. */
  prefix_length?: integer
  /** Indicates whether all documents or none are returned if the analyzer removes all tokens, such as when using a stop filter. Defaults to none. */
  zero_terms_query?: keyword
}

/**
 * Use `MATCH` to perform a match query on the specified field.
 * @esql_function scalar
 * @availability stack since=9.1.0
 * @availability serverless
 */
export function MATCH(
  field: keyword | text | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version,
  query: keyword | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version,
  /** @esql_map_param */
  options?: MATCHOptions
): boolean

/**
 * Use the match operator (`:`) to perform a match query on the specified field.
 * @esql_function scalar
 * @availability stack since=9.1.0
 * @availability serverless
 */
export function MATCH_OPERATOR(
  field: keyword | text | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version,
  query: keyword | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version
): boolean

/**
 * Options for the MATCH_PHRASE function.
 * @esql_map_param_type
 */
export class MATCH_PHRASEOptions {
  /** Analyzer used to convert the text in the query value into token. Defaults to the index-time analyzer mapped for the field. If no analyzer is mapped, the index’s default analyzer is used. */
  analyzer?: keyword
  /** Maximum number of positions allowed between matching tokens. Defaults to 0. Transposed terms have a slop of 2. */
  slop?: integer
  /** Indicates whether all documents or none are returned if the analyzer removes all tokens, such as when using a stop filter. Defaults to none. */
  zero_terms_query?: keyword
  /** Floating point number used to decrease or increase the relevance scores of the query. Defaults to 1.0. */
  boost?: float
}

/**
 * Use `MATCH_PHRASE` to perform a `match_phrase` on the
 * @esql_function scalar
 * @availability stack since=9.1.0
 * @availability serverless
 */
export function MATCH_PHRASE(
  field: keyword | text,
  query: keyword,
  /** @esql_map_param */
  options?: MATCH_PHRASEOptions
): boolean

/**
 * Options for the MULTI_MATCH function.
 * @esql_map_param_type
 */
export class MULTI_MATCHOptions {
  /** Floating point number used to decrease or increase the relevance scores of the query. */
  boost?: float
  /** Analyzer used to convert the text in the query value into token. Defaults to the index-time analyzer mapped for the field. If no analyzer is mapped, the index’s default analyzer is used. */
  analyzer?: keyword
  /** If true, match phrase queries are automatically created for multi-term synonyms. Defaults to true. */
  auto_generate_synonyms_phrase_query?: boolean
  /** Maximum edit distance allowed for matching. */
  fuzziness?: keyword
  /** Method used to rewrite the query. See the rewrite parameter for valid values and more information. If the fuzziness parameter is not 0, the match query uses a fuzzy_rewrite method of top_terms_blended_freqs_${max_expansions} by default. */
  fuzzy_rewrite?: keyword
  /** If true, edits for fuzzy matching include transpositions of two adjacent characters (ab → ba). Defaults to true. */
  fuzzy_transpositions?: boolean
  /** If false, format-based errors, such as providing a text query value for a numeric field, are returned. Defaults to true. */
  lenient?: boolean
  /** Maximum number of terms to which the query will expand. Defaults to 50. */
  max_expansions?: integer
  /** Minimum number of clauses that must match for a document to be returned. */
  minimum_should_match?: integer
  /** Boolean logic used to interpret text in the query value. Defaults to OR. */
  operator?: keyword
  /** Number of beginning characters left unchanged for fuzzy matching. Defaults to 0. */
  prefix_length?: integer
  /** Controls how score is blended together between field groups. Defaults to 0 (best score from each group). */
  tie_breaker?: float
  /** Controls the way multi_match is executed internally. Can be one of `best_fields`, `most_fields`, `cross_fields`, `phrase`, `phrase_prefix` or `bool_prefix`. Defaults to 'best_fields'. See multi_match types. */
  type?: object
}

/**
 * Use `MULTI_MATCH` to perform a multi-match query on the specified field.
 * @esql_function scalar
 * @esql_preview
 */
export function MULTI_MATCH(
  query: keyword | boolean | date | date_nanos | double | integer | ip | long | text | unsigned_long | version,
  fields: keyword | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version,
  /** @esql_map_param */
  options?: MULTI_MATCHOptions
): boolean

/**
 * Options for the QSTR function.
 * @esql_map_param_type
 */
export class QSTROptions {
  /** Default field to search if no field is provided in the query string. Supports wildcards (*). */
  default_field?: keyword
  /** If true, the wildcard characters * and ? are allowed as the first character of the query string. Defaults to true. */
  allow_leading_wildcard?: boolean
  /** If true, the query attempts to analyze wildcard terms in the query string. Defaults to false. */
  allow_wildcard?: boolean
  /** Analyzer used to convert the text in the query value into token. Defaults to the index-time analyzer mapped for the default_field. */
  analyzer?: keyword
  /** If true, match phrase queries are automatically created for multi-term synonyms. Defaults to true. */
  auto_generate_synonyms_phrase_query?: boolean
  /** Maximum edit distance allowed for matching. */
  fuzziness?: keyword
  /** Floating point number used to decrease or increase the relevance scores of the query. */
  boost?: float
  /** Default boolean logic used to interpret text in the query string if no operators are specified. */
  default_operator?: keyword
  /** If true, enable position increments in queries constructed from a query_string search. Defaults to true. */
  enable_position_increments?: boolean
  /** Array of fields to search. Supports wildcards (*). */
  fields?: keyword
  /** Maximum number of terms to which the query expands for fuzzy matching. Defaults to 50. */
  fuzzy_max_expansions?: integer
  /** Number of beginning characters left unchanged for fuzzy matching. Defaults to 0. */
  fuzzy_prefix_length?: integer
  /** If true, edits for fuzzy matching include transpositions of two adjacent characters (ab → ba). Defaults to true. */
  fuzzy_transpositions?: boolean
  /** If false, format-based errors, such as providing a text query value for a numeric field, are returned. Defaults to false. */
  lenient?: boolean
  /** Maximum number of automaton states required for the query. Default is 10000. */
  max_determinized_states?: integer
  /** Minimum number of clauses that must match for a document to be returned. */
  minimum_should_match?: string
  /** Analyzer used to convert quoted text in the query string into tokens. Defaults to the search_quote_analyzer mapped for the default_field. */
  quote_analyzer?: keyword
  /** Maximum number of positions allowed between matching tokens for phrases. Defaults to 0 (which means exact matches are required). */
  phrase_slop?: integer
  /** Suffix appended to quoted text in the query string. */
  quote_field_suffix?: keyword
  /** Method used to rewrite the query. */
  rewrite?: keyword
  /** Coordinated Universal Time (UTC) offset or IANA time zone used to convert date values in the query string to UTC. */
  time_zone?: keyword
}

/**
 * Performs a query string query. Returns true if the provided query string matches the row.
 * @esql_function scalar
 * @availability stack since=9.1.0
 * @availability serverless
 */
export function QSTR(
  query: keyword | text,
  /** @esql_map_param */
  options?: QSTROptions
): boolean

/**
 * Scores an expression. Only full text functions will be scored. Returns scores for all the resulting docs.
 * @esql_function scalar
 * @availability stack since=9.3.0
 * @availability serverless
 * @esql_preview
 */
export function SCORE(query: boolean): double
