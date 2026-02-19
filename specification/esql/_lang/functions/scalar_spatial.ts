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
  geo_point, geo_shape, cartesian_point, cartesian_shape,
  boolean, double, integer, keyword, long
} from '@esql/_lang/data_types'

/** Returns true if the first geometry contains the second. @esql_function scalar */
export function ST_CONTAINS(left: geo_shape | cartesian_shape, right: geo_point | geo_shape | cartesian_point | cartesian_shape): boolean

/** Returns true if the two geometries are disjoint. @esql_function scalar */
export function ST_DISJOINT(left: geo_point | geo_shape | cartesian_point | cartesian_shape, right: geo_point | geo_shape | cartesian_point | cartesian_shape): boolean

/** Returns true if the two geometries intersect. @esql_function scalar */
export function ST_INTERSECTS(left: geo_point | geo_shape | cartesian_point | cartesian_shape, right: geo_point | geo_shape | cartesian_point | cartesian_shape): boolean

/** Returns true if the first geometry is within the second. @esql_function scalar */
export function ST_WITHIN(left: geo_point | geo_shape | cartesian_point | cartesian_shape, right: geo_shape | cartesian_shape): boolean

/** Computes the distance between two points. @esql_function scalar */
export function ST_DISTANCE(left: geo_point | cartesian_point, right: geo_point | cartesian_point): double

/** Returns the bounding box (envelope) of a geometry. @esql_function scalar */
export function ST_ENVELOPE(geometry: geo_point | geo_shape | cartesian_point | cartesian_shape): geo_shape | cartesian_shape

/** Simplifies a geometry using a given tolerance. @esql_function scalar */
export function ST_SIMPLIFY(geometry: geo_point | geo_shape | cartesian_point | cartesian_shape, tolerance: double): geo_shape | cartesian_shape

/** Computes a geohash string from a geo_point. @esql_function scalar */
export function ST_GEOHASH(point: geo_point, precision?: integer): keyword

/** Computes a geotile string from a geo_point. @esql_function scalar */
export function ST_GEOTILE(point: geo_point, precision?: integer): keyword

/** Computes a geohex string from a geo_point. @esql_function scalar */
export function ST_GEOHEX(point: geo_point, precision?: integer): keyword

/** Returns the number of points in a geometry. @esql_function scalar */
export function ST_NPOINTS(geometry: geo_point | geo_shape | cartesian_point | cartesian_shape): integer

/** Returns the X coordinate (longitude). @esql_function scalar */
export function ST_X(point: geo_point | cartesian_point): double

/** Returns the Y coordinate (latitude). @esql_function scalar */
export function ST_Y(point: geo_point | cartesian_point): double

/** Returns the maximum X coordinate. @esql_function scalar */
export function ST_XMAX(geometry: geo_point | geo_shape | cartesian_point | cartesian_shape): double

/** Returns the minimum X coordinate. @esql_function scalar */
export function ST_XMIN(geometry: geo_point | geo_shape | cartesian_point | cartesian_shape): double

/** Returns the maximum Y coordinate. @esql_function scalar */
export function ST_YMAX(geometry: geo_point | geo_shape | cartesian_point | cartesian_shape): double

/** Returns the minimum Y coordinate. @esql_function scalar */
export function ST_YMIN(geometry: geo_point | geo_shape | cartesian_point | cartesian_shape): double
