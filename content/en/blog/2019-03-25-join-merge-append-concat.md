---
title: "Join, Merge, Append and Concatenate"
date: 2019-03-25T00:00:00+00:00
lastmod: 2019-03-25T00:00:00+00:00
draft: false
images: []
categories: ["python"]
tags: ['pandas', 'python', 'column names', 'data', 'csv', 'read']
weight: 100
toc: true
---

---
Working with multiple data frames often involves joining two or more tables to in bring out more no. of columns from another table by joining on some sort of relationship which exists within a table or appending two tables which is adding one or more table over another table with keeping the same order of columns.  

---

Example of append data -> monthly files of revenue sheets of a company and wee need at end of the year to be clubbed into single table.    

![alt text](/static/img/posts/python/2019-03-25-Join-Merge-Append-Concat/T1.jpg "Table 1") &nbsp;&nbsp;&nbsp;&nbsp;
![alt text](/static/img/posts/python/2019-03-25-Join-Merge-Append-Concat/T2.jpg "Table 2")

![alt text](/static/img/posts/python/2019-03-25-Join-Merge-Append-Concat/T3.jpg "Merge Table")

![alt text](/static/img/posts/python/2019-03-25-Join-Merge-Append-Concat/T4.jpg "Appended Table")




---

Example of merging -> multiple files regarding employee education, compensation, performance all linked to each other in some identifier in each one of them which maps to employee master table and for doing analysis we need data from each of these tables in the same which can be achieved by merging.

---

We'll look out for merging/joining two tables now and later will discuss the possibilities around appending to tables using pandas.  
To begin with let's get create some dummy datasets.

```python
import pandas as pd
states_codes = pd.DataFrame({'State': ['Haryana', 'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh'],
                        'Code': ['HR', 'PB', 'RJ', 'UP', 'MP']})
states_area = pd.DataFrame({'State': ['Haryana', 'Punjab',  'Uttar Pradesh', 'Bihar'],
                        'Area_InSquareKM': [44212, 50362, 243290, 94165]})
# a dummy data file
states_literacyrate = pd.read_csv('literacy.csv')
```


```python
states_codes
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Code</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>HR</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>PB</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Rajasthan</td>
      <td>RJ</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Uttar Pradesh</td>
      <td>UP</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Madhya Pradesh</td>
      <td>MP</td>
    </tr>
  </tbody>
</table>
```python
states_area
```



<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>50362</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Bihar</td>
      <td>94165</td>
    </tr>
  </tbody>
</table>
```python
states_literacyrate
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Year</th>
      <th>Literacy Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>2011</td>
      <td>76.64</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Rajasthan</td>
      <td>2011</td>
      <td>67.06</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>2011</td>
      <td>69.72</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Haryana</td>
      <td>2001</td>
      <td>67.91</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Uttar Pradesh</td>
      <td>2001</td>
      <td>56.27</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Rajasthan</td>
      <td>2001</td>
      <td>60.41</td>
    </tr>
  </tbody>
</table>
As you can see State column repeats across all three tables, meaning to say that in case it is required to pull out from these three table


```python
# Merge vs Join
```


```python
area_codes_inner = pd.merge(states_area,states_codes)
area_codes_inner
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
      <th>Code</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212</td>
      <td>HR</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>50362</td>
      <td>PB</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290</td>
      <td>UP</td>
    </tr>
  </tbody>
</table>
```python
results_inner = pd.merge(area_codes_inner,states_literacyrate)
results_inner
```



<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
      <th>Code</th>
      <th>Year</th>
      <th>Literacy Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212</td>
      <td>HR</td>
      <td>2011</td>
      <td>76.64</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Haryana</td>
      <td>44212</td>
      <td>HR</td>
      <td>2001</td>
      <td>67.91</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290</td>
      <td>UP</td>
      <td>2011</td>
      <td>69.72</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Uttar Pradesh</td>
      <td>243290</td>
      <td>UP</td>
      <td>2001</td>
      <td>56.27</td>
    </tr>
  </tbody>
</table>
```python
area_codes_left = pd.merge(states_area,states_codes,how ='left')
area_codes_left
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
      <th>Code</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212</td>
      <td>HR</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>50362</td>
      <td>PB</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290</td>
      <td>UP</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Bihar</td>
      <td>94165</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
```python
results_left = pd.merge(area_codes_left,states_literacyrate,how ='left')
results_left
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
      <th>Code</th>
      <th>Year</th>
      <th>Literacy Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212</td>
      <td>HR</td>
      <td>2011.0</td>
      <td>76.64</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Haryana</td>
      <td>44212</td>
      <td>HR</td>
      <td>2001.0</td>
      <td>67.91</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Punjab</td>
      <td>50362</td>
      <td>PB</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Uttar Pradesh</td>
      <td>243290</td>
      <td>UP</td>
      <td>2011.0</td>
      <td>69.72</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Uttar Pradesh</td>
      <td>243290</td>
      <td>UP</td>
      <td>2001.0</td>
      <td>56.27</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Bihar</td>
      <td>94165</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
```python
area_codes_right = pd.merge(states_area,states_codes,how ='right')
area_codes_right
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
      <th>Code</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212.0</td>
      <td>HR</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>50362.0</td>
      <td>PB</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290.0</td>
      <td>UP</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Rajasthan</td>
      <td>NaN</td>
      <td>RJ</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Madhya Pradesh</td>
      <td>NaN</td>
      <td>MP</td>
    </tr>
  </tbody>
</table>
```python
results_right = pd.merge(area_codes_right,states_literacyrate,how ='right')
results_right
```



<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
      <th>Code</th>
      <th>Year</th>
      <th>Literacy Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212.0</td>
      <td>HR</td>
      <td>2011</td>
      <td>76.64</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Haryana</td>
      <td>44212.0</td>
      <td>HR</td>
      <td>2001</td>
      <td>67.91</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290.0</td>
      <td>UP</td>
      <td>2011</td>
      <td>69.72</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Uttar Pradesh</td>
      <td>243290.0</td>
      <td>UP</td>
      <td>2001</td>
      <td>56.27</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Rajasthan</td>
      <td>NaN</td>
      <td>RJ</td>
      <td>2011</td>
      <td>67.06</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Rajasthan</td>
      <td>NaN</td>
      <td>RJ</td>
      <td>2001</td>
      <td>60.41</td>
    </tr>
  </tbody>
</table>
```python
area_codes_outer = pd.merge(states_area,states_codes, how = 'outer')
area_codes_outer
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
      <th>Code</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212.0</td>
      <td>HR</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>50362.0</td>
      <td>PB</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290.0</td>
      <td>UP</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Bihar</td>
      <td>94165.0</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Rajasthan</td>
      <td>NaN</td>
      <td>RJ</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Madhya Pradesh</td>
      <td>NaN</td>
      <td>MP</td>
    </tr>
  </tbody>
</table>
```python
results_outer = pd.merge(area_codes_outer,states_literacyrate,how ='outer')
results_outer
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
      <th>Code</th>
      <th>Year</th>
      <th>Literacy Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212.0</td>
      <td>HR</td>
      <td>2011.0</td>
      <td>76.64</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Haryana</td>
      <td>44212.0</td>
      <td>HR</td>
      <td>2001.0</td>
      <td>67.91</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Punjab</td>
      <td>50362.0</td>
      <td>PB</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Uttar Pradesh</td>
      <td>243290.0</td>
      <td>UP</td>
      <td>2011.0</td>
      <td>69.72</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Uttar Pradesh</td>
      <td>243290.0</td>
      <td>UP</td>
      <td>2001.0</td>
      <td>56.27</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Bihar</td>
      <td>94165.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Rajasthan</td>
      <td>NaN</td>
      <td>RJ</td>
      <td>2011.0</td>
      <td>67.06</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Rajasthan</td>
      <td>NaN</td>
      <td>RJ</td>
      <td>2001.0</td>
      <td>60.41</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Madhya Pradesh</td>
      <td>NaN</td>
      <td>MP</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
other options in merge function are  -
left_on
right_on
on
left_index
right_index
sort

a detailed description is can be found here - https://pandas.pydata.org/pandas-docs/stable/user_guide/merging.html



```python
states_area
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Area_InSquareKM</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>50362</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Bihar</td>
      <td>94165</td>
    </tr>
  </tbody>
</table>
```python
states_codes
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>Code</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>HR</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>PB</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Rajasthan</td>
      <td>RJ</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Uttar Pradesh</td>
      <td>UP</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Madhya Pradesh</td>
      <td>MP</td>
    </tr>
  </tbody>
</table>
-- .merge : For column(s)-on-columns(s) operations
-- .join : Join DataFrames using their indexes., if need to be on specific keys, then set keys to be the index

```python
states_area.join(states_literacyrate,lsuffix='_FromArea',rsuffix='_FromLiteracy', how='outer')
```


<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State_FromArea</th>
      <th>Area_InSquareKM</th>
      <th>State_FromLiteracy</th>
      <th>Year</th>
      <th>Literacy Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212.0</td>
      <td>Haryana</td>
      <td>2011</td>
      <td>76.64</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>50362.0</td>
      <td>Rajasthan</td>
      <td>2011</td>
      <td>67.06</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290.0</td>
      <td>Uttar Pradesh</td>
      <td>2011</td>
      <td>69.72</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Bihar</td>
      <td>94165.0</td>
      <td>Haryana</td>
      <td>2001</td>
      <td>67.91</td>
    </tr>
    <tr>
      <th>4</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>Uttar Pradesh</td>
      <td>2001</td>
      <td>56.27</td>
    </tr>
    <tr>
      <th>5</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>Rajasthan</td>
      <td>2001</td>
      <td>60.41</td>
    </tr>
  </tbody>
</table>
```python
pd.merge(states_area,states_literacyrate, left_index=True, right_index=True, how='outer')
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State_x</th>
      <th>Area_InSquareKM</th>
      <th>State_y</th>
      <th>Year</th>
      <th>Literacy Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>44212.0</td>
      <td>Haryana</td>
      <td>2011</td>
      <td>76.64</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Punjab</td>
      <td>50362.0</td>
      <td>Rajasthan</td>
      <td>2011</td>
      <td>67.06</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Uttar Pradesh</td>
      <td>243290.0</td>
      <td>Uttar Pradesh</td>
      <td>2011</td>
      <td>69.72</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Bihar</td>
      <td>94165.0</td>
      <td>Haryana</td>
      <td>2001</td>
      <td>67.91</td>
    </tr>
    <tr>
      <th>4</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>Uttar Pradesh</td>
      <td>2001</td>
      <td>56.27</td>
    </tr>
    <tr>
      <th>5</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>Rajasthan</td>
      <td>2001</td>
      <td>60.41</td>
    </tr>
  </tbody>
</table>
```python
## merge on multiple columns
```


```python
city_states_literacy = pd.read_csv('City_States_Literacy.csv')
```


```python
city_states_area = pd.read_csv('City_States_Area.csv')
```


```python
city_states_area
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>City</th>
      <th>Area_InSquareKM</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>1</td>
      <td>983</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Haryana</td>
      <td>2</td>
      <td>886</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Rajasthan</td>
      <td>1</td>
      <td>881</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Rajasthan</td>
      <td>2</td>
      <td>980</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Rajasthan</td>
      <td>3</td>
      <td>895</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Rajasthan</td>
      <td>4</td>
      <td>1010</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Rajasthan</td>
      <td>5</td>
      <td>1075</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Bihar</td>
      <td>1</td>
      <td>802</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Bihar</td>
      <td>2</td>
      <td>859</td>
    </tr>
    <tr>
      <th>9</th>
      <td>Bihar</td>
      <td>3</td>
      <td>1020</td>
    </tr>
    <tr>
      <th>10</th>
      <td>Uttar Pradesh</td>
      <td>4</td>
      <td>945</td>
    </tr>
    <tr>
      <th>11</th>
      <td>Uttar Pradesh</td>
      <td>5</td>
      <td>787</td>
    </tr>
    <tr>
      <th>12</th>
      <td>Madhya Pradhes</td>
      <td>6</td>
      <td>983</td>
    </tr>
  </tbody>
</table>
```python
results_inner = pd.merge(city_states_literacy,city_states_area, left_on=['State','City'], right_on=['State','City'])
results_inner
```



<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>City</th>
      <th>Literacy Rate</th>
      <th>Area_InSquareKM</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>1</td>
      <td>74.78</td>
      <td>983</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Haryana</td>
      <td>2</td>
      <td>63.80</td>
      <td>886</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Rajasthan</td>
      <td>1</td>
      <td>61.68</td>
      <td>881</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Rajasthan</td>
      <td>2</td>
      <td>68.61</td>
      <td>980</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Rajasthan</td>
      <td>3</td>
      <td>70.78</td>
      <td>895</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Rajasthan</td>
      <td>4</td>
      <td>75.80</td>
      <td>1010</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Rajasthan</td>
      <td>5</td>
      <td>80.65</td>
      <td>1075</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Uttar Pradesh</td>
      <td>4</td>
      <td>73.77</td>
      <td>945</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Uttar Pradesh</td>
      <td>5</td>
      <td>60.61</td>
      <td>787</td>
    </tr>
  </tbody>
</table>
```python
pd.merge(city_states_literacy,city_states_area, left_on=['State','City'], right_on=['State','City'])
```




<table >
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>State</th>
      <th>City</th>
      <th>Literacy Rate</th>
      <th>Area_InSquareKM</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Haryana</td>
      <td>1</td>
      <td>74.78</td>
      <td>983</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Haryana</td>
      <td>2</td>
      <td>63.80</td>
      <td>886</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Rajasthan</td>
      <td>1</td>
      <td>61.68</td>
      <td>881</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Rajasthan</td>
      <td>2</td>
      <td>68.61</td>
      <td>980</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Rajasthan</td>
      <td>3</td>
      <td>70.78</td>
      <td>895</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Rajasthan</td>
      <td>4</td>
      <td>75.80</td>
      <td>1010</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Rajasthan</td>
      <td>5</td>
      <td>80.65</td>
      <td>1075</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Uttar Pradesh</td>
      <td>4</td>
      <td>73.77</td>
      <td>945</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Uttar Pradesh</td>
      <td>5</td>
      <td>60.61</td>
      <td>787</td>
    </tr>
  </tbody>
</table>
---

