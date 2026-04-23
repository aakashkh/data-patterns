---
title: "Pandas 101: Data Manipulation in Python"
date: 2025-11-27T12:00:00+05:30
description: "A comprehensive introduction to the Pandas library for data analysis and manipulation in Python."
categories: ["Python", "Data Science"]
tags: ["pandas", "python", "dataframe", "analysis"]
toc: true
draft: false
series: "pandas"
weight: 1
---

# Pandas 101: Data Manipulation in Python

Pandas is the most popular Python library for data manipulation and analysis. It provides high-performance, easy-to-use data structures and data analysis tools.

## Core Data Structures

### Series

A one-dimensional labeled array capable of holding any data type.

```python
import pandas as pd

s = pd.Series([1, 3, 5, np.nan, 6, 8])
print(s)
```

### DataFrame

A two-dimensional labeled data structure with columns of potentially different types.

```python
df = pd.DataFrame({
    'A': 1.,
    'B': pd.Timestamp('20230102'),
    'C': pd.Series(1, index=list(range(4)), dtype='float32'),
    'D': np.array([3] * 4, dtype='int32'),
    'E': pd.Categorical(["test", "train", "test", "train"]),
    'F': 'foo'
})
print(df)
```

## Essential Operations

### Viewing Data

```python
df.head()
df.tail()
df.index
df.columns
df.describe()
```

### Selection

```python
# Select a single column
df['A']

# Select via slice
df[0:3]

# Select by label
df.loc[:, ['A', 'B']]
```

## loc vs iloc

Both are used to select rows and columns, but they differ in how they reference data:

- `loc` — **label-based**: uses row/column names
- `iloc` — **integer-based**: uses 0-based positions

| Feature | `loc` | `iloc` |
|---|---|---|
| Indexing type | Label-based | Integer-based |
| End of slice | Inclusive | Exclusive |
| Use when | Labels are meaningful | Position/order matters |

### Setup

```python
import pandas as pd

data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age':  [25, 30, 35, 40],
    'City': ['New York', 'London', 'Paris', 'Tokyo']
}
df = pd.DataFrame(data, index=['a', 'b', 'c', 'd'])
```

### loc — Label-Based

```python
# Single row by label
df.loc['b']

# Specific cell
df.loc['c', 'Age']          # 35

# Range of rows — inclusive of end label
df.loc['a':'c']             # rows a, b, c

# Specific rows and columns
df.loc[['b', 'd'], ['Name', 'City']]

# Boolean condition
df.loc[df['Age'] > 28]
```

### iloc — Integer-Based

```python
# Single row by position
df.iloc[1]                  # second row

# Specific cell
df.iloc[2, 1]               # row 2, col 1 → 35

# Range of rows — exclusive of end
df.iloc[0:3]                # rows 0, 1, 2 (not 3)

# Specific rows and columns by position
df.iloc[0:2, [0, 2]]        # first 2 rows, cols 0 and 2

# Last N rows
df.iloc[-2:]                # last 2 rows
```

### Common Pitfalls

- `df.loc['z']` raises `KeyError` if label doesn't exist
- `df.iloc[10]` raises `IndexError` if DataFrame has fewer than 11 rows
- `loc['a':'c']` includes `c`; `iloc[0:3]` excludes index 3 — easy to mix up

### Missing Data

Pandas primarily uses the value `np.nan` to represent missing data.

```python
# Drop rows with missing data
df.dropna(how='any')

# Fill missing data
df.fillna(value=5)
```

Pandas is an essential tool in any data scientist's or data engineer's toolkit.
