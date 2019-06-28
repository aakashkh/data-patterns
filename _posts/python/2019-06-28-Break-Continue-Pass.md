---
layout : post
title : Break, Continue and Pass in Python
categories: [python]
tags: [pandas, python, Break, Pass, Continue, For, Loop, If, else]
---

---

### Continue vs Break

---

#### Continue

```python
print("The loop will skip the value when value of i is 2 and restart from next value of i - ")
for i in range(0,4):
    if i == 2:
        continue
    else:
        print(i+100)
```

    The loop will skip the value when value of i is 2 and restart from next value of i - 
    100
    101
    103


---

#### Break

```python
print("The loop will break when value of i is 2. No more further execution! - ")
for i in range(0,4):
    if i == 2:
        break
    else:
        print(i+100)
```

    The loop will break when value of i is 2. No more further execution! - 
    100
    101


---

### Continue vs Pass

---

#### Continue


```python
print('When value of i is 2, it will start from next iteration - ')
for i in range(0,4):
    if i==2:
        continue
    else:
        print(100+i)
    print(i)
```

    When value of i is 2, it will start from next iteration - 
    100
    0
    101
    1
    103
    3

---

#### Pass



```python
print('When value of i is 2, it does nothing and passes execution to next statement - ')
for i in range(0,4):
    if i==2:
        pass
    else:
        print(100+i)
    print(i)
```

    When value of i is 2, it does nothing and passes execution to next statement - 
    100
    0
    101
    1
    2
    103
    3

---