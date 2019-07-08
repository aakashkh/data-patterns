---
layout : post
title : Filtering using mask and where in pandas
categories: [python]
tags: [pandas, python, filtering, mask, where, dataframe, conditions, true, false]
---
---
Filtering a dataframe can be achieved in multiple ways using pandas. There are times when you simply need to update a column based on  a condition which is true or vice-versa. In pandas dataframe there are some inbuilt methods to achieve the same using .where() and .mask().  

* [df.where](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.where.html) - Replace value when condition is false  
* [df.mask](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.mask.html) - Replace value when condition is true

Initiating a dummy dataframe with some columns to understand the same -

```python
import pandas as pd
import numpy as np
dummy_data = pd.DataFrame(
    np.array([[1, 2, 3], [4, 5, np.nan], [7, 8, 9], [3, 2, np.nan], [5, 6, np.nan]]),
    columns=['Column 1', 'Column 2', 'Column 3'])
dummy_data
```

<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1.0</td>
      <td>2.0</td>
      <td>3.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>4.0</td>
      <td>5.0</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>7.0</td>
      <td>8.0</td>
      <td>9.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3.0</td>
      <td>2.0</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5.0</td>
      <td>6.0</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>
<hr>
### Operations over the data frame  
-  <b>Using df.where </b> - Replace values where values in <b>Column 3 </b> is not null by null across all the columns

```python
dummy_data.where(dummy_data['Column 3'].isnull(),np.nan)
```

<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1</th>
      <td>4.0</td>
      <td>5.0</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3.0</td>
      <td>2.0</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5.0</td>
      <td>6.0</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>
<br>

- <b>Using df.mask </b> - Replace values where <b> Column 3 </b> values are null with 0 across the dataframe


```python
dummy_data.mask(dummy_data['Column 3'].isnull(),0)
```

<div class="table-responsive ">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1.0</td>
      <td>2.0</td>
      <td>3.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>7.0</td>
      <td>8.0</td>
      <td>9.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
    </tr>
  </tbody>
</table>
</div>
<hr>
### Operations over a particular columns

- <b>Using df.mask </b> - Replace values in <b> Column 3 </b> by 0 where values are null.  
  The following code results in a list with previous value in Column 3 and the value obtained after using .mask()

```python
list(zip(dummy_data['Column 3'],dummy_data['Column 3'].mask(dummy_data['Column 3'].isnull(),0)))
```
> [(3.0, 3.0), (nan, 0.0), (9.0, 9.0), (nan, 0.0), (nan, 0.0)]

-  <b>Using df.where </b> - Replace values in <b> Column 3 </b> by null where values are not null.    
The following code results in a list with previous value in Column 3 & the value obtained after using .where()

```python
list(zip(dummy_data['Column 3'],dummy_data['Column 3'].where(dummy_data['Column 3'].isnull(),np.nan)))
```

> [(3.0, nan), (nan, nan), (9.0, nan), (nan, nan), (nan, nan)]

<hr>
<b> Notebook Link </b>   - [Filtering using mask and where in pandas](https://nbviewer.jupyter.org/github/aakashkh/Sample-Jupyter-Notebooks/blob/master/Filtering%20using%20mask%20and%20where%20in%20pandas.ipynb){:target="_blank"}
<hr>
