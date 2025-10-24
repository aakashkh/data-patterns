---
title: "Subsetting a dataframe in pandas"
date: 2019-01-05T00:00:00+00:00
lastmod: 2019-01-05T00:00:00+00:00
draft: false
images: []
categories: ["python"]
tags: ['pandas', 'python', 'filter', 'subset', 'data', 'iris']
weight: 100
toc: true
---

---
### Importing packages and datasets
```python
import pandas as pd
# Fetching data from url as csv by mentioning values of various paramters
data = pd.read_csv("https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data",
                   header = None,
                   index_col = False,
                   names = ['sepal_length','sepal_width','petal_length','petal_width','iris_class'])
# Unique classes of iris datasets
data.iris_class.unique()
```
>
 array(['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'], dtype=object)


### Subsetting

```python
data_setosa = data[data.iris_class == 'Iris-setosa']
data_versicolor = data[data.iris_class == 'Iris-versicolor']
data_virginica = data[data.iris_class == 'Iris-virginica']

'''
Now we can have a look at descriptive statistics summary for each of the subset and can make inference like following -
* Each of the subset is of same size i.e., 50
* Average Sepal and Petal Length is lowest in setosa and highest in virginica
'''
```



---

```python
data_setosa.describe().T
```

| Metric | count | mean | std | min | 25% | 50% | 75% | max |
|--------|-------|------|-----|-----|-----|-----|-----|-----|
| sepal_length | 50.0 | 5.006 | 0.352490 | 4.3 | 4.800 | 5.0 | 5.200 | 5.8 |
| sepal_width | 50.0 | 3.418 | 0.381024 | 2.3 | 3.125 | 3.4 | 3.675 | 4.4 |
| petal_length | 50.0 | 1.464 | 0.173511 | 1.0 | 1.400 | 1.5 | 1.575 | 1.9 |
| petal_width | 50.0 | 0.244 | 0.107210 | 0.1 | 0.200 | 0.2 | 0.300 | 0.6 |
---

```python
data_versicolor.describe().T
```

| Metric | count | mean | std | min | 25% | 50% | 75% | max |
|--------|-------|------|-----|-----|-----|-----|-----|-----|
| sepal_length | 50.0 | 5.936 | 0.516171 | 4.9 | 5.600 | 5.90 | 6.3 | 7.0 |
| sepal_width | 50.0 | 2.770 | 0.313798 | 2.0 | 2.525 | 2.80 | 3.0 | 3.4 |
| petal_length | 50.0 | 4.260 | 0.469911 | 3.0 | 4.000 | 4.35 | 4.6 | 5.1 |
| petal_width | 50.0 | 1.326 | 0.197753 | 1.0 | 1.200 | 1.30 | 1.5 | 1.8 |
---

```python
data_virginica.describe().T
```

| Metric | count | mean | std | min | 25% | 50% | 75% | max |
|--------|-------|------|-----|-----|-----|-----|-----|-----|
| sepal_length | 50.0 | 6.588 | 0.635880 | 4.9 | 6.225 | 6.50 | 6.900 | 7.9 |
| sepal_width | 50.0 | 2.974 | 0.322497 | 2.2 | 2.800 | 3.00 | 3.175 | 3.8 |
| petal_length | 50.0 | 5.552 | 0.551895 | 4.5 | 5.100 | 5.55 | 5.875 | 6.9 |
| petal_width | 50.0 | 2.026 | 0.274650 | 1.4 | 1.800 | 2.00 | 2.300 | 2.5 |
---

