---
title: "PySpark Data Patterns: From Pandas User to Spark Developer"
date: 2025-06-01T10:00:00+05:30
description: "Spark SQL with views, groupBy, pivot/unpivot, window functions, lambda-style functions, UDFs, and optimization techniques — for developers coming from Pandas."
categories: ["Python", "Data Engineering"]
tags: ["pyspark", "spark", "pandas", "dataframe", "groupby", "window-functions", "performance"]
toc: true
draft: false
series: "pyspark"
weight: 1
---

# PySpark Data Patterns: From Pandas User to Spark Developer

## Overview

This guide is structured for someone already comfortable with basic PySpark syntax coming from a Pandas background. It covers Spark SQL with views, essential transformation patterns (groupBy, pivot/unpivot, lambda-style functions), optimization techniques beyond broadcast joins, and advanced Spark-native functions — all strictly from the PySpark DataFrame/SQL API perspective.

***

## Spark SQL and Temp Views

Spark lets you mix DataFrame API and SQL freely. The bridge between the two is `createOrReplaceTempView()`, which registers a DataFrame as a temporary table in the Spark session's catalog.

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

Key points about temp views:

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

`groupBy` always pairs with `.agg()` for multiple aggregations in a single pass — avoid calling `groupBy` multiple times on the same data.

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

Calling `groupBy()` with no arguments does a global aggregation across all rows — equivalent to SQL without a GROUP BY clause:

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

`pivot()` is chained between `groupBy()` and an aggregation. It takes one column's distinct values and turns them into columns.

```python
# Count of issues per Category per Status
pivot_df = (
    issues.groupBy("Category")
    .pivot("Status")   # values in 'Status' become columns
    .count()
)
# Result: Category | Closed | Open | In-Progress | ...
```

**Performance tip**: Provide distinct values explicitly to avoid an extra scan:

```python
statuses = ["Open", "Closed", "In-Progress"]

pivot_df = (
    issues.groupBy("Category")
    .pivot("Status", statuses)
    .count()
)
```

### Unpivot — Wide to Long

Spark 3.4+ has a native `.unpivot()` method. For earlier versions, use `stack()` via `selectExpr`.

**Spark 3.4+ native:**

```python
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

The `stack(N, 'label1', col1, 'label2', col2, ...)` function takes N pairs of label + column and melts them into rows.

***

## Window Functions

Window functions are the Spark equivalent of SQL `OVER (PARTITION BY ...)`. Unlike `groupBy` which collapses rows, window functions keep all rows and add a computed column alongside them.

```python
from pyspark.sql import Window

# Partition = group; orderBy = sort within group
w = Window.partitionBy("Category").orderBy("CreatedDate")
```

### Ranking Functions

```python
issues = issues.withColumn("row_num",    F.row_number().over(w))   # always unique
issues = issues.withColumn("rank",       F.rank().over(w))         # ties share rank, gaps after
issues = issues.withColumn("dense_rank", F.dense_rank().over(w))   # ties share rank, no gaps
```

| Function | Ties behaviour |
|---|---|
| `row_number()` | Always unique — arbitrary tiebreak |
| `rank()` | Ties share rank; next rank skips |
| `dense_rank()` | Ties share rank; no gaps |
| `ntile(n)` | Distributes rows into N equal buckets |

**Most common pattern — deduplicate, keep latest per key:**

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

Control the frame explicitly with `rowsBetween` or `rangeBetween`:

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

Spark's "lambda functions" work on **array and map columns** using higher-order functions and are evaluated inside the Catalyst engine (no Python row-by-row overhead).

### `transform()` — Map over Array Elements

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
df = df.withColumn(
    "passing_scores",
    F.filter(F.col("scores"), lambda x: x > 50)
)
```

### `aggregate()` — Reduce an Array to a Single Value

```python
df = df.withColumn(
    "total_score",
    F.aggregate("scores", F.lit(0), lambda acc, x: acc + x)
)
```

### `explode()` — Array Rows to Individual Rows

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

Standard Python UDFs serialize every row from JVM → Python → JVM. Use only when no native Spark function can do the job.

```python
from pyspark.sql.types import StringType

@F.udf(StringType())
def clean_name(name):
    return name.strip().title() if name else None

df = df.withColumn("clean_name", clean_name(F.col("name")))
```

### Pandas UDF (Vectorized — Preferred over Python UDF)

Uses Apache Arrow to transfer data in batches rather than row-by-row. Significantly faster than Python UDFs for heavy transformations:

```python
import pandas as pd
from pyspark.sql.functions import pandas_udf

@pandas_udf(StringType())
def clean_name_vectorized(series: pd.Series) -> pd.Series:
    return series.str.strip().str.title()

df = df.withColumn("clean_name", clean_name_vectorized(F.col("name")))
```

**Rule of thumb**: Native functions > `pandas_udf` > Python UDF. Always check if a built-in `F.*` function exists before writing any UDF.

***

## Optimization Techniques

### 1. Broadcast Join

Use when one side of a join is small (generally under 10–100 MB depending on cluster):

```python
from pyspark.sql.functions import broadcast

result = large_df.join(broadcast(small_lookup_df), on="key", how="left")
```

Spark may auto-broadcast if the table size is below `spark.sql.autoBroadcastJoinThreshold` (default 10 MB).

### 2. Cache and Persist

Cache a DataFrame that is reused multiple times to avoid recomputing the full lineage:

```python
df.cache()        # stores in memory (deserialized)
df.count()        # action that triggers caching

import pyspark
df.persist(pyspark.StorageLevel.MEMORY_AND_DISK)

df.unpersist()    # release when done
```

Don't cache everything — only DataFrames that are genuinely reused in multiple downstream actions.

### 3. Repartition vs Coalesce

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

General target: aim for 128 MB–1 GB per partition.

### 4. Adaptive Query Execution (AQE)

AQE was introduced in Spark 3.0 and is on by default in Spark 3.2+. It re-optimizes the query plan at runtime based on actual data statistics:

```python
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
```

AQE automatically handles:

- **Dynamic partition coalescing**: merges tiny shuffle partitions into reasonably sized ones.
- **Dynamic join strategy switching**: upgrades sort-merge join to broadcast hash join when runtime stats show one side is small enough.
- **Skew join handling**: splits oversized skewed partitions automatically.

### 5. Minimize `withColumn` Chains

Chaining many `withColumn` calls generates nested logical plans. Prefer a single `select` or `selectExpr` when transforming many columns:

```python
# Avoid — deep withColumn chain
df = df.withColumn("a", ...).withColumn("b", ...).withColumn("c", ...)

# Prefer — single select
df = df.select(
    "*",
    some_expr.alias("a"),
    some_expr.alias("b"),
    some_expr.alias("c")
)
```

### 6. Pre-filter Before Joins

Push filters as early as possible — before joins, before groupBy — to reduce the volume of data being shuffled:

```python
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
| Unpivot | `.unpivot()` or `selectExpr("stack(...)")` | stack() works pre-Spark 3.4 |
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
