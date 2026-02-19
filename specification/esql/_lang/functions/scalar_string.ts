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

import { keyword, text, integer, long, boolean } from '@esql/_lang/data_types'

/** Returns the bit length of a string. @esql_function scalar */
export function BIT_LENGTH(str: keyword | text): integer

/** Returns the byte length of a string. @esql_function scalar */
export function BYTE_LENGTH(str: keyword | text): integer

/**
 * Concatenates two or more strings.
 * @esql_function scalar
 */
export function CONCAT(...values: Array<keyword | text>): keyword

/**
 * Returns true if a string contains a substring.
 * @esql_function scalar
 */
export function CONTAINS(str: keyword | text, substr: keyword | text): boolean

/** Returns true if a string ends with a suffix. @esql_function scalar */
export function ENDS_WITH(str: keyword | text, suffix: keyword | text): boolean

/** Returns true if a string starts with a prefix. @esql_function scalar */
export function STARTS_WITH(str: keyword | text, prefix: keyword | text): boolean

/** Returns the leftmost N characters. @esql_function scalar */
export function LEFT(str: keyword | text, length: integer): keyword

/** Returns the rightmost N characters. @esql_function scalar */
export function RIGHT(str: keyword | text, length: integer): keyword

/** Returns the character length of a string. @esql_function scalar */
export function LENGTH(str: keyword | text): integer

/** Finds the position of a substring. @esql_function scalar */
export function LOCATE(str: keyword | text, substr: keyword | text, start?: integer): integer

/** Trims leading whitespace. @esql_function scalar */
export function LTRIM(str: keyword | text): keyword

/** Trims trailing whitespace. @esql_function scalar */
export function RTRIM(str: keyword | text): keyword

/** Trims leading and trailing whitespace. @esql_function scalar */
export function TRIM(str: keyword | text): keyword

/** Repeats a string N times. @esql_function scalar */
export function REPEAT(str: keyword | text, count: integer): keyword

/** Replaces occurrences of a regex with a replacement string. @esql_function scalar */
export function REPLACE(str: keyword | text, regex: keyword | text, replacement: keyword | text): keyword

/** Reverses a string. @esql_function scalar */
export function REVERSE(str: keyword | text): keyword

/** Extracts a substring. @esql_function scalar */
export function SUBSTRING(str: keyword | text, start: integer, length?: integer): keyword

/** Converts a string to lowercase. @esql_function scalar */
export function TO_LOWER(str: keyword | text): keyword

/** Converts a string to uppercase. @esql_function scalar */
export function TO_UPPER(str: keyword | text): keyword

/** Splits a string by a delimiter. @esql_function scalar */
export function SPLIT(str: keyword | text, delim: keyword | text): keyword

/** Returns a string of N spaces. @esql_function scalar */
export function SPACE(count: integer): keyword

/** Computes a hash of a string using a specified algorithm. @esql_function scalar */
export function HASH(algorithm: keyword, input: keyword | text): keyword

/** Computes the MD5 hash of a string. @esql_function scalar */
export function MD5(input: keyword | text): keyword

/** Computes the SHA-1 hash of a string. @esql_function scalar */
export function SHA1(input: keyword | text): keyword

/** Computes the SHA-256 hash of a string. @esql_function scalar */
export function SHA256(input: keyword | text): keyword

/** URL-encodes a string. @esql_function scalar */
export function URL_ENCODE(str: keyword | text): keyword

/** URL-encodes a string component. @esql_function scalar */
export function URL_ENCODE_COMPONENT(str: keyword | text): keyword

/** URL-decodes a string. @esql_function scalar */
export function URL_DECODE(str: keyword | text): keyword

/** Splits text into semantic chunks. @esql_function scalar */
export function CHUNK(input: keyword | text, max_chunk_size?: integer): keyword
