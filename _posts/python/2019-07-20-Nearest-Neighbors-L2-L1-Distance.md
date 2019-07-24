---
layout : post
title : Nearest Neighbors using L2 and L1 Distance
categories: [python, machine learning]
tags: [NN Neighbors, L1 Norm, L2 Norm, Distance, Neares1 Neighbors]
---
---


* [Preliminaries](#preliminaries) 
* [Distance Matrics](#distance-metrics)
    * L2 Norm
    * L1 Norm
* [Nearest Neighbor](#nearest-neighbors)
    * Using L2 Distance
    * Using L1 Distance
* [Predictions](#predictions)
* [Errors](#error-rate)
* [Confusion Matrix](#confusion-matrix)
    * Using Pandas
    * From Scratch
 


---
<!--break-->
### Preliminaries

```python
import numpy as np

# Load data set and code labels as 0 = ’NO’, 1 = ’DH’, 2 = ’SL’
labels = [b'NO', b'DH', b'SL']
data = np.loadtxt('column_3C.dat', converters={6: lambda s: labels.index(s)} )

# Separate features from labels
x = data[:,0:6]
y = data[:,6]

# Divide into training and test set
training_indices = list(range(0,20)) + list(range(40,188)) + list(range(230,310))
test_indices = list(range(20,40)) + list(range(188,230))

trainx = x[training_indices,:]
trainy = y[training_indices]
testx = x[test_indices,:]
testy = y[test_indices]
```
---


### Distance Metrics

* **L2 norm**

> distance_l2norm = np.sqrt(np.sum(np.square(a-b)))


```python
a = np.array([1,2,3,4])
b = np.array([5,6,7,8])
```


```python
print(a-b)
print(np.square(a-b))
print(np.sum(np.square(a-b)))
```
###### **Output:**

    [-4 -4 -4 -4]
    [16 16 16 16]
    64
    
---




* **L1 norm**

> distance_l1norm = np.sum(np.abs(a-b))

```python
print(a-b)
print(np.abs(a-b))
print(np.sum(np.abs(a-b)))
```
###### **Output:**

    [-4 -4 -4 -4]
    [4 4 4 4]
    16
    

---



### Nearest Neighbors

* **L2  norm as distance metric**


```python
def NN_L2(trainx, trainy, testx):
    testy_L2 = []
    for i in range(len(testx)):
        distance = [np.sum(np.square(testx[i]-trainx[j])) for j in range(len(trainx))]
        test_predicted = trainy[np.argmin(distance)]
        testy_L2.append(test_predicted)
    return np.asarray(testy_L2)
    
testy_L2 = NN_L2(trainx, trainy, testx)
```
---
* **L1 norm as distance metric**


```python
def NN_L1(trainx, trainy, testx):
    testy_L1 = []
    for i in range(len(testx)):
        distance = [np.sum(np.abs(testx[i]-trainx[j])) for j in range(len(trainx))]
        test_predicted = trainy[np.argmin(distance)]
        testy_L1.append(test_predicted)
    return np.asarray(testy_L1)
    
testy_L1 = NN_L1(trainx, trainy, testx)
```
---
### Predictions


```python
testy_L1 = NN_L1(trainx, trainy, testx)
testy_L2 = NN_L2(trainx, trainy, testx)
```
---
### Error Rate


```python
def error_rate(testy, testy_fit):
    return float(sum(testy!=testy_fit))/len(testy) 

print("Error rate of NN_L1: ", error_rate(testy,testy_L1) )
print("Error rate of NN_L2: ", error_rate(testy,testy_L2) )
```
###### **Output:**

    Error rate of NN_L1:  0.22580645161290322
    Error rate of NN_L2:  0.20967741935483872
    
---
### Confusion Matrix

* **Using Pandas**


```python
import pandas as pd
def confusion_usingpandas(testy,testy_fit):
    return np.asarray(pd.crosstab(testy,testy_fit))
```


```python
confusion_usingpandas(testy,testy_L2)
```
###### **Output:**



    array([[17,  1,  2],
           [10, 10,  0],
           [ 0,  0, 22]], dtype=int64)




```python
confusion_usingpandas(testy,testy_L1)
```
###### **Output:**



    array([[16,  2,  2],
           [10, 10,  0],
           [ 0,  0, 22]], dtype=int64)

---
* **From Scratch**


```python
def confusion(testy,testy_fit):
    matrix_dimension = len(np.unique(testy))
    confusion = np.zeros((matrix_dimension,matrix_dimension))
    for i in range(len(testy)):
        confusion[int(testy[i])][int(testy_fit[i])] += 1
    return confusion
```


```python
confusion(testy,testy_L2)
```

###### **Output:**


    array([[17.,  1.,  2.],
           [10., 10.,  0.],
           [ 0.,  0., 22.]])




```python
confusion(testy,testy_L1)
```
###### **Output:**



    array([[16.,  2.,  2.],
           [10., 10.,  0.],
           [ 0.,  0., 22.]])


---
<b> Jupyter Notebook Link </b>   - [Nearest neighbor for spine injury classification](https://nbviewer.jupyter.org/github/aakashkh/DSE220x_MLFundamentals/blob/master/Week1/NN_spine/Nearest_neighbor_spine.ipynb){:target="_blank"}

---