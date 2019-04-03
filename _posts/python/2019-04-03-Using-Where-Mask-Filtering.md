---
layout : post
title : Filtering using mask and where in pandas
categories: [python]
tags: [pandas, python, filtering, mask, where, dataframe]
---


df.where -> Replace value where condition is false  
df.mask -> Replace value where condition is true


```python
import pandas as pd
import numpy as np
dummy_data = pd.DataFrame(
    np.array([[1, 2, 3], [4, 5, np.nan], [7, 8, 9], [3, 2, np.nan], [5, 6, np.nan]]),
    columns=['Column 1', 'Column 2', 'Column 3'])
```


```python
dummy_data
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed">
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

### Operations over the data frame  
-  Using df.where - Replace values when the condition is false

```python
dummy_data.where(dummy_data['Column 3'].isnull(),np.nan)
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed">
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


- Using df.mask - Replace values when the condition is true


```python
dummy_data.mask(dummy_data['Column 3'].isnull(),0)
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed">
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

### Operations over a particular columns

- Using df.mask - Replace values when the condition is true

```python
list(zip(dummy_data['Column 3'],dummy_data['Column 3'].mask(dummy_data['Column 3'].isnull(),0)))
```
> [(3.0, 3.0), (nan, 0.0), (9.0, 9.0), (nan, 0.0), (nan, 0.0)]

-  Using df.where - Replace values when the condition is false


```python
list(zip(dummy_data['Column 3'],dummy_data['Column 3'].where(dummy_data['Column 3'].isnull(),np.nan)))
```

> [(3.0, nan), (nan, nan), (9.0, nan), (nan, nan), (nan, nan)]
