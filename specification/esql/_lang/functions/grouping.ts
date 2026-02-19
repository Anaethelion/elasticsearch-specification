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

import { date, datetime, date_nanos, date_period, time_duration, double, integer, long, keyword, text } from '@esql/_lang/data_types'

/**
 * Creates buckets of values. Used for grouping in STATS.
 * @esql_function grouping
 * @esql_alias BIN
 */
export function BUCKET(field: date | datetime | date_nanos | double | integer | long, buckets: integer | date_period | time_duration): double | long | date

/**
 * Groups text values into categories using ML categorization.
 * @esql_function grouping
 */
export function CATEGORIZE(field: keyword | text): keyword
