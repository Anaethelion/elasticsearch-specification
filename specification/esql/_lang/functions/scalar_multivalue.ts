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
  boolean, double, integer, long, unsigned_long, keyword, text,
  date, datetime, date_nanos, ip, version,
  geo_point, geo_shape, cartesian_point, cartesian_shape
} from '@esql/_lang/data_types'

/**
 * Appends values from two multi-valued fields.
 * @esql_function scalar
 */
export function MV_APPEND(left: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape, right: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape

/**
 * Returns the average of a multi-valued numeric field.
 * @esql_function scalar
 */
export function MV_AVG(field: double | integer | long | unsigned_long): double

/**
 * Concatenates multi-valued strings with a delimiter.
 * @esql_function scalar
 */
export function MV_CONCAT(field: keyword | text, delim: keyword | text): keyword

/**
 * Returns true if a multi-valued field contains a value.
 * @esql_function scalar
 */
export function MV_CONTAINS(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, value: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean

/**
 * Returns the number of values.
 * @esql_function scalar
 */
export function MV_COUNT(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape): integer

/**
 * Removes duplicate values.
 * @esql_function scalar
 */
export function MV_DEDUPE(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns the first value.
 * @esql_function scalar
 */
export function MV_FIRST(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape

/**
 * Returns the last value.
 * @esql_function scalar
 */
export function MV_LAST(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape

/**
 * Returns the maximum value.
 * @esql_function scalar
 */
export function MV_MAX(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns the minimum value.
 * @esql_function scalar
 */
export function MV_MIN(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns the median value.
 * @esql_function scalar
 */
export function MV_MEDIAN(field: double | integer | long | unsigned_long): double

/**
 * Returns the median absolute deviation.
 * @esql_function scalar
 */
export function MV_MEDIAN_ABSOLUTE_DEVIATION(field: double | integer | long): double

/**
 * Returns a percentile of a multi-valued numeric field.
 * @esql_function scalar
 */
export function MV_PERCENTILE(field: double | integer | long, percentile: double | integer | long): double

/**
 * Returns the sum of values.
 * @esql_function scalar
 */
export function MV_SUM(field: double | integer | long | unsigned_long): double | long | unsigned_long

/**
 * Sorts the values.
 * @esql_function scalar
 */
export function MV_SORT(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, order?: keyword): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns a slice of values.
 * @esql_function scalar
 */
export function MV_SLICE(field: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape, start: integer, end?: integer): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape

/**
 * Returns the intersection of two multi-valued fields.
 * @esql_function scalar
 */
export function MV_INTERSECTION(left: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, right: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Returns true if two multi-valued fields share any values.
 * @esql_function scalar
 */
export function MV_INTERSECTS(left: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, right: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean

/**
 * Returns the union of two multi-valued fields.
 * @esql_function scalar
 */
export function MV_UNION(left: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version, right: boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version): boolean | double | integer | long | unsigned_long | keyword | text | date | date_nanos | ip | version

/**
 * Combines two multi-valued fields into pairs with a delimiter.
 * @esql_function scalar
 */
export function MV_ZIP(left: keyword | text, right: keyword | text, delim?: keyword | text): keyword
