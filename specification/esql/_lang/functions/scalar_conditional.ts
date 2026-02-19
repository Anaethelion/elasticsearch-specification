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
  aggregate_metric_double, cartesian_point, cartesian_shape, date, date_nanos, dense_vector,
  double, exponential_histogram, geo_point, geo_shape, geohash, geohex,
  geotile, histogram, integer, ip, keyword, long,
  tdigest, text, unsigned_long, version
} from '@esql/_lang/data_types'

/**
 * Accepts pairs of conditions and values. The function returns the value that
 * @esql_function scalar
 */
export function CASE(
  condition: boolean,
  trueValue: aggregate_metric_double | boolean | cartesian_point | cartesian_shape | date | date_nanos | dense_vector | double | geo_point | geo_shape | geohash | geotile | geohex | histogram | integer | ip | keyword | long | tdigest | text | unsigned_long | version | exponential_histogram
): aggregate_metric_double | boolean | cartesian_point | cartesian_shape | date | date_nanos | dense_vector | double | geo_point | geo_shape | geohash | geotile | geohex | histogram | integer | ip | keyword | long | tdigest | unsigned_long | version | exponential_histogram

/**
 * Limits (or clamps) all input sample values to an upper bound of max. Any value above max is reduced to max.
 * @esql_function scalar
 * @availability stack since=9.3.0
 * @availability serverless
 * @esql_preview
 */
export function CLAMP_MAX(
  field: double | integer | long | unsigned_long | double | keyword | ip | boolean | date | version,
  max: double | integer | long | unsigned_long | double | keyword | ip | boolean | date | version
): double | integer | long | unsigned_long | double | keyword | ip | boolean | date | version

/**
 * Limits (or clamps) all input sample values to a lower bound of min. Any value below min is set to min.
 * @esql_function scalar
 * @availability stack since=9.3.0
 * @availability serverless
 * @esql_preview
 */
export function CLAMP_MIN(
  field: double | integer | long | double | unsigned_long | keyword | ip | boolean | date | version,
  min: double | integer | long | double | unsigned_long | keyword | ip | boolean | date | version
): double | integer | long | double | unsigned_long | keyword | ip | boolean | date | version

/**
 * Returns the maximum value from multiple columns. This is similar to esql mv_max except it is intended to run on multiple columns at once.
 * @esql_function scalar
 */
export function GREATEST(
  first: boolean | date | date_nanos | double | integer | ip | keyword | long | text | version,
  rest?: boolean | date | date_nanos | double | integer | ip | keyword | long | text | version
): boolean | date | date_nanos | double | integer | ip | keyword | long | version

/**
 * Returns the minimum value from multiple columns. This is similar to esql mv_min except it is intended to run on multiple columns at once.
 * @esql_function scalar
 */
export function LEAST(
  first: boolean | date | date_nanos | double | integer | ip | keyword | long | text | version,
  rest?: boolean | date | date_nanos | double | integer | ip | keyword | long | text | version
): boolean | date | date_nanos | double | integer | ip | keyword | long | version
