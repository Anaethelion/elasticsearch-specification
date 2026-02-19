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

import { dense_vector, double, integer, long, boolean } from '@esql/_lang/data_types'

/**
 * Computes the cosine similarity between two vectors.
 * @esql_function scalar
 */
export function COSINE_SIMILARITY(a: dense_vector, b: dense_vector): double

/**
 * Computes the dot product of two vectors.
 * @esql_function scalar
 */
export function DOT_PRODUCT(a: dense_vector, b: dense_vector): double

/**
 * Computes the Hamming distance between two vectors.
 * @esql_function scalar
 */
export function HAMMING(a: dense_vector, b: dense_vector): integer

/**
 * Computes the L1 norm (Manhattan distance) between two vectors.
 * @esql_function scalar
 */
export function L1_NORM(a: dense_vector, b: dense_vector): double

/**
 * Computes the L2 norm (Euclidean distance) between two vectors.
 * @esql_function scalar
 */
export function L2_NORM(a: dense_vector, b: dense_vector): double

/**
 * Computes the magnitude (length) of a vector.
 * @esql_function scalar
 */
export function MAGNITUDE(vector: dense_vector): double

/**
 * Performs a K-nearest neighbor search.
 * @esql_function scalar
 */
export function KNN(field: dense_vector, query_vector: dense_vector, k: integer): boolean
