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

/**
 * ES|QL data types.
 *
 * These type aliases define the vocabulary of types used in ES|QL function
 * signatures, operator definitions, and command clauses. Each is tagged with
 * @esql_data_type and optionally with @esql_source_capable (can appear in
 * source data from FROM) and @esql_result_capable (can be produced by
 * functions or expressions).
 */

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type cartesian_point = 'cartesian_point'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type cartesian_shape = 'cartesian_shape'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type date = 'date'

/**
 * Also known as datetime.
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type datetime = 'datetime'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type date_nanos = 'date_nanos'

/**
 * A date duration used in date arithmetic.
 * @esql_data_type
 * @esql_result_capable
 */
export type date_period = 'date_period'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type double = 'double'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type float = 'float'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type geo_point = 'geo_point'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type geo_shape = 'geo_shape'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type integer = 'integer'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type ip = 'ip'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type keyword = 'keyword'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type long = 'long'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type text = 'text'

/**
 * A time duration used in date arithmetic.
 * @esql_data_type
 * @esql_result_capable
 */
export type time_duration = 'time_duration'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type unsigned_long = 'unsigned_long'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type version = 'version'

/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type dense_vector = 'dense_vector'

/**
 * Aggregate metric double, used for pre-aggregated metric data.
 * @esql_data_type
 * @esql_source_capable
 */
export type aggregate_metric_double = 'aggregate_metric_double'

/**
 * @esql_data_type
 * @esql_source_capable
 */
export type geohash = 'geohash'

/**
 * @esql_data_type
 * @esql_source_capable
 */
export type geohex = 'geohex'

/**
 * @esql_data_type
 * @esql_source_capable
 */
export type geotile = 'geotile'

/**
 * @esql_data_type
 */
export type tdigest = 'tdigest'

/**
 * @esql_data_type
 */
export type date_range = 'date_range'

/**
 * @esql_data_type
 */
export type exponential_histogram = 'exponential_histogram'

/**
 * @esql_data_type
 */
export type _tsid = '_tsid'

/**
 * @esql_data_type
 */
export type counter_double = 'counter_double'

/**
 * @esql_data_type
 */
export type counter_integer = 'counter_integer'

/**
 * @esql_data_type
 */
export type counter_long = 'counter_long'

/**
 * @esql_data_type
 */
export type histogram = 'histogram'

/**
 * @esql_data_type
 */
export type int = 'int'