---
title: "Read data into pandas"
date: 2018-12-23T00:00:00+00:00
lastmod: 2018-12-23T00:00:00+00:00
draft: false
images: []
categories: ["python"]
tags: ['pandas', 'python', 'column names', 'data', 'csv', 'read']
weight: 100
toc: true
---

---
#### Provide column names while reading a dataset in pandas  

```python
# Import the required modules
import pandas as pd
```
Reading the dataset using read.csv() function with mentioning column names in names parameters.
```python
#Fetching data from url as csv by mentioning values of various paramters
data = pd.read_csv("https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data",
                   header = None,
                   index_col = False,
                   names = ['sepal_length','sepal_width','petal_length','petal_width','iris_class'])
```


Returing the first 10 rows of the dataset using head() function
```python
# Displaying the first ten rows of the data
data.head(n=10)
```
<table >
  <thead>
    <tr>
      <th></th>
      <th>sepal_length</th>
      <th>sepal_width</th>
      <th>petal_length</th>
      <th>petal_width</th>
      <th>irsi_class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>5.1</td>
      <td>3.5</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>1</th>
      <td>4.9</td>
      <td>3.0</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>2</th>
      <td>4.7</td>
      <td>3.2</td>
      <td>1.3</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4.6</td>
      <td>3.1</td>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5.0</td>
      <td>3.6</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
  </tbody>
</table>
---

