---
title: "SQL Basics & Query Patterns"
description: "Essential SQL concepts, query structure, and fundamental patterns for data retrieval and manipulation."
date: 2025-11-25T10:00:00+05:30
categories: ["SQL", "Database"]
tags: ["sql", "database", "queries", "select", "joins", "aggregations"]
weight: 40
toc: true
draft: false
series: "sql"
weight: 1
---

# SQL Basics & Query Patterns

Master the fundamentals of SQL with practical examples and essential patterns for data retrieval, filtering, and manipulation. This guide covers core concepts that form the foundation of database operations.

## Understanding SQL Structure

SQL (Structured Query Language) follows a declarative approach - you specify **what** you want, not **how** to get it. Every SQL statement has a clear structure that makes it readable and predictable.

### Basic Query Anatomy

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition
GROUP BY column
HAVING group_condition
ORDER BY column
LIMIT number;
```

## Essential SELECT Patterns

### Simple Data Retrieval

```sql
-- Select all columns
SELECT * FROM employees;

-- Select specific columns
SELECT first_name, last_name, salary 
FROM employees;

-- Select with aliases for readability
SELECT 
    first_name AS "First Name",
    last_name AS "Last Name",
    salary * 12 AS "Annual Salary"
FROM employees;
```

### Filtering with WHERE

```sql
-- Single condition
SELECT * FROM employees 
WHERE department = 'Engineering';

-- Multiple conditions with AND
SELECT * FROM employees 
WHERE department = 'Engineering' 
  AND salary > 75000;

-- Multiple conditions with OR
SELECT * FROM employees 
WHERE department = 'Engineering' 
   OR department = 'Data Science';

-- Using IN for multiple values
SELECT * FROM employees 
WHERE department IN ('Engineering', 'Data Science', 'Product');

-- Pattern matching with LIKE
SELECT * FROM employees 
WHERE first_name LIKE 'J%';  -- Names starting with 'J'

-- Range filtering with BETWEEN
SELECT * FROM employees 
WHERE salary BETWEEN 50000 AND 100000;
```

## Working with NULL Values

```sql
-- Find records with missing data
SELECT * FROM employees 
WHERE phone_number IS NULL;

-- Exclude records with missing data
SELECT * FROM employees 
WHERE phone_number IS NOT NULL;

-- Handle NULLs with COALESCE
SELECT 
    first_name,
    last_name,
    COALESCE(phone_number, 'No phone provided') AS contact_phone
FROM employees;
```

## Sorting and Limiting Results

```sql
-- Sort by single column
SELECT * FROM employees 
ORDER BY salary DESC;

-- Sort by multiple columns
SELECT * FROM employees 
ORDER BY department ASC, salary DESC;

-- Limit results (pagination)
SELECT * FROM employees 
ORDER BY hire_date DESC
LIMIT 10;

-- Skip and limit (offset pagination)
SELECT * FROM employees 
ORDER BY hire_date DESC
LIMIT 10 OFFSET 20;  -- Skip first 20, get next 10
```

## Aggregation Functions

### Basic Aggregations

```sql
-- Count records
SELECT COUNT(*) AS total_employees FROM employees;

-- Count non-null values
SELECT COUNT(phone_number) AS employees_with_phone FROM employees;

-- Basic statistics
SELECT 
    COUNT(*) AS total_employees,
    AVG(salary) AS average_salary,
    MIN(salary) AS minimum_salary,
    MAX(salary) AS maximum_salary,
    SUM(salary) AS total_payroll
FROM employees;
```

### GROUP BY Operations

```sql
-- Group by single column
SELECT 
    department,
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department;

-- Group by multiple columns
SELECT 
    department,
    EXTRACT(YEAR FROM hire_date) AS hire_year,
    COUNT(*) AS hires_count
FROM employees
GROUP BY department, EXTRACT(YEAR FROM hire_date)
ORDER BY department, hire_year;

-- Filter groups with HAVING
SELECT 
    department,
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5  -- Only departments with more than 5 employees
ORDER BY avg_salary DESC;
```

## JOIN Operations

### Inner Joins

```sql
-- Basic inner join
SELECT 
    e.first_name,
    e.last_name,
    d.department_name,
    e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;

-- Multiple table joins
SELECT 
    e.first_name,
    e.last_name,
    d.department_name,
    p.project_name,
    ep.role
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
INNER JOIN employee_projects ep ON e.employee_id = ep.employee_id
INNER JOIN projects p ON ep.project_id = p.project_id;
```

### Outer Joins

```sql
-- Left join (all employees, even without departments)
SELECT 
    e.first_name,
    e.last_name,
    COALESCE(d.department_name, 'No Department') AS department
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;

-- Right join (all departments, even without employees)
SELECT 
    COALESCE(e.first_name, 'No Employee') AS first_name,
    d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.department_id;

-- Full outer join (all employees and all departments)
SELECT 
    e.first_name,
    e.last_name,
    d.department_name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.department_id;
```

## Subqueries and CTEs

### Subqueries

```sql
-- Subquery in WHERE clause
SELECT * FROM employees 
WHERE salary > (
    SELECT AVG(salary) FROM employees
);

-- Subquery in SELECT clause
SELECT 
    first_name,
    last_name,
    salary,
    (SELECT AVG(salary) FROM employees) AS company_avg_salary,
    salary - (SELECT AVG(salary) FROM employees) AS salary_difference
FROM employees;

-- Correlated subquery
SELECT 
    e1.first_name,
    e1.last_name,
    e1.department,
    e1.salary
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department = e1.department
);
```

### Common Table Expressions (CTEs)

```sql
-- Simple CTE
WITH department_stats AS (
    SELECT 
        department,
        COUNT(*) AS employee_count,
        AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
)
SELECT 
    department,
    employee_count,
    avg_salary,
    CASE 
        WHEN avg_salary > 80000 THEN 'High Pay'
        WHEN avg_salary > 60000 THEN 'Medium Pay'
        ELSE 'Low Pay'
    END AS pay_category
FROM department_stats
ORDER BY avg_salary DESC;

-- Multiple CTEs
WITH 
high_performers AS (
    SELECT employee_id, first_name, last_name, salary
    FROM employees
    WHERE salary > (SELECT AVG(salary) FROM employees)
),
department_info AS (
    SELECT department_id, department_name, budget
    FROM departments
    WHERE budget > 1000000
)
SELECT 
    hp.first_name,
    hp.last_name,
    hp.salary,
    di.department_name,
    di.budget
FROM high_performers hp
JOIN employees e ON hp.employee_id = e.employee_id
JOIN department_info di ON e.department_id = di.department_id;
```

## Window Functions

### Basic Window Functions

```sql
-- Row numbers and rankings
SELECT 
    first_name,
    last_name,
    department,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS salary_rank,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_salary_rank
FROM employees;

-- Running totals and moving averages
SELECT 
    first_name,
    last_name,
    hire_date,
    salary,
    SUM(salary) OVER (ORDER BY hire_date) AS running_payroll,
    AVG(salary) OVER (ORDER BY hire_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg_salary
FROM employees
ORDER BY hire_date;
```

### Advanced Window Functions

```sql
-- Lead and lag functions
SELECT 
    first_name,
    last_name,
    hire_date,
    salary,
    LAG(salary, 1) OVER (ORDER BY hire_date) AS previous_hire_salary,
    LEAD(salary, 1) OVER (ORDER BY hire_date) AS next_hire_salary,
    salary - LAG(salary, 1) OVER (ORDER BY hire_date) AS salary_change
FROM employees
ORDER BY hire_date;

-- Percentiles and distribution
SELECT 
    first_name,
    last_name,
    department,
    salary,
    PERCENT_RANK() OVER (ORDER BY salary) AS salary_percentile,
    NTILE(4) OVER (ORDER BY salary) AS salary_quartile,
    CUME_DIST() OVER (ORDER BY salary) AS cumulative_distribution
FROM employees;
```

## Conditional Logic

### CASE Statements

```sql
-- Simple CASE
SELECT 
    first_name,
    last_name,
    salary,
    CASE 
        WHEN salary >= 100000 THEN 'Senior'
        WHEN salary >= 70000 THEN 'Mid-level'
        WHEN salary >= 50000 THEN 'Junior'
        ELSE 'Entry-level'
    END AS experience_level
FROM employees;

-- CASE with multiple conditions
SELECT 
    first_name,
    last_name,
    department,
    salary,
    CASE 
        WHEN department = 'Engineering' AND salary > 90000 THEN 'Senior Engineer'
        WHEN department = 'Engineering' AND salary > 70000 THEN 'Engineer'
        WHEN department = 'Sales' AND salary > 80000 THEN 'Senior Sales'
        WHEN department = 'Sales' THEN 'Sales Rep'
        ELSE 'Other'
    END AS job_category
FROM employees;
```

## Date and Time Operations

```sql
-- Date functions
SELECT 
    first_name,
    last_name,
    hire_date,
    EXTRACT(YEAR FROM hire_date) AS hire_year,
    EXTRACT(MONTH FROM hire_date) AS hire_month,
    DATE_PART('dow', hire_date) AS day_of_week,  -- PostgreSQL
    CURRENT_DATE - hire_date AS days_employed,
    AGE(CURRENT_DATE, hire_date) AS employment_duration  -- PostgreSQL
FROM employees;

-- Date arithmetic and formatting
SELECT 
    first_name,
    last_name,
    hire_date,
    hire_date + INTERVAL '90 days' AS probation_end,  -- PostgreSQL
    TO_CHAR(hire_date, 'Month DD, YYYY') AS formatted_hire_date  -- PostgreSQL
FROM employees
WHERE hire_date >= CURRENT_DATE - INTERVAL '1 year';
```

## Performance Tips and Best Practices

### Indexing Considerations

```sql
-- Use indexes for frequently filtered columns
-- CREATE INDEX idx_employee_department ON employees(department);
-- CREATE INDEX idx_employee_salary ON employees(salary);
-- CREATE INDEX idx_employee_hire_date ON employees(hire_date);

-- Composite indexes for multi-column filters
-- CREATE INDEX idx_dept_salary ON employees(department, salary);
```

### Query Optimization

```sql
-- Use EXISTS instead of IN for subqueries (often faster)
SELECT * FROM employees e
WHERE EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.manager_id = e.employee_id
);

-- Use LIMIT to avoid large result sets during development
SELECT * FROM employees 
WHERE department = 'Engineering'
ORDER BY salary DESC
LIMIT 100;

-- Use specific columns instead of SELECT *
SELECT employee_id, first_name, last_name, salary
FROM employees
WHERE department = 'Engineering';
```

## Common Patterns and Use Cases

### Data Quality Checks

```sql
-- Find duplicates
SELECT 
    first_name, 
    last_name, 
    COUNT(*) as duplicate_count
FROM employees
GROUP BY first_name, last_name
HAVING COUNT(*) > 1;

-- Find orphaned records
SELECT e.*
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
WHERE d.department_id IS NULL;
```

### Reporting Queries

```sql
-- Monthly hiring report
SELECT 
    EXTRACT(YEAR FROM hire_date) AS year,
    EXTRACT(MONTH FROM hire_date) AS month,
    COUNT(*) AS hires,
    AVG(salary) AS avg_starting_salary
FROM employees
WHERE hire_date >= CURRENT_DATE - INTERVAL '2 years'
GROUP BY EXTRACT(YEAR FROM hire_date), EXTRACT(MONTH FROM hire_date)
ORDER BY year DESC, month DESC;

-- Department budget utilization
SELECT 
    d.department_name,
    d.budget,
    COALESCE(SUM(e.salary), 0) AS total_salaries,
    d.budget - COALESCE(SUM(e.salary), 0) AS remaining_budget,
    ROUND(
        (COALESCE(SUM(e.salary), 0) * 100.0 / d.budget), 2
    ) AS budget_utilization_percent
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name, d.budget
ORDER BY budget_utilization_percent DESC;
```

## Quick Reference: SQL Cheat Sheet

| Operation | Syntax | Use Case |
|:---|:---|:---|
| **Basic SELECT** | `SELECT col1, col2 FROM table` | Retrieve specific columns |
| **Filter rows** | `WHERE condition` | Filter based on conditions |
| **Sort results** | `ORDER BY col ASC/DESC` | Sort data |
| **Group data** | `GROUP BY col` | Aggregate by groups |
| **Filter groups** | `HAVING condition` | Filter aggregated results |
| **Join tables** | `JOIN table2 ON condition` | Combine related data |
| **Subquery** | `WHERE col IN (SELECT ...)` | Nested queries |
| **Window function** | `OVER (PARTITION BY col)` | Advanced analytics |
| **Conditional logic** | `CASE WHEN ... THEN ... END` | If-then logic |

## What's Next

This covers the fundamental SQL patterns you'll use daily. In upcoming guides, we'll explore:

- **Advanced Query Patterns** - Complex joins, recursive queries, and optimization
- **Performance Tuning** - Index strategies and query optimization
- **Database Design** - Normalization and schema patterns

Master these basics and you'll handle 80% of common database tasks efficiently!