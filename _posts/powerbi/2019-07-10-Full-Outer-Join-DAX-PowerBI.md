---
layout : post
title : Full Outer Join in DAX in PowerBI
categories: [powerbi]
tags: [Power BI, DAX, Outer Join, Full Outer Join, Merge, Left Join, Right Anti Join]
---

---
To begin with, we have **Department**  table as -  

<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
<thead>
    <tr style="text-align: right;">
      <th></th>
      <th>DepID</th>
      <th>Dep Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>Marketing</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>HR</td>
    </tr>
    <tr>
      <th>2</th>
      <td>4</td>
      <td>Finance</td>
    </tr>
    <tr>
      <th>3</th>
      <td>5</td>
      <td>Operations</td>
    </tr>
  </tbody>
</table>
</div>
<br>
and **Employee** tables as - 

<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
<thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Emp Id</th>
      <th>Name</th>
      <th>Income</th>
      <th>DepID</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>Shivani</td>
      <td>200</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>Rob</td>
      <td>133</td>
      <td>1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>Chris</td>
      <td>190</td>
      <td>2</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>Tom</td>
      <td>200</td>
      <td>2</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>Ria</td>
      <td>120</td>
      <td>3</td>
    </tr>
  </tbody>
</table>
</div>
<!--break-->
<br>

The two tables relates on **DepID** column with one to many relatioship between Department to Employee table.

### Full Outer Join
According to [Wikipedia](https://en.wikipedia.org/wiki/Join_(SQL)#Full_outer_join){:target="_blank"} -

**"Conceptually, a full outer join combines the effect of applying both left and right outer joins. Where rows in the FULL OUTER JOINed tables do not match, the result set will have NULL values for every column of the table that lacks a matching row. For those rows that do match, a single row will be produced in the result set (containing columns populated from both tables)."**

So, the Full Outer Join can be acheived by creating -

* Left Outer Join
* Right Anti Join  

![Full Outer Join](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T7.png "Full Outer") &nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;![Left Outer Join](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T5.png "Left Outer")&nbsp;&nbsp;&nbsp;&nbsp; + &nbsp;&nbsp;&nbsp;&nbsp;![Anti Right Join](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T6.png "Anti Right")


This DAX query for the same in PowerBI can be written as - 
```sql
FullOuterJoin = UNION(

    var DepartmentLeftOuterJoinEmp = NATURALLEFTOUTERJOIN(Department,RELATEDTABLE(Employee))
    return SELECTCOLUMNS(DepartmentLeftOuterJoinEmp,
        "DepID", Department[DepID],
        "EmpID", [Emp Id],
        "Income", [Income],
        "Name",[Name],
        "DepName",[Dep Name]
    ),

    var DepartmentUniqueIds = DISTINCT(Department[DepID])
    return SELECTCOLUMNS(CALCULATETABLE(Employee, NOT(Employee[DepID] in DepartmentUniqueIds)),
        "DepID", [DepID],
        "EmpID", [Emp Id],
        "Income", [Income],
        "Name",[Name],
        "DepName"," "
        )
)
```
###### **Output:**
<div class="table-responsive">
<table class="table-sm table-hover table-striped table-condensed table-bordered">
 <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>DepID</th>
      <th>Dep Name</th>
      <th>Emp Id</th>
      <th>Name</th>
      <th>Income</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>Marketing</td>
      <td>1</td>
      <td>Shivani</td>
      <td>200</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>Marketing</td>
      <td>2</td>
      <td>Rob</td>
      <td>133</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2</td>
      <td>HR</td>
      <td>3</td>
      <td>Chris</td>
      <td>190</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2</td>
      <td>HR</td>
      <td>4</td>
      <td>Tom</td>
      <td>200</td>
    </tr>
    <tr>
      <th>4</th>
      <td>3</td>
      <td></td>
      <td>5</td>
      <td>Ria</td>
      <td>120</td>
    </tr>
    <tr>
      <th>5</th>
      <td>4</td>
      <td>Finance</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>6</th>
      <td>5</td>
      <td>Operations</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>
</div>
<hr>
**Note**:  
* Another way to solve the same can be: **Left Outer Join + Right Outer Join - Inner Join**  
  This can be achived in DAX in PowerBI by using: **Distinct(Union(LeftOuterJoin,RightOuterJoin))**
<hr>