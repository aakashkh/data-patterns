---
layout : post
title : T-SQL - Querying multiple tables using Set Operators
categories: [tsql]
tags: [tsql,  sql, data, sql server, database, AdventureWorks, Union, Intersect, Except, Append]
---
<hr />
<hr />
``Note : The following scripts are the part of the course on edx titled as: Querying Data with Transact-SQL - ``  
[Querying Data with Transact-SQL](https://www.edx.org/course/querying-data-with-transact-sql-0)  
`` These queries works on AdventureWorks database and information regarding the same ``  
`` can be accessed by visiting following link - ``  
[AdventureWorks Installation and configuration](https://docs.microsoft.com/en-us/sql/samples/adventureworks-install-configure?view=sql-server-2017)
<hr />
<hr />
Union, Intersectm Except
Union returns result set of distinct rows combined from all statements
Union all retains duplicates
Column Names aka are decided in the first query only not in further queries,
No. of Columns should be same and compatible data types

```sql
Select FirstName, LastName , 'Employee' As Type
From SalesLT.Customer
Union
Select FirstName, LastName, 'Employee Duplicate'
From SalesLT.Customer
Order By LastName;
```
``` sql
Select FirstName, LastName , 'Employee' As Type
From SalesLT.Customer
Union ALL
Select FirstName, LastName, 'Employee Duplicate'
From SalesLT.Customer
Order By LastName;
```


Intersect and Except
Intersect -  Distinct Rows that exist in both sets.

```sql
Select A,B from T1
Intersect
Select A,B from T2
```
```sql
Except
Distinct rows in the first set but not in the second.
Select A,B from T1
Except
Select A,B from T2
```
<hr>
