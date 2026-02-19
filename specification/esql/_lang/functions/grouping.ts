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
  date, date_nanos, date_period, double, integer, keyword,
  long, text, time_duration
} from '@esql/_lang/data_types'

/**
 * Creates groups of values - buckets - out of a datetime or numeric input.
 * @esql_function grouping
 * @esql_alias BIN
 */
export function BUCKET(
  field: integer | long | double | date | date_nanos,
  buckets: integer | long | double | date_period | time_duration,
  from?: integer | long | double | date | keyword | text,
  to?: integer | long | double | date | keyword | text
): double | date | date_nanos

/**
 * Options for the CATEGORIZE function.
 * @esql_map_param_type
 */
export class CATEGORIZEOptions {
  /** Analyzer used to convert the field into tokens for text categorization. */
  analyzer?: keyword
  /** The output format of the categories. Defaults to regex. */
  output_format?: keyword
  /** The minimum percentage of token weight that must match for text to be added to the category bucket. Must be between 1 and 100. The larger the value the narrower the categories. Larger values will increase memory usage and create narrower categories. Defaults to 70. */
  similarity_threshold?: integer
}

/**
 * Groups text messages into categories of similarly formatted text values.
 * @esql_function grouping
 * @availability stack since=9.1 stability=stable
 * @availability serverless stability=stable
 */
export function CATEGORIZE(
  field: text | keyword,
  /** @esql_map_param */
  options?: CATEGORIZEOptions
): keyword

/**
 * Creates groups of values - buckets - out of a @timestamp attribute. The size of the buckets must be provided directly.
 * @esql_function grouping
 * @availability stack since=9.2.0 stability=stable
 * @availability serverless stability=stable
 */
export function T_BUCKET(buckets: date_period | time_duration): date | date_nanos
