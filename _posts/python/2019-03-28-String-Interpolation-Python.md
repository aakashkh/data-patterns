---
layout : post
title : String Interpolation in Python
categories: [python]
tags: [pandas, python, String, Interpolation, format, f-strings, str.format()]
---
 String interpolation in python, sometimes can be a bit tedious, specially when we need to pass variables within Strings.

 Although there are multiple ways to achieve the same, but some of the them are
 * String interpolation
 * str.format()

Declaring Python and Django under some variables -

```python
Name = 'Python'
Framework = 'Django'
```

###  Using str.format()
```python
"Language - {0}, Framework - {1}".format(Name, Framework)
```
> 'Language - Python, Framework - Django'

###  Using f-strings format - string interpolation
```python
f"Language - {Name}, Framework - {Framework}"
```

> 'Language - Python, Framework - Django'


We can also handle integers within string format, without explicitly converting to string format

```python
Year = 2015
Month = 12
```

```python
"Year is " + Year + ", Month is " + Month
```
<hr>

``TypeError: can only concatenate str (not "int") to str </em>``

<hr>


```python
"Year is " + str(Year) + ", Month is " + str(Month)
```

>    'Year is 2015, Month is 12'


```python
"Year is {0}, Month is {1}".format(Year, Month)
```

>  'Year is 2015, Month is 12'


```python
f"Year is {Year}, Month is {Month}"
```

>    'Year is 2015, Month is 12'
