---
layout : post
title : Indexing and Sorting a dataframe using iloc and loc
categories: [python]
tags: [pandas, python, indexing, index, iloc, loc, dataframe, argsort, index, sort]
---

There are multiple ways in pandas by which a dataframe can be indexed i.e, selecting particular set of rows and columns from a dataframe.
For a detailed description over this topic, once can refer official pandas documentation -
[Indexing and Selecting Data](http://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html)

We'll discuss the following -
* [Integer Based Indexing - iloc](#integer-based-indexing-using-iloc)
* [Label Based Indexing - loc](#labels-based-indexing-using-loc)
* [Setting Values using loc](#setting-values-using-loc)
* [Sorting using indexes via argsort](#sorting)

Let's begin with loading a sample dataset and required python packages.

```python
import pandas as pd
import numpy as np
#Fetching data from url as csv by mentioning values of various paramters
data = pd.read_csv("https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data",
                   header = None,
                   index_col = False,
                   names = ['sepal_length','sepal_width','petal_length','petal_width','iris_class'])
# visualising first five rows of sample dataset (Iris)
data.head()
```
The sample first five rows of data looks like (can be viewed using data.head())-

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>sepal_length</th>
      <th>sepal_width</th>
      <th>petal_length</th>
      <th>petal_width</th>
      <th>iris_class</th>
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
</div>
<hr>
### Integer based indexing using iloc
To select some fixed no. of column and a fixed no. of rows from this data, one way is to achieve it by using [iloc](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iloc.html) operation.
The first part of indexing will be for rows and another will be columns (indexes starting from 0 to total no. of rows/columns).  
For example, first 10 rows for last three columns can be extracted by -  
to pass a range : can be used while indexing [start:end], start being inclusive and end being exclusive  
```python
data.iloc[0:10,2:5]
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>petal_length</th>
      <th>petal_width</th>
      <th>iris_class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1.3</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>5</th>
      <td>1.7</td>
      <td>0.4</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>6</th>
      <td>1.4</td>
      <td>0.3</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>8</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>9</th>
      <td>1.5</td>
      <td>0.1</td>
      <td>Iris-setosa</td>
    </tr>
  </tbody>
</table>
</div>
<hr>
Similarly, specific rows and columns can be extracted using indexes of the corresponding elements.  
The following command, will return 1st and 2nd row of 2nd and 4th column.


```python
data.iloc[[0,1],[1,3]]
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>sepal_width</th>
      <th>petal_width</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>3.5</td>
      <td>0.2</td>
    </tr>
    <tr>
      <th>1</th>
      <td>3.0</td>
      <td>0.2</td>
    </tr>
  </tbody>
</table>
</div>
<hr>

Another example, to extracting first 10 rows and all columns but first two.

```python
data.iloc[:10,2:]
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>petal_length</th>
      <th>petal_width</th>
      <th>iris_class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1.3</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>5</th>
      <td>1.7</td>
      <td>0.4</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>6</th>
      <td>1.4</td>
      <td>0.3</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>8</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>9</th>
      <td>1.5</td>
      <td>0.1</td>
      <td>Iris-setosa</td>
    </tr>
  </tbody>
</table>
</div>
<hr>

### Labels based indexing using loc
[loc](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.loc.html)
```python
data.loc[2:10,'petal_length':'iris_class']
```




<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>petal_length</th>
      <th>petal_width</th>
      <th>iris_class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2</th>
      <td>1.3</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>5</th>
      <td>1.7</td>
      <td>0.4</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>6</th>
      <td>1.4</td>
      <td>0.3</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>8</th>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>9</th>
      <td>1.5</td>
      <td>0.1</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>10</th>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
  </tbody>
</table>
</div>
<hr>


```python
data.loc[2:10,['petal_length','iris_class']]
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>petal_length</th>
      <th>iris_class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2</th>
      <td>1.3</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1.5</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1.4</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>5</th>
      <td>1.7</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>6</th>
      <td>1.4</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1.5</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>8</th>
      <td>1.4</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>9</th>
      <td>1.5</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>10</th>
      <td>1.5</td>
      <td>Iris-setosa</td>
    </tr>
  </tbody>
</table>
</div>
<hr>

### Setting values using loc


```python
data.loc[2:10,['petal_length']]
```




<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>petal_length</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2</th>
      <td>1.3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1.5</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1.4</td>
    </tr>
    <tr>
      <th>5</th>
      <td>1.7</td>
    </tr>
    <tr>
      <th>6</th>
      <td>1.4</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1.5</td>
    </tr>
    <tr>
      <th>8</th>
      <td>1.4</td>
    </tr>
    <tr>
      <th>9</th>
      <td>1.5</td>
    </tr>
    <tr>
      <th>10</th>
      <td>1.5</td>
    </tr>
  </tbody>
</table>
</div>
<hr>




```python
data.loc[2:10,'petal_length'] = 30
```


```python
data.loc[2:10]
```




<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>sepal_length</th>
      <th>sepal_width</th>
      <th>petal_length</th>
      <th>petal_width</th>
      <th>iris_class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2</th>
      <td>4.7</td>
      <td>3.2</td>
      <td>30.0</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4.6</td>
      <td>3.1</td>
      <td>30.0</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5.0</td>
      <td>3.6</td>
      <td>30.0</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5.4</td>
      <td>3.9</td>
      <td>30.0</td>
      <td>0.4</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>6</th>
      <td>4.6</td>
      <td>3.4</td>
      <td>30.0</td>
      <td>0.3</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>7</th>
      <td>5.0</td>
      <td>3.4</td>
      <td>30.0</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>8</th>
      <td>4.4</td>
      <td>2.9</td>
      <td>30.0</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>9</th>
      <td>4.9</td>
      <td>3.1</td>
      <td>30.0</td>
      <td>0.1</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>10</th>
      <td>5.4</td>
      <td>3.7</td>
      <td>30.0</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
  </tbody>
</table>
</div>
<hr>

```python
data.head()
```




<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>sepal_length</th>
      <th>sepal_width</th>
      <th>petal_length</th>
      <th>petal_width</th>
      <th>iris_class</th>
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
      <td>30.0</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4.6</td>
      <td>3.1</td>
      <td>30.0</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5.0</td>
      <td>3.6</td>
      <td>30.0</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
  </tbody>
</table>
</div>
<hr>




```python
data.loc[data['sepal_width']>3] = np.nan
```


```python
data.head()
```




<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>sepal_length</th>
      <th>sepal_width</th>
      <th>petal_length</th>
      <th>petal_width</th>
      <th>iris_class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
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
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>
<hr>

### Sorting


```python
#Fetching data from url as csv by mentioning values of various paramters
data = pd.read_csv("https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data",
                   header = None,
                   index_col = False,
                   names = ['sepal_length','sepal_width','petal_length','petal_width','iris_class'])
sample_data = data.iloc[0:6,[1]]
sample_data
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>sepal_width</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>3.5</td>
    </tr>
    <tr>
      <th>1</th>
      <td>3.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3.2</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3.1</td>
    </tr>
    <tr>
      <th>4</th>
      <td>3.6</td>
    </tr>
    <tr>
      <th>5</th>
      <td>3.9</td>
    </tr>
  </tbody>
</table>
</div>
<hr>

```python
sample_data.sort_values(by='sepal_width')
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>sepal_width</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>3.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3.1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3.2</td>
    </tr>
    <tr>
      <th>0</th>
      <td>3.5</td>
    </tr>
    <tr>
      <th>4</th>
      <td>3.6</td>
    </tr>
    <tr>
      <th>5</th>
      <td>3.9</td>
    </tr>
  </tbody>
</table>
</div>
<hr>


```python
sample_data.sort_values(by='sepal_width').index.values
```
> array([1, 3, 2, 0, 4, 5], dtype=int64)

<b> Using argsort </b>

```python
sample_data['sepal_width'].values.argsort(axis=0)
```
> array([1, 3, 2, 0, 4, 5], dtype=int64)

```python
sample_data.iloc[sample_data['sepal_width'].values.argsort(axis=0)]
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>sepal_width</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>3.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3.1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3.2</td>
    </tr>
    <tr>
      <th>0</th>
      <td>3.5</td>
    </tr>
    <tr>
      <th>4</th>
      <td>3.6</td>
    </tr>
    <tr>
      <th>5</th>
      <td>3.9</td>
    </tr>
  </tbody>
</table>
</div>
<hr>
