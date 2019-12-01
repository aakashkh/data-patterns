---
layout : post
title : Hackerrank SQL - Aggregation
categories: [tsql]
tags: [tsql, sub-queries, nested sql, nested queries, apply, correlated queries, correlated, sql, data, sql server, database]
---

---
Following problems are discussed here. To solve the same, please [visit hackerrank website](https://www.hackerrank.com/domains/sql?filters%5Bsubdomains%5D%5B%5D=aggregation){:target="_blank"}. 

* [Weather Observation Station 17](/tsql/2019/12/01/Hackerrank-SQL-Aggregation.html#weather-observation-station-17)  
* [Weather Observation Station 18](/tsql/2019/12/01/Hackerrank-SQL-Aggregation.html#weather-observation-station-18)
* [Weather Observation Station 19](/tsql/2019/12/01/Hackerrank-SQL-Aggregation.html#weather-observation-station-19) 
* [Weather Observation Station 20](/tsql/2019/12/01/Hackerrank-SQL-Aggregation.html#weather-observation-station-20)


---

### [Weather Observation Station 17](https://www.hackerrank.com/challenges/weather-observation-station-17/problem){:target="_blank"}

```
select cast(Long_w as decimal(9,4)) from station where lat_n = (select min(Lat_n)  from station where Lat_n  > 38.7780) 
```
---

<!--break-->


### [Weather Observation Station 18](https://www.hackerrank.com/challenges/weather-observation-station-18/problem){:target="_blank"}

```
select  cast((max(long_w) - min(long_W) + max(lat_n) - min(lat_n)) as decimal(9,4)) from station

```

---

### [Weather Observation Station 19](https://www.hackerrank.com/challenges/weather-observation-station-19/problem){:target="_blank"}

```
select  
cast
(
    sqrt
    (
        (square
            (max(long_w) - min(long_W)) 
        + 
        (square
            (max(lat_n) - min(lat_n)))
        )
    )
    as decimal(9,4)
) from station
```
---
### [Weather Observation Station 20](https://www.hackerrank.com/challenges/weather-observation-station-20/problem){:target="_blank"}

```
with rowtabel  as (select lat_n, (row_number() over (order by lat_n)) as rn from station)
select cast(lat_n as decimal(9,4)) from rowtabel where  rn in (select (count(lat_n)/2)+1 from station) 
```
---

