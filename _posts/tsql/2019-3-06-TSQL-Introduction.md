---
layout : post
title : T-SQL - Introduction (Part 1)
categories: [tsql]
tags: [tsql, select, sql, data, sql server, database, AdventureWorks, null, isnull, nullif, case, end, cast, convert, try_cast, select, datetime]
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

<b>SQL</b> is widely used language to interact with databases. It is a declarative language and not procedural, meaning to say that we are more concerned on achieving the output rather than how it is going to be achieved.  
T-SQL is Microsoft implementation of the SQL also called as Transact SQL.The following links can be accessed to have a detailed overview about the same.
* [T-SQL](https://en.wikipedia.org/wiki/Transact-SQL)
* [Microsoft Documentation](https://docs.microsoft.com/en-us/sql/?view=sql-server-2017)

Just to brief, in a database there are some relations which are also called as <b> Tables / Entities </b>, which have <b>Records (Rows)</b> and <b>Domains (Columns)</b>.Within tables we have some keys and constrains which are Primary Keys and Foreign Keys.

In SQL, there are three type of operation can be performed and we have various statements to do the same -
* Data Manipulation - Select, Insert, Update, Delete
* Data Definition - Create, Alter, Drop
* Data Control - Grant, Revoke, Deny

We'll focus on the data manipulation part which is mostly relates to data analysis and performing advance operations over the data, starting with following in this post -

* [SELECT Statement](#select-statement)
* [Data Type Conversion](#data-type-conversion)
* [Working With Null](#working-with-null)
* [Case And End](#case-and-end)

### SELECT statement
A <b>Select statement</b> looks like -
```sql
Select (5)
From (1)
Where - Filter rows (2)
Group By (3)
Having - filter groups (4)
Order By (6)
```
The number in brackets explains the order in which the query operates and hence we can see that select is executed in the last just before ordering of the columns. Rest all the statements are self-explanatory.

A general <b>Select</b> statement for getting out all/multiple columns with same/custom column names look like -
```sql
-- Selecting all columns from product table of production database
Select * from production.product
-- Selecting specific columns from product table of production database
Specific columns - select name, price from production.product
-- Alias - this means selecting some columns with another name,
-- This can be achieved by using as (optional)
-- The following script select name column with titles as Product,
-- Listprice column multiplied with 0.9 as SalePrice
select name as product , listprice*0.9 saleprice from prod.product
```

Some of the examples of select statements are as follows :-
* Return "Hello World"

```sql
select
  'Hello World';
```
* Select all columns from SalesLT.Product table

``` sql
select
  *
from
  SalesLT.Product;
```
* Select some of the columns, along with a <b>Custom Column</b> which equals to ListPrice - StandardCost.  
 Ths selection with create the new column, but as we haven't given it a name, the name of the column will appears a blank

```sql
select
  productID,
  Name,
  ListPrice,
  standardCost,
  ListPrice - StandardCost
from
  SalesLT.Product;
```

* Rename the custom column created with <b> Margin </b>
  - via as statement
  - without as statement, (this should be avoided as later it might create confusion)

``` sql
-- with as
select
  productID,
  Name,
  ListPrice,
  standardCost,
  ListPrice - StandardCost AS Margin
from
  SalesLT.Product;

-- without as
select
  productID,
  Name,
  ListPrice,
  standardCost,
  ListPrice - StandardCost Margin
from
  SalesLT.Product;
```
* Creating new column by joining two or more columns.
  - Works well wherever the datatype of the two is similar
  - Fails when the datatype mismatches like Integer column with String

``` sql
-- will run successfully
select
  productID,
  Name,
  Color,
  Size,
  Color + Size As Style
from
  SalesLT.Product;

-- will give an error, due to different data types
select
  productID,
  Name,
  Color,
  Size,
  ListPrice + Size As Style
from
  SalesLT.Product;
```

### Data Type Conversion

Try function convert whatever can be converted and put rest as null
* Converting data from one type to another. This can be achieved using
  - Cast, Convert
  - Try_cast, Try_convert
  - Parse, Try_parse
  - Str
The try versions of Cast, Convert and Parse try to convert to the data type as required and return Null if it fails.

* Casting Product ID as variable character and then joining it with column Name and returning the output as Product Name column in which output looks like 'ProductID:Name'

``` sql
select
  cast(
    ProductID As varchar(5)
  ) + ':' + Name as ProductName
from
  SalesLT.Product
```
* The same can be acheived using convert function, but there is slight modification in the syntax of the same. Convert is very useful when working with datetimes.

``` sql
select
  convert(
    varchar(5),
    ProductID
  ) + ':' + Name as ProductName
from
  SalesLT.Product
```
* Using Convert to convert dates in prescribed formats, code 126 is used to convert dates in ISO format.  
Please visit this for more details around the same - [Cast and Convert](https://docs.microsoft.com/en-us/sql/t-sql/functions/cast-and-convert-transact-sql?view=sql-server-2017)

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

* Casting Size column as Integer will fail in this case as the column contains some string values as well
* This can be handled by using try_cast which in results will cast whatever which can be converted Integer and wherever it fails, will return Null

``` sql
-- query fails due to multiple datatypes in same column
select
  Name,
  Cast(Size as Integer) as NumericSize
from
  SalesLT.Product
-- this will run and cast all integers and returns nulls wherever fails
select
  name,
  TRY_CAST(Size as Integer) as numericSize
from
  SalesLT.Product
```
### Working With Null
A SQL NULL is used to represent a missing value and anything with mathematical operation over NULL with return NULL.  
For example -  2+NULL = NULL  
Comparison of two NULL values, hence will return False as we don't know what those two values can be - meaning to say that 'NULL = NULL is <b>False</b>'

There are some SQL functions which are used to handle nulls. These are -
* <b>ISNUll</b> - Return value if column is null, can be used to check Nulls, as it will return TRUE for NUll Values
* <b>NullIf</b> - Return null if column is value, explicitly marked certain values as NULL
* <b>Coalesce</b> - Returns first non null column in the list

These functions can be used as -
* Wherever Size is null, replace it with 0

``` sql
select
  Name,
  ISNULL(
    Try_cast(Size as Integer),
    0
  ) as NumericSize
from
  SalesLT.Product
```
*  Replace Null in column Color and Size with '' and join both separated by ', 'and return the output in new column called ProductDetails

``` sql
select
  ProductNumber,
  Isnull(Color, '')+ ', ' + ISNULL(Size, '') as ProductDetails
from
  SalesLT.Product
```
* Replace Null with 'Multi' in Color column

``` sql
select
  Name,
  IsNull(Color, 'Multi') As SingleColor
from
  SalesLT.Product
```

* If value of Color column is 'Multi', replace it with Null

``` sql
select
  Name,
  NullIF(Color, 'Multi') As SingleColor
from
  SalesLT.Product
```

* Return the first non-null column among these three columns -
  - DiscontinuedDate
  - SellEndDate
  - SellStartDate  

in a new column called LastActivity

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
  SalesLT.Product
```
### Case And End

* A simple if else argument using <b>Case and End with When </b> statement
The query operates on SellEndDate column, and wherever it is null, it categories those *On Sale* and otherwise *Discontinued* and then rename this column as SaleStatus

``` sql
Select
  Name,
  Case
    When SellEndDate IS NULL Then 'On Sale' Else 'Discontinued'
  End AS SaleStatus
From
  SalesLT.Product
```
* With *multiple When* statements

``` sql
Select
  Name,
  Case Size
	When 'S' Then 'Small'
	When 'M' Then 'Medium'
	When 'L' Then 'Large'
	when 'XL' Then 'Extra - Large'
	Else IsNULL(Size, 'n/a')
   End As ProductSize
from
  SalesLT.Product
```
<hr>
