---
title: "Advanced SQL: Window Functions & CTEs"
date: 2025-11-27T10:00:00+05:30
description: "Deep dive into advanced SQL concepts including Window Functions, Common Table Expressions (CTEs), and recursive queries."
categories: ["SQL", "Database"]
tags: ["sql", "window-functions", "cte", "advanced", "queries"]
toc: true
draft: false
series: "sql"
weight: 2
---

# Advanced SQL: Window Functions & CTEs

Building on our SQL basics, this post explores powerful features that allow for complex data analysis directly within the database.

## Common Table Expressions (CTEs)

CTEs provide a way to write auxiliary statements for use in a larger query. They can be thought of as temporary result sets that are defined within the execution scope of a single SELECT, INSERT, UPDATE, DELETE, or CREATE VIEW statement.

### Basic CTE Syntax

```sql
WITH Sales_CTE AS (
    SELECT SalesPersonID, SUM(TotalDue) AS TotalSales
    FROM Sales.SalesOrderHeader
    WHERE OrderDate >= '2023-01-01'
    GROUP BY SalesPersonID
)
SELECT s.SalesPersonID, s.TotalSales, sp.SalesQuota
FROM Sales_CTE s
JOIN Sales.SalesPerson sp ON s.SalesPersonID = sp.BusinessEntityID
WHERE s.TotalSales > sp.SalesQuota;
```

## Window Functions

Window functions perform a calculation across a set of table rows that are somehow related to the current row.

### ROW_NUMBER(), RANK(), and DENSE_RANK()

```sql
SELECT 
    FirstName, 
    LastName, 
    Department, 
    Salary,
    ROW_NUMBER() OVER (PARTITION BY Department ORDER BY Salary DESC) as RowNum,
    RANK() OVER (PARTITION BY Department ORDER BY Salary DESC) as Rank,
    DENSE_RANK() OVER (PARTITION BY Department ORDER BY Salary DESC) as DenseRank
FROM Employees;
```

## Recursive CTEs

Recursive CTEs are useful for querying hierarchical data, such as organizational charts or bill of materials.

```sql
WITH EmployeeHierarchy AS (
    -- Anchor member
    SELECT EmployeeID, ManagerID, Title, 0 AS Level
    FROM Employees
    WHERE ManagerID IS NULL
    
    UNION ALL
    
    -- Recursive member
    SELECT e.EmployeeID, e.ManagerID, e.Title, eh.Level + 1
    FROM Employees e
    INNER JOIN EmployeeHierarchy eh ON e.ManagerID = eh.EmployeeID
)
SELECT * FROM EmployeeHierarchy;
```

These advanced patterns will help you write more readable and maintainable SQL code for complex analytical tasks.
