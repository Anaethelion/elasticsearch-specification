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

import { double, integer, long, unsigned_long, keyword, text, ip, version } from '@esql/_lang/data_types'

/** @esql_function scalar */
export function ABS(number: double | integer | long | unsigned_long): double | integer | long | unsigned_long

/** @esql_function scalar */
export function ACOS(number: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function ASIN(number: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function ATAN(number: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function ATAN2(y_coordinate: double | integer | long | unsigned_long, x_coordinate: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function CBRT(number: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function CEIL(number: double | integer | long | unsigned_long): double | integer | long | unsigned_long

/** @esql_function scalar */
export function COS(angle: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function COSH(angle: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function ACOSH(number: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function ASINH(number: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function ATANH(number: double | integer | long | unsigned_long): double

/**
 * Returns Euler's number.
 * @esql_function scalar
 */
export function E(): double

/** @esql_function scalar */
export function EXP(number: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function FLOOR(number: double | integer | long | unsigned_long): double | integer | long | unsigned_long

/** @esql_function scalar */
export function LOG(base: double | integer | long | unsigned_long, value?: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function LOG10(number: double | integer | long | unsigned_long): double

/**
 * Returns the mathematical constant pi.
 * @esql_function scalar
 */
export function PI(): double

/** @esql_function scalar */
export function POW(base: double | integer | long | unsigned_long, exponent: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function ROUND(number: double | integer | long | unsigned_long, decimals?: integer | long): double | integer | long | unsigned_long

/** @esql_function scalar */
export function ROUND_TO(number: double | integer | long | unsigned_long, values: double | integer | long | unsigned_long): double | integer | long | unsigned_long

/** @esql_function scalar */
export function SIGNUM(number: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function SIN(angle: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function SINH(angle: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function SQRT(number: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function TAN(angle: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function TANH(angle: double | integer | long | unsigned_long): double

/**
 * Returns the mathematical constant tau (2*pi).
 * @esql_function scalar
 */
export function TAU(): double

/** @esql_function scalar */
export function HYPOT(a: double | integer | long | unsigned_long, b: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function COPY_SIGN(magnitude: double | integer | long | unsigned_long, sign: double | integer | long | unsigned_long): double

/** @esql_function scalar */
export function SCALB(number: double | integer | long | unsigned_long, exponent: integer): double

/**
 * Returns the greatest of multiple values.
 * @esql_function scalar
 */
export function GREATEST(...values: Array<boolean | double | integer | long | keyword | text | ip | version>): boolean | double | integer | long | keyword | text | ip | version

/**
 * Returns the least of multiple values.
 * @esql_function scalar
 */
export function LEAST(...values: Array<boolean | double | integer | long | keyword | text | ip | version>): boolean | double | integer | long | keyword | text | ip | version

/**
 * Clamps a value to a range.
 * @esql_function scalar
 */
export function CLAMP(value: double | integer | long, min: double | integer | long, max: double | integer | long): double | integer | long

/**
 * Clamps a value to a maximum.
 * @esql_function scalar
 */
export function CLAMP_MAX(value: double | integer | long, max: double | integer | long): double | integer | long

/**
 * Clamps a value to a minimum.
 * @esql_function scalar
 */
export function CLAMP_MIN(value: double | integer | long, min: double | integer | long): double | integer | long
