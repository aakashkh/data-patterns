---
layout : post
title : Querying multiple tables using Set Operators
categories: [tsql]
tags: [tsql,  sql, data, sql server, database, AdventureWorks, Union, Intersect, Except, Append]
---
```sql

/* Union, Intersectm Except
Union returns result set of distinct rows combined from all statements
Union all retains duplicates
Column Names aka are decided in the first query only not in further queries,
No. of Columns should be same and compatible data types
*/

Select FirstName, LastName , 'Employee' As Type
From SalesLT.Customer
Union
Select FirstName, LastName, 'Employee Duplicate'
From SalesLT.Customer
Order By LastName;


Select FirstName, LastName , 'Employee' As Type
From SalesLT.Customer
Union ALL
Select FirstName, LastName, 'Employee Duplicate'
From SalesLT.Customer
Order By LastName;

/* Intersect and Except
Intersect -  Distinct Rows that exist in both sets.
Select A,B from T1
Intersect
Select A,B from T2

Except
Distinct rows in the first set but not in the second.
Select A,B from T1
Except
Select A,B from T2
*/

```
