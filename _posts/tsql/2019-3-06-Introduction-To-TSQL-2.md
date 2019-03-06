---
layout : post
title : Introduction to Transact-SQL - Part 2
categories: [tsql]
tags: [tsql, select, sql, data, sql server, database, AdventureWorks, duplicates, sorting, paging, filter, like]
---

```sql
/*
Removing Duplicates
Sorting Results
Paging Sorted Resuts
Filter

Select Distinct Color from Color_Table
Select Category from catTable Order By Catgeory Desc (default is ascending)

Limiting Results
Select Top 10 Color from Color_Table
Sleect top 10 percent color from color_table
select top 10 with ties color from color_table ( display all which are same color -
By default top 10 only give 1 where it found confict in duplicates use with ties to resolve this issue)
Top 10 order by desc will give you bottom

what if row no 50-60, then paginate the results

Order by list_items
offset 10 Rows/Row       # skip no. of rows (row for single row but both works)
fetch first/next 20 row/rows only # fetch (next 20 or first 20 after skipping, both works)

*/

select isnull(Color,'None') as Color from SalesLT.Product

select distinct isnull(Color,'None') as Color from SalesLT.Product

select distinct isnull(Color,'None') as Color from SalesLT.Product order by Color

select distinct isnull(Color,'None') as Color, IsnUll(Size, '-') from SalesLT.Product order by Color

select top 100 Name, ListPrice from SalesLT.Product order by ListPrice Desc
select top 10 Name,ListPrice from SalesLT.Product order by ProductNumber

-- offset 0 means from top
select Name, ListPrice from SalesLT.Product order by ProductNumber offset 0 Rows Fetch Next 10 Rows Only

select Name, ListPrice from SalesLT.Product order by ProductNumber offset 10 Rows Fetch Next 10 Rows Only

/*
=<>
In - matches value in a list
Between - inclusive both, i.e., betweenn 100 and 200 include 100 and 200
Like - string pattern
And
Or
Not
*/

Select Name, Color, Size from SalesLT.Product where ProductModelID <> 6

-- Start with FR
select productnumber, Name , ListPrice from SalesLT.Product where ProductNumber like 'FR%'
-- _ means fix number of any digit but fixed where % is variable
select Name, ListPrice, ProductNumber from SalesLT.Product where ProductNumber Like 'FR-_[5-6][5-9]_-[0-9][0-9]'

Select Name from SalesLT.Product where SellEndDate Is Not Null;

Select Name, SellEndDate from SalesLT.Product where SellEndDate Between '2006/1/1' and '2006/12/31'

Select Name, ProductCategoryID From SalesLT.Product where ProductCategoryID in (5,6,7) order by ProductCategoryID Desc

Select ProductCategoryID, Name, SellEndDate From SalesLT.Product where ProductCategoryID in (5,6,7) and SellEndDate Is Null

select Name, ProductCategoryID, ProductNumber From SalesLT.Product where ProductNumber like 'FR%' or ProductCategoryID IN (5,6,7)
```
