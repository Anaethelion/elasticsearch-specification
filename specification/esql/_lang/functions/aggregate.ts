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
  double, integer, long, unsigned_long, keyword, text,
  boolean, date, date_nanos, ip, version,
  aggregate_metric_double, tdigest, exponential_histogram,
  geo_point, geo_shape, cartesian_point, cartesian_shape
} from '@esql/_lang/data_types'

/**
 * The average of a numeric field.
 * @esql_function aggregate
 */
export function AVG(number: aggregate_metric_double | exponential_histogram | tdigest | double | integer | long): double

/**
 * Counts the number of values.
 * @esql_function aggregate
 */
export function COUNT(field?: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape): long

/**
 * Counts the number of distinct values.
 * @esql_function aggregate
 */
export function COUNT_DISTINCT(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, precision?: integer): long

/**
 * Returns the maximum value.
 * @esql_function aggregate
 */
export function MAX(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns the minimum value.
 * @esql_function aggregate
 */
export function MIN(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns the median value.
 * @esql_function aggregate
 */
export function MEDIAN(field: double | integer | long): double

/**
 * Returns the median absolute deviation.
 * @esql_function aggregate
 */
export function MEDIAN_ABSOLUTE_DEVIATION(field: double | integer | long): double

/**
 * Returns the value at a given percentile.
 * @esql_function aggregate
 */
export function PERCENTILE(field: double | integer | long, percentile: double | integer | long): double

/**
 * Returns the sum of values.
 * @esql_function aggregate
 */
export function SUM(field: double | integer | long | unsigned_long): double | long | unsigned_long

/**
 * Returns the standard deviation.
 * @esql_function aggregate
 */
export function STD_DEV(field: double | integer | long): double

/**
 * Returns the variance.
 * @esql_function aggregate
 * @esql_alias STD_VAR
 */
export function VARIANCE(field: double | integer | long): double

/**
 * Returns the top N values sorted by a sort field.
 * @esql_function aggregate
 */
export function TOP(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, limit: integer, order: keyword): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Collects all values into a multi-valued field.
 * @esql_function aggregate
 */
export function VALUES(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Computes the weighted average.
 * @esql_function aggregate
 */
export function WEIGHTED_AVG(value: double | integer | long, weight: double | integer | long): double

/**
 * Returns the first value ordered by a sort field.
 * @esql_function aggregate
 */
export function FIRST(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, sort_field: date | date_nanos | double | integer | long | keyword): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns the last value ordered by a sort field.
 * @esql_function aggregate
 */
export function LAST(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, sort_field: date | date_nanos | double | integer | long | keyword): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns a random sample of values.
 * @esql_function aggregate
 */
export function SAMPLE(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, count: integer): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns true if any value is present (non-null).
 * @esql_function aggregate
 */
export function PRESENT(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean

/**
 * Returns true if all values are absent (null).
 * @esql_function aggregate
 */
export function ABSENT(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean

/**
 * Computes the centroid of spatial values.
 * @esql_function aggregate
 */
export function ST_CENTROID_AGG(field: geo_point | cartesian_point): geo_point | cartesian_point

/**
 * Computes the spatial bounding box.
 * @esql_function aggregate
 */
export function ST_EXTENT_AGG(field: geo_point | geo_shape | cartesian_point | cartesian_shape): geo_shape | cartesian_shape

/**
 * Computes the rate of change per second of a counter metric.
 * @esql_function aggregate
 */
export function RATE(field: double | integer | long): double
