---
title: "Subsetting a DataFrame in Pandas"
description: "Learn different techniques to filter and subset pandas DataFrames efficiently"
date: 2019-01-05T00:00:00+00:00
categories: ["Python", "Data Engineering"]
tags: ["pandas", "dataframes", "filtering", "subset", "indexing"]
toc: true
draft: false
series: "pandas"
weight: 2
---

# Subsetting a DataFrame in Pandas

Master the art of data filtering with practical examples using the Iris dataset. Learn different techniques to filter and subset pandas DataFrames efficiently for better data analysis workflows.

## Importing Packages and Datasets

```python
import pandas as pd

# Fetching data from URL as CSV by mentioning values of various parameters
data = pd.read_csv("https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data",
                   header=None,
                   index_col=False,
                   names=['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'iris_class'])

# Unique classes of iris datasets
data.iris_class.unique()
```

Output:
```
array(['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'], dtype=object)
```

## Subsetting Techniques

### Basic Filtering

```python
data_setosa = data[data.iris_class == 'Iris-setosa']
data_versicolor = data[data.iris_class == 'Iris-versicolor']
data_virginica = data[data.iris_class == 'Iris-virginica']
```

### Key Insights

Now we can look at descriptive statistics summary for each subset and make inferences:

- Each subset is of the same size (50 records)
- Average Sepal and Petal Length is lowest in setosa and highest in virginica
- This demonstrates clear species differentiation in the dataset

## Descriptive Statistics

### Iris Setosa

```python
data_setosa.describe().T
```

| Metric | count | mean | std | min | 25% | 50% | 75% | max |
|--------|-------|------|-----|-----|-----|-----|-----|-----|
| sepal_length | 50.0 | 5.006 | 0.352490 | 4.3 | 4.800 | 5.0 | 5.200 | 5.8 |
| sepal_width | 50.0 | 3.418 | 0.381024 | 2.3 | 3.125 | 3.4 | 3.675 | 4.4 |
| petal_length | 50.0 | 1.464 | 0.173511 | 1.0 | 1.400 | 1.5 | 1.575 | 1.9 |
| petal_width | 50.0 | 0.244 | 0.107210 | 0.1 | 0.200 | 0.2 | 0.300 | 0.6 |

### Iris Versicolor

```python
data_versicolor.describe().T
```

| Metric | count | mean | std | min | 25% | 50% | 75% | max |
|--------|-------|------|-----|-----|-----|-----|-----|-----|
| sepal_length | 50.0 | 5.936 | 0.516171 | 4.9 | 5.600 | 5.90 | 6.3 | 7.0 |
| sepal_width | 50.0 | 2.770 | 0.313798 | 2.0 | 2.525 | 2.80 | 3.0 | 3.4 |
| petal_length | 50.0 | 4.260 | 0.469911 | 3.0 | 4.000 | 4.35 | 4.6 | 5.1 |
| petal_width | 50.0 | 1.326 | 0.197753 | 1.0 | 1.200 | 1.30 | 1.5 | 1.8 |

### Iris Virginica

```python
data_virginica.describe().T
```

| Metric | count | mean | std | min | 25% | 50% | 75% | max |
|--------|-------|------|-----|-----|-----|-----|-----|-----|
| sepal_length | 50.0 | 6.588 | 0.635880 | 4.9 | 6.225 | 6.50 | 6.900 | 7.9 |
| sepal_width | 50.0 | 2.974 | 0.322497 | 2.2 | 2.800 | 3.00 | 3.175 | 3.8 |
| petal_length | 50.0 | 5.552 | 0.551895 | 4.5 | 5.100 | 5.55 | 5.875 | 6.9 |
| petal_width | 50.0 | 2.026 | 0.274650 | 1.4 | 1.800 | 2.00 | 2.300 | 2.5 |

## Advanced Filtering Patterns

### Multiple Conditions

```python
# Filter with multiple conditions using boolean operators
large_setosa = data[(data.iris_class == 'Iris-setosa') & (data.sepal_length > 5.0)]

# Using query method (more readable for complex conditions)
large_setosa_query = data.query("iris_class == 'Iris-setosa' and sepal_length > 5.0")

# Multiple OR conditions
large_flowers = data[(data.sepal_length > 6.5) | (data.petal_length > 5.0)]
```

### Using .loc and .iloc for Advanced Selection

```python
# Label-based selection with .loc
setosa_sepal_data = data.loc[data.iris_class == 'Iris-setosa', ['sepal_length', 'sepal_width']]

# Position-based selection with .iloc
first_10_rows = data.iloc[:10, :]

# Combining boolean indexing with .loc
large_petals = data.loc[(data.petal_length > 4.0) & (data.petal_width > 1.5)]
```

### String-based Filtering

```python
# Filter by string patterns
setosa_variants = data[data.iris_class.str.contains('setosa')]

# Case-insensitive filtering
setosa_case_insensitive = data[data.iris_class.str.lower().str.contains('setosa')]

# Filter by string length
long_names = data[data.iris_class.str.len() > 12]
```

### Numerical Range Filtering

```python
# Filter by numerical ranges
medium_sepal_length = data[data.sepal_length.between(5.0, 6.0)]

# Using quantiles for filtering
q75 = data.sepal_length.quantile(0.75)
top_quartile = data[data.sepal_length >= q75]

# Filter outliers using IQR method
Q1 = data.sepal_length.quantile(0.25)
Q3 = data.sepal_length.quantile(0.75)
IQR = Q3 - Q1
outliers = data[(data.sepal_length < (Q1 - 1.5 * IQR)) | 
                (data.sepal_length > (Q3 + 1.5 * IQR))]
```

## Performance Tips and Best Practices

### 1. Use Vectorized Operations

```python
# Good: Vectorized operation
filtered_data = data[data.sepal_length > 5.0]

# Avoid: Loop-based filtering (slow)
# filtered_rows = []
# for idx, row in data.iterrows():
#     if row['sepal_length'] > 5.0:
#         filtered_rows.append(row)
```

### 2. Chain Conditions Efficiently

```python
# Efficient chaining with parentheses
complex_filter = data[
    (data.iris_class == 'Iris-setosa') & 
    (data.sepal_length > 5.0) & 
    (data.petal_width < 0.3)
]

# Use query() for very complex conditions
complex_query = data.query(
    "iris_class == 'Iris-setosa' and sepal_length > 5.0 and petal_width < 0.3"
)
```

### 3. Memory-Efficient Filtering

```python
# For large datasets, consider using categorical data types
data_categorical = data.copy()
data_categorical['iris_class'] = data_categorical['iris_class'].astype('category')

# This reduces memory usage for string columns with repeated values
print(f"Original memory usage: {data.memory_usage(deep=True).sum()} bytes")
print(f"Categorical memory usage: {data_categorical.memory_usage(deep=True).sum()} bytes")
```

### 4. Index-based Filtering for Performance

```python
# Set index for faster filtering on frequently used columns
data_indexed = data.set_index('iris_class')

# Now filtering by iris_class is much faster
setosa_indexed = data_indexed.loc['Iris-setosa']
```

## Common Filtering Patterns

### Filter by Multiple Values

```python
# Filter by multiple specific values
species_of_interest = ['Iris-setosa', 'Iris-virginica']
filtered_species = data[data.iris_class.isin(species_of_interest)]

# Exclude specific values
not_versicolor = data[~data.iris_class.isin(['Iris-versicolor'])]
```

### Filter by Missing Values

```python
# Filter rows with missing values
has_missing = data[data.isnull().any(axis=1)]

# Filter rows without missing values
complete_rows = data[data.notnull().all(axis=1)]

# Filter specific column for missing values
missing_sepal_length = data[data.sepal_length.isnull()]
```

### Conditional Replacement During Filtering

```python
# Create filtered copy with conditional modifications
filtered_modified = data[data.iris_class == 'Iris-setosa'].copy()
filtered_modified.loc[filtered_modified.sepal_length > 5.0, 'size_category'] = 'large'
filtered_modified.loc[filtered_modified.sepal_length <= 5.0, 'size_category'] = 'small'
```

## Quick Reference: Filtering Cheat Sheet

| Operation | Syntax | Use Case |
|:---|:---|:---|
| **Single condition** | `df[df['col'] > value]` | Basic filtering |
| **Multiple AND conditions** | `df[(df['col1'] > val1) & (df['col2'] < val2)]` | Complex filtering |
| **Multiple OR conditions** | `df[(df['col1'] > val1) \| (df['col2'] < val2)]` | Alternative conditions |
| **String contains** | `df[df['col'].str.contains('pattern')]` | Text pattern matching |
| **Value in list** | `df[df['col'].isin([val1, val2])]` | Multiple value matching |
| **Between values** | `df[df['col'].between(min_val, max_val)]` | Range filtering |
| **Query method** | `df.query("col > value and col2 < value2")` | Readable complex conditions |
| **Label-based** | `df.loc[condition, columns]` | Specific rows and columns |

## Related Patterns

This subsetting technique is fundamental to many other pandas operations:

- **Data Loading Patterns** - Filter data during or after loading
- **Indexing and Sorting** - Combine with sorting for ordered subsets  
- **Join Operations** - Filter before joins for better performance
- **Groupby Operations** - Subset data before grouping for targeted analysis

Master these filtering patterns and you'll handle 90% of data subsetting challenges efficiently!