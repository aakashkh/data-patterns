---
title: "Subsetting a DataFrame in Pandas"
description: "Learn different techniques to filter and subset pandas DataFrames efficiently"
lead: "Master the art of data filtering with practical examples using the Iris dataset"
date: 2019-01-05T00:00:00+00:00
lastmod: 2019-01-05T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "python"
weight: 100
toc: true
---

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
# Filter with multiple conditions
large_setosa = data[(data.iris_class == 'Iris-setosa') & (data.sepal_length > 5.0)]

# Using query method (more readable)
large_setosa_query = data.query("iris_class == 'Iris-setosa' and sepal_length > 5.0")
```

### Performance Tips

1. **Use vectorized operations** instead of loops
2. **Chain conditions** with `&` and `|` operators
3. **Use `.query()`** for complex conditions (more readable)
4. **Consider `.loc[]`** for label-based indexing

## Related Patterns

- Data Loading Patterns (coming soon)
- Indexing and Sorting (coming soon)
- Join Operations (coming soon)