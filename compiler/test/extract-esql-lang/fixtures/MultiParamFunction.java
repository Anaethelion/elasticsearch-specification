package org.elasticsearch.xpack.esql.expression.function.scalar.conditional;

import org.elasticsearch.xpack.esql.expression.function.FunctionInfo;
import org.elasticsearch.xpack.esql.expression.function.Param;

public class MultiParamFunction extends EsqlFunction {
    @FunctionInfo(
        returnType = { "double", "integer", "long" },
        description = "Clamps a value to a range.",
        type = FunctionType.SCALAR,
        preview = true
    )
    public MultiParamFunction(
        Source source,
        @Param(name = "value", type = { "double", "integer", "long" }, description = "The input value.") Expression value,
        @Param(name = "min", type = { "double", "integer", "long" }, description = "Minimum bound.") Expression min,
        @Param(name = "max", type = { "double", "integer", "long" }, description = "Maximum bound.", optional = true) Expression max
    ) {
        super(source, value, min, max);
    }
}
