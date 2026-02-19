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
  counter_long, date, date_nanos, date_period, date_range, dense_vector,
  double, exponential_histogram, geo_point, geo_shape, geohash, geohex,
  geotile, histogram, int, integer, ip, keyword,
  long, tdigest, text, time_duration, unsigned_long, version
} from '@esql/_lang/data_types'

/**
 * Convert aggregate double metric to a block of a single subfield.
 * @esql_function scalar
 */
export function FROM_AGGREGATE_METRIC_DOUBLE(
  aggregate_metric_double: aggregate_metric_double | int | double | long,
  subfieldIndex: int
): long | double

/**
 * Decode a base64 string.
 * @esql_function scalar
 */
export function FROM_BASE64(string: keyword | text): keyword

/**
 * Encode a numeric to an aggregate_metric_double.
 * @esql_function scalar
 * @esql_alias TO_AGGREGATEMETRICDOUBLE
 * @availability stack since=9.2.0
 * @availability serverless
 * @esql_preview
 */
export function TO_AGGREGATE_METRIC_DOUBLE(
  number: double | long | unsigned_long | integer | aggregate_metric_double
): aggregate_metric_double

/**
 * Encode a string to a base64 string.
 * @esql_function scalar
 */
export function TO_BASE64(string: keyword | text | _tsid): keyword

/**
 * Converts an input value to a boolean value.
 * @esql_function scalar
 * @esql_alias TO_BOOL
 */
export function TO_BOOLEAN(field: boolean | keyword | text | double | long | unsigned_long | integer): boolean

/**
 * Converts an input value to a `cartesian_point` value.
 * @esql_function scalar
 */
export function TO_CARTESIANPOINT(field: cartesian_point | keyword | text): cartesian_point

/**
 * Converts an input value to a `cartesian_shape` value.
 * @esql_function scalar
 */
export function TO_CARTESIANSHAPE(field: cartesian_point | cartesian_shape | keyword | text): cartesian_shape

/**
 * Converts an input to a nanosecond-resolution date value (aka date_nanos).
 * @esql_function scalar
 * @esql_alias TO_DATENANOS
 */
export function TO_DATE_NANOS(field: date | date_nanos | keyword | text | double | long | unsigned_long): date_nanos

/**
 * Converts an input value to a `date_range` value.
 * @esql_function scalar
 * @esql_alias TO_DATERANGE
 * @esql_preview
 */
export function TO_DATE_RANGE(field: date_range): date_range

/**
 * Converts an input value into a `date_period` value.
 * @esql_function scalar
 */
export function TO_DATEPERIOD(field: date_period | keyword | text): date_period

/**
 * Converts an input value to a date value.
 * @esql_function scalar
 * @esql_alias TO_DT
 */
export function TO_DATETIME(field: date | date_nanos | keyword | text | double | long | unsigned_long | integer): date

/**
 * Converts a number in radians (https://en.wikipedia.org/wiki/Radian) to degrees (https://en.wikipedia.org/wiki/Degree_(angle)).
 * @esql_function scalar
 */
export function TO_DEGREES(number: double | integer | long | unsigned_long): double

/**
 * Converts a multi-valued input of numbers, or a hexadecimal string, to a dense_vector.
 * @esql_function scalar
 * @availability stack since=9.2.0
 * @availability serverless
 * @esql_preview
 */
export function TO_DENSE_VECTOR(field: double | long | integer | keyword): dense_vector

/**
 * Converts an input value to a double value. If the input parameter is of a date type,
 * @esql_function scalar
 * @esql_alias TO_DBL
 */
export function TO_DOUBLE(
  field: boolean | date | keyword | text | double | long | unsigned_long | integer | counter_double | counter_integer | counter_long
): double

/**
 * Converts an input value to a `geohash` value.
 * @esql_function scalar
 * @esql_preview
 */
export function TO_GEOHASH(field: geohash | long | keyword | text): geohash

/**
 * Converts an input value to a `geohex` value.
 * @esql_function scalar
 * @esql_preview
 */
export function TO_GEOHEX(field: geohex | long | keyword | text): geohex

/**
 * Converts an input value to a `geo_point` value.
 * @esql_function scalar
 */
export function TO_GEOPOINT(field: geo_point | keyword | text): geo_point

/**
 * Converts an input value to a `geo_shape` value.
 * @esql_function scalar
 */
export function TO_GEOSHAPE(field: geo_point | geo_shape | geohash | geohex | geotile | keyword | text): geo_shape

/**
 * Converts an input value to a `geotile` value.
 * @esql_function scalar
 * @esql_preview
 */
export function TO_GEOTILE(field: geotile | long | keyword | text): geotile

/**
 * Converts an input value to an integer value.
 * @esql_function scalar
 * @esql_alias TO_INT
 */
export function TO_INTEGER(
  field: boolean | date | keyword | text | double | long | unsigned_long | integer | counter_integer,
  base?: integer | long | unsigned_long
): integer

/**
 * Options for the TO_IP function.
 * @esql_map_param_type
 */
export class TO_IPOptions {
  /** What to do with leading 0s in IPv4 addresses. */
  leading_zeros?: keyword
}

/**
 * Converts an input string to an IP value.
 * @esql_function scalar
 */
export function TO_IP(
  field: ip | keyword | text,
  /** @esql_map_param */
  options?: TO_IPOptions
): ip

/**
 * Converts the input value to a long.
 * @esql_function scalar
 */
export function TO_LONG(
  field: boolean | date | date_nanos | keyword | text | double | long | unsigned_long | integer | counter_integer | counter_long | geohash | geotile | geohex,
  base?: integer | long | unsigned_long
): long

/**
 * Converts a number in degrees (https://en.wikipedia.org/wiki/Degree_(angle)) to radians (https://en.wikipedia.org/wiki/Radian).
 * @esql_function scalar
 */
export function TO_RADIANS(number: double | integer | long | unsigned_long): double

/**
 * Converts an input value into a string.
 * @esql_function scalar
 * @esql_alias TO_STR
 */
export function TO_STRING(
  field: aggregate_metric_double | boolean | cartesian_point | cartesian_shape | date | date_nanos | dense_vector | double | geo_point | geo_shape | geohash | geotile | geohex | histogram | integer | ip | keyword | long | text | unsigned_long | version | date_range | exponential_histogram
): keyword

/**
 * Converts an untyped histogram to a TDigest, assuming the values are centroids.
 * @esql_function scalar
 */
export function TO_TDIGEST(field: histogram | tdigest): tdigest

/**
 * Converts an input value into a `time_duration` value.
 * @esql_function scalar
 */
export function TO_TIMEDURATION(field: time_duration | keyword | text): time_duration

/**
 * Converts an input value to an unsigned long value. If the input parameter is of a date type,
 * @esql_function scalar
 * @esql_alias TO_ULONG
 * @esql_alias TO_UL
 * @esql_preview
 */
export function TO_UNSIGNED_LONG(
  field: boolean | date | keyword | text | double | long | unsigned_long | integer
): unsigned_long

/**
 * Converts an input string to a version value.
 * @esql_function scalar
 * @esql_alias TO_VER
 */
export function TO_VERSION(field: keyword | text | version): version

/**
 * URL-decodes the input, or returns `null` and adds a warning header to the response if the input cannot be decoded.
 * @esql_function scalar
 * @availability stack since=9.2.0
 * @availability serverless
 */
export function URL_DECODE(string: keyword | text): keyword

/**
 * URL-encodes the input. All characters are percent-encoded (https://en.wikipedia.org/wiki/Percent-encoding) except for alphanumerics, `.`, `-`, `_`, and `~`. Spaces are encoded as `+`.
 * @esql_function scalar
 * @availability stack since=9.2.0
 * @availability serverless
 */
export function URL_ENCODE(string: keyword | text): keyword

/**
 * URL-encodes the input. All characters are percent-encoded (https://en.wikipedia.org/wiki/Percent-encoding) except for alphanumerics, `.`, `-`, `_`, and `~`. Spaces are encoded as `%20`.
 * @esql_function scalar
 * @availability stack since=9.2.0
 * @availability serverless
 */
export function URL_ENCODE_COMPONENT(string: keyword | text): keyword
