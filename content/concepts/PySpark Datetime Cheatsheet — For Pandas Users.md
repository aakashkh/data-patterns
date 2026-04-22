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

> **Note:** Spark uses Java date patterns (`yyyy`, `MM`, `dd`, `HH`, `mm`, `ss`) not Python's `%Y-%m-%d`.[^1][^2]

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
    .withColumn("year",   F.year("CreatedDate"))
    .withColumn("month",  F.month("CreatedDate"))
    .withColumn("day",    F.dayofmonth("CreatedDate"))
    .withColumn("hour",   F.hour("CreatedDate"))
    .withColumn("dow",    F.dayofweek("CreatedDate"))    # 1=Sunday, 7=Saturday
    .withColumn("weeknum", F.weekofyear("CreatedDate"))
    .withColumn("quarter", F.quarter("CreatedDate"))
)
```

***

## 3. Filtering by Date

### Pandas

```python
# After a date
df = df[df["CreatedDate"] >= "2024-01-01"]

# Between two dates
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

> **Tip:** Spark string comparisons work correctly on `DateType` and `TimestampType` columns when the string is in `yyyy-MM-dd` format.[^3][^2]

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
df["next_week"]   = df["CreatedDate"] + pd.Timedelta(days=7)
df["prev_month"]  = df["CreatedDate"] - pd.DateOffset(months=1)
df["next_year"]   = df["CreatedDate"] + pd.DateOffset(years=1)
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
# If year < 2024, set to 1st Jan 2024
df["CreatedDate"] = df["CreatedDate"].apply(
    lambda x: pd.Timestamp("2024-01-01") if x.year < 2024 else x
)

# Or with np.where
import numpy as np
df["CreatedDate"] = np.where(
    df["CreatedDate"].dt.year < 2024,
    pd.Timestamp("2024-01-01"),
    df["CreatedDate"]
)
```

### Spark — `F.when().otherwise()`

```python
# If year < 2024, replace with 1st Jan 2024 (date delimitation)
df = df.withColumn(
    "CreatedDate",
    F.when(
        F.year("CreatedDate") < 2024,
        F.lit("2024-01-01").cast("date")
    ).otherwise(F.col("CreatedDate"))
)
```

More conditional date patterns:[^4][^5][^6][^7]

```python
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

## 11. Generating Date Ranges (Equivalent to `pd.date_range` / `pd.period_range`)

### Pandas

```python
# Daily range
pd.date_range(start="2024-01-01", end="2024-12-31", freq="D")

# Monthly range
pd.period_range(start="2024-01", end="2024-12", freq="M")
```

### Spark — `sequence()` + `explode()`

`sequence()` generates an array of dates between two dates. `explode()` turns each array into rows — like pandas' `date_range` but distributed.[^8][^9][^10][^11]

```python
# 1) Generate a standalone date spine (like pd.date_range)
date_spine = spark.sql("""
    SELECT explode(sequence(DATE '2024-01-01', DATE '2024-12-31', INTERVAL 1 DAY)) AS date
""")
date_spine.show(5)
# +----------+
# |      date|
# +----------+
# |2024-01-01|
# |2024-01-02|
# |...       |

# 2) Monthly date spine (like pd.period_range)
monthly_spine = spark.sql("""
    SELECT explode(sequence(DATE '2024-01-01', DATE '2024-12-01', INTERVAL 1 MONTH)) AS month_start
""")
monthly_spine.show()

# 3) Expand per-row date ranges into individual rows
# e.g. each issue has a CreatedDate and ClosedDate — expand to one row per day
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

A very common analytics pattern: "how many months did this issue stay open?"

```python
from pyspark.sql import functions as F

df = df.withColumn(
    "months_open",
    F.floor(
        F.months_between(
            F.col("ModifiedDate"),
            F.col("CreatedDate")
        )
    ).cast("int")
)
```

Or for whole-calendar-months only (like period difference in pandas):

```python
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
| Subtract months | `- pd.DateOffset(months=1)` | `F.add_months("col", -1)` |
| Days between | `(a - b).dt.days` | `F.datediff(a, b)` |
| Months between | period subtraction | `F.months_between(a, b)` |
| First of month | `.dt.to_period("M").dt.to_timestamp()` | `F.trunc("col", "month")` |
| Last of month | `+ pd.offsets.MonthEnd(0)` | `F.last_day("col")` |
| First of year | `- pd.offsets.YearBegin(1)` | `F.trunc("col", "year")` |
| First of quarter | custom | `F.date_trunc("quarter", "col")` |
| Start of week | `- pd.to_timedelta(dow, unit='d')` | `F.date_trunc("week", "col")` |
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

Add `.cast("date")` after `date_trunc` if you need a plain date.[^12][^13][^14]

**5. Java datetime format strings (not Python's `strftime`).**

| Python | Spark |
|---|---|
| `%Y` | `yyyy` |
| `%m` | `MM` |
| `%d` | `dd` |
| `%H` | `HH` |
| `%M` | `mm` |
| `%S` | `ss` |

---

## References

1. [Pyspark to filter date in format yyyy/mm/dd](https://stackoverflow.com/questions/69438308/pyspark-to-filter-date-in-format-yyyy-mm-dd) - I want to filter my data for Datetime column in the format yyy-mm-dd. However, its string value and ...

2. [PySpark Date Manipulation Techniques](https://blog.naveenpn.com/mastering-date-manipulation-in-pyspark) - Filter Records Within a Date Range. Problem: Filter records where visit_date is between 2023-01-01 a...

3. [How to Filter by Date Range in PySpark (With Example)](https://www.statology.org/pyspark-filter-date/) - This tutorial explains how to filter rows by date range in PySpark, including an example.

4. [How To Conditionally Replace Values In A PySpark Column](https://scales.arabpsychology.com/stats/how-can-i-replace-a-value-in-a-column-in-pyspark-only-if-a-certain-condition-is-met/) - The foundation of effective conditional replacement in PySpark relies entirely on the when() functio...

5. [PySpark: How to Conditionally Replace Value in Column](https://www.statology.org/pyspark-conditional-replace/) - This tutorial explains how to conditionally replace a value in a column of a PySpark DataFrame based...

6. [How to use when() and otherwise() for conditional logic in ...](https://www.linkedin.com/posts/meghagupta18_introducing-when-and-otherwise-for-activity-7352962096050966529-zzrL) - Introducing when() and otherwise() for conditional logic in PySpark similar to if and else Use case:...

7. [How to use when and otherwise in PySpark](https://www.linkedin.com/posts/karthik-kondpak_understanding-when-and-otherwise-in-pyspark-activity-7300479807832657920-tUdi) - In PySpark, when and otherwise are used to create conditional logic inside a DataFrame. They work li...

8. [Generate new rows based on date series in databricks ...](https://learn.microsoft.com/en-us/answers/questions/1056973/generate-new-rows-based-on-date-series-in-databric) - Here we have used Sequence function which generates an array of elements from start to stop (inclusi...

9. [How to Explode a Date Range into Rows in PySpark](https://www.youtube.com/watch?v=dCAr1kOwQv0) - Learn how to manipulate date ranges in PySpark efficiently by exploding them into multiple rows with...

10. [How to Generate a Calendar in PySpark for Time Series ...](https://www.linkedin.com/posts/meghagupta18_generating-a-calendar-or-date-dimension-is-activity-7357455518606483456-YM_b) - Here's a clean, scalable way to generate a calendar using PySpark's sequence() function from pyspark...

11. [pyspark.sql.functions.sequence - Apache Spark](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.functions.sequence.html) - Array function: Generate a sequence of integers from start to stop , incrementing by step . If step ...

12. [trunc(), date_trunc(), last_day() | PySpark Tutorial](https://www.youtube.com/watch?v=HR_VOcBnlto) - Learn how to use PySpark's date truncation functions such as trunc(), date_trunc(), and last_day() t...

13. [How to convert date to the first day of month in a PySpark ...](https://stackoverflow.com/questions/48349048/how-to-convert-date-to-the-first-day-of-month-in-a-pyspark-dataframe-column) - You can get the beginning of the month with the trunc function (as Alper) mentioned or with the date...

14. [PySpark: How to Round Date to First Day of Month](https://www.statology.org/pyspark-round-date-to-month/) - This tutorial explains how to round dates to the first day of the month in PySpark, including an exa...

