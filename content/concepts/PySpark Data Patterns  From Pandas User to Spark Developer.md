# PySpark Data Patterns: From Pandas User to Spark Developer

## Overview

This guide is structured for someone already comfortable with basic PySpark syntax coming from a Pandas background. It covers Spark SQL with views, essential transformation patterns (groupBy, pivot/unpivot, lambda-style functions), optimization techniques beyond broadcast joins, and advanced Spark-native functions — all strictly from the PySpark DataFrame/SQL API perspective.

***

## Spark SQL and Temp Views

Spark lets you mix DataFrame API and SQL freely. The bridge between the two is `createOrReplaceTempView()`, which registers a DataFrame as a temporary table in the Spark session's catalog.[^1][^2]

```python
# Register a DataFrame as a SQL-queryable view
issues.createOrReplaceTempView("issues")

result = spark.sql("""
    SELECT CreatedBy_Email, COUNT(*) as total_issues
    FROM issues
    WHERE Status = 'Open'
    GROUP BY CreatedBy_Email
    ORDER BY total_issues DESC
""")
```

Key points about temp views:[^3][^1]

- Scoped to the current SparkSession — dropped when the session ends.
- Not materialized (no data is written unless you explicitly `.cache()`).
- If you call `createOrReplaceTempView` again with the same name, it replaces the existing view.
- For cross-session sharing, use `createOrReplaceGlobalTempView("name")` and query as `global_temp.name`.

A practical pattern is to use SQL for complex multi-table logic (CTEs, subqueries, HAVING clauses) and the DataFrame API for programmatic transformations (loops over columns, conditional logic):

```python
# selectExpr lets you write SQL expressions inline on a DataFrame
issues = issues.selectExpr(
    "IssueId",
    "Status",
    "UPPER(Category) as Category",
    "datediff(current_date(), CreatedDate) as days_open"
)
```

***

## GroupBy Patterns

### Basic Aggregation

`groupBy` always pairs with `.agg()` for multiple aggregations in a single pass — avoid calling `groupBy` multiple times on the same data.[^4][^5]

```python
from pyspark.sql import functions as F

# Multiple aggregations in one groupBy (efficient)
summary = issues.groupBy("Category", "Status").agg(
    F.count("IssueId").alias("total"),
    F.countDistinct("CreatedBy_PersonNumber").alias("unique_creators"),
    F.min("CreatedDate").alias("first_created"),
    F.max("ModifiedDate").alias("last_modified")
)
```

### HAVING-Like Filtering

There is no `HAVING` keyword in the DataFrame API, but you filter after aggregation:

```python
summary = (
    issues.groupBy("AssignedTo_Email")
    .agg(F.count("IssueId").alias("issue_count"))
    .filter(F.col("issue_count") > 5)   # equivalent to HAVING
)
```

### Global Aggregation (No groupBy Key)

Calling `groupBy()` with no arguments does a global aggregation across all rows — equivalent to SQL without a GROUP BY clause:[^6]

```python
issues.groupBy().agg(
    F.count("*").alias("total_rows"),
    F.countDistinct("CreatedBy_PersonNumber").alias("unique_users")
).show()
```

### Collect to List per Group

Useful for building arrays of values per group (Pandas equivalent: `groupby().apply(list)`):

```python
issues.groupBy("Category").agg(
    F.collect_list("IssueId").alias("issue_ids"),   # preserves duplicates
    F.collect_set("Status").alias("unique_statuses") # distinct values
)
```

***

## Pivot and Unpivot

### Pivot — Long to Wide

`pivot()` is chained between `groupBy()` and an aggregation. It takes one column's distinct values and turns them into columns.[^7][^8]

```python
# Count of issues per Category per Status
pivot_df = (
    issues.groupBy("Category")
    .pivot("Status")   # values in 'Status' become columns
    .count()
)
# Result: Category | Closed | Open | In-Progress | ...
```

**Performance tip**: Provide distinct values explicitly to avoid an extra scan:[^9]

```python
statuses = ["Open", "Closed", "In-Progress"]

pivot_df = (
    issues.groupBy("Category")
    .pivot("Status", statuses)
    .count()
)
```

### Unpivot — Wide to Long

Spark 3.4+ has a native `.unpivot()` method. For earlier versions, use `stack()` via `selectExpr`.[^10][^11]

**Spark 3.4+ native:**

```python
# Unpivot: turn Status columns back into rows
df_unpivot = pivot_df.unpivot(
    ids=["Category"],
    values=["Open", "Closed", "In-Progress"],
    variableColumnName="Status",
    valueColumnName="issue_count"
)
```

**Pre-3.4 using `stack()` in `selectExpr`:**

```python
df_unpivot = pivot_df.selectExpr(
    "Category",
    "stack(3, 'Open', Open, 'Closed', Closed, 'In-Progress', `In-Progress`) as (Status, issue_count)"
).filter("issue_count is not null")
```

The `stack(N, 'label1', col1, 'label2', col2, ...)` function takes N pairs of label + column and melts them into rows.[^8][^9]

***

## Window Functions

Window functions are the Spark equivalent of SQL `OVER (PARTITION BY ...)`. Unlike `groupBy` which collapses rows, window functions keep all rows and add a computed column alongside them.[^12]

```python
from pyspark.sql import Window

# Partition = group; orderBy = sort within group
w = Window.partitionBy("Category").orderBy("CreatedDate")
```

### Ranking Functions

```python
issues = issues.withColumn("row_num",   F.row_number().over(w))   # always unique
issues = issues.withColumn("rank",      F.rank().over(w))         # ties share rank, gaps after
issues = issues.withColumn("dense_rank",F.dense_rank().over(w))   # ties share rank, no gaps
```

| Function | Ties behaviour |
|---|---|
| `row_number()` | Always unique — arbitrary tiebreak |
| `rank()` | Ties share rank; next rank skips |
| `dense_rank()` | Ties share rank; no gaps |
| `ntile(n)` | Distributes rows into N equal buckets |

**Most common pattern — deduplicate, keep latest per key:**[^12]

```python
w_dedup = Window.partitionBy("IssueId").orderBy(F.col("ModifiedDate").desc())

deduped = (
    issues.withColumn("rn", F.row_number().over(w_dedup))
    .filter(F.col("rn") == 1)
    .drop("rn")
)
```

### Analytic / Lag-Lead Functions

```python
w_ordered = Window.partitionBy("AssignedTo_Email").orderBy("CreatedDate")

issues = (
    issues
    .withColumn("prev_issue_date", F.lag("CreatedDate", 1).over(w_ordered))
    .withColumn("next_issue_date", F.lead("CreatedDate", 1).over(w_ordered))
    .withColumn("days_since_last",
        F.datediff(F.col("CreatedDate"), F.col("prev_issue_date")))
)
```

### Running Totals and Sliding Windows

Control the frame explicitly with `rowsBetween` or `rangeBetween`:[^12]

```python
# Running total from start up to current row
w_running = Window.partitionBy("Category").orderBy("CreatedDate") \
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

# Full partition aggregate (for % of total)
w_full = Window.partitionBy("Category") \
    .rowsBetween(Window.unboundedPreceding, Window.unboundedFollowing)

issues = (
    issues.withColumn("running_count", F.count("IssueId").over(w_running))
          .withColumn("pct_of_category",
               F.count("IssueId").over(w_running) /
               F.count("IssueId").over(w_full) * 100)
)
```

***

## Lambda-Style Functions in Spark

Spark's "lambda functions" are different from Python `lambda`. They work on **array and map columns** using higher-order functions and are evaluated inside the Catalyst engine (no Python row-by-row overhead).[^13][^14]

### `transform()` — Map over Array Elements

Like Python's `map()`, but for Spark array columns:

```python
from pyspark.sql import functions as F

# Double every element in an array column
df = df.withColumn("doubled", F.transform("scores", lambda x: x * 2))

# Using when/otherwise inside transform
df = df.withColumn(
    "capped_scores",
    F.transform(F.col("scores"), lambda x: F.when(x > 100, 100).otherwise(x))
)
```

### `filter()` — Keep Matching Array Elements

```python
# Keep only scores above 50
df = df.withColumn(
    "passing_scores",
    F.filter(F.col("scores"), lambda x: x > 50)
)
```

### `aggregate()` — Reduce an Array to a Single Value

```python
# Sum all elements of an array
df = df.withColumn(
    "total_score",
    F.aggregate("scores", F.lit(0), lambda acc, x: acc + x)
)
```

### `explode()` — Array Rows to Individual Rows

Converts each element of an array into its own row (1 row → N rows):[^15]

```python
from pyspark.sql.functions import explode, explode_outer, posexplode

# Basic explode — drops null/empty arrays
df_exploded = df.withColumn("tag", explode("tags"))

# explode_outer — keeps rows with null/empty arrays (returns null)
df_exploded = df.withColumn("tag", explode_outer("tags"))

# posexplode — also gives position (index) in original array
df_exploded = df.select("id", posexplode("tags").alias("pos", "tag"))
```

### `struct()` and Nested Fields

Access nested struct fields using dot notation:

```python
# Nested struct access
df.select("profile.name", "profile.age")

# Create a struct column from separate columns
df = df.withColumn("address",
    F.struct(
        F.col("city").alias("city"),
        F.col("pincode").alias("pincode")
    )
)
```

***

## UDFs — When Native Functions Aren't Enough

### Python UDF (Avoid If Possible)

Standard Python UDFs serialize every row from JVM → Python → JVM. Use only when no native Spark function can do the job.[^16][^17]

```python
from pyspark.sql.types import StringType

@F.udf(StringType())
def clean_name(name):
    return name.strip().title() if name else None

df = df.withColumn("clean_name", clean_name(F.col("name")))
```

### Pandas UDF (Vectorized — Preferred over Python UDF)

Uses Apache Arrow to transfer data in batches rather than row-by-row. Significantly faster than Python UDFs for heavy transformations:[^17][^18]

```python
import pandas as pd
from pyspark.sql.functions import pandas_udf

@pandas_udf(StringType())
def clean_name_vectorized(series: pd.Series) -> pd.Series:
    return series.str.strip().str.title()

df = df.withColumn("clean_name", clean_name_vectorized(F.col("name")))
```

**Rule of thumb**: Native functions > `pandas_udf` > Python UDF. Always check if a built-in `F.*` function exists before writing any UDF.[^16][^17]

***

## Optimization Techniques

### 1. Broadcast Join

You already know this one. Use when one side of a join is small (generally under 10–100 MB depending on cluster):[^19][^20]

```python
from pyspark.sql.functions import broadcast

result = large_df.join(broadcast(small_lookup_df), on="key", how="left")
```

Spark may auto-broadcast if the table size is below `spark.sql.autoBroadcastJoinThreshold` (default 10 MB).[^19]

### 2. Cache and Persist

Cache a DataFrame that is reused multiple times to avoid recomputing the full lineage:[^21][^22]

```python
df.cache()        # stores in memory (deserialized)
df.count()        # action that triggers caching

# More control with persist
import pyspark
df.persist(pyspark.StorageLevel.MEMORY_AND_DISK)

# Release when done
df.unpersist()
```

Don't cache everything — only DataFrames that are genuinely reused in multiple downstream actions.[^23]

### 3. Repartition vs Coalesce

Both change the number of partitions, but with different costs:[^24][^25]

| | `repartition(n)` | `coalesce(n)` |
|---|---|---|
| Can increase partitions? | ✅ Yes | ❌ No |
| Does a full shuffle? | ✅ Yes | ❌ No (merges in place) |
| Produces balanced partitions? | ✅ Yes | ❌ Not guaranteed |
| When to use | Increasing parallelism, skewed data | Reducing partitions before save |

```python
# Before a write — reduce to fewer files efficiently
df.coalesce(5).write.parquet("output/")

# After a heavy filter — re-balance remaining partitions
df.filter(...).repartition(50).groupBy(...).agg(...)
```

General target: aim for 128 MB–1 GB per partition.[^23]

### 4. Repartition by Column (Shuffle Partition Alignment)

Repartitioning by the join/groupBy key before operations can reduce shuffle overhead significantly:[^19]

```python
df1 = df1.repartition(200, "join_key")
df2 = df2.repartition(200, "join_key")

result = df1.join(df2, on="join_key")
```

### 5. Adaptive Query Execution (AQE)

AQE was introduced in Spark 3.0 and is on by default in Spark 3.2+. It re-optimizes the query plan at runtime based on actual data statistics (partition sizes, skew, etc.):[^26][^27][^28]

```python
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
```

AQE automatically handles:

- **Dynamic partition coalescing**: merges tiny shuffle partitions into reasonably sized ones.
- **Dynamic join strategy switching**: upgrades sort-merge join to broadcast hash join when runtime stats show one side is small enough.
- **Skew join handling**: splits oversized skewed partitions automatically.

### 6. Minimize `withColumn` Chains

Chaining many `withColumn` calls generates nested logical plans and can create performance issues. Prefer a single `select` or `selectExpr` when transforming many columns:[^29]

```python
# Bad — deep withColumn chain
df = df.withColumn("a", ...).withColumn("b", ...).withColumn("c", ...)

# Good — single select
df = df.select(
    "*",
    some_expr.alias("a"),
    some_expr.alias("b"),
    some_expr.alias("c")
)
```

### 7. Pre-filter Before Joins

Push filters as early as possible — before joins, before groupBy — to reduce the volume of data being shuffled:[^19]

```python
# Filter first, then join
issues_filtered = issues.filter(F.col("Category") == "3DS")
result = issues_filtered.join(emp_data, on=..., how="left")
```

***

## Summary Pattern Reference

| Pattern | Key Function(s) | Notes |
|---|---|---|
| SQL on DataFrame | `createOrReplaceTempView`, `spark.sql()` | Session-scoped temp table |
| Multi-agg groupBy | `groupBy().agg(count, sum, min, max, ...)` | One pass, not multiple groupBys |
| Having clause | `.agg(...).filter(...)` | Filter after aggregation |
| Pivot | `groupBy().pivot().agg()` | Provide distinct values for speed |
| Unpivot | `.unpivot()` or `selectExpr("stack(...)") ` | stack() works pre-Spark 3.4 |
| Dedup (latest record) | `row_number().over(w) == 1` | Most common window pattern |
| Lag/Lead | `lag(), lead()` | Row offset within a partition |
| Array transform | `F.transform(col, lambda x: ...)` | JVM-side, no Python serialization |
| Array filter | `F.filter(col, lambda x: ...)` | Keep matching elements |
| Flatten array | `explode()` / `explode_outer()` | Outer preserves null arrays |
| Custom logic | `pandas_udf` (vectorized) | Prefer over plain Python `@udf` |
| Small table join | `broadcast(df)` | Avoids shuffle |
| Reuse DataFrame | `.cache()` / `.persist()` | Trigger with an action |
| Reduce output files | `.coalesce(n)` | No full shuffle |
| Auto re-optimize | AQE (`spark.sql.adaptive.enabled`) | On by default in Spark 3.2+ |

---

## References

1. [PySpark createOrReplaceTempView() Explained](https://sparkbyexamples.com/pyspark/pyspark-createorreplacetempview/) - The createOrReplaceTempView() is used to create a temporary view/table from the PySpark DataFrame or...

2. [pyspark.sql.DataFrame.createOrReplaceTempView - Apache Spark](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.createOrReplaceTempView.html) - Creates or replaces a local temporary view with this DataFrame . New in version 2.0.0. Changed in ve...

3. [pyspark.sql.DataFrame.createOrReplaceTempView](https://api-docs.databricks.com/python/pyspark/latest/pyspark.sql/api/pyspark.sql.DataFrame.createOrReplaceTempView.html) - Creates or replaces a local temporary view with this DataFrame. The lifetime of this temporary table...

4. [Aggregation Functions & groupBy in PySpark - LinkedIn](https://www.linkedin.com/posts/ashish-kumar-7758071ab_pyspark-apachespark-dataengineering-activity-7424093499970666496-pcqb) - #Answer groupBy + agg performs aggregations after grouping, while selectExpr allows SQL-style expres...

5. [Pyspark GroupBy DataFrame with Aggregation or Count](https://www.geeksforgeeks.org/python/pyspark-groupby-dataframe-with-aggregation-or-count/) - This can be easily done in Pyspark using the groupBy() function, which helps to aggregate or count v...

6. [pyspark.sql.DataFrame.groupBy - Apache Spark](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.groupBy.html) - Groups the DataFrame by the specified columns so that aggregation can be performed on them. See Grou...

7. [How to Unpivot a PySpark DataFrame (With Example) - Statology](https://www.statology.org/pyspark-unpivot/) - You can use the unpivot function to unpivot a PySpark DataFrame. The following example shows how to ...

8. [PIVOT vs UNPIVOT: Must-Know Concepts for PySpark Developers](https://srinimf.com/2024/09/20/pivot-vs-unpivot-a-guide-for-pyspark-and-pandas-users/) - Example (UNPIVOT in PySpark using selectExpr ):. Here we are Unpivoting the subject, which means mer...

9. [How to perform Pivot and Unpivot of DataFrame in Spark SQL](https://www.projectpro.io/recipes/perform-pivot-and-unpivot-dataframe-spark-sql) - Unpivot is a reverse operation. We can achieve this by rotating column values into rows values. Ther...

10. [pyspark.sql.DataFrame.unpivot - Apache Spark](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.unpivot.html) - Unpivot a DataFrame from wide format to long format, optionally leaving identifier columns set. This...

11. [Unpivot in Spark SQL / PySpark - Stack Overflow](https://stackoverflow.com/questions/42465568/unpivot-in-spark-sql-pyspark) - I have a problem statement at hand wherein I want to unpivot table in Spark SQL / PySpark. I have go...

12. [PySpark Window Functions: Complete Guide with Examples (2026)](https://pipelinepulse.dev/pyspark-window-functions/) - Master every PySpark window function — ranking, analytics, and advanced patterns like sessionization...

13. [Pyspark SQL Tip – Using the Transform higher order function](https://www.linkedin.com/pulse/pyspark-sql-tip-using-transform-higher-order-function-tom-reid) - Transform is one such function and it takes an array or nested array as its first argument and an an...

14. [Conditional Transform on PySpark Array Column with Higher Order ...](https://stackoverflow.com/questions/73479989/conditional-transform-on-pyspark-array-column-with-higher-order-functions) - I have a PySpark DF with an array column with data such as: [0,-1,0,0,1,1,1] I'd like to use higher ...

15. [PySpark Explode Array and Map Columns to Rows](https://sparkbyexamples.com/pyspark/pyspark-explode-array-and-map-columns-to-rows/) - In this article, I will explain how to explode an array or list and map columns to rows using differ...

16. [PySpark performance of using Python UDF vs Pandas UDF](https://stackoverflow.com/questions/76740934/pyspark-performance-of-using-python-udf-vs-pandas-udf) - My understanding is Pandas UDF uses Arrow to reduce data serialization overhead and it also supports...

17. [Topic: Enhancing Performance in PySpark with Vectorized Operations](https://www.linkedin.com/pulse/topic-enhancing-performance-pyspark-vectorized-operations-fidel-v-rue0e) - My Final Conclusion, the use of pandas_udf in PySpark offers a remarkable performance improvement ov...

18. [Spark UDF vs Pandas UDF: Performance and Execution Model](https://www.linkedin.com/posts/abhishek-tiwary-07512a240_spark-vs-pandas-udf-activity-7340740678009634818-sb-0) - Spark UDF vs Pandas UDF (PySpark) Both Spark UDF and Pandas UDF (also called Vectorized UDFs) are us...

19. [PySpark Joins: Optimize Big Data Join Performance | DataCamp](https://www.datacamp.com/tutorial/pyspark-joins) - Broadcast join strategy ... Broadcast joins improve performance by replicating smaller DataFrames ac...

20. [Optimize Big Data Performance with Broadcast Hash Join in PySpark](https://www.c-sharpcorner.com/article/optimize-big-data-performance-with-broadcast-hash-join-in-pyspark/) - Broadcast join in Apache Spark is a powerful technique for optimizing join operations when one datas...

21. [using cache/persit methods to optimize pyspark and ... - GitHub](https://github.com/James-Wachuka/pyspark_optimization) - Using cache() and persist() methods, Spark provides an optimization mechanism to store the intermedi...

22. [Performance Tuning - Spark 4.1.1 Documentation](https://spark.apache.org/docs/latest/sql-performance-tuning.html) - The join strategy hints, namely BROADCAST , MERGE , SHUFFLE_HASH and SHUFFLE_REPLICATE_NL , instruct...

23. [PySpark Performance Tuning and Optimization - Dataquest](https://www.dataquest.io/blog/pyspark-performance-tuning-and-optimization/) - Learn how to diagnose and fix slow PySpark pipelines by removing bottlenecks, tuning partitions, cac...

24. [PySpark Repartition() vs Coalesce() - Spark By {Examples}](https://sparkbyexamples.com/pyspark/pyspark-repartition-vs-coalesce/) - In PySpark, the choice between repartition() and coalesce() functions carries importance in optimizi...

25. [Spark - repartition() vs coalesce() - Stack Overflow](https://stackoverflow.com/questions/31610971/spark-repartition-vs-coalesce) - Coalesce uses existing partitions to minimize the amount of data that are shuffled. Repartition crea...

26. [Pyspark - Adaptive Query Execution(AQE) - LinkedIn](https://www.linkedin.com/pulse/pyspark-adaptive-query-executionaqe-soutir-sen-ccftf) - Adaptive Query Execution (AQE) is an optimization feature introduced in Spark 3.0 to enhance the per...

27. [Adaptive query execution - Azure Databricks - Microsoft Learn](https://learn.microsoft.com/en-us/azure/databricks/optimizations/aqe) - Adaptive query execution (AQE) is query re-optimization that occurs during query execution. The moti...

28. [Adaptive Query Execution: Speeding Up Spark SQL at Runtime](https://www.databricks.com/blog/2020/05/29/adaptive-query-execution-speeding-up-spark-sql-at-runtime.html) - Learn more about the new Spark 3.0 feature Adaptive Query Execution and how to use it to accelerate ...

29. [PySpark Styleguide - Dev Genius](https://blog.devgenius.io/pyspark-styleguide-f54be983e2a2) - Other best practices. Avoid including redundant/useless columns in the select statement; Avoid using...

