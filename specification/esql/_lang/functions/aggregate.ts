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
  _tsid, aggregate_metric_double, cartesian_point, cartesian_shape, counter_double, counter_integer,
  counter_long, date, date_nanos, dense_vector, double, exponential_histogram,
  geo_point, geo_shape, geohash, geohex, geotile, histogram,
  integer, ip, keyword, long, tdigest, text,
  time_duration, unsigned_long, version
} from '@esql/_lang/data_types'

/**
 * Returns true if the input expression yields no non-null values within the current aggregation context. Otherwise it returns false.
 * @esql_function aggregate
 * @availability stack since=9.2.0 stability=stable
 * @availability serverless stability=stable
 */
export function ABSENT(
  field: aggregate_metric_double | boolean | cartesian_point | cartesian_shape | date | date_nanos | dense_vector | double | geo_point | geo_shape | geohash | geotile | geohex | histogram | integer | ip | keyword | long | text | unsigned_long | version | exponential_histogram | tdigest
): boolean

/**
 * Calculates the absence of a field in the output result over time range.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ABSENT_OVER_TIME(
  field: aggregate_metric_double | boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | histogram | integer | ip | keyword | long | text | unsigned_long | version | exponential_histogram | tdigest,
  window?: time_duration
): boolean

/**
 * The average of a numeric field.
 * @esql_function aggregate
 */
export function AVG(number: aggregate_metric_double | exponential_histogram | tdigest | double | integer | long): double

/**
 * Calculates the average over time of a numeric field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function AVG_OVER_TIME(
  field: aggregate_metric_double | double | integer | long | exponential_histogram | tdigest,
  window?: time_duration
): double

/**
 * Returns the total number (count) of input values.
 * @esql_function aggregate
 */
export function COUNT(
  field?: aggregate_metric_double | boolean | cartesian_point | cartesian_shape | exponential_histogram | date | date_nanos | dense_vector | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | tdigest | text | unsigned_long | version
): long

/**
 * Returns the approximate number of distinct values.
 * @esql_function aggregate
 */
export function COUNT_DISTINCT(
  field: boolean | date | date_nanos | double | integer | ip | keyword | long | text | version | _tsid,
  precision?: integer | long | unsigned_long
): long

/**
 * Calculates the count of distinct values over time for a field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function COUNT_DISTINCT_OVER_TIME(
  field: boolean | date | date_nanos | double | integer | ip | keyword | long | text | version,
  precision?: integer | long | unsigned_long
): long

/**
 * Calculates the count over time value of a field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function COUNT_OVER_TIME(
  field: aggregate_metric_double | boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version,
  window?: time_duration
): long

/**
 * Calculates the absolute change of a gauge field in a time window.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function DELTA(field: long | integer | double, window?: time_duration): double

/**
 * Calculates the derivative over time of a numeric field using linear regression.
 * @esql_function time_series_aggregate
 * @availability stack since=9.3.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function DERIV(field: long | integer | double, window?: time_duration): double

/**
 * This function calculates the earliest occurrence of the search field
 * @esql_function aggregate
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function FIRST(
  field: long | integer | double | keyword | text | ip | boolean | date | date_nanos,
  sortField: long | date | date_nanos
): long | integer | double | keyword | ip | boolean | date | date_nanos

/**
 * Calculates the earliest value of a field, where recency determined by the `@timestamp` field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function FIRST_OVER_TIME(
  field: counter_long | counter_integer | counter_double | long | integer | double | exponential_histogram,
  window?: time_duration
): long | integer | double | exponential_histogram

/**
 * @esql_function aggregate
 */
export function HISTOGRAM_MERGE(histogram: exponential_histogram | tdigest): exponential_histogram | tdigest

/**
 * @esql_function time_series_aggregate
 */
export function HISTOGRAM_MERGE_OVER_TIME(
  histogram: exponential_histogram | tdigest,
  window?: time_duration
): exponential_histogram | tdigest

/**
 * Calculates the idelta of a gauge. idelta is the absolute change between the last two data points (it ignores all but the last two data points in each time period). This function is very similar to delta, but is more responsive to recent changes.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function IDELTA(field: long | integer | double, window?: time_duration): double

/**
 * Calculates the absolute increase of a counter field in a time window.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function INCREASE(field: counter_long | counter_integer | counter_double, window?: time_duration): double

/**
 * Calculates the irate of a counter field. irate is the per-second rate of increase between the last two data points (it ignores all but the last two data points in each time period). This function is very similar to rate, but is more responsive to recent changes in the rate of increase.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function IRATE(field: counter_long | counter_integer | counter_double, window?: time_duration): double

/**
 * This function calculates the latest occurrence of the search field
 * @esql_function aggregate
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function LAST(
  field: long | integer | double | keyword | text | ip | boolean | date | date_nanos,
  sortField: long | date | date_nanos
): long | integer | double | keyword | ip | boolean | date | date_nanos

/**
 * Calculates the latest value of a field, where recency determined by the `@timestamp` field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function LAST_OVER_TIME(
  field: counter_long | counter_integer | counter_double | long | integer | double | _tsid | exponential_histogram,
  window?: time_duration
): long | integer | double | _tsid | exponential_histogram

/**
 * The maximum value of a field.
 * @esql_function aggregate
 */
export function MAX(
  field: aggregate_metric_double | boolean | double | integer | long | date | date_nanos | ip | keyword | text | unsigned_long | version | exponential_histogram | tdigest
): boolean | double | integer | long | date | date_nanos | ip | keyword | unsigned_long | version

/**
 * Calculates the maximum over time value of a field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function MAX_OVER_TIME(
  field: aggregate_metric_double | boolean | double | integer | long | date | date_nanos | ip | keyword | text | unsigned_long | version | exponential_histogram | tdigest,
  window?: time_duration
): boolean | double | integer | long | date | date_nanos | ip | keyword | unsigned_long | version

/**
 * The value that is greater than half of all values and less than half of all values, also known as the 50% esql percentile.
 * @esql_function aggregate
 */
export function MEDIAN(number: double | integer | long | exponential_histogram): double

/**
 * Returns the median absolute deviation, a measure of variability. It is a robust statistic, meaning that it is useful for describing data that may have outliers, or may not be normally distributed. For such data it can be more descriptive than standard deviation. It is calculated as the median of each data point’s deviation from the median of the entire sample. That is, for a random variable `X`, the median absolute deviation is `median(|median(X) - X|)`.
 * @esql_function aggregate
 */
export function MEDIAN_ABSOLUTE_DEVIATION(number: double | integer | long): double

/**
 * The minimum value of a field.
 * @esql_function aggregate
 */
export function MIN(
  field: aggregate_metric_double | boolean | double | integer | long | date | date_nanos | ip | keyword | text | unsigned_long | version | exponential_histogram | tdigest
): boolean | double | integer | long | date | date_nanos | ip | keyword | unsigned_long | version

/**
 * Calculates the minimum over time value of a field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function MIN_OVER_TIME(
  field: aggregate_metric_double | boolean | double | integer | long | date | date_nanos | ip | keyword | text | unsigned_long | version | exponential_histogram | tdigest,
  window?: time_duration
): boolean | double | integer | long | date | date_nanos | ip | keyword | unsigned_long | version

/**
 * Returns the value at which a certain percentage of observed values occur. For example, the 95th percentile is the value which is greater than 95% of the observed values and the 50th percentile is the `MEDIAN`.
 * @esql_function aggregate
 */
export function PERCENTILE(
  number: double | integer | long | exponential_histogram | tdigest,
  percentile: double | integer | long
): double

/**
 * Calculates the percentile over time of a field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.3.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function PERCENTILE_OVER_TIME(
  field: double | integer | long | exponential_histogram | tdigest,
  percentile: double | integer | long
): double

/**
 * Returns true if the input expression yields any non-null values within the current aggregation context. Otherwise it returns false.
 * @esql_function aggregate
 * @availability stack since=9.2.0 stability=stable
 * @availability serverless stability=stable
 */
export function PRESENT(
  field: aggregate_metric_double | boolean | cartesian_point | cartesian_shape | date | date_nanos | dense_vector | double | geo_point | geo_shape | geohash | geotile | geohex | integer | histogram | ip | keyword | long | text | unsigned_long | version | exponential_histogram | tdigest
): boolean

/**
 * Calculates the presence of a field in the output result over time range.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function PRESENT_OVER_TIME(
  field: aggregate_metric_double | boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | histogram | integer | ip | keyword | long | text | unsigned_long | version | exponential_histogram | tdigest,
  window?: time_duration
): boolean

/**
 * Calculates the per-second average rate of increase of a counter. Rate calculations account for breaks in monotonicity, such as counter resets when a service restarts, and extrapolate values within each bucketed time interval. Rate is the most appropriate aggregate function for counters. It is only allowed in a STATS command under a `TS` source command, to be properly applied per time series.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function RATE(field: counter_long | counter_integer | counter_double, window?: time_duration): double

/**
 * Collects sample values for a field.
 * @esql_function aggregate
 * @availability stack since=9.1.0 stability=stable
 * @availability serverless stability=stable
 */
export function SAMPLE(
  field: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | text | version,
  limit: integer
): boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | version

/**
 * Calculate the spatial centroid over a field with spatial geometry type.
 * @esql_function aggregate
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_CENTROID_AGG(
  field: geo_point | cartesian_point | geo_shape | cartesian_shape
): geo_point | cartesian_point

/**
 * Calculate the spatial extent over a field with geometry type. Returns a bounding box for all values of the field.
 * @esql_function aggregate
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_EXTENT_AGG(
  field: geo_point | cartesian_point | geo_shape | cartesian_shape
): geo_shape | cartesian_shape

/**
 * The population standard deviation of a numeric field.
 * @esql_function aggregate
 */
export function STD_DEV(number: double | integer | long): double

/**
 * Calculates the population standard deviation over time of a numeric field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.3.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function STDDEV_OVER_TIME(field: double | integer | long, window?: time_duration): double

/**
 * The sum of a numeric expression.
 * @esql_function aggregate
 */
export function SUM(
  number: aggregate_metric_double | exponential_histogram | tdigest | double | integer | long
): long | double

/**
 * Calculates the sum over time value of a field.
 * @esql_function time_series_aggregate
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function SUM_OVER_TIME(
  field: aggregate_metric_double | double | integer | long | exponential_histogram | tdigest,
  window?: time_duration
): double | long

/**
 * Collects the top values for a field. Includes repeated values.
 * @esql_function aggregate
 */
export function TOP(
  field: boolean | double | integer | long | date | ip | keyword | text,
  limit: integer,
  order?: keyword,
  outputField?: double | integer | long | date
): boolean | double | integer | long | date | ip | keyword

/**
 * Returns unique values as a multivalued field. The order of the returned values isn’t guaranteed.
 * @esql_function aggregate
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function VALUES(
  field: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | text | version
): boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | version

/**
 * The population variance of a numeric field.
 * @esql_function aggregate
 * @esql_alias STD_VAR
 */
export function VARIANCE(number: double | integer | long): double

/**
 * Calculates the population variance over time of a numeric field.
 * @esql_function time_series_aggregate
 * @esql_alias STDVAR_OVER_TIME
 * @availability stack since=9.3.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function VARIANCE_OVER_TIME(field: double | integer | long, window?: time_duration): double

/**
 * The weighted average of a numeric expression.
 * @esql_function aggregate
 */
export function WEIGHTED_AVG(number: double | integer | long, weight: double | integer | long): double
