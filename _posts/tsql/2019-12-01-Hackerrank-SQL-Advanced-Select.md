---
layout : post
title : Hackerrank SQL - Advanced Select
categories: [tsql]
tags: [tsql, sub-queries, nested sql, nested queries, apply, correlated queries, correlated, sql, data, sql server, database, AdventureWorks]
---

---
Following problems are discussed here. To solve the same, please [visit hackerrank website](https://www.hackerrank.com/domains/sql?filters%5Bsubdomains%5D%5B%5D=advanced-select){:target="_blank"}. 

* [New Companies](/tsql/2019/12/01/Hackerrank-SQL-Advanced-Select.html#new-companies)  
* [Binary Tree Nodes](/tsql/2019/12/01/Hackerrank-SQL-Advanced-Select.html#binary-tree-nodes)
* [Occupations](/tsql/2019/12/01/Hackerrank-SQL-Advanced-Select.html#occupations) 
* [The PADS](/tsql/2019/12/01/Hackerrank-SQL-Advanced-Select.html#the-pads)
* [Type of Triangle](/tsql/2019/12/01/Hackerrank-SQL-Advanced-Select.html#type-of-triangle) 



---

### [New Companies](https://www.hackerrank.com/challenges/the-company/problem){:target="_blank"}

```sql
select 
company.company_code,
company.founder,
count(distinct lead_manager.lead_manager_code),
count(distinct senior_manager.senior_manager_code), 
count(distinct manager.manager_code),
count(distinct employee.employee_code)
from company
left join 
    lead_manager on company.company_code = lead_manager.company_code
left join 
    senior_manager on company.company_code = senior_manager.company_code and
    lead_manager.lead_manager_code = senior_manager.lead_manager_code
left join 
    manager on company.company_code = manager.company_code and
    lead_manager.lead_manager_code = manager.lead_manager_code and 
    senior_manager.senior_manager_code = manager.senior_manager_code
left join 
    employee on company.company_code = employee.company_code and
    lead_manager.lead_manager_code = employee.lead_manager_code and 
    senior_manager.senior_manager_code = employee.senior_manager_code and 
    manager.manager_code = employee.manager_code
group by company.company_code, company.founder
order by company.company_code
```
---
<!--break-->
### [Binary Tree Nodes](https://www.hackerrank.com/challenges/binary-search-tree-1/problem){:target="_blank"}


```sql
select N,
CASE
    WHEN N in (select N from BST where P is NUll) then "Root"
    WHEN N in (select P from BST) then "Inner"
    Else "Leaf"
end as flag 
from BST
order by N
```
---
### [Occupations](https://www.hackerrank.com/challenges/occupations/problem){:target="_blank"}

```sql

select doc_name,prof_name,singer_name,actor_name from(
(select 
 (row_number() over (order by name)) as doc_rank, 
 name as doc_name 
 from occupations 
 where occupation = "Doctor"
) as t1
full outer join 
(select 
 (row_number() over (order by name)) as prof_rank, 
 name as prof_name 
 from occupations 
 where occupation = "Professor") as t2
on t1.doc_rank = t2.prof_rank
full outer join (
    select 
 (row_number() over (order by name)) as actor_rank, 
 name as actor_name 
 from occupations 
 where occupation = "Actor") as t3
on t2.prof_rank = t3.actor_rank
full outer join (
    select 
 (row_number() over (order by name)) as singer_rank, 
 name as singer_name 
 from occupations 
 where occupation = "Singer") as t4
on t3.actor_rank = t4.singer_rank)
```
---
### [The PADS](https://www.hackerrank.com/challenges/the-pads/problem){:target="_blank"}

```sql

select name+"("+left(occupation,1)+")" from occupations order by name, occupation

select "There are a total of "+cast(count(name) as varchar )+" "+lower(occupation)+"s." from occupations group by occupation 
order by count(name), occupation
```
---
### [Type of Triangle](https://www.hackerrank.com/challenges/what-type-of-triangle/problem){:target="_blank"}

```sql
select 
case 
    when a+b > c and b+c > a and c+a > b then 
        case 
            when a = b and b = c then 'Equilateral' 
            when a = b or b = c or a = c then 'Isosceles' 
            else 'Scalene' 
        end
    else 'Not A Triangle' 
end 
from triangles;
```
---