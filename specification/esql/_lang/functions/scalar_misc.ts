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
  date, double, integer, ip, keyword, long,
  unsigned_long, version
} from '@esql/_lang/data_types'

/**
 * Limits (or clamps) the values of all samples to have a lower limit of min and an upper limit of max.
 * @esql_function scalar
 * @availability stack since=9.3.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function CLAMP(
  field: double | integer | long | double | unsigned_long | keyword | ip | boolean | date | version,
  min: double | integer | long | double | unsigned_long | keyword | ip | boolean | date | version,
  max: double | integer | long | double | unsigned_long | keyword | ip | boolean | date | version
): double | integer | long | double | unsigned_long | keyword | ip | boolean | date | version
