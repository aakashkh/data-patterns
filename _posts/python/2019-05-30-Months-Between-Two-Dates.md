---
layout : post
title : Months between two dates
categories: [python]
tags: [pandas, python, months, date, datetime, month start date, month end date, start date, end date]
---
<hr>
### Importing Packages and Datasets

```python
import pandas as pd
import numpy as np
```

```python
start_date = ['2019-06-03', '2019-06-13', '2018-11-05', '2019-05-31', '2019-06-01', '2019-09-01']
end_date =  ['2019-08-31', '2019-08-23', '2018-11-25', '2019-07-1', '2019-07-31', '2019-10-25']
data = pd.DataFrame(list(zip(start_date,end_date)), columns = ['Start Date', 'End Date'])
```
<div class="table-responsive-sm">
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
    <td>2019-08-23</td>
  </tr>
  <tr>
    <th>2</th>
    <td>2018-11-05</td>
    <td>2018-11-25</td>
  </tr>
  <tr>
    <th>3</th>
    <td>2019-05-31</td>
    <td>2019-07-1</td>
  </tr>
  <tr>
    <th>4</th>
    <td>2019-06-01</td>
    <td>2019-07-31</td>
  </tr>
  <tr>
    <th>5</th>
    <td>2019-09-01</td>
    <td>2019-10-25</td>
  </tr>
</tbody>
</table>
</div>
<hr>

### Logic
```python
# Store data index as a new column which will act as a primary key will be used later and initiate a blank new dataframe
data['Key'] = data.reset_index(drop = True).index
final = pd.DataFrame()
# Start the loop which will iterate on each particular combination of start data and end date -
for i in range(0,len(data)):
    start_date = data['Start Date'][i]
    end_date = data['End Date'][i]
    print("-----------------------------------------------------------------------------")
    print("Start Date is {0}, End Date is {1}".format(start_date, end_date))
    print("-----------------------------------------------------------------------------")
# If both dates fall in same month and year, then the date range is the same ( no consecutive months exists), check for same and proceed if the any of these are not same
# Store Month start date falling between two dates in  a new dataframe object
# Store Month end dates falling between two dates
# If first month start date is not equal to the start date of the date range, then we need to shift the index by one to accommodate for the enddate of the first month
    if ((pd.to_datetime(start_date).month != pd.to_datetime(end_date).month) | (pd.to_datetime(start_date).year != pd.to_datetime(end_date).year)):
        month_startdates = pd.DataFrame(pd.date_range(start_date, end_date, freq = 'MS'), columns=['Month_StartDate'])
        month_enddates = pd.DataFrame(pd.date_range(start_date, end_date, freq = 'M'), columns = ['Month_EndDate'])
        print("Ranges of months in the above date range : \n {0} \n {1}".format(month_startdates, month_enddates))
        if not pd.to_datetime(start_date).month == pd.to_datetime(month_startdates['Month_StartDate'][0]).month:
            month_startdates.index = range(1,len(month_startdates)+1)
        df = pd.concat([month_startdates,month_enddates], axis = 1)
        print("\n After adjusting for indexes : \n {0} ".format(df))
        df['Key'] = i
        final = final.append(df).reset_index(drop = True)
        print("\n Map it to orignal index, so that it can be merged with oringal DF : \n {0}".format(df))
    else:
# If month and year of both start date and end date are same, simply, create the record with the same
        final.append({'Month_StartDate':pd.to_datetime(start_date),
              'Month_EndDate': pd.to_datetime(end_date),
              'Key': i}, ignore_index =True)
```
<hr>

### Example 1 : When i = 1
    -----------------------------------------------------------------------------
    Start Date is 2019-06-13, End Date is 2019-08-23
    -----------------------------------------------------------------------------
    Ranges of months in the above date range :
       Month_StartDate
    0      2019-07-01
    1      2019-08-01
       Month_EndDate
    0    2019-06-30
    1    2019-07-31

     After adjusting for indexes :
       Month_StartDate Month_EndDate
    0             NaT    2019-06-30
    1      2019-07-01    2019-07-31
    2      2019-08-01           NaT

     Map it to orignal index, so that it can be merged with oringal DF :
       Month_StartDate Month_EndDate  Key
    0             NaT    2019-06-30    1
    1      2019-07-01    2019-07-31    1
    2      2019-08-01           NaT    1

<hr>

### Example 2 : When i = 3
    -----------------------------------------------------------------------------
    Start Date is 2019-05-31, End Date is 2019-07-1
    -----------------------------------------------------------------------------
    Ranges of months in the above date range :
       Month_StartDate
    0      2019-06-01
    1      2019-07-01
       Month_EndDate
    0    2019-05-31
    1    2019-06-30

     After adjusting for indexes :
       Month_StartDate Month_EndDate
    0             NaT    2019-05-31
    1      2019-06-01    2019-06-30
    2      2019-07-01           NaT

     Map it to orignal index, so that it can be merged with oringal DF :
       Month_StartDate Month_EndDate  Key
    0             NaT    2019-05-31    3
    1      2019-06-01    2019-06-30    3
    2      2019-07-01           NaT    3

### Merge with orignal data on key and index

```python
data = pd.merge(data, final, how = 'left')
data
```

<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Key</th>
      <th>Month_StartDate</th>
      <th>Month_EndDate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2019-06-03</td>
      <td>2019-08-31</td>
      <td>0</td>
      <td>NaT</td>
      <td>2019-06-30</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2019-06-03</td>
      <td>2019-08-31</td>
      <td>0</td>
      <td>2019-07-01</td>
      <td>2019-07-31</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2019-06-03</td>
      <td>2019-08-31</td>
      <td>0</td>
      <td>2019-08-01</td>
      <td>2019-08-31</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2019-06-13</td>
      <td>2019-08-23</td>
      <td>1</td>
      <td>NaT</td>
      <td>2019-06-30</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2019-06-13</td>
      <td>2019-08-23</td>
      <td>1</td>
      <td>2019-07-01</td>
      <td>2019-07-31</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2019-06-13</td>
      <td>2019-08-23</td>
      <td>1</td>
      <td>2019-08-01</td>
      <td>NaT</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2018-11-05</td>
      <td>2018-11-25</td>
      <td>2</td>
      <td>NaT</td>
      <td>NaT</td>
    </tr>
    <tr>
      <th>7</th>
      <td>2019-05-31</td>
      <td>2019-07-1</td>
      <td>3</td>
      <td>NaT</td>
      <td>2019-05-31</td>
    </tr>
    <tr>
      <th>8</th>
      <td>2019-05-31</td>
      <td>2019-07-1</td>
      <td>3</td>
      <td>2019-06-01</td>
      <td>2019-06-30</td>
    </tr>
    <tr>
      <th>9</th>
      <td>2019-05-31</td>
      <td>2019-07-1</td>
      <td>3</td>
      <td>2019-07-01</td>
      <td>NaT</td>
    </tr>
    <tr>
      <th>10</th>
      <td>2019-06-01</td>
      <td>2019-07-31</td>
      <td>4</td>
      <td>2019-06-01</td>
      <td>2019-06-30</td>
    </tr>
    <tr>
      <th>11</th>
      <td>2019-06-01</td>
      <td>2019-07-31</td>
      <td>4</td>
      <td>2019-07-01</td>
      <td>2019-07-31</td>
    </tr>
    <tr>
      <th>12</th>
      <td>2019-09-01</td>
      <td>2019-10-25</td>
      <td>5</td>
      <td>2019-09-01</td>
      <td>2019-09-30</td>
    </tr>
    <tr>
      <th>13</th>
      <td>2019-09-01</td>
      <td>2019-10-25</td>
      <td>5</td>
      <td>2019-10-01</td>
      <td>NaT</td>
    </tr>
  </tbody>
</table>
</div>

<hr>

### Adjustment for missing start and end date

```python
data.loc[data['Month_StartDate'].isnull(),'Month_StartDate'] = pd.to_datetime(data['Start Date'])
data.loc[data['Month_EndDate'].isnull(),'Month_EndDate'] = pd.to_datetime(data['End Date'])
data
```
<div class="table-responsive-sm">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Key</th>
      <th>Month_StartDate</th>
      <th>Month_EndDate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2019-06-03</td>
      <td>2019-08-31</td>
      <td>0</td>
      <td>2019-06-03</td>
      <td>2019-06-30</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2019-06-03</td>
      <td>2019-08-31</td>
      <td>0</td>
      <td>2019-07-01</td>
      <td>2019-07-31</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2019-06-03</td>
      <td>2019-08-31</td>
      <td>0</td>
      <td>2019-08-01</td>
      <td>2019-08-31</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2019-06-13</td>
      <td>2019-08-23</td>
      <td>1</td>
      <td>2019-06-13</td>
      <td>2019-06-30</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2019-06-13</td>
      <td>2019-08-23</td>
      <td>1</td>
      <td>2019-07-01</td>
      <td>2019-07-31</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2019-06-13</td>
      <td>2019-08-23</td>
      <td>1</td>
      <td>2019-08-01</td>
      <td>2019-08-23</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2018-11-05</td>
      <td>2018-11-25</td>
      <td>2</td>
      <td>2018-11-05</td>
      <td>2018-11-25</td>
    </tr>
    <tr>
      <th>7</th>
      <td>2019-05-31</td>
      <td>2019-07-1</td>
      <td>3</td>
      <td>2019-05-31</td>
      <td>2019-05-31</td>
    </tr>
    <tr>
      <th>8</th>
      <td>2019-05-31</td>
      <td>2019-07-1</td>
      <td>3</td>
      <td>2019-06-01</td>
      <td>2019-06-30</td>
    </tr>
    <tr>
      <th>9</th>
      <td>2019-05-31</td>
      <td>2019-07-1</td>
      <td>3</td>
      <td>2019-07-01</td>
      <td>2019-07-01</td>
    </tr>
    <tr>
      <th>10</th>
      <td>2019-06-01</td>
      <td>2019-07-31</td>
      <td>4</td>
      <td>2019-06-01</td>
      <td>2019-06-30</td>
    </tr>
    <tr>
      <th>11</th>
      <td>2019-06-01</td>
      <td>2019-07-31</td>
      <td>4</td>
      <td>2019-07-01</td>
      <td>2019-07-31</td>
    </tr>
    <tr>
      <th>12</th>
      <td>2019-09-01</td>
      <td>2019-10-25</td>
      <td>5</td>
      <td>2019-09-01</td>
      <td>2019-09-30</td>
    </tr>
    <tr>
      <th>13</th>
      <td>2019-09-01</td>
      <td>2019-10-25</td>
      <td>5</td>
      <td>2019-10-01</td>
      <td>2019-10-25</td>
    </tr>
  </tbody>
</table>
</div>
<hr>

Notebook Link - [Months between two dates](https://nbviewer.jupyter.org/github/aakashkh/Sample-Jupyter-Notebooks/blob/master/Months%20between%20two%20dates.ipynb){:target="_blank"}
<hr>
