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

import { double, integer } from '@esql/_lang/data_types'

/**
 * Computes the confidence interval and its reliability for the given best estimate and bootstrap estimates. The output usually is an array with three values: lower bound, upper bound, and the fraction of trials that give a reliable interval. If no sensible interval is found, the function returns null instead. For example: CONFIDENCE_INTERVAL(10.0, [9.8, 9.9, 10.0, 10.1, 9, 9, 11, 11], 2, 4, 0.9) = [9.54, 10.46, 0.5]Explanation: the best estimate (based on all data) is 10.0, and there are 2 trials with 4 buckets each. The first trial has estimates [9.8, 9.9, 10.0, 10.1] and the second trial has estimates [9, 9, 11, 11]. The computed 90% confidence interval is [9.54, 10.46]. Only the first trial is considered reliable, because its values are nicely distributed around the best estimate. The second trial has very high kurtosis and is thereforeconsidered unreliable. This leads to a reliability of 0.5 (1 reliable trial out of 2).
 * @esql_function scalar
 */
export function CONFIDENCE_INTERVAL(
  bestEstimate: double,
  estimates: double,
  trialCount: integer,
  bucketCount: integer,
  confidenceLevel: double
): double

/**
 * Returns a pseudorandom number, uniformly distributed between 0 (inclusive) and bound (exclusive).
 * @esql_function scalar
 */
export function RANDOM(bound: integer): integer
