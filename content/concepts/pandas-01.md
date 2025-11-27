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

### Missing Data

Pandas primarily uses the value `np.nan` to represent missing data.

```python
# Drop rows with missing data
df.dropna(how='any')

# Fill missing data
df.fillna(value=5)
```

Pandas is an essential tool in any data scientist's or data engineer's toolkit.
