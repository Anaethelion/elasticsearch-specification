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
  date, date_nanos, double, integer, long, unsigned_long
} from '@esql/_lang/data_types'

/**
 * Returns the absolute value.
 * @esql_function scalar
 */
export function ABS(number: double | integer | long | unsigned_long): double | integer | long | unsigned_long

/**
 * Returns the arccosine (https://en.wikipedia.org/wiki/Inverse_trigonometric_functions) of `n` as an angle, expressed in radians.
 * @esql_function scalar
 */
export function ACOS(number: double | integer | long | unsigned_long): double

/**
 * Returns the inverse hyperbolic cosine (https://en.wikipedia.org/wiki/Inverse_trigonometric_functions) of a number.
 * @esql_function scalar
 */
export function ACOSH(number: double | integer | long | unsigned_long): double

/**
 * Returns the arcsine (https://en.wikipedia.org/wiki/Inverse_trigonometric_functions) of the input numeric expression as an angle, expressed in radians.
 * @esql_function scalar
 */
export function ASIN(number: double | integer | long | unsigned_long): double

/**
 * Returns the inverse hyperbolic sine (https://en.wikipedia.org/wiki/Inverse_trigonometric_functions) of a number.
 * @esql_function scalar
 */
export function ASINH(number: double | integer | long | unsigned_long): double

/**
 * Returns the arctangent (https://en.wikipedia.org/wiki/Inverse_trigonometric_functions) of the input numeric expression as an angle, expressed in radians.
 * @esql_function scalar
 */
export function ATAN(number: double | integer | long | unsigned_long): double

/**
 * The angle (https://en.wikipedia.org/wiki/Atan2) between the positive x-axis and the ray from the origin to the point (x , y) in the Cartesian plane, expressed in radians.
 * @esql_function scalar
 */
export function ATAN2(
  y_coordinate: double | integer | long | unsigned_long,
  x_coordinate: double | integer | long | unsigned_long
): double

/**
 * Returns the inverse hyperbolic tangent (https://en.wikipedia.org/wiki/Inverse_trigonometric_functions) of a number.
 * @esql_function scalar
 */
export function ATANH(number: double | integer | long | unsigned_long): double

/**
 * Returns the cube root of a number. The input can be any numeric value, the return value is always a double.
 * @esql_function scalar
 */
export function CBRT(number: double | integer | long | unsigned_long): double

/**
 * Round a number up to the nearest integer.
 * @esql_function scalar
 */
export function CEIL(number: double | integer | long | unsigned_long): double | integer | long | unsigned_long

/**
 * Returns a value with the magnitude of the first argument and the sign of the second argument.
 * @esql_function scalar
 * @availability stack since=9.1.0 stability=stable
 * @availability serverless stability=stable
 */
export function COPY_SIGN(magnitude: double | integer | long, sign: double | integer | long): double | integer | long

/**
 * Returns the cosine (https://en.wikipedia.org/wiki/Sine_and_cosine) of an angle.
 * @esql_function scalar
 */
export function COS(angle: double | integer | long | unsigned_long): double

/**
 * Returns the hyperbolic cosine (https://en.wikipedia.org/wiki/Hyperbolic_functions) of a number.
 * @esql_function scalar
 */
export function COSH(number: double | integer | long | unsigned_long): double

/**
 * Returns Euler’s number (https://en.wikipedia.org/wiki/E_(mathematical_constant)).
 * @esql_function scalar
 */
export function E(): double

/**
 * Returns the value of e raised to the power of the given number.
 * @esql_function scalar
 */
export function EXP(number: double | integer | long | unsigned_long): double

/**
 * Round a number down to the nearest integer.
 * @esql_function scalar
 */
export function FLOOR(number: double | integer | long | unsigned_long): double | integer | long | unsigned_long

/**
 * Returns the hypotenuse of two numbers. The input can be any numeric values, the return value is always a double.
 * @esql_function scalar
 */
export function HYPOT(
  number1: double | integer | long | unsigned_long,
  number2: double | integer | long | unsigned_long
): double

/**
 * Returns the logarithm of a value to a base. The input can be any numeric value, the return value is always a double. Logs of zero, negative numbers, and base of one return `null` as well as a warning.
 * @esql_function scalar
 */
export function LOG(
  base?: integer | unsigned_long | long | double,
  number: integer | unsigned_long | long | double
): double

/**
 * Returns the logarithm of a value to base 10. The input can be any numeric value, the return value is always a double. Logs of 0 and negative numbers return `null` as well as a warning.
 * @esql_function scalar
 */
export function LOG10(number: double | integer | long | unsigned_long): double

/**
 * Returns Pi (https://en.wikipedia.org/wiki/Pi), the ratio of a circle’s circumference to its diameter.
 * @esql_function scalar
 */
export function PI(): double

/**
 * Returns the value of `base` raised to the power of `exponent`.
 * @esql_function scalar
 */
export function POW(
  base: double | integer | long | unsigned_long,
  exponent: double | integer | long | unsigned_long
): double

/**
 * Rounds a number to the specified number of decimal places.
 * @esql_function scalar
 */
export function ROUND(
  number: double | integer | long | unsigned_long,
  decimals?: integer | long
): double | integer | long | unsigned_long

/**
 * Rounds down to one of a list of fixed points.
 * @esql_function scalar
 * @availability stack since=9.1.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ROUND_TO(
  field: double | integer | long | date | date_nanos,
  points: double | integer | long | date | date_nanos
): double | integer | long | date | date_nanos

/**
 * Returns the result of `d * 2 ^ scaleFactor`,
 * @esql_function scalar
 * @availability stack since=9.1.0 stability=stable
 * @availability serverless stability=stable
 */
export function SCALB(d: double | integer | long | unsigned_long, scaleFactor: integer | long): double

/**
 * Returns the sign of the given number. It returns `-1` for negative numbers, `0` for `0` and `1` for positive numbers.
 * @esql_function scalar
 */
export function SIGNUM(number: double | integer | long | unsigned_long): double

/**
 * Returns the sine (https://en.wikipedia.org/wiki/Sine_and_cosine) of an angle.
 * @esql_function scalar
 */
export function SIN(angle: double | integer | long | unsigned_long): double

/**
 * Returns the hyperbolic sine (https://en.wikipedia.org/wiki/Hyperbolic_functions) of a number.
 * @esql_function scalar
 */
export function SINH(number: double | integer | long | unsigned_long): double

/**
 * Returns the square root of a number. The input can be any numeric value, the return value is always a double.
 * @esql_function scalar
 */
export function SQRT(number: double | integer | long | unsigned_long): double

/**
 * Returns the tangent (https://en.wikipedia.org/wiki/Sine_and_cosine) of an angle.
 * @esql_function scalar
 */
export function TAN(angle: double | integer | long | unsigned_long): double

/**
 * Returns the hyperbolic tangent (https://en.wikipedia.org/wiki/Hyperbolic_functions) of a number.
 * @esql_function scalar
 */
export function TANH(number: double | integer | long | unsigned_long): double

/**
 * Returns the [ratio](https://tauday.com/tau-manifesto) of a circle’s circumference to its radius.
 * @esql_function scalar
 */
export function TAU(): double
