package org.elasticsearch.xpack.esql.expression.function.scalar.math;

import org.elasticsearch.xpack.esql.expression.function.FunctionInfo;
import org.elasticsearch.xpack.esql.expression.function.Param;

public class SimpleFunction extends EsqlFunction {
    @FunctionInfo(
        returnType = "double",
        description = "Returns the absolute value."
    )
    public SimpleFunction(
        Source source,
        @Param(name = "number", type = { "double", "integer", "long" }, description = "Numeric expression.") Expression v
    ) {
        super(source, v);
    }
}
