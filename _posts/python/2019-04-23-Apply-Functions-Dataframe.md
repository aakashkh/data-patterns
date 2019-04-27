---
layout : post
title : Applying functions over pandas dataframe - apply, applymap, map
categories: [python]
tags: [pandas, python, dataframe, applymap, map, apply, lambda, function]
---

```python
import pandas as pd
import numpy as np
```


```python
data = pd.DataFrame(np.random.rand(4, 3)*100,
                    columns=['Physics','Çhemistry','Maths'],
                    index = ['Student 1', 'Student 2','Student 3','Student 4'])
```


```python
data
```




<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Physics</th>
      <th>Çhemistry</th>
      <th>Maths</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Student 1</th>
      <td>92.907528</td>
      <td>61.462909</td>
      <td>90.654302</td>
    </tr>
    <tr>
      <th>Student 2</th>
      <td>25.733638</td>
      <td>94.571536</td>
      <td>68.961046</td>
    </tr>
    <tr>
      <th>Student 3</th>
      <td>90.143432</td>
      <td>86.293426</td>
      <td>98.143929</td>
    </tr>
    <tr>
      <th>Student 4</th>
      <td>56.651902</td>
      <td>23.143058</td>
      <td>39.698153</td>
    </tr>
  </tbody>
</table>
</div>




```python
RoundUpto2Decimal = lambda x: round(x,2)
```


```python
data.applymap(RoundUpto2Decimal)
```




<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Physics</th>
      <th>Çhemistry</th>
      <th>Maths</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Student 1</th>
      <td>92.91</td>
      <td>61.46</td>
      <td>90.65</td>
    </tr>
    <tr>
      <th>Student 2</th>
      <td>25.73</td>
      <td>94.57</td>
      <td>68.96</td>
    </tr>
    <tr>
      <th>Student 3</th>
      <td>90.14</td>
      <td>86.29</td>
      <td>98.14</td>
    </tr>
    <tr>
      <th>Student 4</th>
      <td>56.65</td>
      <td>23.14</td>
      <td>39.70</td>
    </tr>
  </tbody>
</table>
</div>




```python
AverageMarks = lambda x: np.mean(x)
```


```python
data.apply(AverageMarks)
```


    Physics      66.359125
    Çhemistry    66.367733
    Maths        74.364358
    dtype: float64


```python
data.apply(AverageMarks,axis = 1)
```




    Student 1    81.674913
    Student 2    63.088740
    Student 3    91.526929
    Student 4    39.831038
    dtype: float64




```python
SquareOfMarks = lambda x: x**2
```


```python
data['Physics'].map(SquareOfMarks)
```




    Student 1    8631.808722
    Student 2     662.220115
    Student 3    8125.838389
    Student 4    3209.437997
    Name: Physics, dtype: float64




```python
data.apply(lambda x: (x-np.min(x))/(np.max(x)-np.min(x)))
```




<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Physics</th>
      <th>Çhemistry</th>
      <th>Maths</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Student 1</th>
      <td>1.000000</td>
      <td>0.536479</td>
      <td>0.871853</td>
    </tr>
    <tr>
      <th>Student 2</th>
      <td>0.000000</td>
      <td>1.000000</td>
      <td>0.500684</td>
    </tr>
    <tr>
      <th>Student 3</th>
      <td>0.958852</td>
      <td>0.884106</td>
      <td>1.000000</td>
    </tr>
    <tr>
      <th>Student 4</th>
      <td>0.460272</td>
      <td>0.000000</td>
      <td>0.000000</td>
    </tr>
  </tbody>
</table>
</div>
