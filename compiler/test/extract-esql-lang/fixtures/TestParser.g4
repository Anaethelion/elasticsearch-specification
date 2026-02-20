/*
 * Test grammar fixture for unit tests.
 */
parser grammar TestParser;

options {
  tokenVocab=TestLexer;
}

query
    : sourceCommand
    | query PIPE processingCommand
    ;

sourceCommand
    : fromCommand
    | rowCommand
    ;

processingCommand
    : evalCommand
    | statsCommand
    | sortCommand
    | {this.isDevVersion()}? lookupCommand
    ;

fromCommand
    : FROM indexPatternAndMetadataFields
    ;

rowCommand
    : ROW fields
    ;

evalCommand
    : EVAL fields
    ;

statsCommand
    : STATS stats=aggFields? (BY grouping=fields)?
    ;

sortCommand
    : SORT orderExpression
    ;

lookupCommand
    : DEV_LOOKUP tableName=indexPattern ON matchFields=qualifiedNamePatterns
    ;
