---
layout : post
title : Applying functions over pandas dataframe using apply, applymap and map
categories: [python]
tags: [pandas, python, dataframe, applymap, map, apply, lambda, function]
---
### Importing Packages and Datasets
```python
import pandas as pd
import numpy as np
data = pd.DataFrame(np.random.rand(4, 3)*100,
                    columns=['Physics','Çhemistry','Maths'],
                    index = ['Student 1', 'Student 2','Student 3','Student 4'])
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


### Applymap

```python
RoundUpto2Decimal = lambda x: round(x,2)
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



### Apply

```python
AverageMarks = lambda x: np.mean(x)
data.apply(AverageMarks)
```
>
    Physics      41.912893
    Çhemistry    41.945759
    Maths        44.417037
    dtype: float64




```python
data.apply(AverageMarks,axis = 1)
```
>
    Student 1    48.550401
    Student 2    67.361994
    Student 3    12.236957
    Student 4    42.884899
    dtype: float64


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
### Map

```python
SquareOfMarks = lambda x: x**2
data['Physics'].map(SquareOfMarks)
```
>
    Student 1    4008.608640
    Student 2     469.077845
    Student 3      30.900857
    Student 4    5947.639058
    Name: Physics, dtype: float64
