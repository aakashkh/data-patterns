---
title: "Download Data from a github folder using httr package in R"
date: 2020-04-24T00:00:00+00:00
lastmod: 2020-04-24T00:00:00+00:00
draft: false
images: []
categories: ["r"]
tags: ['r', 'httr', 'github', 'covid19 data', 'covid19 tracker', 'download']
weight: 100
toc: true
---

---



### Import Libraries and Request to the master branch of git

The following chunk of code, import required libraries and request the master branch of the required git repository.
```javascript
library(httr)
library(tidyverse)

req <- GET("https://api.github.com/repos/CSSEGISandData/COVID-19/git/trees/master?recursive=1")
req
```
#### Output - 
```python
## Response [https://api.github.com/repos/CSSEGISandData/COVID-19/git/trees/master?recursive=1]
##   Date: 2020-04-24 08:14
##   Status: 200
##   Content-Type: application/json; charset=utf-8
##   Size: 88.9 kB
## {
##   "sha": "###############################",
##   "url": "https://api.github.com/repos/CSSEGISandData/COVID-19/git/trees/65ba...
##   "tree": [
##     {
##       "path": ".gitignore",  
##       "mode": "100644",
##       "type": "blob",
##       "sha": "##############################",
##       "size": 9,
## ...

```

---
### Extracting the path variable from the output of above request

This chunk access the path variable which stores all the paths associated in this master brnanch
```javascript
file_path <- data.frame(unlist(lapply(content(req)$tree, function(x) x$path)))
colnames(file_path) = c('Path')
head(file_path)
```
#### Output -
```python
##                                                   Path
## 1                                           .gitignore
## 2                                            README.md
## 3                                        archived_data
## 4                              archived_data/README.md
## 5            archived_data/archived_daily_case_updates
## 6 archived_data/archived_daily_case_updates/.gitignore
```

---
### Access files under a specific folder

For example, to access the all csv files under csse_covid_19_daily_reports folder -
```javascript
file_path <- file_path %>%
  separate(Path,c('base','folder','filename'),'/') %>%
  filter(folder == 'csse_covid_19_daily_reports') %>%
  filter(str_detect(filename,'.csv'))

head(file_path)
```
#### Output -
```
|##                 base  |                    folder  |     filename  |
|-------------------------|----------------------------|---------------|
|## 1 csse_covid_19_data  |csse_covid_19_daily_reports |01-22-2020.csv |
|## 2 csse_covid_19_data  |csse_covid_19_daily_reports |01-23-2020.csv |
|## 3 csse_covid_19_data  |csse_covid_19_daily_reports |01-24-2020.csv |
|## 4 csse_covid_19_data  |csse_covid_19_daily_reports |01-25-2020.csv |
|## 5 csse_covid_19_data  |csse_covid_19_daily_reports |01-26-2020.csv |
|## 6 csse_covid_19_data  |csse_covid_19_daily_reports |01-27-2020.csv | 
```
---
### Looping and save file to local
We`ll loop through all the paths and request the data by generating url for each file, converting datatype of all columns to character and appending all files to a consolidated one.

```javascript
i<-1
dataset <- tibble()
for (i in seq(i,nrow(file_path))){
  path <- paste0('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/',file_path$filename[i])
  daily_data = readr::read_csv(content(GET(path)))
  daily_data$filename <- file_path$filename[i]
  daily_data <- tibble(data.frame(lapply(daily_data, as.character)))
  dataset = bind_rows(dataset,daily_data)
  print(path)
  Sys.sleep(1)
} 

readr::write_csv(dataset,'dataset.csv')
```

---