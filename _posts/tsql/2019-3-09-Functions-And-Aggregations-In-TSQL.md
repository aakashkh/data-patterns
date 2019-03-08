---
layout : post
title : Using Functions and aggregating data in TSQL
categories: [tsql]
tags: [tsql,  sql, data, sql server, database, AdventureWorks, Functions, Logical, window, grou by, groupby, aggregate]
---

```sql

  /* Functions */
/* Scalar functions - return a single value */

Select Year(SellStartDate) as SellStartYear, ProductID, Name From SalesLT.Product Order BY SellStartYear

Select Year(SellStartDate) as SellStartYear, DATENAME(mm, SellStartDate) as SellStartMonth, Day(SellStartDate) as SellStartDate, DATENAME(dw, SellStartdate) as SellStartWeekday, ProductID, Name From SalesLT.Product order by SellStartYear

Select DATEDIFF(YY, SellStartDate, GetDate()) as YearSold, ProductID, Name from SalesLT.Product Order By ProductID

Select UPPER(Name) as ProductName from SalesLT.Product

Select CONCAT(FirstName ,' ', LastName) As FullName from SalesLT.Customer

Select Name, ProductNumber, Left(ProductNumber, 2) as ProductType from SalesLT.Product

Select Name, ProductNumber, Left(ProductNumber, 2) as ProductType, Substring(ProductNumber,charindex('-',ProductNumber)+1,4) as ModelCode, Substring(ProductNumber, Len(ProductNumber) - Charindex('-', Reverse(Right(ProductNumber,3)))+2,2) as SizeCode from SalesLT.Product

/* Logical Function -
IsNumeric
IIF
Choose - Categories to specific named categories used as  1,2,3,4
*/

--1 is TRUE
Select Name, Size as NumericSize from SalesLT.Product where ISNUMERIC(Size)=1

Select Name, iif(ProductCategoryID IN (5,6,7),'Bike','Other') as ProductType From SalesLT.Product

Select Name, IIF(IsNUmeric(Size) =1, 'Numeric','Non-Numeric') as SizeType from SalesLT.Product

Select prd.Name as ProductName, cat.Name as Category, choose (cat.ParentProductCategoryID,'Bikes','Components','Clothing','Accessories') as ProductType, cat.ParentProductCategoryID From SalesLT.Product as prd JOIN SalesLT.ProductCategory as cat on prd.ProductCategoryID = cat.ProductCategoryID

/* Window - applies to set of rows
Rank, Offset, aggregate, distribute
*/

-- Rank same no. same rank but next number is how far it is i.e., index column with rank
Select TOP(100) ProductID, Name, ListPrice, Rank() OVER(Order BY ListPrice Desc) as RankByPrice From SalesLT.Product Order BY RankByPrice

-- Group BY Product Category and within group same rank
Select c.Name as category, p.name as product, ListPrice, Rank() Over(Partition BY c.Name Order BY ListPrice DESC) As RankByPrice from SalesLT.Product as p JOIN SalesLT.ProductCategory as c on p.ProductCategoryID = c.ProductCategoryID order by Category, RankByPrice

/* Aggregate Function */
Select Count(*) as Products, Count(Distinct ProductCategoryID) as Categories,AVG(ListPrice) as AveragePrice  from SalesLT.Product

Select count(p.ProductID) as BikeModels, AVg(ListPrice) as AveragePrice from SalesLT.Product as p join SalesLT.ProductCategory as c on p.ProductCategoryID = c.ProductCategoryID where c.Name Like '%Bikes'

/* GroupBY */
Select c.SalesPerson, ISNULL(SUM(oh.Subtotal),0.00) as SalesRevenue From SalesLT.Customer as c Left Join SalesLT.SalesOrderHeader as oh on c.CustomerID= oh.CustomerID group by c.SalesPerson order by SalesRevenue desc

-- as groupby runs before select in SQL, we need to pass the whole function in groupby
Select c.SalesPerson, concat(c.FirstName + ' ', c.LastName) as Customer,ISNULL(SUM(oh.Subtotal),0.00) as SalesRevenue From SalesLT.Customer as c Left Join SalesLT.SalesOrderHeader as oh on c.CustomerID= oh.CustomerID group by c.SalesPerson, CONCAT(c.FirstName + ' ', c.LastName) order by SalesRevenue desc

/* Having - filtering group, search condition thate group satisfy */
Select ProductID, Sum(sod.OrderQty) as Quantity from SalesLT.SalesOrderDetail as sod join SalesLT.SalesOrderHeader as soh on sod.SalesOrderID = soh.SalesOrderID where Year(soh.OrderDate) = 2008 group BY ProductID

-- give error, group can be filter using having
Select ProductID, Sum(sod.OrderQty) as Quantity from SalesLT.SalesOrderDetail as sod join SalesLT.SalesOrderHeader as soh on sod.SalesOrderID = soh.SalesOrderID where Year(soh.OrderDate) = 2008 and sum(sod.OrderQty) > 50
 group BY ProductID

 Select ProductID, Sum(sod.OrderQty) as Quantity from SalesLT.SalesOrderDetail as sod join SalesLT.SalesOrderHeader as soh on sod.SalesOrderID = soh.SalesOrderID where Year(soh.OrderDate) = 2008 group BY ProductID  having sum(sod.OrderQty) > 50
 ```
