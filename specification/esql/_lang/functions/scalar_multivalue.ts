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
  cartesian_point, cartesian_shape, date, date_nanos, double, geo_point,
  geo_shape, geohash, geohex, geotile, integer, ip,
  keyword, long, text, unsigned_long, version
} from '@esql/_lang/data_types'

/**
 * Concatenates values of two multi-value fields.
 * @esql_function scalar
 */
export function MV_APPEND(
  field1: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version,
  field2: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version
): boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | version

/**
 * Converts a multivalued field into a single valued field containing the average of all of the values.
 * @esql_function scalar
 */
export function MV_AVG(number: double | integer | long | unsigned_long): double

/**
 * Converts a multivalued string expression into a single valued column containing the concatenation of all values separated by a delimiter.
 * @esql_function scalar
 */
export function MV_CONCAT(string: text | keyword, delim: text | keyword): keyword

/**
 * Checks if all values yielded by the second multivalue expression are present in the values yielded by the first multivalue expression. Returns a boolean. Null values are treated as an empty set.
 * @esql_function scalar
 * @availability stack since=9.2.0
 * @availability serverless
 * @esql_preview
 */
export function MV_CONTAINS(
  superset: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version,
  subset: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version
): boolean

/**
 * Converts a multivalued expression into a single valued column containing a count of the number of values.
 * @esql_function scalar
 */
export function MV_COUNT(
  field: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version
): integer

/**
 * Remove duplicate values from a multivalued field.
 * @esql_function scalar
 */
export function MV_DEDUPE(
  field: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version
): boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | version

/**
 * Converts a multivalued expression into a single valued column containing the
 * @esql_function scalar
 */
export function MV_FIRST(
  field: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version
): boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | version

/**
 * Returns the values that appear in both input fields. Returns `null` if either field is null or if no values match.
 * @esql_function scalar
 * @availability stack since=9.3.0
 * @availability serverless
 * @esql_preview
 */
export function MV_INTERSECTION(
  field1: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version,
  field2: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version
): boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | version

/**
 * Checks if any value yielded by the second multivalue expression is present in the values yielded by the first multivalue expression. Returns a boolean. Null values are treated as an empty set.
 * @esql_function scalar
 * @availability stack since=9.3.0
 * @availability serverless
 * @esql_preview
 */
export function MV_INTERSECTS(
  field1: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version,
  field2: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version
): boolean

/**
 * Converts a multivalue expression into a single valued column containing the last
 * @esql_function scalar
 */
export function MV_LAST(
  field: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version
): boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | version

/**
 * Converts a multivalued expression into a single valued column containing the maximum value.
 * @esql_function scalar
 */
export function MV_MAX(
  field: boolean | date | date_nanos | double | integer | ip | keyword | long | text | unsigned_long | version
): boolean | date | date_nanos | double | integer | ip | keyword | long | unsigned_long | version

/**
 * Converts a multivalued field into a single valued field containing the median value.
 * @esql_function scalar
 */
export function MV_MEDIAN(number: double | integer | long | unsigned_long): double | integer | long | unsigned_long

/**
 * Converts a multivalued field into a single valued field containing the median absolute deviation. It is calculated as the median of each data point’s deviation from the median of the entire sample. That is, for a random variable `X`, the median absolute deviation is `median(|median(X) - X|)`.
 * @esql_function scalar
 */
export function MV_MEDIAN_ABSOLUTE_DEVIATION(
  number: double | integer | long | unsigned_long
): double | integer | long | unsigned_long

/**
 * Converts a multivalued expression into a single valued column containing the minimum value.
 * @esql_function scalar
 */
export function MV_MIN(
  field: boolean | date | date_nanos | double | integer | ip | keyword | long | text | unsigned_long | version
): boolean | date | date_nanos | double | integer | ip | keyword | long | unsigned_long | version

/**
 * Converts a multivalued field into a single valued field containing the value at which a certain percentage of observed values occur.
 * @esql_function scalar
 */
export function MV_PERCENTILE(
  number: double | integer | long,
  percentile: double | integer | long
): double | integer | long

/**
 * Converts a multivalued expression into a single-valued column by multiplying every element on the input list by its corresponding term in P-Series and computing the sum.
 * @esql_function scalar
 */
export function MV_PSERIES_WEIGHTED_SUM(number: double, p: double): double

/**
 * Returns a subset of the multivalued field using the start and end index values.
 * @esql_function scalar
 */
export function MV_SLICE(
  field: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version,
  start: integer,
  end?: integer
): boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | version

/**
 * Sorts a multivalued field in lexicographical order.
 * @esql_function scalar
 */
export function MV_SORT(
  field: boolean | date | date_nanos | double | integer | ip | keyword | long | text | version,
  order?: keyword
): boolean | date | date_nanos | double | integer | ip | keyword | long | version

/**
 * Converts a multivalued field into a single valued field containing the sum of all of the values.
 * @esql_function scalar
 */
export function MV_SUM(number: double | integer | long | unsigned_long): double | integer | long | unsigned_long

/**
 * Returns all unique values from the combined input fields (set union). Null values are treated as empty sets; returns `null` only if both fields are null.
 * @esql_function scalar
 * @availability stack since=9.4.0
 * @availability serverless
 * @esql_preview
 */
export function MV_UNION(
  field1: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version,
  field2: boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | text | unsigned_long | version
): boolean | cartesian_point | cartesian_shape | date | date_nanos | double | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | unsigned_long | version

/**
 * Combines the values from two multivalued fields with a delimiter that joins them together.
 * @esql_function scalar
 */
export function MV_ZIP(
  string1: keyword | text,
  string2: keyword | text,
  delim?: keyword | text
): keyword
