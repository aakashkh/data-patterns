---
title: "Applying functions over pandas dataframe using apply, applymap and map"
date: 2019-04-23T00:00:00+00:00
lastmod: 2019-04-23T00:00:00+00:00
draft: false
images: []
categories: ["python"]
tags: ['pandas', 'python', 'dataframe', 'applymap', 'map', 'apply', 'lambda', 'function']
weight: 100
toc: true
---

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

<table >
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
    <td>59.488944</td>
    <td>14.888411</td>
    <td>52.794760</td>
  </tr>
  <tr>
    <th>Student 2</th>
    <td>21.872113</td>
    <td>66.481646</td>
    <td>87.190572</td>
  </tr>
  <tr>
    <th>Student 3</th>
    <td>9.885919</td>
    <td>54.449674</td>
    <td>58.696036</td>
  </tr>
  <tr>
    <th>Student 4</th>
    <td>33.804378</td>
    <td>6.286295</td>
    <td>30.373699</td>
  </tr>
</tbody>
</table>
---

### Applymap

```python
RoundUpto2Decimal = lambda x: round(x,2)
data.applymap(RoundUpto2Decimal)
```


<table >
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
    <td>59.49</td>
    <td>14.89</td>
    <td>52.79</td>
  </tr>
  <tr>
    <th>Student 2</th>
    <td>21.87</td>
    <td>66.48</td>
    <td>87.19</td>
  </tr>
  <tr>
    <th>Student 3</th>
    <td>9.89</td>
    <td>54.45</td>
    <td>58.70</td>
  </tr>
  <tr>
    <th>Student 4</th>
    <td>33.80</td>
    <td>6.29</td>
    <td>30.37</td>
  </tr>
</tbody>
</table>
---

### Apply

```python
AverageMarks = lambda x: np.mean(x)
data.apply(AverageMarks)
```
>
    Physics      31.262839
    Çhemistry    35.526506
    Maths        57.263767
    dtype: float64



```python
data.apply(AverageMarks,axis = 1)
```
>
    Student 1    42.390705
    Student 2    58.514777
    Student 3    41.010543
    Student 4    23.488124
    dtype: float64


```python
data.apply(lambda x: (x-np.min(x))/(np.max(x)-np.min(x)))
```
<table >
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
      <td>0.142903</td>
      <td>0.394620</td>
    </tr>
    <tr>
      <th>Student 2</th>
      <td>0.241642</td>
      <td>1.000000</td>
      <td>1.000000</td>
    </tr>
    <tr>
      <th>Student 3</th>
      <td>0.000000</td>
      <td>0.800118</td>
      <td>0.498485</td>
    </tr>
    <tr>
      <th>Student 4</th>
      <td>0.482198</td>
      <td>0.000000</td>
      <td>0.000000</td>
    </tr>
  </tbody>
</table>

---

### Map

```python
SquareOfMarks = lambda x: x**2
data['Physics'].map(SquareOfMarks)
```
>
    Student 1    3538.934482
    Student 2     478.389328
    Student 3      97.731389
    Student 4    1142.735997
    Name: Physics, dtype: float64


---

<b> Notebook Link </b>  - [Applying functions over pandas dataframe using apply, applymap and map](https://nbviewer.jupyter.org/github/aakashkh/Sample-Jupyter-Notebooks/blob/master/Functions%20using%20apply%2C%20applymap%20and%20map.ipynb){:target="_blank"}

---

