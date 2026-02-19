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

import { date, datetime, date_nanos, date_period, time_duration, keyword, integer, long } from '@esql/_lang/data_types'

/** Computes the difference between two dates. @esql_function scalar */
export function DATE_DIFF(unit: keyword, start: date | datetime | date_nanos, end: date | datetime | date_nanos): integer

/** Extracts a part of a date as an integer. @esql_function scalar */
export function DATE_EXTRACT(part: keyword, date_value: date | datetime | date_nanos): long

/** Formats a date as a string. @esql_function scalar */
export function DATE_FORMAT(format: keyword, date_value: date | datetime | date_nanos): keyword

/** Parses a string into a date. @esql_function scalar */
export function DATE_PARSE(format: keyword, date_string?: keyword): date

/** Truncates a date to a given interval. @esql_function scalar */
export function DATE_TRUNC(interval: date_period | time_duration, date_value: date | datetime | date_nanos): date | datetime | date_nanos

/** Returns the name of the day of the week. @esql_function scalar */
export function DAY_NAME(date_value: date | datetime | date_nanos): keyword

/** Returns the name of the month. @esql_function scalar */
export function MONTH_NAME(date_value: date | datetime | date_nanos): keyword

/** Returns the current date and time. @esql_function scalar */
export function NOW(): date
