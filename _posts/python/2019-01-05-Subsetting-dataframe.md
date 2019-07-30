---
layout : post
title : Subsetting a dataframe in pandas
categories: [python]
tags: [pandas, python, filter, subset, data, iris]
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
<!--break-->

<hr>
```python
data_setosa.describe().T
```
<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>count</th>
      <th>mean</th>
      <th>std</th>
      <th>min</th>
      <th>25%</th>
      <th>50%</th>
      <th>75%</th>
      <th>max</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>sepal_length</th>
      <td>50.0</td>
      <td>5.006</td>
      <td>0.352490</td>
      <td>4.3</td>
      <td>4.800</td>
      <td>5.0</td>
      <td>5.200</td>
      <td>5.8</td>
    </tr>
    <tr>
      <th>sepal_width</th>
      <td>50.0</td>
      <td>3.418</td>
      <td>0.381024</td>
      <td>2.3</td>
      <td>3.125</td>
      <td>3.4</td>
      <td>3.675</td>
      <td>4.4</td>
    </tr>
    <tr>
      <th>petal_length</th>
      <td>50.0</td>
      <td>1.464</td>
      <td>0.173511</td>
      <td>1.0</td>
      <td>1.400</td>
      <td>1.5</td>
      <td>1.575</td>
      <td>1.9</td>
    </tr>
    <tr>
      <th>petal_width</th>
      <td>50.0</td>
      <td>0.244</td>
      <td>0.107210</td>
      <td>0.1</td>
      <td>0.200</td>
      <td>0.2</td>
      <td>0.300</td>
      <td>0.6</td>
    </tr>
  </tbody>
</table>
</div>

<hr>
```python
data_versicolor.describe().T
```
<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered w-40">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>count</th>
      <th>mean</th>
      <th>std</th>
      <th>min</th>
      <th>25%</th>
      <th>50%</th>
      <th>75%</th>
      <th>max</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>sepal_length</th>
      <td>50.0</td>
      <td>5.936</td>
      <td>0.516171</td>
      <td>4.9</td>
      <td>5.600</td>
      <td>5.90</td>
      <td>6.3</td>
      <td>7.0</td>
    </tr>
    <tr>
      <th>sepal_width</th>
      <td>50.0</td>
      <td>2.770</td>
      <td>0.313798</td>
      <td>2.0</td>
      <td>2.525</td>
      <td>2.80</td>
      <td>3.0</td>
      <td>3.4</td>
    </tr>
    <tr>
      <th>petal_length</th>
      <td>50.0</td>
      <td>4.260</td>
      <td>0.469911</td>
      <td>3.0</td>
      <td>4.000</td>
      <td>4.35</td>
      <td>4.6</td>
      <td>5.1</td>
    </tr>
    <tr>
      <th>petal_width</th>
      <td>50.0</td>
      <td>1.326</td>
      <td>0.197753</td>
      <td>1.0</td>
      <td>1.200</td>
      <td>1.30</td>
      <td>1.5</td>
      <td>1.8</td>
    </tr>
  </tbody>
</table>
</div>
<hr>


```python
data_virginica.describe().T
```
<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>count</th>
      <th>mean</th>
      <th>std</th>
      <th>min</th>
      <th>25%</th>
      <th>50%</th>
      <th>75%</th>
      <th>max</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>sepal_length</th>
      <td>50.0</td>
      <td>6.588</td>
      <td>0.635880</td>
      <td>4.9</td>
      <td>6.225</td>
      <td>6.50</td>
      <td>6.900</td>
      <td>7.9</td>
    </tr>
    <tr>
      <th>sepal_width</th>
      <td>50.0</td>
      <td>2.974</td>
      <td>0.322497</td>
      <td>2.2</td>
      <td>2.800</td>
      <td>3.00</td>
      <td>3.175</td>
      <td>3.8</td>
    </tr>
    <tr>
      <th>petal_length</th>
      <td>50.0</td>
      <td>5.552</td>
      <td>0.551895</td>
      <td>4.5</td>
      <td>5.100</td>
      <td>5.55</td>
      <td>5.875</td>
      <td>6.9</td>
    </tr>
    <tr>
      <th>petal_width</th>
      <td>50.0</td>
      <td>2.026</td>
      <td>0.274650</td>
      <td>1.4</td>
      <td>1.800</td>
      <td>2.00</td>
      <td>2.300</td>
      <td>2.5</td>
    </tr>
  </tbody>
</table>
</div>
<hr>
