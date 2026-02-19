package org.elasticsearch.xpack.esql.expression.function.scalar.histogram;

import org.elasticsearch.xpack.esql.expression.function.FunctionInfo;
import org.elasticsearch.xpack.esql.expression.function.Param;

public class HistogramPercentile extends EsqlFunction {
    @FunctionInfo(
        returnType = "double",
        description = "Computes a percentile from a histogram."
    )
    public HistogramPercentile(
        Source source,
        @Param(name = "histogram", type = "histogram", description = "Input histogram.") Expression h,
        @Param(name = "percentile", type = "double", description = "Percentile value.") Expression p
    ) {
        super(source, h, p);
    }
}
