---
layout : post
title : Part 0 - Plotting Using Seaborn - Data Preparation
categories: [python, visualisation]
tags: [python, seaborn, matplotlib, pandas, plot, eda, data preparation, exploratory data analysis]
---
---

### Import Preliminaries and datasets

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.pylab as plb
import warnings
warnings.filterwarnings('ignore')

test_scores = pd.read_csv("Data/Test scores.csv", parse_dates=['Test taken date'])
test_master = pd.read_csv("Data/Test master.csv")
test_participant = pd.read_csv("Data/Audience summary.csv")
```

We have three datasets, namely -  
### Test Scores Dataset 
This contains scores of each particpant in the test they appeared.

```python
test_scores.head()
```

<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead >
    <tr style="text-align: right;">
      <th></th>
      <th>Participant identifier</th>
      <th>Test Name</th>
      <th>Test taken date</th>
      <th>Track</th>
      <th>Designation</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>37MCTM</td>
      <td>If conditional</td>
      <td>2018-11-23</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>18</td>
    </tr>
    <tr>
      <th>1</th>
      <td>37MCTM</td>
      <td>Determiners and Quantifiers</td>
      <td>2018-11-23</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>28</td>
    </tr>
    <tr>
      <th>2</th>
      <td>37MCTM</td>
      <td>Modals</td>
      <td>2018-11-23</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>22</td>
    </tr>
    <tr>
      <th>3</th>
      <td>37MCTM</td>
      <td>Tenses</td>
      <td>2018-11-13</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>12</td>
    </tr>
    <tr>
      <th>4</th>
      <td>37MCTM</td>
      <td>Pronouns</td>
      <td>2018-11-13</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>15</td>
    </tr>
  </tbody>
</table>
</div>

<!--break-->
---

### Test Master
This is about the other details associated with each test.

```python
test_master
```




<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Test name</th>
      <th>No. of questions</th>
      <th>Complexity</th>
      <th>Marks per question</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Articles-New</td>
      <td>15</td>
      <td>Easy</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Tenses</td>
      <td>15</td>
      <td>Easy</td>
      <td>1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Pronouns</td>
      <td>15</td>
      <td>Easy</td>
      <td>1</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Articles</td>
      <td>15</td>
      <td>Easy</td>
      <td>1</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Conjuctions</td>
      <td>15</td>
      <td>Easy</td>
      <td>1</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Adjective &amp; Adverb</td>
      <td>15</td>
      <td>Easy</td>
      <td>1</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Active and passive voice</td>
      <td>15</td>
      <td>Medium</td>
      <td>2</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Puctuations</td>
      <td>15</td>
      <td>Medium</td>
      <td>2</td>
    </tr>
    <tr>
      <th>8</th>
      <td>If conditional</td>
      <td>15</td>
      <td>Medium</td>
      <td>2</td>
    </tr>
    <tr>
      <th>9</th>
      <td>Determiners and Quantifiers</td>
      <td>15</td>
      <td>Medium</td>
      <td>2</td>
    </tr>
    <tr>
      <th>10</th>
      <td>Modals</td>
      <td>15</td>
      <td>Medium</td>
      <td>2</td>
    </tr>
    <tr>
      <th>11</th>
      <td>Prepositions</td>
      <td>15</td>
      <td>Medium</td>
      <td>2</td>
    </tr>
    <tr>
      <th>12</th>
      <td>Comprehension</td>
      <td>10</td>
      <td>Difficult</td>
      <td>3</td>
    </tr>
    <tr>
      <th>13</th>
      <td>Confusing words</td>
      <td>15</td>
      <td>Difficult</td>
      <td>3</td>
    </tr>
    <tr>
      <th>14</th>
      <td>Synonyms &amp; Antonyms</td>
      <td>15</td>
      <td>Difficult</td>
      <td>3</td>
    </tr>
    <tr>
      <th>15</th>
      <td>Vocabulary</td>
      <td>15</td>
      <td>Difficult</td>
      <td>3</td>
    </tr>
    <tr>
      <th>16</th>
      <td>Capitalization</td>
      <td>15</td>
      <td>Difficult</td>
      <td>3</td>
    </tr>
  </tbody>
</table>
</div>


---

### Test Participants
This is abouth the other details associated with the pariticipants.

```python
test_participant
```



<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Designation</th>
      <th>Engineering</th>
      <th>Quality Assurance</th>
      <th>Support</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Associate</td>
      <td>1400</td>
      <td>250.0</td>
      <td>220</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Lead</td>
      <td>1800</td>
      <td>400.0</td>
      <td>100</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Manager</td>
      <td>300</td>
      <td>60.0</td>
      <td>70</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Consultant</td>
      <td>200</td>
      <td>NaN</td>
      <td>10</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Associate Director and above</td>
      <td>600</td>
      <td>5.0</td>
      <td>32</td>
    </tr>
  </tbody>
</table>
</div>

---

We will create more metrics in the dataset provided so that it would be easy to analyse and compare across multiple factors, like - 

* Weekday
* Week No. 
* Month of the test taken date
* Maximum Score can be obtained
* Percentage of marks obtained by the participants  


```python
test_scores['weekday_name']  = test_scores['Test taken date'].dt.weekday_name
test_scores['month']  = test_scores['Test taken date'].dt.month_name() 
test_scores['week']  = test_scores['Test taken date'].dt.week-42 # to get number from 1 
test_master['maximum_score'] = test_master['No. of questions'] * test_master['Marks per question']
test_scores = pd.merge(test_scores,test_master,left_on="Test Name", right_on="Test name", how = "left")
cols = ['Participant identifier', 'Test Name', 'Track','Designation', 'Score', 
        'weekday_name', 'month', 'week','Complexity', 'maximum_score']
test_scores = test_scores[cols]
test_scores['Percent'] = round((test_scores['Score']/test_scores['maximum_score'])*100,2)
```


```python
test_scores.head()
```




<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Participant identifier</th>
      <th>Test Name</th>
      <th>Track</th>
      <th>Designation</th>
      <th>Score</th>
      <th>weekday_name</th>
      <th>month</th>
      <th>week</th>
      <th>Complexity</th>
      <th>maximum_score</th>
      <th>Percent</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>37MCTM</td>
      <td>If conditional</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>18</td>
      <td>Friday</td>
      <td>November</td>
      <td>5</td>
      <td>Medium</td>
      <td>30</td>
      <td>60.00</td>
    </tr>
    <tr>
      <th>1</th>
      <td>37MCTM</td>
      <td>Determiners and Quantifiers</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>28</td>
      <td>Friday</td>
      <td>November</td>
      <td>5</td>
      <td>Medium</td>
      <td>30</td>
      <td>93.33</td>
    </tr>
    <tr>
      <th>2</th>
      <td>37MCTM</td>
      <td>Modals</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>22</td>
      <td>Friday</td>
      <td>November</td>
      <td>5</td>
      <td>Medium</td>
      <td>30</td>
      <td>73.33</td>
    </tr>
    <tr>
      <th>3</th>
      <td>37MCTM</td>
      <td>Tenses</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>12</td>
      <td>Tuesday</td>
      <td>November</td>
      <td>4</td>
      <td>Easy</td>
      <td>15</td>
      <td>80.00</td>
    </tr>
    <tr>
      <th>4</th>
      <td>37MCTM</td>
      <td>Pronouns</td>
      <td>Engineering</td>
      <td>Lead</td>
      <td>15</td>
      <td>Tuesday</td>
      <td>November</td>
      <td>4</td>
      <td>Easy</td>
      <td>15</td>
      <td>100.00</td>
    </tr>
  </tbody>
</table>
</div>

---

Now we are ready to visualise this data for better analysis.  
The first post in the series is - [Part 1 - Plotting Using Seaborn - Violin, Box and Line Plot](/python/visualisation/2019/08/21/Plotting-Seaborn-Violin-Box-Line.html)  

---