---
layout : post
title : Introduction to Transact-SQL - Part 2
categories: [tsql]
tags: [tsql, select, sql, data, sql server, database, AdventureWorks, duplicates, sorting, paging, filter, like]
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

In the last post, we started with Introduction to T-SQL, where some of the forms of <b>SELECT</b> statement were discussed, along with examples regarding <b> Data Type Conversion </b>, <b>Working with NULLs</b> and <b>CASE-END</b> operations were shown.  
You can follow the same - [Introduction to Transact-SQL - Part 1](https://aakashkh.github.io/tsql/2019/03/06/Introduction-To-TSQL.html)

We'll be discussing these in this post -
* [Removing Duplicates](#removing-duplicates)
* [Sorting Results](#sorting-results)
* [Paging Sorted Results](#paging-sorted-results)
* [Filtering Data](#filtering-data)

### Removing Duplicates
<b> Distinct </b> is used for getting results distinct values from the selected columns

* The following queries results in a column with distinct Color names with *null* replaced as *None*, creating a new category for such cases.

```sql
select
  distinct isnull(Color, 'None') as Color
from
  SalesLT.Product
```
### Sorting Results
<b> Order By </b> is used to order the final output return by sql queries by the order of the column in ascending / descending manner. The default order is ascending.
* The following queries will give the distinct color names sorted alphabetically.

``` sql
select
  distinct isnull(Color, 'None') as Color
from
  SalesLT.Product
order by
  Color
```
* This one will do the same, sorting the output in alphabetical manner by column color of the output returned. Here we are bringing distinct values of color with replacing *null* by *None* in Color column and for each color bringing the size associated with them where *null* values are replaced by *-* character.
```sql
select
  distinct isnull(Color, 'None') as Color,
  isnull(Size, '-')
from
  SalesLT.Product
order by
  Color
```




Limiting Results
```sql
Select Category from catTable Order By Catgeory Desc

Select Top 10 Color from Color_Table
Sleect top 10 percent color from color_table
select top 10 with ties color from color_table ( display all which are same color -
By default top 10 only give 1 where it found confict in duplicates use with ties to resolve this issue)
Top 10 order by desc will give you bottom
```

what if row no 50-60, then paginate the results
```sql
Order by list_items
offset 10 Rows/Row       # skip no. of rows (row for single row but both works)
fetch first/next 20 row/rows only # fetch (next 20 or first 20 after skipping, both works)
````


```sql
select
  top 100 Name,
  ListPrice
from
  SalesLT.Product
order by
  ListPrice Desc
```
``` sql
select
  top 10 Name,
  ListPrice
from
  SalesLT.Product
order by
  ProductNumber -- offset 0 means from top
```
``` sql
select
  Name,
  ListPrice
from
  SalesLT.Product
order by
  ProductNumber offset 0 Rows Fetch Next 10 Rows Only
```
``` sql
select
  Name,
  ListPrice
from
  SalesLT.Product
order by
  ProductNumber offset 10 Rows Fetch Next 10 Rows Only
```
  /*
  =<>
  In - matches value in a list
  Between - inclusive both, i.e., betweenn 100 and 200 include 100 and 200
  Like - string pattern
  And
  Or
  Not
``` sql
Select
  Name,
  Color,
  Size
from
  SalesLT.Product
where
  ProductModelID <> 6 -- Start with FR
```
``` sql
select
  productnumber,
  Name,
  ListPrice
from
  SalesLT.Product
where
  ProductNumber like 'FR%' -- _ means fix number of any digit but fixed where % is variable
```

``` sql
select
  Name,
  ListPrice,
  ProductNumber
from
  SalesLT.Product
where
  ProductNumber Like 'FR-_[5-6][5-9]_-[0-9][0-9]'
```
``` sql
Select
  Name
from
  SalesLT.Product
where
  SellEndDate Is Not Null;
```
``` sql
Select
  Name,
  SellEndDate
from
  SalesLT.Product
where
  SellEndDate Between '2006/1/1'
  and '2006/12/31'
```
``` sql
Select
  Name,
  ProductCategoryID
From
  SalesLT.Product
where
  ProductCategoryID in (5, 6, 7)
order by
  ProductCategoryID Desc
```
``` sql
Select
  ProductCategoryID,
  Name,
  SellEndDate
From
  SalesLT.Product
where
  ProductCategoryID in (5, 6, 7)
  and SellEndDate Is Null
```
``` sql
select
  Name,
  ProductCategoryID,
  ProductNumber
From
  SalesLT.Product
where
  ProductNumber like 'FR%'
  or ProductCategoryID IN (5, 6, 7)

```
