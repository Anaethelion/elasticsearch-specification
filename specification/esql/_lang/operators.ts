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
  dense_vector
} from '@esql/_lang/data_types'

// =============================================================================
// Arithmetic operators
// =============================================================================

/**
 * Add two values. For numerics, dates, and dense vectors.
 * @esql_operator infix
 * @esql_symbol +
 * @esql_precedence 4
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class ADD {
  lhs: double | integer | long | date_nanos | date_period | datetime | time_duration | unsigned_long | dense_vector
  rhs: double | integer | long | date_nanos | date_period | datetime | time_duration | unsigned_long | dense_vector
  /** @esql_return_type */
  return_type: double | integer | long | date_nanos | date_period | datetime | time_duration | unsigned_long | dense_vector
}

/**
 * Subtract two values. For numerics, dates, and dense vectors.
 * @esql_operator infix
 * @esql_symbol -
 * @esql_precedence 4
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class SUB {
  lhs: double | integer | long | date_nanos | date_period | datetime | time_duration | unsigned_long | dense_vector
  rhs: double | integer | long | date_nanos | date_period | datetime | time_duration | unsigned_long | dense_vector
  /** @esql_return_type */
  return_type: double | integer | long | date_nanos | date_period | datetime | time_duration | unsigned_long | dense_vector
}

/**
 * Multiply two values.
 * @esql_operator infix
 * @esql_symbol *
 * @esql_precedence 3
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class MUL {
  lhs: double | integer | long | unsigned_long
  rhs: double | integer | long | unsigned_long
  /** @esql_return_type */
  return_type: double | integer | long | unsigned_long
}

/**
 * Divide two values.
 * @esql_operator infix
 * @esql_symbol /
 * @esql_precedence 3
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class DIV {
  lhs: double | integer | long | unsigned_long
  rhs: double | integer | long | unsigned_long
  /** @esql_return_type */
  return_type: double | integer | long | unsigned_long
}

/**
 * Modulo (remainder) of two values.
 * @esql_operator infix
 * @esql_symbol %
 * @esql_precedence 3
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class MOD {
  lhs: double | integer | long | unsigned_long
  rhs: double | integer | long | unsigned_long
  /** @esql_return_type */
  return_type: double | integer | long | unsigned_long
}

/**
 * Unary negation.
 * @esql_operator prefix
 * @esql_symbol -
 * @esql_precedence 2
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class NEG {
  operand: double | integer | long
  /** @esql_return_type */
  return_type: double | integer | long
}

// =============================================================================
// Comparison operators
// =============================================================================

/**
 * Equality comparison.
 * @esql_operator infix
 * @esql_symbol ==
 * @esql_precedence 6
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class EQUALS {
  lhs: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape
  rhs: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape
  /** @esql_return_type */
  return_type: boolean
}

/**
 * Inequality comparison.
 * @esql_operator infix
 * @esql_symbol !=
 * @esql_precedence 6
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class NOT_EQUALS {
  lhs: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape
  rhs: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape
  /** @esql_return_type */
  return_type: boolean
}

/**
 * Less than comparison.
 * @esql_operator infix
 * @esql_symbol <
 * @esql_precedence 5
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class LESS_THAN {
  lhs: double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  rhs: double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  /** @esql_return_type */
  return_type: boolean
}

/**
 * Less than or equal comparison.
 * @esql_operator infix
 * @esql_symbol <=
 * @esql_precedence 5
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class LESS_THAN_OR_EQUAL {
  lhs: double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  rhs: double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  /** @esql_return_type */
  return_type: boolean
}

/**
 * Greater than comparison.
 * @esql_operator infix
 * @esql_symbol >
 * @esql_precedence 5
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class GREATER_THAN {
  lhs: double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  rhs: double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  /** @esql_return_type */
  return_type: boolean
}

/**
 * Greater than or equal comparison.
 * @esql_operator infix
 * @esql_symbol >=
 * @esql_precedence 5
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class GREATER_THAN_OR_EQUAL {
  lhs: double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  rhs: double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  /** @esql_return_type */
  return_type: boolean
}

// =============================================================================
// Logical operators
// =============================================================================

/**
 * Logical AND.
 * @esql_operator infix
 * @esql_symbol AND
 * @esql_precedence 8
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class AND {
  lhs: boolean
  rhs: boolean
  /** @esql_return_type */
  return_type: boolean
}

/**
 * Logical OR.
 * @esql_operator infix
 * @esql_symbol OR
 * @esql_precedence 9
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class OR {
  lhs: boolean
  rhs: boolean
  /** @esql_return_type */
  return_type: boolean
}

/**
 * Logical NOT.
 * @esql_operator prefix
 * @esql_symbol NOT
 * @esql_precedence 7
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class NOT {
  operand: boolean
  /** @esql_return_type */
  return_type: boolean
}

// =============================================================================
// Pattern matching operators
// =============================================================================

/**
 * Tests whether a string matches a wildcard pattern.
 * @esql_operator infix
 * @esql_symbol LIKE
 * @esql_precedence 5
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class LIKE {
  lhs: keyword | text
  rhs: keyword
  /** @esql_return_type */
  return_type: boolean
}

/**
 * Tests whether a string matches a regular expression.
 * @esql_operator infix
 * @esql_symbol RLIKE
 * @esql_precedence 5
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class RLIKE {
  lhs: keyword | text
  rhs: keyword
  /** @esql_return_type */
  return_type: boolean
}

// =============================================================================
// Null testing operators
// =============================================================================

/**
 * Tests if a value is null.
 * @esql_operator postfix
 * @esql_symbol IS NULL
 * @esql_precedence 1
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class IS_NULL {
  operand: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape | dense_vector
  /** @esql_return_type */
  return_type: boolean
}

/**
 * Tests if a value is not null.
 * @esql_operator postfix
 * @esql_symbol IS NOT NULL
 * @esql_precedence 1
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class IS_NOT_NULL {
  operand: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape | dense_vector
  /** @esql_return_type */
  return_type: boolean
}

// =============================================================================
// Membership operators
// =============================================================================

/**
 * Tests if a value is contained in a list of values.
 * @esql_operator infix
 * @esql_symbol IN
 * @esql_precedence 6
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class IN {
  lhs: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  rhs: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version
  /** @esql_return_type */
  return_type: boolean
}

// =============================================================================
// Match operator
// =============================================================================

/**
 * Performs a match query on a field. Shortcut syntax for the MATCH function.
 * @esql_operator infix
 * @esql_symbol :
 * @esql_precedence 1
 * @availability stack since=8.18.0
 * @availability serverless
 */
export class MATCH_OPERATOR {
  lhs: keyword | text | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version
  rhs: keyword | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version
  /** @esql_return_type */
  return_type: boolean
}

// =============================================================================
// Cast operator
// =============================================================================

/**
 * Inline type cast.
 * @esql_operator postfix
 * @esql_symbol ::
 * @esql_precedence 1
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class CAST {
  operand: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape
  /** @esql_return_type */
  return_type: boolean | double | integer | long | unsigned_long | keyword | text | date | datetime | date_nanos | ip | version | geo_point | geo_shape | cartesian_point | cartesian_shape
}
