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
  date, date_nanos, date_period, integer, keyword, long,
  text, time_duration
} from '@esql/_lang/data_types'

/**
 * Subtracts the `startTimestamp` from the `endTimestamp` and returns the difference in multiples of `unit`.
 * @esql_function scalar
 */
export function DATE_DIFF(
  unit: keyword | text,
  startTimestamp: date | date_nanos,
  endTimestamp: date | date_nanos
): integer

/**
 * Extracts parts of a date, like year, month, day, hour.
 * @esql_function scalar
 */
export function DATE_EXTRACT(datePart: keyword | text, date: date | date_nanos): long

/**
 * Returns a string representation of a date, in the provided format.
 * @esql_function scalar
 */
export function DATE_FORMAT(dateFormat?: keyword | text, date: date | date_nanos): keyword

/**
 * Options for the DATE_PARSE function.
 * @esql_map_param_type
 */
export class DATE_PARSEOptions {
  /** Coordinated Universal Time (UTC) offset or IANA time zone used to convert date values in the query string to UTC. */
  time_zone_param_name?: keyword
  /** The locale to use when parsing the date, relevant when parsing month names or week days. */
  locale_param_name?: keyword
}

/**
 * Returns a date by parsing the second argument using the format specified in the first argument.
 * @esql_function scalar
 */
export function DATE_PARSE(
  datePattern?: keyword | text,
  dateString: keyword | text,
  /** @esql_map_param */
  options?: DATE_PARSEOptions
): date

/**
 * Rounds down a date to the closest interval since epoch, which starts at `0001-01-01T00:00:00Z`.
 * @esql_function scalar
 */
export function DATE_TRUNC(interval: date_period | time_duration, date: date | date_nanos): date | date_nanos

/**
 * Returns the name of the weekday for date based on the configured Locale.
 * @esql_function scalar
 * @availability stack since=9.2.0
 * @availability serverless
 */
export function DAY_NAME(date: date | date_nanos): keyword

/**
 * Returns the month name for the provided date based on the configured Locale.
 * @esql_function scalar
 * @availability stack since=9.2.0
 * @availability serverless
 */
export function MONTH_NAME(date: date | date_nanos): keyword

/**
 * Returns current date and time.
 * @esql_function scalar
 */
export function NOW(): date

/**
 * Filters data for the given time range using the @timestamp attribute.
 * @esql_function scalar
 * @availability stack since=9.3.0
 * @availability serverless
 */
export function T_RANGE(
  start_time_or_offset_parameter: time_duration | date_period | date | date_nanos | keyword | long,
  end_time_parameter?: keyword | long | date | date_nanos
): boolean
