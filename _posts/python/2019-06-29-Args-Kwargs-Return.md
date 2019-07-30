---
layout : post
title : Functions in Python - return, scope, args and kwargs
categories: [python]
tags: [python, args, kwargs, scope, local, global, return, function, argument]
---

---


* [Return in Function](/python/2019/06/29/Args-Kwargs-Return.html#return-in-function)
* [Scoping in Function](/python/2019/06/29/Args-Kwargs-Return.html#scoping-in-function)
    * [Access global variable in function context](/python/2019/06/29/Args-Kwargs-Return.html#access-global-variable-in-function-context)
    * [Declare a local variable within in a function](/python/2019/06/29/Args-Kwargs-Return.html#declare-a-local-variable-within-in-a-function)
    * [Declare local variable with same name as in global](/python/2019/06/29/Args-Kwargs-Return.html#declare-local-variable-with-same-name-as-in-global)
    * [Using Global Keyword](/python/2019/06/29/Args-Kwargs-Return.html#using-global-keyword)
* [\*args and \*\*kwargs in function](/python/2019/06/29/Args-Kwargs-Return.html#args-and-kwargs-in-function)

<!--break-->
### Return in Function
Function execution stops once it reaches a return statement.


```python
def add_num(x1,x2):
    return x1+x2
add_num(1,2)
```
###### **Output:**



    3



The function will return 20, the addition expression will not execute as before that a return statement is reached.

```python
def add_num(x1,x2):
    return 20
    return x1+x2
add_num(3,4)
```

###### **Output:**


    20



--- 
### Scoping in Function

* #### __Access global variable in function context__

Global variables can be accessed but can`t be altered. To altered the same, they has to be accessed by using global in front of them. We'll see that later in the same section.
```python
i = 20
def add_num(x1):
    return i+x1
add_num(2)
```


###### **Output:**

    22




```python
print(i)
```
###### **Output:**

    20
    
--- 
* #### __Declare a local variable within in a function__

The scope of a local variable is limited to function itself. Outside the function it can`t be accessed and doing same will throw an error.
```python
def add_num(x1):
    p = 40
    return p+x1

add_num(40)
```



###### **Output:**

    80


Printing the local variable outside the function scope will throw an error.

```python
try:
    print(p)
except Exception as e:
    print("Found Error - {0}".format(e))
```
###### **Output:**
 
    Found Error - name 'p' is not defined
    
--- 

* #### __Declare local variable with same name as in global__
Local varibale will be given preference if a variable with sam name as the one outside the function is decalred but its scopre is limited in the function

```python
i = 20
def add_num(x1):
    i =10
    return i+x1
add_num(4)
```
###### **Output:**



    14



This will print the value of global variable.
```python
print(i)
```
###### **Output:**

    20
    
--- 
* #### __Using Global Keyword__

Global variable can`t be altered, to do the same access them via global keyword
```python
i = 20
def add_num(x1):
    i = i -20
    return i+x1

try:
    add_num(5)
except Exception as e:
    print("Found Error - {0}".format(e))
```
###### **Output:**

    Found Error - local variable 'i' referenced before assignment
    


```python
i = 20
def add_num(x1):
    global i
    i = i -20
    return i+x1
add_num(5)
```


###### **Output:**

    5


Accessing with global, will altered there value as well.

```python
print(i)
```
###### **Output:**

    0

--- 
### args and kwargs in function
* __args__

User define arguments and keyword arguments (name, value pair) can be defined in function using *args and **kwargs.
The *args have to be defined after positional argument and kwargs has to be defined after *args. There is a strict order is defined if any function incldue these all.

```python
def print_name(*args):
    for argument in args:
        print(argument)

print_name("hello","world!")
```
###### **Output:**

    hello
    world!
    
--- 
* __kwargs__

```python
def print_name(**kwargs):
    print(kwargs)
    print(kwargs.items())
    for item in kwargs:
        print(item, kwargs[item])
    for name, value in kwargs.items():
        print( '{0} = {1}'.format(name, value))

print_name(a = "hello",b="world!")
```
###### **Output:**

    {'a': 'hello', 'b': 'world!'}
    dict_items([('a', 'hello'), ('b', 'world!')])
    a hello
    b world!
    a = hello
    b = world!
    
--- 
<b> Jupyter Notebook Link </b>   - [ Functions using apply, applymap and map](https://nbviewer.jupyter.org/github/aakashkh/Sample-Jupyter-Notebooks/blob/master/Functions%20using%20apply%2C%20applymap%20and%20map.ipynb){:target="_blank"}

---