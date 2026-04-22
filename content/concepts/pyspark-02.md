---
title: "PySpark Datetime Cheatsheet — For Pandas Users"
date: 2025-06-02T10:00:00+05:30
description: "A side-by-side Pandas vs PySpark reference for every common datetime operation: casting, extracting, filtering, arithmetic, date spines, and common gotchas."
categories: ["Python", "Data Engineering"]
tags: ["pyspark", "spark", "pandas", "datetime", "date", "data-manipulation"]
toc: true
draft: false
series: "pyspark"
weight: 2
---

# PySpark Datetime Cheatsheet — For Pandas Users

All examples use:

```python
from pyspark.sql import functions as F
import pandas as pd
```

***

## 1. Casting Strings to Dates / Timestamps

### Pandas

```python
df["CreatedDate"] = pd.to_datetime(df["CreatedDate"])
df["date_only"]   = pd.to_datetime(df["date_only"]).dt.date
```

### Spark

```python
# Full timestamp
df = df.withColumn("CreatedDate", F.to_timestamp("CreatedDate"))

# With custom format
df = df.withColumn("CreatedDate", F.to_timestamp("CreatedDate", "yyyy-MM-dd HH:mm:ss"))

# Date only (no time part)
df = df.withColumn("date_only", F.to_date("date_only", "yyyy-MM-dd"))
```

> **Note:** Spark uses Java date patterns (`yyyy`, `MM`, `dd`, `HH`, `mm`, `ss`) not Python's `%Y-%m-%d`.

***

## 2. Extracting Date Parts

### Pandas

```python
df["year"]  = df["CreatedDate"].dt.year
df["month"] = df["CreatedDate"].dt.month
df["day"]   = df["CreatedDate"].dt.day
df["hour"]  = df["CreatedDate"].dt.hour
df["dow"]   = df["CreatedDate"].dt.dayofweek   # 0=Monday
```

### Spark

```python
df = (df
    .withColumn("year",    F.year("CreatedDate"))
    .withColumn("month",   F.month("CreatedDate"))
    .withColumn("day",     F.dayofmonth("CreatedDate"))
    .withColumn("hour",    F.hour("CreatedDate"))
    .withColumn("dow",     F.dayofweek("CreatedDate"))    # 1=Sunday, 7=Saturday
    .withColumn("weeknum", F.weekofyear("CreatedDate"))
    .withColumn("quarter", F.quarter("CreatedDate"))
)
```

***

## 3. Filtering by Date

### Pandas

```python
df = df[df["CreatedDate"] >= "2024-01-01"]
df = df[(df["CreatedDate"] >= "2024-01-01") & (df["CreatedDate"] < "2025-01-01")]
```

### Spark (3 equivalent styles)

```python
# Style 1: string comparison (works for date and timestamp columns)
df = df.filter(F.col("CreatedDate") >= "2024-01-01")

# Style 2: .between() — inclusive on both ends
df = df.filter(F.col("CreatedDate").between("2024-01-01", "2024-12-31"))

# Style 3: literal date
df = df.filter(F.col("CreatedDate") >= F.lit("2024-01-01").cast("date"))

# Combined range
df = df.filter(
    (F.col("CreatedDate") >= "2024-01-01") &
    (F.col("CreatedDate") <  "2025-01-01")
)
```

> **Tip:** Spark string comparisons work correctly on `DateType` and `TimestampType` columns when the string is in `yyyy-MM-dd` format.

***

## 4. Filter by Year / Month (like `.dt.year`)

### Pandas

```python
df = df[df["CreatedDate"].dt.year == 2024]
df = df[df["CreatedDate"].dt.month == 3]
```

### Spark

```python
df = df.filter(F.year("CreatedDate") == 2024)
df = df.filter(F.month("CreatedDate") == 3)

# Year and month together
df = df.filter(
    (F.year("CreatedDate") == 2024) &
    (F.month("CreatedDate") == 3)
)
```

***

## 5. Date Arithmetic

### Pandas

```python
df["next_week"]  = df["CreatedDate"] + pd.Timedelta(days=7)
df["prev_month"] = df["CreatedDate"] - pd.DateOffset(months=1)
df["next_year"]  = df["CreatedDate"] + pd.DateOffset(years=1)
```

### Spark

```python
# Add / subtract days
df = df.withColumn("next_week",  F.date_add("CreatedDate", 7))
df = df.withColumn("prev_week",  F.date_sub("CreatedDate", 7))

# Add / subtract months
df = df.withColumn("next_month", F.add_months("CreatedDate",  1))
df = df.withColumn("prev_month", F.add_months("CreatedDate", -1))

# Add years (no direct function — use add_months with 12)
df = df.withColumn("next_year",  F.add_months("CreatedDate", 12))
df = df.withColumn("prev_year",  F.add_months("CreatedDate", -12))
```

***

## 6. Difference Between Two Dates

### Pandas

```python
df["days_diff"]   = (df["ModifiedDate"] - df["CreatedDate"]).dt.days
df["months_diff"] = (df["ModifiedDate"].dt.to_period("M") - df["CreatedDate"].dt.to_period("M")).n
```

### Spark

```python
# Difference in days
df = df.withColumn(
    "days_diff",
    F.datediff(F.col("ModifiedDate"), F.col("CreatedDate"))
)

# Difference in months (decimal — e.g., 3.94 months)
df = df.withColumn(
    "months_diff",
    F.months_between(F.col("ModifiedDate"), F.col("CreatedDate"))
)

# Difference in whole months (truncate to month start first)
df = df.withColumn(
    "whole_months",
    F.months_between(
        F.trunc("ModifiedDate", "month"),
        F.trunc("CreatedDate",  "month")
    ).cast("int")
)

# Difference in years
df = df.withColumn(
    "years_diff",
    (F.months_between("ModifiedDate", "CreatedDate") / 12).cast("int")
)
```

***

## 7. First Day / Last Day of Month

### Pandas

```python
df["first_day"] = df["CreatedDate"].dt.to_period("M").dt.to_timestamp()
df["last_day"]  = df["CreatedDate"] + pd.offsets.MonthEnd(0)
```

### Spark

```python
# First day of month
df = df.withColumn("first_day", F.trunc("CreatedDate", "month"))

# Last day of month
df = df.withColumn("last_day", F.last_day("CreatedDate"))

# First day of year
df = df.withColumn("first_day_of_year", F.trunc("CreatedDate", "year"))

# First day of quarter (use date_trunc)
df = df.withColumn("first_day_of_quarter", F.date_trunc("quarter", "CreatedDate"))
```

> `trunc()` = date-level truncation, returns DateType.
> `date_trunc()` = timestamp-level truncation, returns TimestampType. Supports `"year"`, `"quarter"`, `"month"`, `"week"`, `"day"`, `"hour"`, `"minute"`, `"second"`.

***

## 8. Current Date and Time

### Pandas

```python
from datetime import datetime, date
today = date.today()
now   = datetime.now()
```

### Spark

```python
df = df.withColumn("today",    F.current_date())
df = df.withColumn("now",      F.current_timestamp())
df = df.withColumn("days_old", F.datediff(F.current_date(), F.col("CreatedDate")))
```

***

## 9. Conditional Date Replacement (`when` / `otherwise`)

This is the Spark equivalent of pandas' `np.where` or `df.loc[condition, col] = value`.

### Pandas

```python
import numpy as np
df["CreatedDate"] = np.where(
    df["CreatedDate"].dt.year < 2024,
    pd.Timestamp("2024-01-01"),
    df["CreatedDate"]
)
```

### Spark — `F.when().otherwise()`

```python
df = df.withColumn(
    "CreatedDate",
    F.when(
        F.year("CreatedDate") < 2024,
        F.lit("2024-01-01").cast("date")
    ).otherwise(F.col("CreatedDate"))
)

# Cap a date — if modified date > today, set to today
df = df.withColumn(
    "ModifiedDate",
    F.when(
        F.col("ModifiedDate") > F.current_date(),
        F.current_date()
    ).otherwise(F.col("ModifiedDate"))
)

# Null handling — if CreatedDate is null, use ModifiedDate
df = df.withColumn(
    "EffectiveDate",
    F.when(F.col("CreatedDate").isNull(), F.col("ModifiedDate"))
     .otherwise(F.col("CreatedDate"))
)

# Multiple conditions — chaining when()
df = df.withColumn(
    "Period",
    F.when(F.year("CreatedDate") < 2022, F.lit("Pre-2022"))
     .when(F.year("CreatedDate") == 2022, F.lit("2022"))
     .when(F.year("CreatedDate") == 2023, F.lit("2023"))
     .otherwise(F.lit("2024+"))
)
```

***

## 10. Truncation Patterns (Delimitation)

A common pattern in data pipelines: snap dates to boundaries.

```python
# Snap all dates before 2024-01-01 to exactly 2024-01-01
df = df.withColumn(
    "CreatedDate",
    F.when(
        F.col("CreatedDate") < F.lit("2024-01-01").cast("date"),
        F.lit("2024-01-01").cast("date")
    ).otherwise(F.col("CreatedDate"))
)

# Snap to start of month
df = df.withColumn("month_start", F.trunc("CreatedDate", "month"))

# Snap to start of quarter
df = df.withColumn("quarter_start", F.date_trunc("quarter", "CreatedDate").cast("date"))

# Snap to start of year
df = df.withColumn("year_start", F.trunc("CreatedDate", "year"))

# Round down to nearest Monday (start of week)
df = df.withColumn("week_start", F.date_trunc("week", "CreatedDate").cast("date"))
```

***

## 11. Generating Date Ranges (Equivalent to `pd.date_range`)

### Pandas

```python
pd.date_range(start="2024-01-01", end="2024-12-31", freq="D")
pd.period_range(start="2024-01", end="2024-12", freq="M")
```

### Spark — `sequence()` + `explode()`

`sequence()` generates an array of dates between two dates. `explode()` turns each array into rows.

```python
# Daily date spine
date_spine = spark.sql("""
    SELECT explode(sequence(DATE '2024-01-01', DATE '2024-12-31', INTERVAL 1 DAY)) AS date
""")

# Monthly date spine
monthly_spine = spark.sql("""
    SELECT explode(sequence(DATE '2024-01-01', DATE '2024-12-01', INTERVAL 1 MONTH)) AS month_start
""")

# Expand per-row date ranges into individual rows
df_expanded = (
    df
    .withColumn(
        "date_array",
        F.expr("sequence(to_date(CreatedDate), to_date(ModifiedDate), interval 1 day)")
    )
    .withColumn("date", F.explode("date_array"))
    .drop("date_array")
)
```

***

## 12. Months Between Two Dates — Whole Months

```python
df = df.withColumn(
    "months_open",
    F.floor(
        F.months_between(
            F.col("ModifiedDate"),
            F.col("CreatedDate")
        )
    ).cast("int")
)

# Whole-calendar-months only
df = df.withColumn(
    "full_months",
    F.months_between(
        F.trunc("ModifiedDate", "month"),
        F.trunc("CreatedDate",  "month")
    ).cast("int")
)
```

***

## 13. Quick Reference Table

| Goal | Pandas | Spark |
|---|---|---|
| String → datetime | `pd.to_datetime(col)` | `F.to_timestamp("col")` |
| String → date only | `.dt.date` | `F.to_date("col")` |
| Extract year | `.dt.year` | `F.year("col")` |
| Extract month | `.dt.month` | `F.month("col")` |
| Extract day | `.dt.day` | `F.dayofmonth("col")` |
| Filter by date | `df[col >= "2024-01-01"]` | `.filter(F.col("col") >= "2024-01-01")` |
| Filter range | `(col >= a) & (col <= b)` | `F.col("col").between(a, b)` |
| Add days | `+ pd.Timedelta(days=7)` | `F.date_add("col", 7)` |
| Subtract days | `- pd.Timedelta(days=7)` | `F.date_sub("col", 7)` |
| Add months | `+ pd.DateOffset(months=1)` | `F.add_months("col", 1)` |
| Days between | `(a - b).dt.days` | `F.datediff(a, b)` |
| Months between | period subtraction | `F.months_between(a, b)` |
| First of month | `.dt.to_period("M").dt.to_timestamp()` | `F.trunc("col", "month")` |
| Last of month | `+ pd.offsets.MonthEnd(0)` | `F.last_day("col")` |
| First of year | custom | `F.trunc("col", "year")` |
| First of quarter | custom | `F.date_trunc("quarter", "col")` |
| Start of week | custom | `F.date_trunc("week", "col")` |
| Today | `date.today()` | `F.current_date()` |
| Now | `datetime.now()` | `F.current_timestamp()` |
| Conditional replace | `np.where(cond, val, col)` | `F.when(cond, val).otherwise(col)` |
| Date spine (daily) | `pd.date_range(...)` | `sequence(start, end, interval 1 day)` + `explode()` |
| Monthly spine | `pd.period_range(..., freq="M")` | `sequence(start, end, interval 1 month)` + `explode()` |

***

## 14. Common Gotchas

**1. String date comparisons work only if the column is already `DateType` or `TimestampType`.**

If your column is still a `string`, cast it first:

```python
df = df.withColumn("CreatedDate", F.to_date("CreatedDate"))
df = df.filter(F.col("CreatedDate") >= "2024-01-01")
```

**2. `F.lit()` for date literals inside `when()`.**

```python
F.lit("2024-01-01").cast("date")   # correct
F.lit(date(2024, 1, 1))           # also works
```

**3. `months_between` returns a decimal.**

Use `F.floor()` or `.cast("int")` to get whole months.

**4. `date_trunc` returns `TimestampType`, `trunc` returns `DateType`.**

```python
F.trunc("col", "month")           # → DateType   2024-04-01
F.date_trunc("month", "col")      # → TimestampType  2024-04-01 00:00:00
```

Add `.cast("date")` after `date_trunc` if you need a plain date.

**5. Java datetime format strings (not Python's `strftime`).**

| Python | Spark |
|---|---|
| `%Y` | `yyyy` |
| `%m` | `MM` |
| `%d` | `dd` |
| `%H` | `HH` |
| `%M` | `mm` |
| `%S` | `ss` |
