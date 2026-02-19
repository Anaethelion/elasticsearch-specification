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
  date, datetime, date_nanos, date_period, time_duration,
  ip, version, geo_point, geo_shape, cartesian_point, cartesian_shape,
  dense_vector, aggregate_metric_double, geohash, geohex, geotile, date_range
} from '@esql/_lang/data_types'

/** Converts to boolean. @esql_function scalar */
export function TO_BOOLEAN(value: boolean | keyword | text | double | integer | long | unsigned_long): boolean

/**
 * Converts to datetime.
 * @esql_function scalar
 * @esql_alias TO_DT
 */
export function TO_DATETIME(value: date | datetime | date_nanos | keyword | text | double | integer | long | unsigned_long): datetime

/** Converts to date_nanos. @esql_function scalar @esql_alias TO_DATENANOS */
export function TO_DATE_NANOS(value: date | datetime | date_nanos | keyword | text | double | integer | long | unsigned_long): date_nanos

/** Converts to double. @esql_function scalar @esql_alias TO_DBL */
export function TO_DOUBLE(value: boolean | keyword | text | double | integer | long | unsigned_long | date | datetime | date_nanos): double

/** Converts to integer. @esql_function scalar @esql_alias TO_INT */
export function TO_INTEGER(value: boolean | keyword | text | double | integer | long | unsigned_long | date | datetime | date_nanos): integer

/** Converts to long. @esql_function scalar */
export function TO_LONG(value: boolean | keyword | text | double | integer | long | unsigned_long | date | datetime | date_nanos): long

/** Converts to unsigned long. @esql_function scalar */
export function TO_UNSIGNED_LONG(value: boolean | keyword | text | double | integer | long | unsigned_long | date | datetime | date_nanos): unsigned_long

/** Converts to keyword string. @esql_function scalar */
export function TO_STRING(value: boolean | keyword | text | double | integer | long | unsigned_long | date | datetime | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape): keyword

/** Converts to IP address. @esql_function scalar */
export function TO_IP(value: keyword | text | ip): ip

/** Converts to version. @esql_function scalar */
export function TO_VERSION(value: keyword | text | version): version

/** Converts to geo_point. @esql_function scalar */
export function TO_GEOPOINT(value: keyword | text | geo_point): geo_point

/** Converts to geo_shape. @esql_function scalar */
export function TO_GEOSHAPE(value: keyword | text | geo_shape): geo_shape

/** Converts to cartesian_point. @esql_function scalar */
export function TO_CARTESIANPOINT(value: keyword | text | cartesian_point): cartesian_point

/** Converts to cartesian_shape. @esql_function scalar */
export function TO_CARTESIANSHAPE(value: keyword | text | cartesian_shape): cartesian_shape

/** Converts to date_period. @esql_function scalar */
export function TO_DATEPERIOD(value: keyword | text | date_period): date_period

/** Converts to time_duration. @esql_function scalar */
export function TO_TIMEDURATION(value: keyword | text | time_duration): time_duration

/** Converts radians to degrees. @esql_function scalar */
export function TO_DEGREES(value: double | integer | long | unsigned_long): double

/** Converts degrees to radians. @esql_function scalar */
export function TO_RADIANS(value: double | integer | long | unsigned_long): double

/** Encodes a value as base64. @esql_function scalar */
export function TO_BASE64(value: keyword | text): keyword

/** Decodes a base64-encoded string. @esql_function scalar */
export function FROM_BASE64(value: keyword | text): keyword

/** Converts to dense_vector. @esql_function scalar */
export function TO_DENSE_VECTOR(value: keyword | text | dense_vector): dense_vector

/** Converts to aggregate_metric_double. @esql_function scalar @esql_alias TO_AGGREGATEMETRICDOUBLE */
export function TO_AGGREGATE_METRIC_DOUBLE(value: aggregate_metric_double | double | integer | long): aggregate_metric_double

/** Converts a geo_point to a geohash string. @esql_function scalar */
export function TO_GEOHASH(value: geo_point | keyword | text | geohash): geohash

/** Converts a geo_point to a geotile string. @esql_function scalar */
export function TO_GEOTILE(value: geo_point | keyword | text | geotile): geotile

/** Converts a geo_point to a geohex string. @esql_function scalar */
export function TO_GEOHEX(value: geo_point | keyword | text | geohex): geohex

/** Converts to a date range. @esql_function scalar */
export function TO_DATE_RANGE(value: date | datetime | date_nanos | date_range): date_range
