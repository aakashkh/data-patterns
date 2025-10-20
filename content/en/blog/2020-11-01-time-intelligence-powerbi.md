---
title: "Time Intelligence in PowerBI"
date: 2020-11-01T00:00:00+00:00
lastmod: 2020-11-01T00:00:00+00:00
draft: false
images: []
categories: ["powerbi"]
tags: ['Power BI', 'DAX', 'Time', 'DateTable', 'Parallel Period', 'Moving Average', 'Running Total', 'Cumulative Sum', 'Same Period', 'Last Year', 'TotalYTD', 'TotalQTD']
weight: 100
toc: true
---

---

Data Analysis Expressions (DAX) includes [time-intelligence functions](https://docs.microsoft.com/en-us/dax/time-intelligence-functions-dax){:target="_blank"}  that enable you to manipulate data using time periods, including days, months, quarters, and years, and then build and compare calculations over those periods.


![Time Intelligence in PowerBI](/static/img/posts/powerbi/2020-11-01-Time-Intelligence-PowerBI/time_intelligence.jpg "Time Intelligence in PowerBI")


# Data Model 

![Data Model](/static/img/posts/powerbi/2020-11-01-Time-Intelligence-PowerBI/model.png "Data Model")

Above date table can be created using following dax - 
### DateTable

```python
DateTable = 
ADDCOLUMNS(
    CALENDAR(EOMONTH(min(Data_Blog[SalesDate]),-1), EOMONTH(max(Data_Blog[SalesDate]),3)),
    "Start of Month", EOMONTH([Date],-1)+1,
    "Year", Year([Date]),
    "Quarter",CONCATENATE("QTR ",QUARTER([Date])),
    "MonthNumber", Month([Date]),
    "Month", FORMAT([Date], "MMMM"),
    "Day", DAY ( [Date] )
)
```

# Measures

### Sales -  Sum
```python
= CALCULATE(sum(Data_Blog[Sales]))
```

### Sales_MoM - Previous Month Sales
```python
var _prevmonthsales = CALCULATE([Sales],DATEADD(DateTable[Date],-1,MONTH))  
return [Sales] - _prevmonthsales
```

### Sales_MoM %  - Percentage change with Previous Month Sales
```python
var _prevmonthsales = CALCULATE([Sales],DATEADD(DateTable[Date],-1,MONTH))  
return DIVIDE([Sales] - _prevmonthsales,_prevmonthsales)
```

### Sales_MovingAverage - Moving Average of last three months 
#### [Quick Measure - Rolling Average] 
```python
IF(
	ISFILTERED('Data_Blog'[SalesDate]),
	ERROR("Time intelligence quick measures can only be grouped or filtered by the Power BI-provided date hierarchy or primary date column."),
	VAR __LAST_DATE = ENDOFMONTH(DateTable[Date])
	VAR __DATE_PERIOD =
		DATESBETWEEN(
			DateTable[Date],
			STARTOFMONTH(DATEADD(__LAST_DATE, -2, MONTH)),
			__LAST_DATE
		)
	RETURN
		AVERAGEX(
			CALCULATETABLE(
				SUMMARIZE(
					VALUES('Data_Blog'),
					DateTable[Year],
					DateTable[Quarter] ,
					DateTable[MonthNumber],
					DateTable[Month]
				),
				__DATE_PERIOD
			),
			CALCULATE(SUM('Data_Blog'[Sales]), ALL(DateTable[Date]))
		)
)
```
### Sales_PreviousMonth - Parallel Period - Last Month
```python
= CALCULATE([Sales],PARALLELPERIOD(DateTable[Date],-1,MONTH))
```
### Sales_PreviousYear - Previous Year Sum
```python
= CALCULATE([Sales],PREVIOUSYEAR(DateTable[Date]))
```
### Sales_QTD - Quarter Till Date - Running Total
```python
= TOTALQTD([Sales],DateTable[Date])
```
### Sales_SamePeriodLastYear - Same Period Last Year
```python
= CALCULATE([Sales],SAMEPERIODLASTYEAR(DateTable[Date]))
```
### Sales_YTD -  Year Till Date -  Running Total
```python
= TOTALYTD([Sales],'DateTable'[Date])
```