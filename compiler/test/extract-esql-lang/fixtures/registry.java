package org.elasticsearch.xpack.esql.expression.function;

public class EsqlFunctionRegistry {
    private void snapshotFunctions() {
        return List.of(
                def(SimpleFunction.class, SimpleFunction::new, "abs"),
                def(Bucket.class, Bucket::new, "bucket", "bin"),
                def(ToBoolean.class, ToBoolean::new, "to_boolean", "to_bool"),
                def(AvailabilityFunction.class, uni(AvailabilityFunction::new), "avg")
        );
    }
}
