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
  dense_vector, double, float, integer, text
} from '@esql/_lang/data_types'

/**
 * Options for the KNN function.
 * @esql_map_param_type
 */
export class KNNOptions {
  /** The number of nearest neighbors to return from each shard. Elasticsearch collects k results from each shard, then merges them to find the global top results. This value must be less than or equal to num_candidates. This value is automatically set with any LIMIT applied to the function. */
  k?: integer
  /** Floating point number used to decrease or increase the relevance scores of the query.Defaults to 1.0. */
  boost?: float
  /** The minimum number of nearest neighbor candidates to consider per shard while doing knn search. KNN may use a higher number of candidates in case the query can't use a approximate results. Cannot exceed 10,000. Increasing min_candidates tends to improve the accuracy of the final results. Defaults to 1.5 * k (or LIMIT) used for the query. */
  min_candidates?: integer
  /** The percentage of vectors to explore per shard while doing knn search with bbq_disk. Must be between 0 and 100. 0 will default to using num_candidates for calculating the percent visited. Increasing visit_percentage tends to improve the accuracy of the final results. If visit_percentage is set for bbq_disk, num_candidates is ignored. Defaults to ~1% per shard for every 1 million vectors */
  visit_percentage?: float
  /** The minimum similarity required for a document to be considered a match. The similarity value calculated relates to the raw similarity used, not the document score. */
  similarity?: double
  /** Applies the specified oversampling for rescoring quantized vectors. See oversampling and rescoring quantized vectors for details. */
  rescore_oversample?: double
}

/**
 * Finds the k nearest vectors to a query vector, as measured by a similarity metric. knn function finds nearest vectors through approximate search on indexed dense_vectors or semantic_text fields.
 * @esql_function scalar
 * @availability stack since=9.4.0 stability=stable
 * @availability serverless stability=stable
 */
export function KNN(
  field: dense_vector | text,
  query: dense_vector,
  /** @esql_map_param */
  options?: KNNOptions
): boolean

/**
 * Calculates the cosine similarity between two dense_vectors.
 * @esql_function scalar
 * @availability stack since=9.4.0 stability=stable
 * @availability serverless stability=stable
 */
export function V_COSINE(left: dense_vector, right: dense_vector): double

/**
 * Calculates the dot product between two dense_vectors.
 * @esql_function scalar
 * @availability stack since=9.4.0 stability=stable
 * @availability serverless stability=stable
 */
export function V_DOT_PRODUCT(left: dense_vector, right: dense_vector): double

/**
 * Calculates the Hamming distance between two dense vectors.
 * @esql_function scalar
 * @availability stack since=9.4.0 stability=stable
 * @availability serverless stability=stable
 */
export function V_HAMMING(left: dense_vector, right: dense_vector): double

/**
 * Calculates the l1 norm between two dense_vectors.
 * @esql_function scalar
 * @availability stack since=9.4.0 stability=stable
 * @availability serverless stability=stable
 */
export function V_L1_NORM(left: dense_vector, right: dense_vector): double

/**
 * Calculates the l2 norm between two dense_vectors.
 * @esql_function scalar
 * @availability stack since=9.4.0 stability=stable
 * @availability serverless stability=stable
 */
export function V_L2_NORM(left: dense_vector, right: dense_vector): double

/**
 * Calculates the magnitude of a dense_vector.
 * @esql_function scalar
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function V_MAGNITUDE(input: dense_vector): double
