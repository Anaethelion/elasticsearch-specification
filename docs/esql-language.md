# ES|QL Language Specification

In addition to the HTTP API specification (endpoints, request/response types), this repository
contains a machine-readable model of the **ES|QL language** itself: its data types, commands,
operators, and functions. Language clients use this model to generate query builders, provide
autocomplete, and validate queries at compile/build time.

The source of truth for the language lives in the Elasticsearch server
(Java annotations such as `@FunctionInfo` / `@Param` and the ANTLR grammar files). The
TypeScript specification files in this repository are a curated mirror of that information,
and the [extraction tool](#extraction-tool) keeps them in sync automatically.

## Query structure

An ES|QL query is a pipeline: one source command followed by zero or more processing
commands separated by `|`. The metamodel reflects this structure and tells clients what
is valid at each position.

```
  source command          processing commands
  (position=source)       (position=processing)
       |                       |              |
       v                       v              v
    FROM index            | STATS ...    | SORT ...    | KEEP ...
                               |
                   +-----------+-----------+
                   |                       |
              main expression          BY clause
                   |                       |
                   v                       v
           acceptedFunctionKinds   acceptedFunctionKinds
           [scalar, aggregate,     [scalar, grouping]
            time_series_aggregate]        |
                   |                      |
                   v                      v
             AVG(salary)            BUCKET(hire_date, 1 year)
             ^^^ aggregate          ^^^^^^ grouping
                   |                      |
                   v                      v
              params/return          params/return
              use EsqlDataType       use EsqlDataType
```

To build a query, a client walks this chain:

1. **Pick a source command** -- filter `commands` where `position = source`
2. **Chain processing commands** -- filter `commands` where `position = processing`
3. **For each command's expressions** -- check `command.acceptedFunctionKinds` to know
   which functions to offer (defaults to `[scalar]` when absent)
4. **For each clause** -- check `clause.acceptedFunctionKinds` independently
   (e.g. the BY clause in STATS accepts `grouping` functions like BUCKET)
5. **For function parameters and return types** -- look up `EsqlDataType` to validate
   type compatibility

## Data flow

The extraction tool reads two sources from an Elasticsearch checkout:
1. **Java annotations** on function classes -- produces function files and data type declarations
2. **ANTLR grammar** (`EsqlBaseParser.g4`) -- auto-syncs `commands.ts`, adding new commands,
   removing stale ones, and patching `@esql_function_context` annotations

The compiler then reads the TypeScript spec files and produces the `esql` section of `schema.json`.

## Directory layout

All ES|QL language definitions live under `specification/esql/_lang/`:

```
specification/esql/_lang/
  _types.ts              Supporting type aliases for command clause shapes
  data_types.ts          ES|QL data type vocabulary
  commands.ts            All commands (source and processing) -- auto-synced with grammar
  operators.ts           All operators (arithmetic, comparison, logical, etc.)
  functions/
    scalar_math.ts       Math functions (ABS, CEIL, FLOOR, ROUND, ...)
    scalar_string.ts     String functions (CONCAT, SUBSTRING, TRIM, ...)
    scalar_date.ts       Date functions (DATE_DIFF, DATE_TRUNC, NOW, ...)
    scalar_convert.ts    Type conversion functions (TO_INTEGER, TO_STRING, ...)
    scalar_conditional.ts  Conditional functions (CASE)
    scalar_nulls.ts      Null-handling functions (COALESCE)
    scalar_ip.ts         IP functions (CIDR_MATCH, IP_PREFIX)
    scalar_spatial.ts    Spatial functions (ST_DISTANCE, ST_INTERSECTS, ...)
    scalar_multivalue.ts Multi-value functions (MV_AVG, MV_CONCAT, ...)
    scalar_score.ts      Scoring functions (DECAY)
    aggregate.ts         Aggregate functions (AVG, COUNT, SUM, MAX, ...)
    grouping.ts          Grouping functions (BUCKET, CATEGORIZE)
    fulltext.ts          Full-text functions (MATCH, KQL, QUERY_STRING, ...)
    vector.ts            Vector functions (COSINE_SIMILARITY, DOT_PRODUCT, ...)
    inference.ts         ML inference functions (TEXT_EMBEDDING)
```

These files are **not** regular runnable TypeScript. They are structural definitions
parsed by the compiler via [ts-morph](https://ts-morph.com/) for their AST and JSDoc
annotations. See [TypeScript quirks](#typescript-quirks) for details.

## Naming convention

All ES|QL names (commands, functions, operators) are written in **UPPERCASE** in the
specification and in the serialized `schema.json` output. This matches how the language
presents them (e.g. `FROM`, `ABS`, `STATS`). It is up to individual code generators to
transform casing for their target language.

## Data types

Data types are defined as type aliases in `data_types.ts`, each annotated with `@esql_data_type`.
Two optional capability tags indicate where the type can appear:

| Tag | Meaning |
|-----|---------|
| `@esql_source_capable` | Can appear in source data (e.g. fields from `FROM`) |
| `@esql_result_capable` | Can be produced by functions or expressions |

Example:

```ts
/**
 * @esql_data_type
 * @esql_source_capable
 * @esql_result_capable
 */
export type keyword = 'keyword'

/**
 * A date duration used in date arithmetic.
 * @esql_data_type
 * @esql_result_capable
 */
export type date_period = 'date_period'
```

These type aliases are imported by the function, command, and operator files to form
typed signatures. The type names themselves become the string values in `schema.json`
(e.g. `"types": ["keyword", "double", "integer"]`).

## Commands

Commands are modeled as annotated classes in `commands.ts`. The `@esql_command` tag takes
a position argument: `source` (produces rows, e.g. `FROM`) or `processing` (transforms
rows, e.g. `WHERE`, `STATS`). These values are defined by the `EsqlCommandPosition` enum
in the metamodel.

Class properties represent the command's arguments. The first non-clause property becomes
the `mainArgument` in the schema. Properties annotated with `@esql_clause` become named
clauses (e.g. the `BY` clause in `STATS`).

### Function context annotations

Commands and clauses can declare which function kinds are valid in their expression
context using `@esql_function_context`. This is auto-managed by the extraction tool
based on the ANTLR grammar (specifically, which commands use `aggFields` and `BY` clauses).

Example:

```ts
/**
 * Groups rows by one or more expressions and computes aggregate values.
 * @esql_command processing
 * @esql_function_context aggregate
 * @esql_function_context time_series_aggregate
 * @availability stack since=8.11.0
 * @availability serverless
 */
export class STATS {
  /** Aggregate expressions to compute. */
  aggregates?: EsqlAggFields
  /**
   * Grouping expressions.
   * @esql_clause BY
   * @esql_function_context grouping
   */
  by?: EsqlFieldList
}
```

This produces `acceptedFunctionKinds` in `schema.json`:

```json
{
  "name": "STATS",
  "position": "processing",
  "acceptedFunctionKinds": ["scalar", "aggregate", "time_series_aggregate"],
  "clauses": [
    {
      "keyword": "BY",
      "acceptedFunctionKinds": ["scalar", "grouping"]
    }
  ]
}
```

Clients use `acceptedFunctionKinds` for autocomplete: when a user is typing inside
a STATS command, offer scalar, aggregate, and time-series aggregate functions; in the
BY clause, offer scalar and grouping functions. Commands without `acceptedFunctionKinds`
accept only scalar functions by default.

### Command annotation reference

| Tag | Purpose |
|-----|---------|
| `@esql_command source\|processing` | Declares a command and its position |
| `@esql_clause <KEYWORD>` | Marks a property as a named clause |
| `@esql_function_context <kind>` | Declares which function kinds are valid (auto-managed) |
| `@esql_preview` | Marks the command as preview/experimental |

## Operators

Operators are modeled as annotated classes in `operators.ts`. They are separate from
functions because they have fixity and precedence. Fixity values (`prefix`, `infix`,
`postfix`) are defined by the `EsqlOperatorFixity` enum in the metamodel.

Class properties named `lhs`, `rhs`, or `operand` become operator parameters.
A property annotated with `@esql_return_type` defines the return type.

Example:

```ts
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
```

| Tag | Purpose |
|-----|---------|
| `@esql_operator prefix\|infix\|postfix` | Declares an operator and its fixity |
| `@esql_symbol <sym>` | The symbol as written in ES\|QL (e.g. `+`, `==`, `IS NULL`) |
| `@esql_precedence <n>` | Binding precedence (lower = tighter) |
| `@esql_return_type` | Marks a property as the return type |

## Functions

Functions are modeled as **TypeScript function declarations without a body** in the
`functions/` directory. The function kind (`scalar`, `aggregate`, `grouping`,
`time_series_aggregate`) is declared via `@esql_function` and defined by the
`EsqlFunctionKind` enum in the metamodel. Parameter and return types use collapsed
union types: each union member is an ES|QL data type imported from `data_types.ts`.
Client generators decide how to map these unions (overloads, generics, discriminated
unions, etc.).

### Simple function

```ts
/** @esql_function scalar */
export function ABS(number: double | integer | long | unsigned_long): double | integer | long | unsigned_long
```

### Optional parameter

Mark a parameter as optional with `?`:

```ts
/** @esql_function scalar */
export function ROUND(number: double | integer | long | unsigned_long, decimals?: integer | long): double | integer | long | unsigned_long
```

### Aliases

Use `@esql_alias` to declare alternate names. Multiple aliases are comma-separated:

```ts
/**
 * Creates buckets of values. Used for grouping in STATS.
 * @esql_function grouping
 * @esql_alias BIN
 */
export function BUCKET(field: date | datetime | date_nanos | double | integer | long, buckets: integer | date_period | time_duration): double | long | date
```

### Map parameters

Some functions accept key-value option maps (e.g. `MATCH` options). These are modeled
with a companion class annotated `@esql_map_param_type`, and the parameter itself is
annotated with `@esql_map_param`:

```ts
/**
 * Options for the MATCH function.
 * @esql_map_param_type
 */
export class MATCHOptions {
  analyzer?: keyword
  fuzziness?: keyword
  boost?: float
  // ...
}

/**
 * Performs a match query on the specified field.
 * @esql_function scalar
 * @availability stack since=9.0.0 stability=stable
 * @availability serverless stability=stable
 */
export function MATCH(
  field: keyword | text | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version,
  query: keyword | boolean | date | date_nanos | double | integer | ip | long | unsigned_long | version,
  /** @esql_map_param */
  options?: MATCHOptions
): boolean
```

### Function annotation reference

| Tag | Purpose |
|-----|---------|
| `@esql_function scalar\|aggregate\|grouping\|time_series_aggregate` | Declares a function and its kind |
| `@esql_alias <NAME>[, <NAME>]` | Alternate names (uppercase) |
| `@esql_map_param` | Marks a parameter as a key-value option map |
| `@esql_map_param_type` | Marks a class as the type definition for a map parameter |
| `@esql_optional` | Marks a parameter as optional (alternative to `?`) |
| `@esql_preview` | Marks the function as preview/experimental |

## Availability and preview

The `@availability` and `@esql_preview` tags follow the same conventions as the HTTP API
specification:

```ts
/**
 * @esql_function scalar
 * @availability stack since=8.11.0 stability=stable
 * @availability serverless stability=stable
 */
```

- `@availability stack since=<version> stability=<stable|beta|experimental>` -- available in self-managed Elasticsearch since the given version with the given stability level.
- `@availability serverless stability=<stable|beta|experimental>` -- available in Elasticsearch Serverless.
- `@esql_preview` -- the feature is in technical preview and may change or be removed.

The `stability` value is mapped from the server's `FunctionAppliesToLifecycle` enum:
`GA` -> `stable`, `BETA` -> `beta`, `PREVIEW`/`DEVELOPMENT` -> `experimental`.
Lifecycles like `COMING`, `DEPRECATED`, `DISCONTINUED`, and `UNAVAILABLE` are skipped.

## Enums

The metamodel uses proper enums for categorical fields instead of string literals:

| Enum | Values | Used by |
|------|--------|---------|
| `EsqlCommandPosition` | `source`, `processing` | `EsqlCommand.position` |
| `EsqlFunctionKind` | `scalar`, `aggregate`, `grouping`, `time_series_aggregate` | `EsqlFunctionDefinition.kind`, `acceptedFunctionKinds` |
| `EsqlOperatorFixity` | `prefix`, `infix`, `postfix` | `EsqlOperator.fixity` |
| `Stability` | `stable`, `beta`, `experimental` | `Availability.stability` |

These serialize to their string values in `schema.json` (e.g. `"position": "source"`).

## Schema output

The compiler produces an `esql` key at the top level of `schema.json`, alongside the
existing `endpoints` and `types`:

```jsonc
{
  "_info": { ... },
  "endpoints": [...],
  "types": [...],
  "esql": {
    "dataTypes": [
      { "name": "keyword", "sourceCapable": true, "resultCapable": true },
      ...
    ],
    "commands": [
      {
        "name": "STATS", "position": "processing",
        "acceptedFunctionKinds": ["scalar", "aggregate", "time_series_aggregate"],
        "clauses": [
          { "keyword": "BY", "acceptedFunctionKinds": ["scalar", "grouping"], ... }
        ],
        ...
      },
      { "name": "FROM", "position": "source", "description": "...", "clauses": [...] },
      ...
    ],
    "operators": [
      { "name": "ADD", "symbol": "+", "fixity": "infix", "precedenceGroup": 4, "params": [...], "returnType": [...] },
      ...
    ],
    "functions": [
      { "name": "ABS", "kind": "scalar", "params": [...], "returnType": [...] },
      { "name": "BUCKET", "kind": "grouping", "aliases": ["BIN"], "params": [...], "returnType": [...] },
      ...
    ]
  }
}
```

The full type definition for `EsqlLanguageModel` and its constituent types can be found in
[`compiler/src/model/metamodel.ts`](../compiler/src/model/metamodel.ts). The corresponding
Rust structs are in [`compiler-rs/clients_schema/src/lib.rs`](../compiler-rs/clients_schema/src/lib.rs).

## How the compiler processes it

The ES|QL language model is compiled by a dedicated module, separate from the HTTP API
compilation path. See the [compiler documentation](./compiler.md) for general background.

Key files:

| File | Role |
|------|------|
| [`compiler/src/model/build-esql-model.ts`](../compiler/src/model/build-esql-model.ts) | Visits `_lang` source files, parses `@esql_*` JSDoc annotations, produces `EsqlLanguageModel` |
| [`compiler/src/model/build-model.ts`](../compiler/src/model/build-model.ts) | Calls `compileEsqlLanguageModel()` and attaches the result to `model.esql`; skips `_lang` files in the HTTP API visitors |
| [`compiler/src/steps/validate-esql-model.ts`](../compiler/src/steps/validate-esql-model.ts) | Validation step: checks naming conventions, required fields, valid enum values |
| [`compiler/src/model/utils.ts`](../compiler/src/model/utils.ts) | Excludes `_lang` files from the uniqueness checks (type names intentionally overlap with global types) |

The flow:

1. `build-model.ts` creates the `ts-morph` project from `specification/tsconfig.json`.
2. Files under `esql/_lang/` are skipped by the existing class/interface/enum/type-alias visitors.
3. `compileEsqlLanguageModel()` iterates those files, dispatching on annotation:
   - `@esql_data_type` on type aliases produces `EsqlDataType`
   - `@esql_command` on classes produces `EsqlCommand` (with `acceptedFunctionKinds` from `@esql_function_context`)
   - `@esql_operator` on classes produces `EsqlOperator`
   - `@esql_function` on function declarations produces `EsqlFunctionDefinition`
4. The result is stored as `model.esql`.
5. The `validateEsqlModel` step runs as part of the compiler pipeline.

## Extraction tool

The extraction tool at `compiler/src/esql/extract.ts` parses the Elasticsearch server
source to keep the specification in sync. It reads two things:

1. **Java function annotations** (`@FunctionInfo`, `@Param`, `@MapParam`, `@FunctionAppliesTo`)
   -- generates TypeScript function files and syncs data types
2. **ANTLR grammar** (`EsqlBaseParser.g4` and imported parser grammars) -- auto-syncs
   `commands.ts` with the current grammar

The easiest way to run it is via the Makefile target:

```sh
make extract-esql-lang es=/path/to/elasticsearch
```

Or directly via npm:

```sh
npm run extract-esql-lang --prefix compiler -- --es-path /path/to/elasticsearch
```

### What the tool does

**Functions**: Parses `@FunctionInfo` annotations using `tree-sitter-java`, extracts
parameter types, return types, descriptions, aliases, availability, and map parameters.
Generates TypeScript function files grouped by subdirectory (e.g. `scalar_math.ts`).

**Data types**: Collects all types referenced in function signatures and adds any
missing ones to `data_types.ts`.

**Commands**: Parses the ANTLR grammar to determine source vs processing commands,
which commands accept aggregate functions (`aggFields`), and which have `BY` clauses.
Then:
- **Auto-adds** commands present in the grammar but missing from `commands.ts` (skeleton with TODO description and placeholder availability)
- **Auto-removes** commands present in `commands.ts` but no longer in the grammar
- **Patches** `@esql_function_context` annotations on commands that accept aggregate/grouping functions

### When to run it

Run the extraction tool whenever the Elasticsearch server adds, removes, or changes
ES|QL functions or commands. Review the output and fill in any TODO descriptions or
placeholder availability versions on newly added commands.

## TypeScript quirks

The `_lang` files are structural definitions, not runnable TypeScript. Two categories of
TypeScript errors arise and are suppressed with targeted directives:

### TS2391 -- Function implementation is missing

All function declarations in `functions/*.ts` are body-less (they are signatures, not
implementations). TypeScript reports TS2391 on every one of them. Since this is inherent
to the design and affects every function declaration (180+), each function file has
`// @ts-nocheck` on its first line.

### TS2457 -- Type alias name cannot be 'boolean'

In `data_types.ts`, the type alias `export type boolean = 'boolean'` intentionally
shadows the built-in TypeScript `boolean` keyword to model the ES|QL type. This single
line has a `// @ts-expect-error TS2457` comment.

Other `_lang` files (`_types.ts`, `commands.ts`, `operators.ts`) have no TypeScript errors
and require no suppression directives.
