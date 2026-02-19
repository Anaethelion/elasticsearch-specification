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

import { integer, keyword, text } from '@esql/_lang/data_types'

/**
 * Returns the bit length of a string.
 * @esql_function scalar
 */
export function BIT_LENGTH(string: keyword | text): integer

/**
 * Returns the byte length of a string.
 * @esql_function scalar
 */
export function BYTE_LENGTH(string: keyword | text): integer

/**
 * Options for the CHICKEN function.
 * @esql_map_param_type
 */
export class CHICKENOptions {
  /** Chicken style. Available styles: ordinary, early_state, laying, thinks_its_a_duck, smoking_a_pipe, soup, racing, stoned, realistic, whistling. Defaults to ordinary. */
  style?: keyword
  /** Maximum width of the speech bubble. Defaults to 40, maximum is 76. */
  width?: integer
}

/**
 * Returns a string with the input text wrapped in ASCII art of a chicken saying the message.
 * @esql_function scalar
 */
export function CHICKEN(
  message: keyword | text,
  /** @esql_map_param */
  options?: CHICKENOptions
): keyword

/**
 * Options for the CHUNK function.
 * @esql_map_param_type
 */
export class CHUNKOptions {
  /** The chunking strategy to use. Default value is `sentence`. */
  strategy?: keyword
  /** The maximum size of a chunk in words. This value cannot be lower than `20` (for `sentence` strategy)
or `10` (for `word` or `recursive` strategies). This model should not exceed the window size for any
associated models using the output of this function. */
  max_chunk_size?: integer
  /** The number of overlapping words for chunks. It is applicable only to a `word` chunking strategy.
This value cannot be higher than half the `max_chunk_size` value. */
  overlap?: integer
  /** The number of overlapping sentences for chunks. It is applicable only for a `sentence` chunking strategy.
It can be either `1` or `0`. */
  sentence_overlap?: integer
  /** Sets a predefined lists of separators based on the selected text type. Values may be `markdown` or `plaintext`.
Only applicable to the `recursive` chunking strategy. When using the `recursive` chunking strategy one of
`separators` or `separator_group` must be specified. */
  separator_group?: keyword
  /** A list of strings used as possible split points when chunking text. Each string can be a plain string or a
regular expression (regex) pattern. The system tries each separator in order to split the text, starting from
the first item in the list. After splitting, it attempts to recombine smaller pieces into larger chunks that stay
within the `max_chunk_size` limit, to reduce the total number of chunks generated. Only applicable to the
`recursive` chunking strategy. When using the `recursive` chunking strategy one of `separators` or `separator_group`
must be specified. */
  separators?: keyword
}

/**
 * Use `CHUNK` to split a text field into smaller chunks.
 * @esql_function scalar
 * @availability stack since=9.3.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function CHUNK(
  field: keyword | text,
  /** @esql_map_param */
  chunking_settings?: CHUNKOptions
): keyword

/**
 * Concatenates two or more strings.
 * @esql_function scalar
 */
export function CONCAT(string1: keyword | text, string2: keyword | text): keyword

/**
 * Returns a boolean that indicates whether a keyword substring is within another string.
 * @esql_function scalar
 * @availability stack since=9.2.0 stability=stable
 * @availability serverless stability=stable
 */
export function CONTAINS(string: keyword | text, substring: keyword | text): boolean

/**
 * Returns a boolean that indicates whether a keyword string ends with another string.
 * @esql_function scalar
 */
export function ENDS_WITH(str: keyword | text, suffix: keyword | text): boolean

/**
 * Computes the hash of the input using various algorithms such as MD5, SHA, SHA-224, SHA-256, SHA-384, SHA-512.
 * @esql_function scalar
 */
export function HASH(algorithm: keyword | text, input: keyword | text): keyword

/**
 * Returns the substring that extracts *length* chars from *string* starting from the left.
 * @esql_function scalar
 */
export function LEFT(string: keyword | text, length: integer): keyword

/**
 * Returns the character length of a string.
 * @esql_function scalar
 */
export function LENGTH(string: keyword | text): integer

/**
 * Returns an integer that indicates the position of a keyword substring within another string.
 * @esql_function scalar
 */
export function LOCATE(
  string: keyword | text,
  substring: keyword | text,
  start?: integer
): integer

/**
 * Removes leading whitespaces from a string.
 * @esql_function scalar
 */
export function LTRIM(string: keyword | text): keyword

/**
 * Computes the MD5 hash of the input (if the MD5 hash is available on the JVM).
 * @esql_function scalar
 */
export function MD5(input: keyword | text): keyword

/**
 * Use `RLIKE` to filter data based on string patterns using
 * @esql_function scalar
 */
export function R_LIKE(str: keyword | text, pattern: keyword | text): boolean

/**
 * Returns a string constructed by concatenating `string` with itself the specified `number` of times.
 * @esql_function scalar
 */
export function REPEAT(string: keyword | text, number: integer): keyword

/**
 * The function substitutes in the string `str` any match of the regular expression `regex`
 * @esql_function scalar
 */
export function REPLACE(
  string: keyword | text,
  regex: keyword | text,
  newString: keyword | text
): keyword

/**
 * Returns a new string representing the input string in reverse order.
 * @esql_function scalar
 */
export function REVERSE(str: keyword | text): keyword

/**
 * Return the substring that extracts *length* chars from *str* starting from the right.
 * @esql_function scalar
 */
export function RIGHT(string: keyword | text, length: integer): keyword

/**
 * Removes trailing whitespaces from a string.
 * @esql_function scalar
 */
export function RTRIM(string: keyword | text): keyword

/**
 * Computes the SHA1 hash of the input.
 * @esql_function scalar
 */
export function SHA1(input: keyword | text): keyword

/**
 * Computes the SHA256 hash of the input.
 * @esql_function scalar
 */
export function SHA256(input: keyword | text): keyword

/**
 * Returns a string made of `number` spaces.
 * @esql_function scalar
 */
export function SPACE(number: integer): keyword

/**
 * Split a single valued string into multiple strings.
 * @esql_function scalar
 */
export function SPLIT(string: keyword | text, delim: keyword | text): keyword

/**
 * Returns a boolean that indicates whether a keyword string starts with another string.
 * @esql_function scalar
 */
export function STARTS_WITH(str: keyword | text, prefix: keyword | text): boolean

/**
 * Returns a substring of a string, specified by a start position and an optional length.
 * @esql_function scalar
 */
export function SUBSTRING(
  string: keyword | text,
  start: integer,
  length?: integer
): keyword

/**
 * Returns a new string representing the input string converted to lower case.
 * @esql_function scalar
 */
export function TO_LOWER(str: keyword | text): keyword

/**
 * Returns a new string representing the input string converted to upper case.
 * @esql_function scalar
 */
export function TO_UPPER(str: keyword | text): keyword

/**
 * Options for the TOP_SNIPPETS function.
 * @esql_map_param_type
 */
export class TOP_SNIPPETSOptions {
  /** The maximum number of matching snippets to return. */
  num_snippets?: integer
  /** The maximum number of words to return in each snippet.
This allows better control of inference costs by limiting the size of tokens per snippet. */
  num_words?: integer
}

/**
 * Use `TOP_SNIPPETS` to extract the best snippets for a given query string from a text field.
 * @esql_function scalar
 * @availability stack since=9.3.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function TOP_SNIPPETS(
  field: keyword | text,
  query: keyword,
  /** @esql_map_param */
  options?: TOP_SNIPPETSOptions
): keyword

/**
 * Removes leading and trailing whitespaces from a string.
 * @esql_function scalar
 */
export function TRIM(string: keyword | text): keyword

/**
 * Use `LIKE` to filter data based on string patterns using wildcards. `LIKE`
 * @esql_function scalar
 */
export function WILDCARD_LIKE(str: keyword | text, pattern: keyword | text): boolean
