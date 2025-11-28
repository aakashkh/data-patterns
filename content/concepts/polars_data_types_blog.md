---
title: "Mastering Polars Data Types and Missing Values"
date: 2025-01-16T10:00:00+05:30
description: "Understand Polars' strict type system, nested data structures like Arrays, Lists, and Structs, and learn the crucial differences between null and NaN for robust data pipelines."
categories: ["Python", "Data Engineering"]
tags: ["polars", "data-types", "nested-data", "null-handling", "arrays", "lists", "structs"]
toc: true
draft: false
series: "polars"
weight: 3
---
# Mastering Polars Data Types and Missing Values
<a href="https://colab.research.google.com/github/aakashkh/data-patterns/blob/main/static/notebooks/concepts/polars_data_types_blog.ipynb" target="_blank"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"></a> &nbsp; <a href="/data-patterns/notebooks/concepts/polars_data_types_blog.ipynb" target="_blank" download><img src="https://img.shields.io/badge/Download-Notebook-blue?logo=jupyter" alt="Download Notebook"></a>

Polars is a lightning-fast DataFrame library for Rust and Python. One of its strengths lies in its strict and expressive type system. Understanding how Polars handles data types, especially nested ones, and how it manages missing data is crucial for writing efficient and bug-free data pipelines.

In this post, we'll explore Polars' core data structures, dive into nested types like Arrays and Lists, and demystify the difference between `null` and `NaN`.


## Core Data Structures

Polars is built around three main structures:

1.  **Series**: A named, one-dimensional array of data. All elements in a Series must have the same data type.
2.  **DataFrame**: A two-dimensional table consisting of multiple Series (columns).
3.  **LazyFrame**: A representation of a query plan. Operations on a LazyFrame are not executed immediately. Instead, Polars optimizes the entire plan before execution, leading to significant performance gains.

## Nested Data Types

Polars supports complex nested data types, allowing you to work with hierarchical data efficiently.

### 1. Polars Array (`pl.Array`)
The `Array` type represents **fixed-size** lists. Every element in an `Array` column must have the exact same number of items. This constraint allows Polars to store the data more efficiently in memory compared to variable-length lists.

```python
import polars as pl

coordinates = pl.DataFrame(
    [
        pl.Series('point2d', [[1, 3], [2, 3]]),
    ],
    schema={
        'point2d': pl.Array(shape=2, inner=pl.Int64),
    }
)
```

### 2. Polars List (`pl.List`)
The `List` type is more flexible, allowing for **variable-length** arrays. This is ideal for data like "daily temperature readings" where some days might have more readings than others.

```python
weather_readings = pl.DataFrame({
    "temperature": [[72.5, 75.0, 77.3], [68.0, 70.2]],
})
```

### 3. Polars Struct (`pl.Struct`)
A `Struct` is essentially a dictionary nested within a cell. It contains named fields, each with its own data type.

```python
rating_series = pl.Series(
    "rating",
    [
        {"Movies": "Cars", "Theater": "NE", "Avg_rating": 4.5},
        {"Movies": "Toy Story", "Theater": "ME", "Avg_rating": 4.9},
    ]
)
```

## Handling Missing Data: `null` vs `NaN`

A common source of confusion in data analysis is the difference between "missing" and "undefined" data. Polars makes a clear distinction:

*   **`null`**: Represents **missing data**. It indicates that the value is absent. This concept applies to all data types (Integers, Strings, Lists, etc.).
*   **`NaN` (Not a Number)**: A special floating-point value defined by the IEEE 754 standard. It represents an undefined or unrepresentable result, such as `0/0` or `sqrt(-1)`. It **only** applies to floating-point columns.

### Key Differences
- **Aggregations**: `null` values are typically ignored in aggregations (e.g., `mean()` calculates the mean of existing values). `NaN` values propagate; if a column contains a `NaN`, the sum or mean will also be `NaN`.
- **Filling**: You use `fill_null()` to handle missing data and `fill_nan()` to handle floating-point anomalies.

```python
import numpy as np

df = pl.DataFrame({
    "value": [1.0, np.nan, None, 4.0]
})

# Check for values
df.with_columns(
    is_nan = pl.col("value").is_nan(),
    is_null = pl.col("value").is_null()
)
```

## Data Type Conversion

Converting between data types is done using the `.cast()` method.

### Strictness
By default, Polars is **strict**. If a cast is ambiguous or would result in data loss (that isn't explicitly allowed), it will raise an error. For example, trying to cast the string "abc" to an Integer will fail.

You can relax this behavior by setting `strict=False`. In this mode, values that cannot be converted are replaced with `null`.

```python
df = pl.DataFrame({"val": ["1", "2", "a"]})

# This replaces "a" with null instead of raising an error
df.select(pl.col("val").cast(pl.Int64, strict=False))
```

## Conclusion

Polars' strict type system and explicit handling of missing values are designed to prevent silent bugs in your data pipelines. By understanding the nuances of `Array` vs `List` and `null` vs `NaN`, you can leverage the full power of Polars for your data engineering tasks.
