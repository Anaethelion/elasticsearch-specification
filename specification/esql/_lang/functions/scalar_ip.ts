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

import { ip, keyword, text, boolean, integer } from '@esql/_lang/data_types'

/** Returns true if the IP matches any of the provided CIDR blocks. @esql_function scalar */
export function CIDR_MATCH(ip_value: ip, ...cidr_blocks: Array<keyword | text>): boolean

/** Truncates an IP to a given prefix length. @esql_function scalar */
export function IP_PREFIX(ip_value: ip, prefix_length_v4: integer, prefix_length_v6: integer): ip

/** Computes the network direction based on source and destination IPs. @esql_function scalar @esql_alias NETDIR */
export function NETWORK_DIRECTION(source: ip, destination: ip, ...cidr_blocks: Array<keyword | text>): keyword
