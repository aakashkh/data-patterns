---
layout : post
title : Introduction to Transact-SQL - Part 1
categories: [tsql]
tags: [tsql, select, sql, data, sql server, database, AdventureWorks, null, select, datetime]
---

SQL - widely used
T-SQL - Microsoft implementation of SQL also called as Transact SQL
SQL is a declarative and not Procedural

Relations (Tables) - Entities
Domains (Columns)
Primary Key and Foreign Keys

Objects - Tables, Views, Stored Procedures
Objects are aranged in Shcema, .e., namespace for databse objects.

Data Manipulation Laguage - Select, insert, update, delete
Data Deifinition Language - create, alter, drop
Data Control Language - gramt, revoke, deny

The Select Statement (Bracket line executes order)
1. Select (5)
2. From (1)
3. Where - Filter rows (2)
4. Group By (3)
5. Having - filter groups (4)
6. Order By (6)


1. All columns - Select * from production.product;
2. Specific columns - select name, price from prod.product
3. Aliases - select name as product, listprice*0.9 as saleprice from prod.product
select name product , listprice*0.9 saleprice from prod.product (no need to use as)


```sql
select
  'Hello World';
```
``` sql
select
  *
from
  SalesLT.Product;
```

``` sql
select
  productID,
  Name,
  ListPrice,
  standardCost,
  ListPrice - StandardCost
from
  SalesLT.Product;
```
``` sql
select
  productID,
  Name,
  ListPrice,
  standardCost,
  ListPrice - StandardCost AS Margin
from
  SalesLT.Product;
-- should be avoided, always use AS
```
``` sql
select
  productID,
  Name,
  ListPrice,
  standardCost,
  ListPrice - StandardCost Margin
from
  SalesLT.Product;
```
``` sql
select
  productID,
  Name,
  Color,
  Size
from
  SalesLT.Product;
-- Null means unknown and hence Red + NUll  is NUll
```
``` sql
select
  productID,
  Name,
  Color,
  Size,
  Color + Size As Style
from
  SalesLT.Product;
-- will give an error, diffeent data types
```
```sql
select
  productID,
  Name,
  Color,
  Size,
  ListPrice + Size As Style
from
  SalesLT.Product;
```

Data type conversion
cast / try_cast
convert / try_convert
parse/try_parse
str
Try function convert whatever can be converted and put rest as null


-- CAST
``` sql
select
  cast(
    ProductID As varchar(5)
  ) + ':' + Name as ProductName
from
  SalesLT.Product -- Convert
```
``` sql
select
  convert(
    varchar(5),
    ProductID
  ) + ':' + Name as ProductName
from
  SalesLT.Product -- convert dates
```
``` sql
select
  SellStartDate,
  convert(
    nvarchar(30),
    SellStartDate
  ) as ConvertedDate,
  convert(
    nvarchar(30),
    SellStartDate,
    126
  ) as ISOFOrmattedDate
from
  SalesLT.Product
```

``` sql
	-- Try to cast, will throw an error
select
  Name,
  Cast(Size as Integer) as NumericSize
from
  SalesLT.Product -- convert use try and it will replace errors with null
```
``` sql
select
  name,
  TRY_CAST(Size as Integer) as numericSize
from
  SalesLT.Product
```

  working with Null
  2+NULL = NULL
  NULL = NULL is False
  NULL Is NULL is True
  ISNUll - is a column is null, return value if column is null
  NullIf - return null if column is value
  Coalesce, returns first no null column in the list
``` sql
  -- Null as 0
select
  Name,
  ISNULL(
    Try_cast(Size as Integer),
    0
  ) as NumericSize
from
  SalesLT.Product -- null, strings = blank string
```
``` sql
select
  ProductNumber,
  Isnull(Color, '')+ ', ' + ISNULL(Size, '') as ProductDetails
from
  SalesLT.Product
```
``` sql
select
  Name,
  IsNull(Color, 'Multi') As SingleColor
from
  SalesLT.Product
```
``` sql
select
  Name,
  NullIF(Color, 'Multi') As SingleColor
from
  SalesLT.Product -- first non null date
```
``` sql
select
  Name,
  DiscontinuedDate,
  SellEndDate,
  SellStartDate,
  Coalesce(
    DiscontinuedDate, SellEndDate, SellStartDate
  ) as LastActivity
from
  SalesLT.Product -- CASE
```
``` sql
Select
  Name,
  Case When SellEndDate IS NULL Then 'On Sale' Else 'Discontinued' End AS SaleStatus
From
  SalesLT.Product -- Simple Case
```
``` sql
Select
  Name,
  Case Size When 'S' Then 'Small' When 'M' Then 'Medium' When 'L' Then 'Large' when 'XL' Then 'Extra - Large' Else IsNULL(Size, 'n/a') End As ProductSize
from
  SalesLT.Product ```
```
