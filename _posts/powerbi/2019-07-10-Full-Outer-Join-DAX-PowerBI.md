---
layout : post
title : Full Outer Join in DAX in PowerBI
categories: [powerbi]
tags: [Power BI, DAX, Outer Join, Full Outer Join, Merge, Left Join, Right Anti Join]
---

---
### Full Outer Join 
<!--break-->

Full outer join returns all rows in both the table.  

**Example** -  
We have **Department** and **Employee** table as -  


![Department](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T1.jpg "Department") &nbsp;&nbsp;&nbsp;&nbsp;![Employee](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T2.jpg "Employee")

The relationship between the two is as shown - 

![One to Many Relationship](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T4.jpg "Relationship")

The full outer join can be acheived by creating two separates join and appending one below another i.e., 

* Left Outer Join
* Right Anti Join


![Full Outer Join](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T7.png "Full Outer") &nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;![Left Outer Join](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T5.png "Left Outer")&nbsp;&nbsp;&nbsp;&nbsp; + &nbsp;&nbsp;&nbsp;&nbsp;![Anti Right Join](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T6.png "Anti Right")

### Full Outer Join

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
![Full Outer Join](/static/img/posts/powerbi/2019-07-10-Full-Outer-Join-DAX/T3.jpg "Full Outer Join")
