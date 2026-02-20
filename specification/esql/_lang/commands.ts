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
  EsqlAggFields,
  EsqlExpression,
  EsqlFieldList,
  EsqlFieldPatternList,
  EsqlIndexPattern,
  EsqlMapExpression,
  EsqlRenameClauseList,
  EsqlSortExpressionList,
  EsqlStringPattern,
  EsqlSubQueryList
} from '@esql/_lang/_types'

// =============================================================================
// Source commands

/**
 * @esql_command source
 * @esql_preview
 */
export class EXPLAIN {
  subqueryExpression: EsqlExpression
}

/**
 * @esql_command source
 */
export class PROMQL {
  promqlParam: EsqlExpression
}
// =============================================================================

/**
 * Retrieves data from one or more data streams, indices, or aliases.
 * @esql_command source
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class FROM {
  /** Index pattern(s) to read from. */
  index: EsqlIndexPattern
  /**
   * Metadata fields to retrieve alongside document fields.
   * @esql_clause METADATA
   */
  metadata?: EsqlFieldList
}

/**
 * Produces a row with one or more columns with values that you specify.
 * @esql_command source
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class ROW {
  /** One or more column definitions using literal values or expressions. */
  fields: EsqlFieldList
}

/**
 * Returns information about the deployment.
 * @esql_command source
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class SHOW {
  /** The info subcommand. Currently only INFO is supported. */
  subcommand: EsqlExpression
}

/**
 * Retrieves data from time series indices.
 * @esql_command source
 * @availability stack since=8.14.0
 */
export class TS {
  /** Index pattern(s) to read from. Must target time series indices. */
  index: EsqlIndexPattern
  /**
   * Metadata fields to retrieve alongside document fields.
   * @esql_clause METADATA
   */
  metadata?: EsqlFieldList
}

// =============================================================================
// Processing commands

/**
 * @esql_command processing
 * @esql_preview
 */
export class MMR {
  /** @esql_clause ON */
  diversifyfield: EsqlExpression
}
// =============================================================================

/**
 * Calculates new columns or overwrites existing ones using expressions.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class EVAL {
  /** One or more column definitions. */
  fields: EsqlFieldList
}

/**
 * Filters rows based on a boolean expression.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class WHERE {
  /** A boolean expression to filter rows. */
  condition: EsqlExpression
}

/**
 * Keeps only the specified columns and removes all others.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class KEEP {
  /** Column name patterns to retain. Supports wildcards. */
  columns: EsqlFieldPatternList
}

/**
 * Removes the specified columns from the output.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class DROP {
  /** Column name patterns to remove. Supports wildcards. */
  columns: EsqlFieldPatternList
}

/**
 * Limits the number of rows returned.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class LIMIT {
  /** Maximum number of rows to return. Must be a non-negative integer. */
  count: EsqlExpression
}

/**
 * Groups rows by one or more expressions and computes aggregate values.
 * @esql_command processing
 * @esql_function_context aggregate
 * @esql_function_context time_series_aggregate
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class STATS {
  /** Aggregate expressions to compute. */
  aggregates?: EsqlAggFields
  /**
   * Grouping expressions.
   * @esql_clause BY
   * @esql_function_context grouping
   */
  by?: EsqlFieldList
}

/**
 * Sorts rows by one or more expressions.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class SORT {
  /** Expressions to sort by, with optional ASC/DESC and NULLS FIRST/LAST. */
  order: EsqlSortExpressionList
}

/**
 * Renames one or more columns.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class RENAME {
  /** Rename clauses in the form: old_name AS new_name. */
  renamings: EsqlRenameClauseList
}

/**
 * Extracts structured data from a string using a dissect pattern.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class DISSECT {
  /** The input expression to extract from. */
  input: EsqlExpression
  /** The dissect pattern string. */
  pattern: EsqlStringPattern
}

/**
 * Extracts structured data from a string using a grok pattern.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class GROK {
  /** The input expression to extract from. */
  input: EsqlExpression
  /** One or more grok pattern strings. */
  pattern: EsqlStringPattern
}

/**
 * Enriches rows with data from an enrich policy.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class ENRICH {
  /** The enrich policy name. */
  policy: EsqlExpression
  /**
   * The match field to join on.
   * @esql_clause ON
   */
  on?: EsqlExpression
  /**
   * Fields to add from the enrich index.
   * @esql_clause WITH
   */
  with?: EsqlFieldList
}

/**
 * Expands a multi-valued field into one row per value.
 * @esql_command processing
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class MV_EXPAND {
  /** The multi-valued field to expand. */
  field: EsqlExpression
}

/**
 * Performs a lookup join with another index.
 * @esql_command processing
 * @availability stack since=8.16.0
 * @availability serverless
 */
export class JOIN {
  /** The lookup index to join with. */
  index: EsqlIndexPattern
  /**
   * Fields to join on.
   * @esql_clause ON
   */
  on: EsqlFieldList
}

/**
 * Detects change points in a metric over time.
 * @esql_command processing
 * @availability stack since=8.18.0
 * @availability serverless
 */
export class CHANGE_POINT {
  /** The value field to analyze for change points. */
  value: EsqlExpression
  /**
   * The key field (timestamp) to order by. Defaults to @timestamp.
   * @esql_clause ON
   */
  on?: EsqlExpression
  /**
   * Output column names for type and pvalue.
   * @esql_clause AS
   */
  as?: EsqlFieldList
}

/**
 * Generates text completions using an inference endpoint.
 * @esql_command processing
 * @availability stack since=8.18.0
 * @availability serverless
 */
export class COMPLETION {
  /** The prompt expression. */
  prompt: EsqlExpression
  /**
   * Named parameters including the inference endpoint.
   * @esql_clause WITH
   */
  with?: EsqlMapExpression
}

/**
 * Returns a random sample of rows based on a probability.
 * @esql_command processing
 * @availability stack since=8.18.0
 * @availability serverless
 */
export class SAMPLE {
  /** The sampling probability between 0 and 1. */
  probability: EsqlExpression
}

/**
 * Forks the pipeline into multiple sub-queries that are executed independently and unioned.
 * @esql_command processing
 * @availability stack since=8.18.0
 * @availability serverless
 */
export class FORK {
  /** One or more sub-query pipelines enclosed in parentheses. */
  subqueries: EsqlSubQueryList
}

/**
 * Reranks results using a text-based reranking model.
 * @esql_command processing
 * @availability stack since=8.18.0
 * @availability serverless
 */
export class RERANK {
  /** The query text used for reranking. */
  query: EsqlExpression
  /**
   * Fields to pass to the reranker.
   * @esql_clause ON
   */
  on: EsqlFieldList
  /**
   * Named parameters including the inference endpoint.
   * @esql_clause WITH
   */
  with?: EsqlMapExpression
}

/**
 * Like STATS but preserves original rows and appends aggregate columns via a join.
 * @esql_command processing
 * @esql_function_context aggregate
 * @esql_function_context time_series_aggregate
 * @availability stack since=8.18.0
 */
export class INLINE_STATS {
  /** Aggregate expressions to compute. */
  aggregates: EsqlAggFields
  /**
   * Grouping expressions.
   * @esql_clause BY
   * @esql_function_context grouping
   */
  by?: EsqlFieldList
}

/**
 * Combines results from multiple retrieval methods using reciprocal rank fusion or other strategies.
 * @esql_command processing
 * @availability stack since=8.18.0
 */
export class FUSE {
  /**
   * Score field to fuse on.
   * @esql_clause SCORE_BY
   */
  score_by?: EsqlExpression
  /**
   * Key fields to join fused results.
   * @esql_clause KEY_BY
   */
  key_by?: EsqlFieldList
  /**
   * Group field for grouping fused results.
   * @esql_clause GROUP_BY
   */
  group_by?: EsqlExpression
  /**
   * Options for the fusion strategy.
   * @esql_clause WITH
   */
  with?: EsqlMapExpression
}

/**
 * Parses a URI string into its component parts.
 * @esql_command processing
 * @availability stack since=8.18.0
 */
export class URI_PARTS {
  /** The output field prefix for URI components. */
  target: EsqlExpression
  /** The input URI expression. */
  input: EsqlExpression
}

/**
 * Retrieves metrics information.
 * @esql_command processing
 * @availability stack since=8.18.0
 */
export class METRICS_INFO {
}

// =============================================================================
// Development / preview commands
// =============================================================================

/**
 * Looks up values in a lookup index.
 * @esql_command processing
 * @esql_preview
 * @availability stack since=8.14.0
 */
export class LOOKUP {
  /** The lookup index. */
  index: EsqlIndexPattern
  /**
   * Fields to match on.
   * @esql_clause ON
   */
  on: EsqlFieldPatternList
}

/**
 * Insists that specified fields must be present in the output.
 * @esql_command processing
 * @esql_preview
 * @availability stack since=8.18.0
 */
export class INSIST {
  /** Fields that must be present. */
  fields: EsqlFieldPatternList
}
