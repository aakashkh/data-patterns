---
layout : post
title : Using Functions and aggregating data in TSQL
categories: [tsql]
tags: [tsql,  sql, data, sql server, database, AdventureWorks, Functions, Logical, window, grou by, groupby, aggregate]
---
## Functions in TSQL  
We can use multiple inbuilt functions in TSQL to achieve complex tasks in a very simpler manner. The first one in this category is -

### Scalar functions
These functions returns a single value, for example - Year(), Day(), Upper()
https://docs.microsoft.com/en-us/sql/t-sql/functions/functions?view=sql-server-2017

The following query will give Year of the SellStartDate, and the scalar function used here is Year().
```sql
Select
  Year(SellStartDate) as SellStartYear,
  ProductID,
  Name
From
  SalesLT.Product
Order BY
  SellStartYear
```
The following query will give -
* Year of SellStartDate
* Month (as 'DATENAME' takes parameter 'MM' according to the output required) of SellStartDate
* Day of SellStartDate
* WeekDay of SellStartDate
and other required columns.

```sql
Select
  Year(SellStartDate) as SellStartYear,
  DATENAME(mm, SellStartDate) as SellStartMonth,
  Day(SellStartDate) as SellStartDate,
  DATENAME(dw, SellStartdate) as SellStartWeekday,
  ProductID,
  Name
From
  SalesLT.Product
order by
  SellStartYear
```
The following query will give the difference between two dates - SellStartDate and Today's date and the difference here is shown in no. of years which is set by the parameter 'YY' in 'DATEDIFF' function.

```sql
Select
  DATEDIFF(
    YY,
    SellStartDate,
    GetDate()
  ) as YearSold,
  ProductID,
  Name
from
  SalesLT.Product
Order By
  ProductID
```
This is simple one, and will return ProductName in Upper Case
```sql
Select
  UPPER(Name) as ProductName
from
  SalesLT.Product
```
This one will return FirstName and Last Name, separated by a space
```sql
Select
  CONCAT(FirstName, ' ', LastName) As FullName
from
  SalesLT.Customer
```
Multiple substring functions can also be used like LEFT(), which is used to extract the leftmost number of characters by passing the parameter accordingly.
```sql
Select
  Name,
  ProductNumber,
  Left(ProductNumber, 2) as ProductType
from
  SalesLT.Product
```
#### <u> Spltiing by Delimitter  </u>

The following query is a complex one and each operations is explained as -
For Example - the Product Number is 'FR-R92B-58'
* ProductType = FR
  - Simplest one, first two digits
* ModelCode = R92B
  - Next four digit after the character '-', increment by one once the index in known
* SizeCode = 58
  - Calculate the total length of the substring
  - Find the index of second character '-', which can be found by getting the last three digit and reversing the same and adjusting the index accordingly.

This complex operation will still work if no. of characters are not fixed within the separator.
As in this case, the no of characters are fixed, the following operation will also suffice -
``Substring(ProductNumber,9,2)``

```sql
Select
  Name,
  ProductNumber,
  Left(ProductNumber, 2) as ProductType,
  Substring(
    ProductNumber,
    charindex('-', ProductNumber)+ 1,
    4
  ) as ModelCode,
  Substring(
    ProductNumber,
    Len(ProductNumber) - Charindex(
      '-',
      Reverse(
        Right(ProductNumber, 3)
      )
    )+ 2,
    2
  ) as SizeCode
from
  SalesLT.Product
```
<hr>
### Logical functions
The are used to work on True, False situations.
* IsNumeric - check whether value is numeric or not
*
```sql
--1 is TRUE, 0 is FALSE
Select
  Name,
  Size as NumericSize
from
  SalesLT.Product
where
  ISNUMERIC(Size)= 1
```
* IIF - short if else statement, can be used nested for complex queries

```sql
Select
  Name,
  iif(
    ProductCategoryID IN (5, 6, 7),
    'Bike',
    'Other'
  ) as ProductType
From
  SalesLT.Product
```
```sql
Select
  Name,
  IIF(
    IsNUmeric(Size) = 1,
    'Numeric',
    'Non-Numeric'
  ) as SizeType
from
  SalesLT.Product
```
* Choose - Used to convert categories into some order
As in this example, it will give
  - Bikes - 1
  - Components - 2
  - Clothing - 3
  - Accessories - 4

```sql
Select
  prd.Name as ProductName,
  cat.Name as Category,
  choose (
    cat.ParentProductCategoryID, 'Bikes',
    'Components', 'Clothing', 'Accessories'
  ) as ProductType,
  cat.ParentProductCategoryID
From
  SalesLT.Product as prd
  JOIN SalesLT.ProductCategory as cat on prd.ProductCategoryID = cat.ProductCategoryID
```
<hr>

### Window Functions
These are applied to set of rows - examples Rank, Offset, aggregate, distribute

<b> Rank </b>
* <b> Ranking in a order </b>

If two values are the same rank, the next one following will be ranked but the distance i.e., how far its from the top one and not in increment mannner.
For example,
* A - 120 - 1
* B - 120 - 1
* C - 118 - 3  

The C is not ranked as 2, but as 3
```sql
Select
  TOP(100) ProductID,
  Name,
  ListPrice,
  Rank() OVER(
    Order BY
      ListPrice Desc
  ) as RankByPrice
From
  SalesLT.Product
Order BY
  RankByPrice
```
- <b> Ranks within a group </b>

This can be achieved by Partition By statement.
The following example find the rank within the product category based on list price.
```sql
Select
  c.Name as category,
  p.name as product,
  ListPrice,
  Rank() Over(
    Partition BY c.Name
    Order BY
      ListPrice DESC
  ) As RankByPrice
from
  SalesLT.Product as p
  JOIN SalesLT.ProductCategory as c on p.ProductCategoryID = c.ProductCategoryID
order by
  Category,
  RankByPrice

```
<hr>

<b> Aggregate </b>

Simple mathematical function to summarize data like Count, Distinct, Avg, Max, Sum

```sql
Select
  Count(*) as Products,
  Count(Distinct ProductCategoryID) as Categories,
  AVG(ListPrice) as AveragePrice
from
  SalesLT.Product
```
```sql
Select
  count(p.ProductID) as BikeModels,
  Avg(ListPrice) as AveragePrice
from
  SalesLT.Product as p
  join SalesLT.ProductCategory as c on p.ProductCategoryID = c.ProductCategoryID
where
  c.Name Like '%Bikes'

```
<hr>
### Group By
Group By statement is used to group the data at some categories and then display the associated aggregations for each group. Grouping can be done at multiple levels as well.

For example the following query group at SalesPerson and for each sales person shows the total revenue in descending order

```sql
Select
  c.SalesPerson,
  ISNULL(
    SUM(oh.Subtotal),
    0.00
  ) as SalesRevenue
From
  SalesLT.Customer as c
  Left Join SalesLT.SalesOrderHeader as oh on c.CustomerID = oh.CustomerID
group by
  c.SalesPerson
order by
  SalesRevenue desc
```
``Note: As groupby runs before select in SQL, we need to pass the whole function in groupby if a new column is created``  

For example -
```sql
Select
  c.SalesPerson,
  concat(c.FirstName + ' ', c.LastName) as Customer,
  ISNULL(
    SUM(oh.Subtotal),
    0.00
  ) as SalesRevenue
From
  SalesLT.Customer as c
  Left Join SalesLT.SalesOrderHeader as oh on c.CustomerID = oh.CustomerID
group by
  c.SalesPerson,
  CONCAT(c.FirstName + ' ', c.LastName)
order by
  SalesRevenue desc
```

- <b> Filtering the Groups </b>

Groups can be filter using 'HAVING' statement and not 'WHERE'.  
The following command will give and error on filtering group using where clause.
```sql
Select
  ProductID,
  Sum(sod.OrderQty) as Quantity
from
  SalesLT.SalesOrderDetail as sod
  join SalesLT.SalesOrderHeader as soh on sod.SalesOrderID = soh.SalesOrderID
where
  Year(soh.OrderDate) = 2008
  and sum(sod.OrderQty) > 50
group BY
  ProductID
```
``Msg 147, Level 15, State 1, Line 9
An aggregate may not appear in the WHERE clause``
``unless it is in a subquery contained in a HAVING clause or a select list,``
``and the column being aggregated is an outer reference``

But this works fine -

```sql
Select
  ProductID,
  Sum(sod.OrderQty) as Quantity
from
  SalesLT.SalesOrderDetail as sod
  join SalesLT.SalesOrderHeader as soh on sod.SalesOrderID = soh.SalesOrderID
where
  Year(soh.OrderDate) = 2008
group BY
  ProductID
having
  sum(sod.OrderQty) > 50
 ```
