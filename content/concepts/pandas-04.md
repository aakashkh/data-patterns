---
title: "Advanced pandas GroupBy and Window Functions"
date: 2025-11-29T12:00:00+05:30
description: "A deep dive into every GroupBy method — agg, transform, filter, apply, cumulative ops, window functions, pivot tables — with a retail dataset and two real-world problem/solution walkthroughs."
categories: ["Python", "Data Science"]
tags: ["pandas", "python", "dataframe", "groupby", "window-functions", "transform", "aggregations", "performance"]
toc: true
draft: false
series: "pandas"
weight: 4
---

# Advanced pandas GroupBy and Window Functions

## Dataset Setup

All examples use a retail sales dataset with transactions across stores, regions, and product categories.

```python
import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range('2024-01-01', '2025-06-18', freq='D')
n = 10000
data = {
    'store_id': np.random.choice([f'S{i:03d}' for i in range(1, 21)], n),
    'region': np.random.choice(['North', 'South', 'East', 'West'], n),
    'product_category': np.random.choice(['Electronics', 'Clothing', 'Home', 'Books'], n),
    'sale_amount': np.random.normal(150, 50, n).clip(20, 1000).round(2),
    'transaction_date': np.random.choice(dates, n),
    'customer_id': np.random.choice([f'C{i:04d}' for i in range(1, 1001)], n)
}
df = pd.DataFrame(data)
df['region'] = df['region'].astype('category')   # memory optimization
df['year'] = df['transaction_date'].dt.year
df['month'] = df['transaction_date'].dt.month
```

---

## Part 1 — Core GroupBy Methods

### agg — Multiple Aggregations in One Pass

```python
# Named aggregations (clean column names, no MultiIndex)
region_stats = df.groupby('region', as_index=False).agg(
    total_sales   = ('sale_amount', 'sum'),
    avg_sale      = ('sale_amount', 'mean'),
    transactions  = ('sale_amount', 'count'),
    unique_customers = ('customer_id', pd.Series.nunique)
).round(2)
```

```python
# Different functions per column
stats = df.groupby('region').agg({
    'sale_amount': ['sum', 'mean', 'std'],
    'customer_id': pd.Series.nunique
}).round(2)
```

```python
# Custom aggregation function
def coef_variation(x):
    return (x.std() / x.mean()).round(4)

df.groupby('region')['sale_amount'].agg(
    cv=coef_variation,
    total='sum'
)
```

### transform — Broadcast Back to All Rows

Unlike `agg`, `transform` keeps the original DataFrame shape — every row gets the group-level result stamped on it.

```python
# % of each sale relative to its region's total
df['region_sale_pct'] = df.groupby('region')['sale_amount'].transform(
    lambda x: (x / x.sum() * 100).round(2)
)

# Z-score normalization within each region
df['sale_zscore'] = df.groupby('region')['sale_amount'].transform(
    lambda x: ((x - x.mean()) / x.std()).round(2)
)

# Fill missing values with group mean (common ETL pattern)
df['sale_amount'] = df.groupby('region')['sale_amount'].transform(
    lambda x: x.fillna(x.mean())
)
```

### filter — Drop Entire Groups

`filter` keeps or drops **whole groups** based on a condition — it never modifies individual rows.

```python
# Keep only regions with >= 200 transactions
df_filtered = df.groupby('region').filter(lambda g: len(g) >= 200)

# Keep stores with consistent sales (std < 30% of mean)
consistent = df.groupby('store_id').filter(
    lambda g: g['sale_amount'].std() < g['sale_amount'].mean() * 0.3
)

# Keep stores with above-average total sales within their region
def above_avg_in_region(group):
    region_avg = df[df['region'] == group['region'].iloc[0]].groupby('store_id')['sale_amount'].sum().mean()
    return group['sale_amount'].sum() > region_avg

high_perf = df.groupby(['region', 'store_id']).filter(above_avg_in_region)
```

### apply — Full Flexibility

Use `apply` when you need multi-column access, row position (`iloc`), or multiple new columns in one pass.

```python
# Top product category per store
def top_category(group):
    return pd.Series({
        'top_category':       group.groupby('product_category')['sale_amount'].sum().idxmax(),
        'top_category_sales': group.groupby('product_category')['sale_amount'].sum().max()
    })

store_top = df.groupby('store_id').apply(top_category).reset_index()

# Year-over-year growth per store
def yoy_growth(group):
    yearly = group.groupby('year')['sale_amount'].sum()
    pct = yearly.pct_change().mul(100).round(2)
    return pd.Series({
        '2024_yoy': pct.get(2024, np.nan),
        '2025_yoy': pct.get(2025, np.nan)
    })

growth = df.groupby('store_id').apply(yoy_growth).reset_index()
```

---

## Part 2 — Utility Methods

### size vs count

```python
df.groupby('region').size()           # rows per group (includes NaN)
df.groupby('region').count()          # non-null values per column
```

### first, last, nth, head, tail

```python
df.groupby('store_id').first()[['transaction_date', 'sale_amount']]   # first row per group
df.groupby('store_id').last()[['transaction_date', 'sale_amount']]    # last row per group
df.groupby('store_id').nth(1)                                          # second row per group
df.groupby('store_id').head(2)                                         # first 2 rows per group
df.groupby('store_id').tail(2)                                         # last 2 rows per group
```

### Cumulative Operations

```python
df['running_total']  = df.groupby('store_id')['sale_amount'].cumsum()
df['running_max']    = df.groupby('store_id')['sale_amount'].cummax()
df['running_count']  = df.groupby('store_id').cumcount() + 1
```

### shift — Lag / Lead within Group

```python
df = df.sort_values(['store_id', 'transaction_date'])
df['prev_sale']  = df.groupby('store_id')['sale_amount'].shift(1)   # LAG
df['next_sale']  = df.groupby('store_id')['sale_amount'].shift(-1)  # LEAD
df['sale_delta'] = df['sale_amount'] - df['prev_sale']
```

### ngroup — Assign Integer ID to Each Group

```python
df['region_id'] = df.groupby('region').ngroup()
```

### describe — Stats per Group

```python
df.groupby('region')['sale_amount'].describe().round(2)
```

---

## Part 3 — Window Functions

Window functions keep all rows and add a computed column — unlike `groupBy().agg()` which collapses rows.

### Ranking

```python
df = df.sort_values(['region', 'sale_amount'], ascending=[True, False])

# row_number equivalent — always unique
df['row_num'] = df.groupby('region')['sale_amount'].rank(method='first', ascending=False)

# rank() — ties share rank, gaps after
df['rank'] = df.groupby('region')['sale_amount'].rank(method='min', ascending=False)

# dense_rank() — ties share rank, no gaps
df['dense_rank'] = df.groupby('region')['sale_amount'].rank(method='dense', ascending=False)
```

| `method` | Ties behaviour |
|---|---|
| `first` | Always unique — row order tiebreak |
| `min` | Ties share rank; next rank skips (SQL `RANK()`) |
| `dense` | Ties share rank; no gaps (SQL `DENSE_RANK()`) |
| `average` | Ties get average rank |

### Lag and Lead

```python
df = df.sort_values(['region', 'transaction_date'])
df['prev_sale'] = df.groupby('region')['sale_amount'].shift(1)   # LAG(1)
df['next_sale'] = df.groupby('region')['sale_amount'].shift(-1)  # LEAD(1)
```

### Rolling (Moving) Windows

```python
df = df.sort_values(['region', 'transaction_date'])

# 3-period moving average within each region
df['moving_avg_3'] = (
    df.groupby('region')['sale_amount']
    .rolling(window=3, min_periods=1)
    .mean()
    .reset_index(drop=True)
)

# 7-period rolling sum
df['rolling_sum_7'] = (
    df.groupby('region')['sale_amount']
    .rolling(window=7, min_periods=1)
    .sum()
    .reset_index(drop=True)
)
```

### Expanding Windows

```python
# Cumulative mean from start up to current row
df['expanding_mean'] = (
    df.groupby('region')['sale_amount']
    .expanding()
    .mean()
    .reset_index(drop=True)
)
```

---

## Part 4 — Pivot Tables

```python
# Basic pivot
pivot = df.pivot_table(
    values='sale_amount',
    index='region',
    columns='product_category',
    aggfunc='sum',
    fill_value=0
)

# Multiple aggregations + marginal totals
pivot_full = df.pivot_table(
    values='sale_amount',
    index='region',
    columns='product_category',
    aggfunc=['sum', 'mean'],
    fill_value=0,
    margins=True       # adds "All" row and column
)
```

---

## Part 5 — Multi-Level Grouping

```python
# Sales by region and year
df.groupby(['region', 'year'])['sale_amount'].sum().round(2)

# Unstack to wide format
df.groupby(['region', 'year'])['sale_amount'].sum().unstack('year').round(2)
```

---

## Part 6 — Performance Tips

- Use `category` dtype for grouping columns — reduces memory and speeds up groupby.
- Prefer `agg` or `transform` over `apply` for simple operations — `apply` has Python overhead.
- Use `namedagg` syntax (`col=('source_col', 'func')`) for clean column names without MultiIndex.
- Avoid chaining multiple `groupby` calls on the same data — combine into one `agg` pass.

```python
# Memory-efficient grouping column
df['region'] = df['region'].astype('category')

# One pass instead of multiple groupbys
summary = df.groupby('store_id').agg(
    total   = ('sale_amount', 'sum'),
    avg     = ('sale_amount', 'mean'),
    count   = ('sale_amount', 'count'),
    std     = ('sale_amount', 'std'),
    first_dt = ('transaction_date', 'min'),
    last_dt  = ('transaction_date', 'max'),
)
```

---

## Part 7 — Practice Problems

### Problem 1: Top Salespersons by Region and Category

**Question:** You have a sales dataset with columns `region`, `product_category`, `salesperson`, `sale_amount`, `transaction_date`. Find salespersons who:
1. Are in regions where the average sale per product category exceeds $5000
2. Have at least 3 transactions above their region-category average
3. Return their region, category, qualifying transaction count, and average sale

```python
import pandas as pd
import numpy as np

np.random.seed(42)
data = {
    'region':           np.random.choice(['North', 'South', 'East', 'West'], 1000),
    'product_category': np.random.choice(['Electronics', 'Clothing', 'Furniture'], 1000),
    'salesperson':      np.random.choice(['Alice', 'Bob', 'Charlie', 'David', 'Eve'], 1000),
    'sale_amount':      np.random.normal(6000, 2000, 1000).astype(int),
    'transaction_date': pd.date_range(start='2024-01-01', end='2024-12-31', periods=1000)
}
df_p1 = pd.DataFrame(data)

def find_top_salespersons(df):
    # Step 1: region-category averages that exceed $5000
    rc_avgs = (
        df.groupby(['region', 'product_category'])['sale_amount']
        .mean()
        .reset_index()
    )
    rc_avgs = rc_avgs[rc_avgs['sale_amount'] > 5000]

    # Step 2: merge averages back, keep only qualifying region-category combos
    df_m = df.merge(
        rc_avgs[['region', 'product_category', 'sale_amount']],
        on=['region', 'product_category'],
        suffixes=('', '_avg')
    )

    # Step 3: keep rows where individual sale > group average
    df_above = df_m[df_m['sale_amount'] > df_m['sale_amount_avg']]

    # Step 4: count qualifying transactions per salesperson
    result = (
        df_above
        .groupby(['region', 'product_category', 'salesperson'])
        .agg(
            qualifying_transactions = ('sale_amount', 'count'),
            avg_sale_amount         = ('sale_amount', 'mean')
        )
        .reset_index()
    )
    result['avg_sale_amount'] = result['avg_sale_amount'].round(2)

    # Step 5: at least 3 qualifying transactions
    return (
        result[result['qualifying_transactions'] >= 3]
        .sort_values(['region', 'product_category', 'qualifying_transactions'],
                     ascending=[True, True, False])
    )

print(find_top_salespersons(df_p1))
```

---

### Problem 2: Comprehensive Store Analysis

**Question:** You manage a retail chain. Using `filter`, `agg`, `transform`, `apply`, and a custom YoY function:
1. Filter stores with above-average total sales per region
2. Among those, find stores with consistent sales (std < 30% of mean)
3. For consistent stores, compute YoY growth
4. Return a combined report with all metrics

```python
np.random.seed(123)
dates2 = pd.date_range('2023-01-01', '2025-06-18', freq='D')
n2 = 5000
data2 = {
    'store_id':         np.random.choice([f'S{i:03d}' for i in range(1, 21)], n2),
    'region':           np.random.choice(['North', 'South', 'East', 'West'], n2),
    'product_category': np.random.choice(['Electronics', 'Clothing', 'Home', 'Books'], n2),
    'sale_amount':      np.random.normal(100, 30, n2).clip(20, 500).round(2),
    'transaction_date': np.random.choice(dates2, n2),
    'customer_id':      np.random.choice([f'C{i:04d}' for i in range(1, 501)], n2)
}
df_p2 = pd.DataFrame(data2)
df_p2['year'] = df_p2['transaction_date'].dt.year

def comprehensive_store_analysis(df):
    # 1. filter: above-average total sales per region
    def above_avg(group):
        region_store_totals = (
            df[df['region'] == group['region'].iloc[0]]
            .groupby('store_id')['sale_amount'].sum()
        )
        return group['sale_amount'].sum() > region_store_totals.mean()

    high_perf = df.groupby(['region', 'store_id']).filter(above_avg)

    # 2. agg: store-level summary
    store_stats = (
        high_perf.groupby('store_id')
        .agg(
            total_sales      = ('sale_amount', 'sum'),
            avg_sale         = ('sale_amount', 'mean'),
            transaction_count= ('sale_amount', 'count'),
            unique_customers = ('customer_id', pd.Series.nunique)
        )
        .round(2)
    )

    # 3. transform: sale % of store total
    high_perf = high_perf.copy()
    high_perf['sale_pct'] = high_perf.groupby('store_id')['sale_amount'].transform(
        lambda x: (x / x.sum() * 100).round(2)
    )

    # 4. apply: top product category per store
    top_cats = (
        high_perf.groupby('store_id')
        .apply(lambda g: g.groupby('product_category')['sale_amount'].sum().idxmax())
        .reset_index(name='top_category')
    )

    # 5. filter: consistent stores (std < 30% of mean)
    consistent = high_perf.groupby('store_id').filter(
        lambda g: g['sale_amount'].std() < g['sale_amount'].mean() * 0.3
    )

    # 6. apply: YoY growth for consistent stores
    def yoy(group):
        yearly = group.groupby('year')['sale_amount'].sum()
        pct = yearly.pct_change().mul(100).round(2)
        return pd.Series({
            '2024_yoy': pct.get(2024, np.nan),
            '2025_yoy': pct.get(2025, np.nan)
        })

    yoy_df = consistent.groupby('store_id').apply(yoy).reset_index()

    # 7. combine
    report = (
        store_stats.reset_index()
        .merge(top_cats,  on='store_id', how='left')
        .merge(yoy_df,    on='store_id', how='left')
    )

    # 8. date range and active days
    date_range = (
        consistent.groupby('store_id')['transaction_date']
        .agg(first_dt='min', last_dt='max')
    )
    date_range['days_active'] = (date_range['last_dt'] - date_range['first_dt']).dt.days

    return report.merge(date_range[['days_active']], on='store_id', how='left')

print(comprehensive_store_analysis(df_p2))
```

---

## Quick Reference

| Method | Output shape | Use when |
|---|---|---|
| `agg` | One row per group | Summarizing / collapsing groups |
| `transform` | Same as input | Broadcasting group stat to every row |
| `filter` | Subset of input | Dropping entire groups on a condition |
| `apply` | Flexible | Complex multi-column logic, row position access |
| `cumsum/cummax` | Same as input | Running totals within group |
| `shift(n)` | Same as input | Lag/Lead within group |
| `rolling(n).mean()` | Same as input | Moving average within group |
| `rank(method=...)` | Same as input | Row number / rank within group |
| `pivot_table` | Wide format | Cross-sectional summary |
