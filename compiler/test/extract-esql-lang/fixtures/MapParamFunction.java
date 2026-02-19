package org.elasticsearch.xpack.esql.expression.function.fulltext;

import org.elasticsearch.xpack.esql.expression.function.FunctionInfo;
import org.elasticsearch.xpack.esql.expression.function.MapParam;
import org.elasticsearch.xpack.esql.expression.function.Param;

public class MapParamFunction extends EsqlFunction {
    public static final String FIELD = "field";
    public static final String QUERY = "query";
    public static final String ANALYZER = "analyzer";
    public static final String BOOST = "boost";

    @FunctionInfo(
        returnType = "boolean",
        description = "Performs a match query on the specified field."
    )
    public MapParamFunction(
        Source source,
        @Param(name = FIELD, type = { "keyword", "text" }, description = "Field to search.") Expression field,
        @Param(name = QUERY, type = "keyword", description = "Query string.") Expression query,
        @MapParam(
            name = "options",
            description = "Match options.",
            params = {
                @MapParam.MapParamEntry(
                    name = ANALYZER,
                    type = { "keyword" },
                    description = "Analyzer to use."
                ),
                @MapParam.MapParamEntry(
                    name = BOOST,
                    type = { "float" },
                    description = "Boost factor."
                )
            },
            optional = true
        ) Expression options
    ) {
        super(source, field, query, options);
    }
}
