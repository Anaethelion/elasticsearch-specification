package org.elasticsearch.xpack.esql.expression.function.aggregate;

import org.elasticsearch.xpack.esql.expression.function.FunctionInfo;
import org.elasticsearch.xpack.esql.expression.function.Param;

public class AvailabilityFunction extends EsqlFunction {
    @FunctionInfo(
        returnType = "double",
        description = "The average of a numeric field.",
        type = FunctionType.AGGREGATE,
        appliesTo = {
            @FunctionAppliesTo(lifeCycle = LifeCycle.GA, version = "8.11.0"),
            @FunctionAppliesTo(lifeCycle = LifeCycle.PREVIEW, version = "8.10.0")
        }
    )
    public AvailabilityFunction(
        Source source,
        @Param(name = "number", type = { "double", "integer", "long" }, description = "A numeric value.") Expression v
    ) {
        super(source, v);
    }
}
