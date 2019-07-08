---
layout : post
title : Exception handling in Python
categories: [python]
tags: [python, try, except, catch, else, finally, exception handling]
---

---

We'll discuss the followwing:
* [Try and Except clause](#try-and-except) 
* [Else](#else)
* [Finally](#finally)

### Try and Except

The following statement will throw an error as string can't be parsed into integers.


```python
hello = "hello world"
print("Converting string to int")
print(int(hello))
print("Done!")
```
<!--break-->
###### **Output:**

    Converting string to int
   
    ---------------------------------------------------------------------------

    ValueError                                Traceback (most recent call last)

    <ipython-input-2-0017d7718fd0> in <module>
          1 print("Converting string to int")
    ----> 2 print(int(hello))
          3 print("Done!")
    

    ValueError: invalid literal for int() with base 10: 'hello world'



We can catch the error created in above code execution, by using **try...except** clause in python.


```python
try:
    print("Converting string to int")
    print(int(hello))
except:
    pass
print("Done!")
```
###### **Output:**

    Converting string to int
    Done!
    

Multiple ways to catch the error and return as output to use in further executions.


```python
try:
    print("Converting string to int")
    print(int(hello))
except:
    print('Found Error')
print("Done!")
```
###### **Output:**

    Converting string to int
    Found Error
    Done!
    


```python
try:
    print("Converting string to int")
    print(int(hello))
except Exception as e:
    print('Found Error - {0}'.format(e))
    print("The type of error us - {0}".format(type(e)))
    print("The error arguments are - {0}".format(e.args))
    
print("Done!")
```
###### **Output:**

    Converting string to int
    Found Error - invalid literal for int() with base 10: 'hello world'
    The type of error us - <class 'ValueError'>
    The error arguments are - ("invalid literal for int() with base 10: 'hello world'",)
    Done!
    

We can also catch multiple errors, for example, in this example there are two errors, firstly type error and another is value error.


```python
try:
    print("Converting string to int")
    print(hello +30)
    print(int(hello))
except ValueError:
    print("Value Error found")
print("Done!")
```
###### **Output:**

    Converting string to int
   
    ---------------------------------------------------------------------------

    TypeError                                 Traceback (most recent call last)

    <ipython-input-6-6b78f81ffba1> in <module>
          1 try:
          2     print("Converting string to int")
    ----> 3     print(hello +30)
          4     print(int(hello))
          5 except ValueError:
    

    TypeError: can only concatenate str (not "int") to str


---
```python
try:
    print("Converting string to int")
    print(hello +30)
    print(int(hello))
except ValueError :
    print("Value Error found")
except TypeError:
    print("Type Error found")
print("Done!")
```
###### **Output:**

    Converting string to int
    Type Error found
    Done!
    

If any other error appears before the errors which are declared in exception statement, the code execution will failed, for example - 


```python
try:
    print("Converting string to int")
    print(1/0)
    print(hello +30)
    print(int(hello))
except ValueError :
    print("Value Error found")
except TypeError:
    print("Type Error")
print("Done!")
```
###### **Output:**

    Converting string to int
    
    ---------------------------------------------------------------------------

    ZeroDivisionError                         Traceback (most recent call last)

    <ipython-input-8-50842d051dc1> in <module>
          1 try:
          2     print("Converting string to int")
    ----> 3     print(1/0)
          4     print(hello +30)
          5     print(int(hello))
    

    ZeroDivisionError: division by zero


The above error can be captured as - 


```python
try:
    print("Converting string to int")
    print(1/0)
    print(hello +30)
    print(int(hello))
except (ValueError, TypeError) as error:
    print("Value or Type Error - {0}".format(error))
except Exception:
    print("Another error occured, Not a value or type error.")
print("Done!")
```
###### **Output:**

    Converting string to int
    Another error occured, Not a value or type error.
    Done!
    
---
### Else

Else will only exectue if there are no errors found in the try block


```python
hello =30
try:
    print(hello +30)
    print(int(hello))
except (ValueError, TypeError) as error:
    print("Value or Type Error - {0}".format(error))
except Exception:
    print("Another error")
else:
    print("Executed successfully")
print("Done!")
```
###### **Output:**

    60
    30
    Executed successfully
    Done!
    

---
```python
# Situation - 1
# any_file.txt is not available, which will cause IOError and hence code statements in else block won`t execute.
try:
    input_file = open('any_file.txt', mode = 'r')
except IOError:
    print("IOError occured !!")
else:
    for line in input_file:
        print(line)
    input_file.close()
```
###### **Output:**

    IOError occured !!
    
---

```python
# Situation - 2
# any_file.txt is available, which will not cause any error and hence code statements in else block will execute.
try:
    input_file = open('any_file.txt', mode = 'r')
except IOError:
    print("IOError occured !!")
else:
    for line in input_file:
        print(line, end = '')
    input_file.close()
```
###### **Output:**

    Hello World 1!
    Hello World 2!
    Hello World 3!
    Hello World 4!
    Hello World 5!

---
### Finally

Code staements in finally block will always execute, no matter how many errors occured/or not occured in try except block.


```python
''' any_file.txt is not available, which will cause IOError and hence 
code statements in else block won`t execute but 
code block in finally statement will execute.
'''
try:
    input_file = open('any_file.txt', mode = 'r')
except IOError:
    print("IOError occured !!")
else:
    for line in input_file:
        print(line, end = '')
finally:    
    input_file.close()
    print("\n")
    print("File is Closed")
```
###### **Output:**

    IOError occured !!
    
    
    File is Closed
    
--- 
<b> Jupyter Notebook Link </b>   - [Exception Handling in Python](https://nbviewer.jupyter.org/github/aakashkh/Sample-Jupyter-Notebooks/blob/master/Exception-Handling.ipynb){:target="_blank"}

---