---
title: "Advanced Polars Functions: String Operations & Complex Data Types"
date: 2025-01-16T10:00:00+05:30
description: "Master advanced Polars expressions including string manipulation, datetime operations, list columns, and complex data transformations."
categories: ["Python", "Data Engineering"]
tags: ["polars", "expressions", "strings", "datetime", "lists", "advanced"]
weight: 20
toc: true
draft: false
series: "polars"
weight: 3
---

# Advanced Polars Expressions: String Operations & Complex Data Types

Welcome to the second installment of our Polars mastery series! Building on the foundational concepts from [Part 1](../polars-02/), we'll dive deep into Polars' powerful expression system for handling strings, dates, lists, and complex data transformations.

This post focuses on **practical patterns you'll use daily** when working with real-world data that's messy, nested, and requires sophisticated manipulation.

***

## String Operations: Beyond Basic Text Processing

Polars provides a comprehensive `.str` namespace for string operations that are both more readable and significantly faster than Pandas equivalents.

### Basic String Operations

```python
import polars as pl

# Sample data with messy strings
df = pl.DataFrame({
    "names": ["  Alice Johnson  ", "bob smith", "CHARLIE BROWN", None],
    "emails": ["alice@company.com", "BOB@GMAIL.COM", "charlie.brown@work.org", "invalid-email"],
    "phone": ["(555) 123-4567", "555.987.6543", "5551234567", "555-CALL-NOW"]
})

# Clean and standardize strings
result = df.with_columns([
    # Clean names: strip whitespace, title case
    pl.col("names").str.strip_chars().str.to_titlecase().alias("clean_names"),
    
    # Normalize emails: lowercase, validate format
    pl.col("emails").str.to_lowercase().alias("clean_emails"),
    
    # Extract just digits from phone numbers
    pl.col("phone").str.extract_all(r"\d").list.join("").alias("phone_digits")
])

print(result)
```

### Advanced String Pattern Matching

```python
# Extract structured data from strings
df = pl.DataFrame({
    "log_entries": [
        "2024-01-15 ERROR: Database connection failed",
        "2024-01-15 INFO: User login successful",
        "2024-01-16 WARNING: High memory usage detected",
        "2024-01-16 ERROR: API timeout occurred"
    ]
})

# Parse log entries using regex
parsed = df.with_columns([
    # Extract date
    pl.col("log_entries").str.extract(r"(\d{4}-\d{2}-\d{2})").alias("date"),
    
    # Extract log level
    pl.col("log_entries").str.extract(r"(ERROR|INFO|WARNING)").alias("level"),
    
    # Extract message (everything after the colon and space)
    pl.col("log_entries").str.extract(r": (.+)$").alias("message"),
    
    # Check if it's an error
    pl.col("log_entries").str.contains("ERROR").alias("is_error")
])

print(parsed)
```

### String Aggregations and Transformations

```python
# Group operations on strings
df = pl.DataFrame({
    "category": ["A", "A", "B", "B", "A"],
    "items": ["apple", "apricot", "banana", "blueberry", "avocado"]
})

# String aggregations by group
result = df.group_by("category").agg([
    # Concatenate all items with separator
    pl.col("items").str.concat(", ").alias("all_items"),
    
    # Count items starting with specific letter
    pl.col("items").filter(pl.col("items").str.starts_with("a")).len().alias("items_starting_with_a"),
    
    # Get the longest item name
    pl.col("items").sort_by(pl.col("items").str.len_chars(), descending=True).first().alias("longest_item")
])

print(result)
```

***

## DateTime Operations: Time Series Made Simple

Polars excels at datetime operations with a rich `.dt` namespace that handles time zones, parsing, and complex temporal logic.

### Parsing and Creating Dates

```python
import polars as pl
from datetime import datetime, date

# Various date formats
df = pl.DataFrame({
    "date_strings": ["2024-01-15", "15/01/2024", "Jan 15, 2024", "2024-01-15 14:30:00"],
    "timestamps": [1705334400, 1705334400, 1705334400, 1705334400],  # Unix timestamps
    "year": [2024, 2023, 2022, 2021],
    "month": [1, 12, 6, 3],
    "day": [15, 25, 10, 8]
})

# Parse different date formats
parsed_dates = df.with_columns([
    # Parse ISO format
    pl.col("date_strings").str.strptime(pl.Date, "%Y-%m-%d", strict=False).alias("iso_date"),
    
    # Convert Unix timestamps
    pl.from_epoch("timestamps", time_unit="s").alias("from_timestamp"),
    
    # Create date from components
    pl.date("year", "month", "day").alias("constructed_date")
])

print(parsed_dates)
```

### Advanced DateTime Manipulations

```python
# Time series analysis
df = pl.DataFrame({
    "timestamp": pl.date_range(
        start=date(2024, 1, 1),
        end=date(2024, 12, 31),
        interval="1d"
    ),
    "sales": range(366)  # Daily sales data
})

# Rich datetime operations
time_features = df.with_columns([
    # Extract components
    pl.col("timestamp").dt.year().alias("year"),
    pl.col("timestamp").dt.month().alias("month"),
    pl.col("timestamp").dt.weekday().alias("weekday"),
    pl.col("timestamp").dt.quarter().alias("quarter"),
    
    # Business logic
    pl.col("timestamp").dt.weekday().is_in([6, 7]).alias("is_weekend"),
    
    # Date arithmetic
    pl.col("timestamp").dt.offset_by("7d").alias("next_week"),
    pl.col("timestamp").dt.offset_by("-1mo").alias("last_month"),
    
    # Truncate to periods
    pl.col("timestamp").dt.truncate("1mo").alias("month_start"),
    pl.col("timestamp").dt.truncate("1w").alias("week_start")
])

print(time_features.head())
```

### Rolling Time Windows

```python
# Rolling calculations over time
df = pl.DataFrame({
    "date": pl.date_range(date(2024, 1, 1), date(2024, 1, 31), "1d"),
    "value": range(31)
})

# Time-based rolling operations
rolling_stats = df.with_columns([
    # 7-day rolling average
    pl.col("value").rolling_mean(window_size="7d", by="date").alias("rolling_7d_avg"),
    
    # 14-day rolling sum
    pl.col("value").rolling_sum(window_size="14d", by="date").alias("rolling_14d_sum"),
    
    # Rolling standard deviation
    pl.col("value").rolling_std(window_size="7d", by="date").alias("rolling_7d_std")
])

print(rolling_stats.tail(10))
```

***

## List Columns: Nested Data Structures

One of Polars' most powerful features is native support for list columns, enabling complex nested operations without exploding data.

### Creating and Manipulating Lists

```python
# Data with list columns
df = pl.DataFrame({
    "user_id": [1, 2, 3],
    "scores": [[85, 92, 78], [90, 88], [95, 87, 91, 89]],
    "tags": [["python", "data"], ["rust", "performance"], ["analytics", "visualization", "python"]]
})

# List operations
list_ops = df.with_columns([
    # List statistics
    pl.col("scores").list.len().alias("num_scores"),
    pl.col("scores").list.mean().alias("avg_score"),
    pl.col("scores").list.max().alias("max_score"),
    
    # List filtering and transformation
    pl.col("scores").list.eval(pl.element() > 85).list.sum().alias("high_scores_count"),
    
    # String list operations
    pl.col("tags").list.len().alias("num_tags"),
    pl.col("tags").list.contains("python").alias("has_python_tag"),
    pl.col("tags").list.join(", ").alias("tags_string")
])

print(list_ops)
```

### Advanced List Processing

```python
# Complex list transformations
df = pl.DataFrame({
    "transactions": [
        [{"amount": 100, "type": "debit"}, {"amount": 50, "type": "credit"}],
        [{"amount": 200, "type": "debit"}, {"amount": 75, "type": "credit"}, {"amount": 25, "type": "debit"}],
        [{"amount": 150, "type": "credit"}]
    ]
})

# Process nested structures
processed = df.with_columns([
    # Extract amounts from nested dicts
    pl.col("transactions").list.eval(
        pl.element().struct.field("amount")
    ).alias("amounts"),
    
    # Filter by transaction type
    pl.col("transactions").list.eval(
        pl.when(pl.element().struct.field("type") == "debit")
        .then(pl.element().struct.field("amount"))
        .otherwise(None)
    ).list.drop_nulls().alias("debit_amounts"),
    
    # Calculate net balance
    pl.col("transactions").list.eval(
        pl.when(pl.element().struct.field("type") == "debit")
        .then(-pl.element().struct.field("amount"))
        .otherwise(pl.element().struct.field("amount"))
    ).list.sum().alias("net_balance")
])

print(processed)
```

***

## Complex Expressions: Combining Multiple Operations

Polars expressions can be combined in sophisticated ways to handle complex business logic.

### Multi-Step Transformations

```python
# E-commerce data processing
df = pl.DataFrame({
    "order_id": [1, 2, 3, 4, 5],
    "customer_email": ["alice@email.com", "BOB@EMAIL.COM", "charlie@email.com", "diana@email.com", "eve@email.com"],
    "items": [
        [{"name": "laptop", "price": 999, "qty": 1}],
        [{"name": "mouse", "price": 25, "qty": 2}, {"name": "keyboard", "price": 75, "qty": 1}],
        [{"name": "monitor", "price": 300, "qty": 1}, {"name": "cable", "price": 15, "qty": 3}],
        [{"name": "tablet", "price": 500, "qty": 1}],
        [{"name": "phone", "price": 800, "qty": 1}, {"name": "case", "price": 20, "qty": 1}]
    ]
})

# Complex business logic in one expression chain
processed_orders = df.with_columns([
    # Normalize customer email
    pl.col("customer_email").str.to_lowercase().alias("normalized_email"),
    
    # Calculate order total
    pl.col("items").list.eval(
        pl.element().struct.field("price") * pl.element().struct.field("qty")
    ).list.sum().alias("order_total"),
    
    # Extract item names
    pl.col("items").list.eval(
        pl.element().struct.field("name")
    ).list.join(", ").alias("item_names"),
    
    # Count unique items
    pl.col("items").list.len().alias("item_count"),
    
    # Categorize order size
    pl.when(pl.col("items").list.eval(
        pl.element().struct.field("price") * pl.element().struct.field("qty")
    ).list.sum() > 500)
    .then(pl.lit("large"))
    .when(pl.col("items").list.eval(
        pl.element().struct.field("price") * pl.element().struct.field("qty")
    ).list.sum() > 100)
    .then(pl.lit("medium"))
    .otherwise(pl.lit("small"))
    .alias("order_size")
])

print(processed_orders)
```

### Performance Comparison: Polars vs Pandas

```python
import time
import pandas as pd
import polars as pl

# Create test data
n_rows = 100_000
test_data = {
    "text": [f"user_{i}@example.com" for i in range(n_rows)],
    "numbers": [list(range(i, i+10)) for i in range(n_rows)],
    "dates": pl.date_range(date(2020, 1, 1), date(2024, 1, 1), "1d")[:n_rows]
}

# Pandas approach
pd_df = pd.DataFrame({
    "text": test_data["text"],
    "numbers": test_data["numbers"],
    "dates": test_data["dates"]
})

start_time = time.time()
pd_result = pd_df.assign(
    domain=pd_df["text"].str.extract(r"@(.+)"),
    avg_number=pd_df["numbers"].apply(lambda x: sum(x) / len(x)),
    year=pd_df["dates"].dt.year
)
pandas_time = time.time() - start_time

# Polars approach
pl_df = pl.DataFrame(test_data)

start_time = time.time()
pl_result = pl_df.with_columns([
    pl.col("text").str.extract(r"@(.+)").alias("domain"),
    pl.col("numbers").list.mean().alias("avg_number"),
    pl.col("dates").dt.year().alias("year")
])
polars_time = time.time() - start_time

print(f"Pandas time: {pandas_time:.3f}s")
print(f"Polars time: {polars_time:.3f}s")
print(f"Speedup: {pandas_time/polars_time:.1f}x")
```

***

## Best Practices for Complex Expressions

### 1. Use Expression Chaining Wisely

```python
# Good: Clear, readable chain
result = df.with_columns([
    pl.col("email")
    .str.to_lowercase()
    .str.strip_chars()
    .str.replace_all(r"\s+", "")
    .alias("clean_email")
])

# Avoid: Overly complex single expressions
# Break complex logic into multiple steps for readability
```

### 2. Leverage Lazy Evaluation

```python
# Build complex query lazily
query = (
    pl.scan_csv("large_dataset.csv")
    .filter(pl.col("status") == "active")
    .with_columns([
        pl.col("created_date").str.strptime(pl.Date, "%Y-%m-%d"),
        pl.col("tags").str.split(",").list.eval(pl.element().str.strip_chars())
    ])
    .filter(pl.col("created_date") > date(2024, 1, 1))
    .group_by("category")
    .agg([
        pl.col("value").sum(),
        pl.col("tags").list.concat().list.unique().list.len().alias("unique_tags")
    ])
)

# Execute when ready
result = query.collect()
```

### 3. Use Appropriate Data Types

```python
# Specify types for better performance
df = pl.DataFrame({
    "category": ["A", "B", "A", "C"],
    "value": [1.0, 2.0, 3.0, 4.0]
}).with_columns([
    pl.col("category").cast(pl.Categorical),  # Better for grouping
    pl.col("value").cast(pl.Float32)  # Smaller memory footprint
])
```

***

## What's Next

In the next part of this series, we'll explore:

- **Joins and Data Reshaping**: Combining datasets efficiently
- **Performance Optimization**: Memory management and streaming
- **Production Patterns**: Building robust data pipelines

The key takeaway from this session: **Polars' expression system is designed for composability and performance. Master the `.str`, `.dt`, and `.list` namespaces, and you'll handle 90% of real-world data transformation challenges.**

***

## Quick Reference: Advanced Operations

| Operation Type | Polars Expression | Use Case |
|:---|:---|:---|
| **String cleaning** | `pl.col("text").str.strip_chars().str.to_lowercase()` | Normalize text data |
| **Regex extraction** | `pl.col("text").str.extract(r"pattern")` | Parse structured strings |
| **Date parsing** | `pl.col("date_str").str.strptime(pl.Date, "%Y-%m-%d")` | Convert string to date |
| **List aggregation** | `pl.col("list_col").list.mean()` | Statistics on list elements |
| **Nested filtering** | `pl.col("list_col").list.eval(pl.element() > 5)` | Filter list elements |
| **Complex conditions** | `pl.when(condition).then(value).otherwise(default)` | Conditional logic |

Ready to master data joins and reshaping? Continue to [Part 3: Joins & Data Reshaping](../polars-03/) *(coming soon)*.