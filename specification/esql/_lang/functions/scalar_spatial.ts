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
  cartesian_point, cartesian_shape, double, geo_point, geo_shape, geohash,
  geohex, geotile, integer
} from '@esql/_lang/data_types'

/**
 * Returns whether the first geometry contains the second geometry.
 * @esql_function scalar
 */
export function ST_CONTAINS(
  geomA: geo_point | cartesian_point | geo_shape | cartesian_shape,
  geomB: geo_point | cartesian_point | geo_shape | cartesian_shape
): boolean

/**
 * Returns whether the two geometries or geometry columns are disjoint.
 * @esql_function scalar
 */
export function ST_DISJOINT(
  geomA: geo_point | cartesian_point | geo_shape | cartesian_shape | geohash | geotile | geohex,
  geomB: geo_point | cartesian_point | geo_shape | cartesian_shape | geohash | geotile | geohex
): boolean

/**
 * Computes the distance between two points.
 * @esql_function scalar
 */
export function ST_DISTANCE(geomA: geo_point | cartesian_point, geomB: geo_point | cartesian_point): double

/**
 * Determines the minimum bounding box of the supplied geometry.
 * @esql_function scalar
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_ENVELOPE(
  geometry: geo_point | geo_shape | cartesian_point | cartesian_shape
): geo_shape | cartesian_shape

/**
 * Calculates the `geohash` of the supplied geo_point at the specified precision.
 * @esql_function scalar
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_GEOHASH(
  geometry: geo_point,
  precision: integer,
  bounds?: geo_shape
): geohash

/**
 * Calculates the `geohex`, the H3 cell-id, of the supplied geo_point at the specified precision.
 * @esql_function scalar
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_GEOHEX(
  geometry: geo_point,
  precision: integer,
  bounds?: geo_shape
): geohex

/**
 * Calculates the `geotile` of the supplied geo_point at the specified precision.
 * @esql_function scalar
 * @availability stack since=9.2.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_GEOTILE(
  geometry: geo_point,
  precision: integer,
  bounds?: geo_shape
): geotile

/**
 * Returns true if two geometries intersect.
 * @esql_function scalar
 */
export function ST_INTERSECTS(
  geomA: geo_point | cartesian_point | geo_shape | cartesian_shape | geohash | geotile | geohex,
  geomB: geo_point | cartesian_point | geo_shape | cartesian_shape | geohash | geotile | geohex
): boolean

/**
 * Counts the number of points in the supplied geometry.
 * @esql_function scalar
 * @availability stack since=9.4.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_NPOINTS(geometry: geo_point | geo_shape | cartesian_point | cartesian_shape): integer

/**
 * Simplifies the input geometry by applying the Douglas-Peucker algorithm with a specified tolerance. Vertices that fall within the tolerance distance from the simplified shape are removed. Note that the resulting geometry may be invalid, even if the original input was valid.
 * @esql_function scalar
 * @availability stack since=9.4.0 stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_SIMPLIFY(
  geometry: geo_point | geo_shape | cartesian_point | cartesian_shape,
  tolerance: double
): geo_point | geo_shape | cartesian_point | cartesian_shape

/**
 * Returns whether the first geometry is within the second geometry.
 * @esql_function scalar
 */
export function ST_WITHIN(
  geomA: geo_point | cartesian_point | geo_shape | cartesian_shape,
  geomB: geo_point | cartesian_point | geo_shape | cartesian_shape
): boolean

/**
 * Extracts the `x` coordinate from the supplied point. If the point is of type `geo_point` this is equivalent to extracting the `longitude` value.
 * @esql_function scalar
 */
export function ST_X(point: geo_point | cartesian_point): double

/**
 * Extracts the maximum value of the `x` coordinates from the supplied geometry. If the geometry is of type `geo_point` or `geo_shape` this is equivalent to extracting the maximum `longitude` value.
 * @esql_function scalar
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_XMAX(point: geo_point | geo_shape | cartesian_point | cartesian_shape): double

/**
 * Extracts the minimum value of the `x` coordinates from the supplied geometry. If the geometry is of type `geo_point` or `geo_shape` this is equivalent to extracting the minimum `longitude` value.
 * @esql_function scalar
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_XMIN(point: geo_point | geo_shape | cartesian_point | cartesian_shape): double

/**
 * Extracts the `y` coordinate from the supplied point. If the point is of type `geo_point` this is equivalent to extracting the `latitude` value.
 * @esql_function scalar
 */
export function ST_Y(point: geo_point | cartesian_point): double

/**
 * Extracts the maximum value of the `y` coordinates from the supplied geometry. If the geometry is of type `geo_point` or `geo_shape` this is equivalent to extracting the maximum `latitude` value.
 * @esql_function scalar
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_YMAX(point: geo_point | geo_shape | cartesian_point | cartesian_shape): double

/**
 * Extracts the minimum value of the `y` coordinates from the supplied geometry. If the geometry is of type `geo_point` or `geo_shape` this is equivalent to extracting the minimum `latitude` value.
 * @esql_function scalar
 * @availability stack stability=experimental
 * @availability serverless stability=experimental
 * @esql_preview
 */
export function ST_YMIN(point: geo_point | geo_shape | cartesian_point | cartesian_shape): double
