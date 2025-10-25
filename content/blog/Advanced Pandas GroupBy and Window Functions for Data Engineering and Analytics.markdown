# Advanced Pandas GroupBy and Window Functions for Data Engineering and Analytics

## Session Outline: Advanced GroupBy and Window Functions in Pandas

### 1. Introduction to GroupBy and Its Role in Data Engineering (5 minutes)
   - **Overview**: Recap of `GroupBy` as a **split-apply-combine** paradigm, as defined by Wes McKinney in *Python for Data Analysis*.
   - **Data Engineering Context**: Why `GroupBy` is critical for ETL pipelines, data aggregation, and analytics workflows.
   - **Key Insight from Experts**:
     - Wes McKinney emphasizes `GroupBy` for flexible data aggregation and transformation.
     - Matt Harrison advocates for chaining operations and leveraging `GroupBy` for concise, readable code (*Effective Pandas*).
   - Use cases:
     - Aggregating transactional data for reporting.
     - Feature engineering for machine learning.
     - Time-series analysis and cohort analysis.

### 2. Core GroupBy Operations and Best Practices (10 minutes)
   - Basic syntax: `df.groupby('column')`
   - Aggregation functions: `mean()`, `sum()`, `count()`, `min()`, `max()`, `std()`.
   - Grouping by single/multiple columns, index levels, and functions.
   - **Best Practices** (Matt Harrison):
     - Use `as_index=False` for cleaner outputs.
     - Chain operations to avoid intermediate dataframes.
     - Leverage `namedagg` for readable multi-aggregation results.

### 3. Advanced GroupBy Techniques for Data Engineering (15 minutes)
   - **Multi-level aggregations**: Using `agg()` with dictionaries and custom functions.
   - **Transformations for feature engineering**: Normalizing data, filling missing values, and computing group-based statistics.
   - **Filtering for data quality**: Dropping groups based on conditions (e.g., low record count or outliers).
   - **Custom aggregations**: Writing reusable, performant custom functions with `apply()` or `agg()`.
   - **Handling large datasets**:
     - Using `chunksize` for out-of-memory processing (Wes McKinney’s approach).
     - Leveraging `dask` or `modin` for distributed `GroupBy`.
   - **Pivot tables and reshaping**: Advanced pivot tables for cross-sectional analysis.

### 4. Window Functions for Advanced Analytics (10 minutes)
   - **Overview**: Window functions as SQL-like operations (`OVER(PARTITION BY ... ORDER BY ...)`) for row-level computations within groups.
   - Key functions:
     - `row_number()`, `rank()`, `dense_rank()` for ranking.
     - `shift()` for `LAG`/`LEAD`.
     - `cumsum()`, `cummin()`, `cummax()` for cumulative metrics.
     - `rolling()` and `expanding()` for time-series analysis.
   - **Use Cases**:
     - Cohort analysis (e.g., user retention).
     - Time-series feature engineering (e.g., moving averages).
     - Ranking and outlier detection within groups.

### 5. Performance Optimization and Scalability (10 minutes)
   - **Performance Tips** (Wes McKinney):
     - Use `categorical` dtypes for grouping columns to reduce memory usage.
     - Avoid `apply()` when built-in aggregations suffice.
     - Use `numpy` operations within `agg()` for speed.
   - **Scalability**:
     - Processing large datasets with chunking or `dask`.
     - Parallelizing `GroupBy` operations for big data.
   - **Profiling**: Using `pandas` profiling or `line_profiler` to identify bottlenecks.

### 6. Practical Code Walkthrough (25 minutes)
   - Demonstrate advanced `GroupBy` and window function operations on a sample dataset.
   - Highlight real-world applications with production-ready code.

### 7. Q&A and Hands-On Practice (10 minutes)
   - Address audience questions.
   - Provide exercises for attendees to apply advanced `GroupBy` and window functions.

---

## Code Walkthrough: Advanced GroupBy and Window Functions in Pandas

### Setup
We’ll use a larger, more complex dataset simulating e-commerce sales data, including `Region`, `Product`, `Sales`, `Date`, and `Customer_ID`. This dataset is designed to showcase advanced techniques and scalability.

```python
import pandas as pd
import numpy as np
from uuid import uuid4

# Create sample dataset
np.random.seed(42)
dates = pd.date_range('2023-01-01', '2023-12-31', freq='D')
regions = ['North', 'South', 'East', 'West']
products = ['Laptop', 'Phone', 'Tablet']
customers = [str(uuid4())[:8] for _ in range(100)]

data = {
    'Region': np.random.choice(regions, size=1000),
    'Product': np.random.choice(products, size=1000),
    'Sales': np.random.randint(500, 1500, size=1000),
    'Date': np.random.choice(dates, size=1000),
    'Customer_ID': np.random.choice(customers, size=1000)
}
df = pd.DataFrame(data)
df['Region'] = df['Region'].astype('category')  # Optimize memory
df['Date'] = pd.to_datetime(df['Date'])
print("Sample Dataset (first 5 rows):")
print(df.head())
```

**Output** (sample, actual output varies due to randomness):
```
   Region Product  Sales       Date Customer_ID
0   West  Tablet   1282 2023-07-25  a1b2c3d4
1   East   Phone    914 2023-03-12  e5f6g7h8
2  South  Laptop   1056 2023-11-01  i9j0k1l2
3  North  Tablet    732 2023-05-19  m3n4o5p6
4   West   Phone   1198 2023-09-07  q7r8s9t0
```

### 1. Core GroupBy Operations with Best Practices
Group by `Region` and `Product`, calculating multiple aggregations with `namedagg` for clarity (Matt Harrison’s recommendation).

```python
# Multi-aggregation with named columns
agg_result = df.groupby(['Region', 'Product'], as_index=False).agg(
    Total_Sales=('Sales', 'sum'),
    Average_Sales=('Sales', 'mean'),
    Record_Count=('Sales', 'count')
)
print("\nAggregations by Region and Product:")
print(agg_result.head())
```

**Output** (sample):
```
   Region Product  Total_Sales  Average_Sales  Record_Count
0   East  Laptop       23500       1050.0           22
1   East   Phone       21000        950.0           23
2   East  Tablet       19800       1100.0           18
3  North  Laptop       24500       1020.0           24
4  North   Phone       22000        980.0           22
```

### 2. Advanced GroupBy: Custom Aggregations
Use a custom function to calculate the coefficient of variation (std/mean) for sales within each group.

```python
# Custom function for coefficient of variation
def coef_variation(x):
    return np.std(x) / np.mean(x)

custom_agg = df.groupby('Region')['Sales'].agg(
    Coefficient_of_Variation=coef_variation,
    Total_Sales='sum'
)
print("\nCustom Aggregation (Coefficient of Variation):")
print(custom_agg)
```

**Output** (sample):
```
       Coefficient_of_Variation  Total_Sales
Region                                    
East                   0.3214        64300
North                  0.2987        67800
South                  0.3102        65500
West                   0.3345        62000
```

### 3. Transformation for Feature Engineering
Compute the percentage of total sales within each `Region` for each row (useful for feature engineering).

```python
# Percentage of total sales within Region
df['Sales_Pct'] = df.groupby('Region')['Sales'].transform(lambda x: x / x.sum() * 100)
print("\nDataset with Sales Percentage by Region:")
print(df[['Region', 'Sales', 'Sales_Pct']].head())
```

**Output** (sample):
```
   Region  Sales  Sales_Pct
0   West   1282     2.065
1   East    914     1.422
2  South   1056     1.612
3  North    732     1.080
4   West   1198     1.932
```

### 4. Filtering for Data Quality
Filter out regions with fewer than 200 records to ensure statistical significance.

```python
# Filter groups with at least 200 records
filtered_groups = df.groupby('Region').filter(lambda x: len(x) >= 200)
print("\nRegions with >= 200 Records:")
print(filtered_groups.groupby('Region').size())
```

**Output** (sample):
```
Region
East     250
North    260
South    245
West     245
dtype: int64
```

### 5. Window Functions for Advanced Analytics
#### a. Row Number and Rank
Assign row numbers and ranks within each `Region` based on `Sales`.

```python
# Row number and rank within Region, ordered by Sales
df = df.sort_values(['Region', 'Sales'], ascending=[True, False])
df['Row_Number'] = df.groupby('Region')['Sales'].rank(method='first', ascending=False)
df['Sales_Rank'] = df.groupby('Region')['Sales'].rank(method='min', ascending=False)
print("\nDataset with Row Number and Rank:")
print(df[['Region', 'Sales', 'Row_Number', 'Sales_Rank']].head())
```

**Output** (sample):
```
   Region  Sales  Row_Number  Sales_Rank
10   East   സ0.0        1.0         1.0
15   East   1450        2.0         2.0
20  North   1480        1.0         1.0
25  North   1430        2.0         2.0
30  South   1475        1.0         1.0
```

#### b. Lag and Lead
Calculate the previous and next sales values within each `Region`, ordered by `Date`.

```python
# Lag and Lead Sales within Region
df = df.sort_values(['Region', 'Date'])
df['Previous_Sales'] = df.groupby('Region')['Sales'].shift(1)
df['Next_Sales'] = df.groupby('Region')['Sales'].shift(-1)
print("\nDataset with Lag and Lead Sales:")
print(df[['Region', 'Date', 'Sales', 'Previous_Sales', 'Next_Sales']].head())
```

**Output** (sample):
```
   Region       Date  Sales  Previous_Sales  Next_Sales
0   East 2023-01-02   1200             NaN      1100.0
1   East 2023-01-03   1100          1200.0      1300.0
2  North 2023-01-01   1000             NaN       900.0
3  North 2023-01-04    900          1000.0      1400.0
4  South 2023-01-01   1150             NaN      1050.0
```

#### c. Rolling and Expanding Windows
Calculate a 3-day moving average and cumulative sum of sales within each `Region`.

```python
# 3-day moving average and cumulative sum
df['Moving_Avg_Sales'] = df.groupby('Region')['Sales'].rolling(window=3, min_periods=1).mean().reset_index(drop=True)
df['Cumulative_Sales'] = df.groupby('Region')['Sales'].cumsum()
print("\nDataset with Moving Average and Cumulative Sales:")
print(df[['Region', 'Date', 'Sales', 'Moving_Avg_Sales', 'Cumulative_Sales']].head())
```

**Output** (sample):
```
   Region       Date  Sales  Moving_Avg_Sales  Cumulative_Sales
0   East 2023-01-02   1200         1200.000            1200
1   East 2023-01-03   1100         1150.000            2300
2  North 2023-01-01   1000         1000.000            1000
3  North 2023-01-04    900          950.000            1900
4  South 2023-01-01   1150         1150.000            1150
```

### 6. Handling Large Datasets
Process the dataset in chunks to simulate handling large data (Wes McKinney’s approach).

```python
# Chunked GroupBy for large datasets
chunk_size = 200
result = []
for chunk in pd.read_csv('large_dataset.csv', chunksize=chunk_size):  # Simulate large dataset
    chunk_result = chunk.groupby('Region')['Sales'].sum()
    result.append(chunk_result)
final_result = pd.concat(result).groupby(level=0).sum()
print("\nChunked GroupBy Result:")
print(final_result)
```

**Note**: Replace `'large_dataset.csv'` with the actual dataset file for real-world use.

### 7. Integration with Dask for Scalability
Use `dask` for distributed `GroupBy` operations on large datasets.

```python
import dask.dataframe as dd

# Convert pandas DataFrame to Dask DataFrame
ddf = dd.from_pandas(df, npartitions=4)
dask_result = ddf.groupby('Region')['Sales'].sum().compute()
print("\nDask GroupBy Result:")
print(dask_result)
```

**Output** (sample):
```
Region
East     64300
North    67800
South    65500
West     62000
Name: Sales, dtype: int64
```

### 8. Advanced Pivot Tables
Create a pivot table with multiple aggregations and marginal totals.

```python
# Advanced pivot table with multiple aggregations
pivot_table = df.pivot_table(
    values='Sales',
    index='Region',
    columns='Product',
    aggfunc=['sum', 'mean'],
    fill_value=0,
    margins=True
)
print("\nAdvanced Pivot Table:")
print(pivot_table)
```

**Output** (sample):
```
           sum                          mean                         
Product Laptop Phone Tablet   All   Laptop   Phone  Tablet      All
Region                                                             
East    23500 21000  19800 64300 1050.0  950.0 1100.0  1017.46
North   24500 22000  21300 67800 1020.0  980.0 1050.0  1011.94
South   24000 21500  20000 65500 1080.0  970.0 1020.0  1007.69
West    23000 21000  18000 62000 1040.0  960.0 1000.0  1008.13
All     95000 85500  79100 259600 1047.5  966.0 1042.5  1011.31
```

---

## Notes for the Session
- **Expert Insights**:
  - Wes McKinney (*Python for Data Analysis*): Optimize `GroupBy` by using efficient dtypes (e.g., `category`) and avoiding unnecessary `apply()` calls.
  - Matt Harrison (*Effective Pandas*): Chain operations, use `namedagg`, and profile code to ensure readability and performance.
- **Performance Tips**:
  - Convert grouping columns to `category` dtype for memory efficiency.
  - Use `numpy` for aggregations when possible (e.g., `np.sum` instead of `sum()`).
  - For large datasets, consider `dask` or chunking to avoid memory issues.
- **Analytics Applications**:
  - Use window functions for cohort analysis, time-series features, or ranking tasks.
  - Combine `GroupBy` with `pivot_table` for executive dashboards.
- **Visualization**: Plot moving averages or cumulative sales using `seaborn` or `matplotlib` for better insights.
- **Exercise Ideas**:
  - Compute customer-level metrics (e.g., total sales per customer).
  - Create a cohort analysis to track sales trends over time by region.
  - Optimize a slow `GroupBy` operation using profiling tools.