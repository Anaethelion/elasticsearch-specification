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
  double, exponential_histogram, integer, long, tdigest, unsigned_long
} from '@esql/_lang/data_types'

/**
 * @esql_function scalar
 */
export function EXTRACT_HISTOGRAM_COMPONENT(histogram: exponential_histogram | tdigest, component: integer): double

/**
 * @esql_function scalar
 */
export function HISTOGRAM_PERCENTILE(
  histogram: exponential_histogram | tdigest,
  percentile: double | integer | long | unsigned_long
): double
