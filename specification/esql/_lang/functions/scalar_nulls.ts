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
  cartesian_point, cartesian_shape, date, date_nanos, exponential_histogram, geo_point,
  geo_shape, geohash, geohex, geotile, histogram, integer,
  ip, keyword, long, tdigest, text, version
} from '@esql/_lang/data_types'

/**
 * Returns the first of its arguments that is not null. If all arguments are null, it returns `null`.
 * @esql_function scalar
 */
export function COALESCE(
  first: boolean | cartesian_point | cartesian_shape | date_nanos | date | histogram | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | tdigest | text | version | exponential_histogram,
  rest?: boolean | cartesian_point | cartesian_shape | date_nanos | date | histogram | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | tdigest | text | version | exponential_histogram
): boolean | cartesian_point | cartesian_shape | date_nanos | date | histogram | geo_point | geo_shape | geohash | geotile | geohex | integer | ip | keyword | long | tdigest | version | exponential_histogram
