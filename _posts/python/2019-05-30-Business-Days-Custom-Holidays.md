---
layout : post
title : Business Days with Custom Holidays
categories: [python]
tags: [pandas, python, Business Days, Net Work Days, Datetime, holidays, custom, weekends, weekday]
---

---
### Importing Packages and Datasets

```python
import pandas as pd
```


```python
start_date = ['2019-06-03', '2019-06-13', '2019-10-01', '2019-09-01']
end_date =  ['2019-08-31', '2019-06-21', '2019-10-25', '2019-12-25']
data = pd.DataFrame(list(zip(start_date,end_date)), columns = ['Start Date', 'End Date'])
data
```




<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Start Date</th>
      <th>End Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2019-06-03</td>
      <td>2019-08-31</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2019-06-13</td>
      <td>2019-06-21</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2019-10-01</td>
      <td>2019-10-25</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2019-09-01</td>
      <td>2019-12-25</td>
    </tr>
  </tbody>
</table>
</div>
<hr>


### Custm Holidays List
```python
holiday_dates = [pd.datetime(2019, 8, 15), pd.datetime(2019, 10, 2), pd.datetime(2019, 10, 8),
                 pd.datetime(2019, 10, 28), pd.datetime(2019, 12, 25)]
```
<!--break-->
---
### Example - calculate business days (excluding weekends) with custom holidays
```python
# Exclude weekends and custom holidays
pd.bdate_range(pd.datetime(2019, 8, 1), pd.datetime(2019, 8, 31),  holidays=holiday_dates, freq='C', weekmask = None)
```




    DatetimeIndex(['2019-08-01', '2019-08-02', '2019-08-05', '2019-08-06',
                   '2019-08-07', '2019-08-08', '2019-08-09', '2019-08-12',
                   '2019-08-13', '2019-08-14', '2019-08-16', '2019-08-19',
                   '2019-08-20', '2019-08-21', '2019-08-22', '2019-08-23',
                   '2019-08-26', '2019-08-27', '2019-08-28', '2019-08-29',
                   '2019-08-30'],
                  dtype='datetime64[ns]', freq='C')



<hr>
### Applying the same using lambda
```python
data['Business Days'] = data.apply(lambda x: len(pd.bdate_range(x['Start Date'],
                                                                x['End Date'],
                                                                holidays=holiday_dates,
                                                                freq='C',
                                                                weekmask = None)), axis = 1)
data
```




<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Business Days</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2019-06-03</td>
      <td>2019-08-31</td>
      <td>64</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2019-06-13</td>
      <td>2019-06-21</td>
      <td>7</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2019-10-01</td>
      <td>2019-10-25</td>
      <td>17</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2019-09-01</td>
      <td>2019-12-25</td>
      <td>79</td>
    </tr>
  </tbody>
</table>
</div>
<hr>
<b> Notebook Link </b>   - [Business Days with Custom Holidays](https://nbviewer.jupyter.org/github/aakashkh/Sample-Jupyter-Notebooks/blob/master/Business%20Days%20with%20Custom%20Holidays.ipynb){:target="_blank"}
<hr>
