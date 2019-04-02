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

Declaring some variables -

```python
Name = 'Python'
Framework = 'Django'
```

* ###  Using str.format()

```python
"Language - {0}, Framework - {1}".format(Name, Framework)
```
> 'Language - Python, Framework - Django'

* ###  Using f-strings format - string interpolation

```python
f"Language - {Name}, Framework - {Framework}"
```

> 'Language - Python, Framework - Django'


* ### Handling numeric in Strings

```python
Year = 2015
Month = 12
```
The following will through an error, as we can use strings and integers without conversions.

```python
"Year is " + Year + ", Month is " + Month
```
<hr>

``TypeError: can only concatenate str (not "int") to str </em>``

<hr>

The above error can be handled by explicit conversion, str.format and f-strings.
```python
# Explicit conversion to string
"Year is " + str(Year) + ", Month is " + str(Month)
# Using str.format()
"Year is {0}, Month is {1}".format(Year, Month)
# Using f-strings format - string interpolation
f"Year is {Year}, Month is {Month}"
```
>  'Year is 2015, Month is 12'  
>  'Year is 2015, Month is 12'  
>  'Year is 2015, Month is 12'

* ### Similarly, mathematical operations can be applied -

```python
Number1 = 2
Number2 = 10
# Using str.format()
print("No. 1 * No. 2 is {0}".format(Number1*Number2))
# Using f-strings format - string interpolation
print(f"No. 1 * No. 2 is {Number1*Number2}")
```
> No. 1 \* No. 2 is 20  
> No. 1 \* No. 2 is 20
