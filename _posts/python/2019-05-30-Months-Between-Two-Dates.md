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

```python
# Store data index as a new column which will act as a primary key
# Will be used later and initiate a blank new dataframe
data['Key'] = data.reset_index(drop = True).index
final = pd.DataFrame()

# Start the loop which will iterate on each particular combination of
# start data and end date -
for i in range(0,len(data)):
# Print Start Date and End Date  
    print("-----------------------------------------------------------------------------")
    print("Start Date is {0}, End Date is {1}".format(data['Start Date'][i], data['End Date'][i]))
    print("-----------------------------------------------------------------------------")
# If both dates fall in same month and year, then the date range is the same ( no consecutive months exists)
# check for same and proceed if the any of these are not same
    if ((pd.to_datetime(data['Start Date'][i]).month != pd.to_datetime(data['End Date'][i]).month) |
(pd.to_datetime(data['Start Date'][i]).year != pd.to_datetime(data['End Date'][i]).year)):
# Store Month start date falling between two dates in  a new dataframe object, index are important here and
# hence its been done in dataframe, list can also be used
        month_startdates = pd.DataFrame(pd.date_range(data['Start Date'][i], data['End Date'][i], freq = 'MS'), columns=['Month_StartDate'])
# Store Month end dates falling between two dates
        month_enddates = pd.DataFrame(pd.date_range(data['Start Date'][i], data['End Date'][i], freq = 'M'), columns = ['Month_EndDate'])
# Print both month start dates and month end dates
        print("Ranges of months in the above date range : \n {0} \n {1}".format(month_startdates, month_enddates))
# If first month start date is not equal to the start date of the date range, then we need to shift the index by one
# to accommodate for the enddate of the first month
        if not pd.to_datetime(data['Start Date'][i]).month == pd.to_datetime(month_startdates['Month_StartDate'][0]).month:
            month_startdates.index = range(1,len(month_startdates)+1)
# AFter adjusting for index, merged both monthstartdate and month end date
        df = pd.concat([month_startdates,month_enddates], axis = 1)
        print("\n After adjusting for indexes : \n {0} ".format(df))
# Create a new column which will consist of the original key of the record
        df['Key'] = i
        final = final.append(df).reset_index(drop = True)
        print("\n Map it to orignal index, so that it can be merged with oringal DF : \n {0}".format(df))
    else:
# If month and year of both start date and end date are same, simply, create the record with the same
        final.append({'Month_StartDate':pd.to_datetime(data['Start Date'][i]),
              'Month_EndDate': pd.to_datetime(data['End Date'][i]),
              'Key': i}, ignore_index =True)
```

    -----------------------------------------------------------------------------
    Start Date is 2019-06-03, End Date is 2019-08-31
    -----------------------------------------------------------------------------
    Ranges of months in the above date range :
       Month_StartDate
    0      2019-07-01
    1      2019-08-01
       Month_EndDate
    0    2019-06-30
    1    2019-07-31
    2    2019-08-31

     After adjusting for indexes :
       Month_StartDate Month_EndDate
    0             NaT    2019-06-30
    1      2019-07-01    2019-07-31
    2      2019-08-01    2019-08-31

     Map it to orignal index, so that it can be merged with oringal DF :
       Month_StartDate Month_EndDate  Key
    0             NaT    2019-06-30    0
    1      2019-07-01    2019-07-31    0
    2      2019-08-01    2019-08-31    0
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
    -----------------------------------------------------------------------------
    Start Date is 2018-11-05, End Date is 2018-11-25
    -----------------------------------------------------------------------------
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
    -----------------------------------------------------------------------------
    Start Date is 2019-06-01, End Date is 2019-07-31
    -----------------------------------------------------------------------------
    Ranges of months in the above date range :
       Month_StartDate
    0      2019-06-01
    1      2019-07-01
       Month_EndDate
    0    2019-06-30
    1    2019-07-31

     After adjusting for indexes :
       Month_StartDate Month_EndDate
    0      2019-06-01    2019-06-30
    1      2019-07-01    2019-07-31

     Map it to orignal index, so that it can be merged with oringal DF :
       Month_StartDate Month_EndDate  Key
    0      2019-06-01    2019-06-30    4
    1      2019-07-01    2019-07-31    4
    -----------------------------------------------------------------------------
    Start Date is 2019-09-01, End Date is 2019-10-25
    -----------------------------------------------------------------------------
    Ranges of months in the above date range :
       Month_StartDate
    0      2019-09-01
    1      2019-10-01
       Month_EndDate
    0    2019-09-30

     After adjusting for indexes :
       Month_StartDate Month_EndDate
    0      2019-09-01    2019-09-30
    1      2019-10-01           NaT

     Map it to orignal index, so that it can be merged with oringal DF :
       Month_StartDate Month_EndDate  Key
    0      2019-09-01    2019-09-30    5
    1      2019-10-01           NaT    5



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
