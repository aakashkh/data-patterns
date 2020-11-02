---
layout : post
title : Time Intelligence in PowerBI
categories: [powerbi]
tags: [Power BI, DAX, Time, DateTable, Parallel Period, Moving Average, Running Total, Cumulative Sum, Same Period, Last Year, TotalYTD, TotalQTD]
---

---

### Time Intelligence in PowerBI

Data Analysis Expressions (DAX) includes [time-intelligence functions](https://docs.microsoft.com/en-us/dax/time-intelligence-functions-dax){:target="_blank"}  that enable you to manipulate data using time periods, including days, months, quarters, and years, and then build and compare calculations over those periods.


![Time Intelligence in PowerBI](/static/img/posts/powerbi/2020-11-01-Time-Intelligence-PowerBI/time_intelligence.jpg "Time Intelligence in PowerBI")
<!--break-->
![Time Intelligence in PowerBI](/static/img/posts/powerbi/2020-11-01-Time-Intelligence-PowerBI/model.jpg "Time Intelligence in PowerBI")

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
### Sales
```python
= CALCULATE(sum(Data_Blog[Sales]))
```

### Sales_MoM
```python
var _prevmonthsales = CALCULATE([Sales],DATEADD(DateTable[Date],-1,MONTH))  
return [Sales] - _prevmonthsales
```

### Sales_MoM % 
```python
var _prevmonthsales = CALCULATE([Sales],DATEADD(DateTable[Date],-1,MONTH))  
return DIVIDE([Sales] - _prevmonthsales,_prevmonthsales)
```

### Sales_MovingAverage
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
### Sales_PreviousMonth
```python
= CALCULATE([Sales],PARALLELPERIOD(DateTable[Date],-1,MONTH))
```
### Sales_PreviousYear
```python
= CALCULATE([Sales],PREVIOUSYEAR(DateTable[Date]))
```
### Sales_QTD
```python
= TOTALQTD([Sales],DateTable[Date])
```
### Sales_SamePeriodLastYear
```python
= CALCULATE([Sales],SAMEPERIODLASTYEAR(DateTable[Date]))
```
### Sales_YTD
```python
= TOTALYTD([Sales],'DateTable'[Date])
```

