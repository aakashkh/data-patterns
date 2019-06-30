---
layout : post
title : Functions in Python - return, scope, args and kwargs
categories: [python]
tags: [python, args, kwargs, scope, local, global, return, function, argument]
---

---

### Return in Function
Function execution stops once it reaches a return statement.


```python
def add_num(x1,x2):
    return x1+x2
add_num(1,2)
```



>
    3




```python
def add_num(x1,x2):
    return 20
    return x1+x2
add_num(3,4)
```



>
    20



### Scoping in Function

#### Access global variable in function context


```python
i = 20
def add_num(x1):
    return i+x1
add_num(2)
```



>
    22




```python
print(i)
```
>
    20
    

### Declare a local variable within in a function


```python
def add_num(x1):
    p = 40
    return p+x1

add_num(40)
```



>
    80




```python
try:
    print(p)
except Exception as e:
    print("Found Error - {0}".format(e))
```
>
    Found Error - name 'p' is not defined
    

### Declare local variable with same name as in global


```python
i = 20
def add_num(x1):
    i =10
    return i+x1
add_num(4)
```



>
    14




```python
print(i)
```
>
    20
    

### Using Global Keyword, to access global variable in function and make changes


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
>
    Found Error - local variable 'i' referenced before assignment
    


```python
i = 20
def add_num(x1):
    global i
    i = i -20
    return i+x1
add_num(5)
```



>
    5




```python
print(i)
```
>
    0
    

### \*args and \*\*kwargs in function


```python
def print_name(*args):
    for argument in args:
        print(argument)

print_name("hello","world!")
```
>
    hello
    world!
    


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
>
    {'a': 'hello', 'b': 'world!'}
    dict_items([('a', 'hello'), ('b', 'world!')])
    a hello
    b world!
    a = hello
    b = world!
    
