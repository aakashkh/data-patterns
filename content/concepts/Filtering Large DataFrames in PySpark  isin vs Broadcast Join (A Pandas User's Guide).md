# Filtering Large DataFrames in PySpark: `isin` vs Broadcast Join
### A Practical Guide for Developers Coming from Pandas

***

## Executive Summary

In pandas, filtering a large DataFrame using values from a small one is trivial — you use `.isin()` or `.merge()` and everything happens in a single process in RAM. In PySpark, data is split across many machines, and the way you filter or join dramatically changes how much data moves across the network. This guide explains, from a pandas perspective, what "driver", "executor", and "partition" mean, and then walks through three filtering patterns — `isin`, inner join, and broadcast join — with runnable toy examples so you can see the difference yourself.

***

## Part 1: How Spark is Different from Pandas

### Pandas Lives on One Machine

When you do this in pandas:

```python
issues.merge(subtracker_filtered, on="FK_SubTracker", how="inner")
```

Everything happens in a single Python process. All data is in RAM. There is no concept of "where the data lives" because it is all right there.[^1][^2]

### Spark Lives on Many Machines

Spark splits your data across a cluster. Three concepts you need to understand:

**Driver**
The "controller" process — this is where your notebook code runs. It holds the *plan* of what to do, but usually does not hold the actual rows of data. Think of it as the manager who tells workers what to do.[^3][^4]

**Executor**
Worker processes on separate machines (or cores on the same machine in local mode). They hold the actual data and do the actual computation.[^4][^3]

**Partition**
A chunk of the DataFrame stored on one executor. If your `issues` DataFrame has 11 lakh (1.1 million) rows, Spark might split it into, say, 8 partitions of ~137,000 rows each, spread across executors.[^5][^6]

The diagram below illustrates this:

```
Your Notebook (Driver)
       │
       │  "join issues with subtracker"
       │
┌──────▼──────────────────────────────┐
│              Spark Cluster          │
│                                     │
│  Executor 1           Executor 2    │
│  ┌────────────┐       ┌───────────┐ │
│  │ issues     │       │ issues    │ │
│  │ rows 0-137k│       │ rows 137k │ │
│  │            │       │ -275k     │ │
│  └────────────┘       └───────────┘ │
│  ... more executors ...             │
└─────────────────────────────────────┘
```

So when Spark needs to join two DataFrames, the challenge is: how do matching rows on *different* executors find each other?[^7][^8]

***

## Part 2: The Problem — Joining Big with Small

### The Setup (your real pipeline)

- `issues`: 11 lakh rows (big)
- `subtracker_filtered`: ~1000 rows (small), pre-filtered to `Category = 'Request For Device'`

Goal: Keep only the issues that match the small subtracker, and bring `Category`, `Subcategory` columns into `issues`.

### Why Not Just Filter at the End?

Doing a full left join and then filtering keeps all 11 lakh rows in memory through all the expensive joins (with `issuedesc`, `emp_data`, etc.), only throwing away rows at the very last step. That wastes time and resources.[^9][^10]

***

## Part 3: Three Approaches

### Approach 1 — `isin` with a Python list

**The idea:** Collect the small set of keys to the driver as a Python list, then filter the large DataFrame using that list.

```python
from pyspark.sql import functions as F

# Step 1: Collect the ~1000 FK_SubTracker values to the driver
keys = [
    row.FK_SubTracker
    for row in subtracker_filtered.select("FK_SubTracker").distinct().collect()
]
# keys is now a plain Python list: [101, 203, 305, ...]

# Step 2: Filter issues — Spark sends this list to all executors
issues_small = issues.filter(F.col("FK_SubTracker").isin(keys))
```

**What happens internally:**
- `.collect()` brings ~1000 values to the driver (tiny, fine)
- Spark sends that list to every executor
- Each executor checks its own partition rows against the list (no network shuffle)

**Limitation:** You only filter — you don't get the `Category`, `Subcategory` columns yet. You'd still need a separate join afterward.[^11][^12]

**Pandas equivalent:**
```python
keys = subtracker_filtered["FK_SubTracker"].unique()
issues_small = issues[issues["FK_SubTracker"].isin(keys)]
```

***

### Approach 2 — Regular Inner Join

**The idea:** Join the two DataFrames on the common key with `how="inner"`, so only matching rows survive.

```python
issues_small = issues.join(
    subtracker_filtered,
    on="FK_SubTracker",
    how="inner"   # only rows that match in both sides survive
)
```

**What happens internally (the expensive case):**
By default, Spark performs a **Shuffle Join** (also called SortMergeJoin). Both DataFrames are *shuffled* — rows from each are moved across the network so that matching keys land on the same executor.[^8]

```
Executor 1 (issues rows with FK_SubTracker=101)
    +
Executor 3 (subtracker rows with FK_SubTracker=101)
    → Spark shuffles row 101 from executor 3 to executor 1
```

For a ~1000-row `subtracker_filtered`, this shuffle is small and acceptable. But if both DataFrames were large, this would be very expensive.[^13][^8]

**Pandas equivalent:**
```python
issues_small = issues.merge(subtracker_filtered, on="FK_SubTracker", how="inner")
```

***

### Approach 3 — Broadcast Join (The Best Pattern Here)

**The idea:** When one side is small, *copy it to every executor* before the join starts. Each executor already has the small table locally and can join without any shuffling.[^10][^14][^7]

```python
from pyspark.sql import functions as F
from pyspark.sql.functions import broadcast

issues_small = issues.join(
    broadcast(subtracker_filtered),   # <- tell Spark: this is small, copy it everywhere
    on="FK_SubTracker",
    how="inner"
)
```

**What happens internally:**

```
Before the join:
  Driver collects subtracker_filtered (~1000 rows, tiny)
  Driver sends a copy to every executor

During the join:
  Executor 1: checks its issues partition against its local copy of subtracker
  Executor 2: same, independently
  No data moves between executors for the subtracker side
```

No shuffle. Each executor works independently and in parallel.[^15][^7][^8][^10]

Spark also does this automatically when the small side is under 10 MB (`spark.sql.autoBroadcastJoinThreshold`). With only ~1000 rows, `subtracker_filtered` is well under that limit.[^14][^16][^10]

**Pandas equivalent:** There is no concept of "broadcast" in pandas because everything is already on one machine.

**Performance impact:** In production pipelines, broadcast joins deliver **5-8× speedups** compared to shuffle joins when the pattern fits (large × small join).[^7]

***

## Part 4: Runnable Toy Examples

You can run these in your Spark session to see the behavior yourself.

### Setup — Create Toy Data

```python
from pyspark.sql import SparkSession, functions as F
from pyspark.sql.functions import broadcast

spark = SparkSession.builder.master("local[*]").appName("demo").getOrCreate()
spark.sparkContext.setLogLevel("ERROR")

# Big table: 1 million issues
from pyspark.sql.types import StructType, StructField, IntegerType, StringType

issues_data = [(i, i % 500) for i in range(1_000_000)]  # IssueId, FK_SubTracker
issues = spark.createDataFrame(issues_data, ["IssueId", "FK_SubTracker"])

# Small table: only 10 FK_SubTracker IDs with Category
sub_data = [(i * 50, "Request For Device", f"Sub-{i}") for i in range(10)]
subtracker_filtered = spark.createDataFrame(
    sub_data, ["FK_SubTracker", "Category", "Subcategory"]
)

print(f"issues rows: {issues.count():,}")         # 1,000,000
print(f"subtracker rows: {subtracker_filtered.count()}")  # 10
```

***

### Example 1 — `isin` (filter only, no extra columns)

```python
# Collect keys to driver
keys = [row.FK_SubTracker for row in subtracker_filtered.select("FK_SubTracker").collect()]
print(f"Keys: {keys}")

# Filter large DataFrame
issues_isin = issues.filter(F.col("FK_SubTracker").isin(keys))
print(f"After isin filter: {issues_isin.count():,} rows")
# You get filtered issues, but NO Category/Subcategory columns

issues_isin.show(5)
```

Output:
```
+-------+-------------+
|IssueId|FK_SubTracker|
+-------+-------------+
|      0|            0|
|    500|            0|
|   1000|            0|
|      ...            |
+-------+-------------+
# Category, Subcategory not available yet
```

If you now want `Category` and `Subcategory`, you still need a join. `isin` only filtered.

***

### Example 2 — Regular Inner Join

```python
issues_inner = issues.join(
    subtracker_filtered,
    on="FK_SubTracker",
    how="inner"
)
print(f"After inner join: {issues_inner.count():,} rows")
issues_inner.show(5)
```

Output:
```
+-------------+-------+------------------+-----------+
|FK_SubTracker|IssueId|          Category|Subcategory|
+-------------+-------+------------------+-----------+
|            0|      0|Request For Device|      Sub-0|
|            0|    500|Request For Device|      Sub-0|
|          ...                                       |
+-------------+-------+------------------+-----------+
# Filtered AND enriched in one step
```

***

### Example 3 — Broadcast Join

```python
issues_broadcast = issues.join(
    broadcast(subtracker_filtered),  # same as inner join but no shuffle
    on="FK_SubTracker",
    how="inner"
)
print(f"After broadcast join: {issues_broadcast.count():,} rows")
issues_broadcast.show(5)
```

Same output as inner join, but faster for large data because the small side (`subtracker_filtered`) is copied to every executor instead of being shuffled.[^10][^7]

***

### Bonus: See the Execution Plan

You can see whether Spark chose BroadcastHashJoin or SortMergeJoin:

```python
# Regular join
issues.join(subtracker_filtered, on="FK_SubTracker", how="inner").explain()
# Look for: SortMergeJoin (shuffle join)

# Broadcast join
issues.join(broadcast(subtracker_filtered), on="FK_SubTracker", how="inner").explain()
# Look for: BroadcastHashJoin (no shuffle)
```

In the broadcast join plan output you'll see `BroadcastHashJoin` instead of `SortMergeJoin`.[^17][^14]

***

## Part 5: When to Use Which

| Scenario | Best Pattern | Why |
|---|---|---|
| Filter only, list < 500 values | `isin` | Simple, no DataFrame overhead |
| Filter only, list > 500 values | `inner join` or `broadcast join` | Avoid collecting huge list to driver |
| Filter + need extra columns | `broadcast join` with pre-filtered small DF | One step: filter + enrich |
| Both DataFrames are large | Regular `inner join` | Spark handles shuffle automatically |
| Small DF > 10 MB but < 8 GB | `broadcast(df)` explicit hint | Override default threshold |

> **Rule of thumb:** If one side is small (fits in memory per executor) and you need columns from it, always use `broadcast join`.[^8][^7][^10]

***

## Part 6: Applied to Your Issues Pipeline

Your optimized flow:

```python
from pyspark.sql.functions import broadcast

# --- 1. Build small filtered dimension (Category = 'Request For Device') ---
subtracker_dim = (
    subtracker.join(tracker, on="FK_Tracker", how="left")
    .withColumnsRenamed({
        "PK_SubTracker": "FK_SubTracker",
        "Name":          "Subcategory",
        "IsActive":      "SubcategoryIsActive",
    })
    .filter(F.col("Category") == "Request For Device")   # ~1000 rows
    .select("FK_SubTracker", "Subcategory", "SubcategoryIsActive", "Category")
)

# --- 2. Shrink issues via broadcast inner join ---
issues = issues.join(
    broadcast(subtracker_dim),   # copy tiny ~1000-row DF to all executors
    on="FK_SubTracker",
    how="inner"                  # only 'Request For Device' issues survive
)

# --- 3. All remaining joins now operate on a tiny issues DataFrame ---
issues = issues.join(issuedesc, how="left", on="IssueId")
issues = issues.alias("I").join(
    emp_data.alias("E"),
    on=F.col("I.CreatedBy_PersonNumber") == F.col("E.BK_PersonNumber"),
    how="left"
)
```

**What changed vs original:**
- `how='left'` → `how='inner'` on the subtracker join
- `broadcast()` hint added to tell Spark the subtracker_dim is small
- Final `issues.filter(Category == 'Request For Device')` is gone — it's already done
- All subsequent joins (`issuedesc`, `emp_data`) now run on ~1000 rows instead of 11 lakh[^9][^7][^10]

***

## Summary

| Concept | Pandas equivalent | Spark reality |
|---|---|---|
| All data in one place | Single DataFrame in RAM | Data split into partitions across executors |
| "Manager" process | Your Python script | Driver |
| "Worker" process | No equivalent | Executor |
| Simple filter | `df[df["col"].isin(list)]` | `df.filter(F.col("col").isin(list))` |
| Filter + enrich | `df.merge(small_df, how="inner")` | `df.join(broadcast(small_df), how="inner")` |
| Shuffle | No concept (all local) | Data moved across network to co-locate join keys — expensive |
| Broadcast | No concept | Copy small table to every executor — eliminates shuffle |

The key insight: **`broadcast` is just a way of telling Spark "this table is tiny, don't move the big one — copy the small one everywhere instead"**. This is the single most impactful optimization for pipelines that join a large fact table with a small dimension table.[^15][^7][^10]

---

## References

1. [When to use Spark vs Pandas? : r/dataengineering - Reddit](https://www.reddit.com/r/dataengineering/comments/1bgct3c/when_to_use_spark_vs_pandas/) - You can run Pandas and Spark out of memory and then they're both painfully slow. You can run spark o...

2. [Dataframe Performance Comparison - Pandas on Spark vs Pandas](https://stevenlevine.dev/2022/01/pandas-on-spark-vs-plain-pandas/) - The pandas API on Spark often outperforms pandas even on a single machine thanks to the optimization...

3. [Spark Executors, Cores, Partitions & Tasks Explained](https://www.youtube.com/watch?v=hywtEMs-aMY) - Confused about how executors, cores, partitions, and tasks work in Apache Spark? In this video, I br...

4. [Understanding Spark Driver and Executor | PDF](https://www.scribd.com/document/892537181/Spark) - Users assign jobs to the Driver, which breaks them down into stages and tasks for the Executors to h...

5. [Spark partitioning - Dev Genius](https://blog.devgenius.io/spark-partitioning-da6dba06949f) - A partition in Spark is a logical chunk of data mapped to a single node in a cluster. Partitions are...

6. [An Intro to Apache Spark Partitioning](https://www.talend.com/resources/intro-apache-spark-partitioning/) - Understanding the characteristics of partitions in Apache Spark will help you achieve better perform...

7. [Broadcast Variables & Broadcast Joins in PySpark](https://datavidhya.com/learn/python-and-pyspark/pyspark-advanced/broadcast-joins/) - When Spark joins two DataFrames and one is small enough, it can use a BroadcastHashJoin strategy ins...

8. [Apache Spark Optimizations: Shuffle Join Vs. Broadcast Joins](https://shanoj.com/2024/01/15/apache-spark-optimizations-shuffle-join-vs-broadcast-joins/) - Join Conditions: Optimal use of join keys and conditions can reduce the amount of data shuffled acro...

9. [Why is there a difference in performance between prefilter ...](https://www.reddit.com/r/bigdata/comments/13xtyqf/why_is_there_a_difference_in_performance_between/) - The presenter say that filtering the large data by the medium data keys and then joining the table w...

10. [Apache Spark Performance Boosting](https://towardsdatascience.com/apache-spark-performance-boosting-e072a3ec1179/) - Here, I will mention some useful coding implementations while developing in Pyspark to increase perf...

11. [apache spark - pyspark: isin vs join](https://stackoverflow.com/questions/45803888/pyspark-isin-vs-join) - Depending on the size of the given list of values, then with respect to runtime when is it best to u...

12. [Spark efficiently filtering entries from big dataframe that exist in a ...](https://stackoverflow.com/questions/40717062/spark-efficiently-filtering-entries-from-big-dataframe-that-exist-in-a-small-dat) - Spark efficiently filtering entries from big dataframe that exist in a small dataframe

13. [PySpark Joins: Optimize Big Data Join Performance](https://www.datacamp.com/tutorial/pyspark-joins) - Learn how to optimize PySpark joins, reduce shuffles, handle skew, and improve performance across bi...

14. [Mastering Broadcast Joins in PySpark: The Key to Efficient ...](https://www.linkedin.com/pulse/mastering-broadcast-joins-pyspark-key-efficient-table-sourabh-phulare-q6tae) - Broadcast joins are a powerful optimization technique in PySpark for scenarios where you need to joi...

15. [How to Optimize Joins in PySpark with Broadcast and ...](https://www.linkedin.com/posts/lucas-aguiar-tostes_post-2-in-my-second-post-about-pyspark-activity-7376259634468290561-RFUV) - 1. Broadcast Join: Ideal for joining a large dataset with a small one. Spark replicates (“broadcasts...

16. [How to Improve Spark SQL Join Efficiency on Large ...](https://www.singdata.com/trending/spark-sql-join-efficiency-terabyte-datasets-2025/) - Use smart partitioning to make joins quicker. Partitioning with join keys helps Spark match rows fas...

17. [DataFrame join optimization - Broadcast Hash Join](https://stackoverflow.com/questions/32435263/dataframe-join-optimization-broadcast-hash-join) - You can hint to Spark SQL that a given DF should be broadcast for join by calling method broadcast o...

