---
title: "Handle multiple datetime formats representation using lubridate"
date: 2020-04-26T00:00:00+00:00
lastmod: 2020-04-26T00:00:00+00:00
draft: false
images: []
categories: ["r"]
tags: ['r', 'datetime', 'heterogeneous', 'multiple', 'formats', 'lubridate', 'tidyverse']
weight: 100
toc: true
---

---

### Handling Heterogeneous datetime formats 

We`ll be using <b>parse_date_time</b> function of lubridate package.  
Multple datetime formats can be passed under orders attribute of the above function as shown below - 
```javascript
library(lubridate)
dates <- c( "1/22/2020 17:00", "2020-02-02 09:43:01", "2/1/2020 11:53")
parse_date_time(dates, orders = c('%Y-%m-%d %H:%M;%S','%m/%d/%Y %H:%M', '%m/%d/%y %H:%M'))
```
#### Output - 
```
## [1] "2020-01-22 17:00:00 UTC" "2020-02-02 09:43:01 UTC"
## [3] "2020-02-01 11:53:00 UTC"
```

---