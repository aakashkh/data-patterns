---
layout : post
title : Part 4 - Plotting Using Seaborn - Heatmap, Lollipop Plot, Scatter Plot
categories: [python, visualisation]
tags: [python, seaborn, matplotlib, pandas, plot, heatmap, lollipop plot, scatter plot]
---

---
### Introduction and Data preparation
Please follow the folloing links regarding data preparation and previous posts to follow along -

* <b> For Data Preapration </b>  - [Part 0 - Plotting Using Seaborn - Data Preparation](/python/visualisation/2019/08/20/Plotting-Seaborn-Data-Preparation.html){:target="_blank"}

* <b> For Part 1 </b> - [Part 1 - Plotting Using Seaborn - Violin, Box and Line Plot](/python/visualisation/2019/08/21/Plotting-Seaborn-Violin-Box-Line.html){:target="_blank"}

* <b> For Part 2 </b> - [Part 2 - Plotting Using Seaborn - Distribution Plot, Facet Grid](/python/visualisation/2019/08/23/Plotting-Seaborn-Distribution-Facet-Grid.html){:target="_blank"}

* <b> For Part 3 </b> - [Part 3 - Plotting Using Seaborn - Donut](/python/visualisation/2019/08/23/Plotting-Seaborn-Donut.html){:target="_blank"}

---

### Heatmap shwoing average percentage score across each test by track

```python
test_scores_TestName2 = test_scores.groupby(['Test Name','Track'])[['Score','maximum_score']].mean().reset_index().sort_values(by=['maximum_score','Score'])
test_scores_TestName2['Percent'] = test_scores_TestName2['Score']/test_scores_TestName2['maximum_score']
df_heatmap = test_scores_TestName2.pivot('Test Name','Track','Percent')
fig, axes = plt.subplots(figsize=(9,9))
f = sns.heatmap(df_heatmap, annot=True,cmap ="Blues")
f.set_xlabel(xlabel = '',fontsize=20)
f.set_ylabel(ylabel = '',fontsize=20)
f.set_yticklabels(labels = list(df_heatmap.index.values), fontsize=12, rotation = 360)
f.set_xticklabels(labels = ['Engineering', 'QA', 'Support'], fontsize=12, rotation =360)
fig.suptitle('Heatmap shwoing average percentage score across each test by track', 
             fontsize=20, x = 0.5, y = 0.94)
#plb.savefig('Heat_Track',dpi=100,bbox_inches='tight')  
```

<!--break-->

![Heatmap](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Heatmap-Lollipop/output_6_1.png "Heatmap shwoing average percentage score across each test by track")

---

### Heatmap shwoing average percentage score across each test by designation

```python
test_scores_TestName2 = test_scores.groupby(['Test Name','Designation'])[['Score','maximum_score']].mean().reset_index().sort_values(
                                                                                                    by=['maximum_score','Score'])
test_scores_TestName2['Percent'] = test_scores_TestName2['Score']/test_scores_TestName2['maximum_score']
df_heatmap = test_scores_TestName2.pivot('Test Name','Designation','Percent')
df_heatmap = df_heatmap[['Associate',  'Lead','Manager','Consultant','Associate Director and above']]
fig, axes = plt.subplots(figsize=(14,9))
f = sns.heatmap(df_heatmap, annot=True,cmap ="Blues")
f.set_xlabel(xlabel = '',fontsize=20)
f.set_ylabel(ylabel = '',fontsize=20)
f.set_yticklabels(labels = list(df_heatmap.index.values), fontsize=12, rotation = 360)
f.set_xticklabels(labels = ['Associate',  'Lead','Manager','Consultant','Director & above'], fontsize=12, rotation =360)
fig.suptitle('Heatmap shwoing average percentage score across each test by designation', 
             fontsize=20, x = 0.5, y = 0.94)
#plb.savefig('Heat_Design',dpi=100,bbox_inches='tight')
```

![Heatmap](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Heatmap-Lollipop/output_7_1.png "Heatmap shwoing average percentage score across each test by designation")

---

### Average score percentage across tests by complexity 

```python
fig = plt.figure(figsize=(12,10))
test_names = test_scores.groupby(['Test Name', 'Complexity'])['Percent'].mean().reset_index()
list_ordering = ['Easy','Medium','Difficult']  
test_names['Complexity'] = test_names['Complexity'] .astype("category", categories=list_ordering, ordered=True)
test_names = test_names.sort_values(['Complexity', 'Percent'])
my_range=range(0,len(test_names))
my_color=np.where(test_names['Complexity']=='Easy',"#ffa600",
                  np.where(test_names['Complexity']=='Medium',"#f95d6a","#a05195"))

plt.hlines(y=test_names['Test Name'], xmin=0, xmax=test_names['Percent'], color=my_color,linewidth=3, alpha =0.8)
plt.scatter(test_names['Percent'], my_range, color=my_color, s=80, alpha=1)
plt.title("Average score percentage across tests by complexity", fontsize=20, x=0.5,y=1.02)
plt.xlabel('Score %', fontsize=20)
plt.ylabel('',fontsize=20)
plt.yticks(fontsize=15)
plt.xticks(fontsize=15)
plt.grid()
custom_lines = [Line2D([0], [0], color="#ffa600", lw=4),
                Line2D([0], [0], color="#f95d6a", lw=4),
                Line2D([0], [0], color="#a05195", lw=4)]
plt.legend(custom_lines, ['Easy', 'Medium', 'Difficult'], loc='lower right')
#plb.savefig('Lollipo_Score',dpi=100,bbox_inches='tight')
```

![Lollipop Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Heatmap-Lollipop/output_9_1.png "Average score percentage across tests by complexity")

--- 

### Participation across tests by complexity


```python
fig = plt.figure(figsize=(12,10))
test_names = test_scores.groupby(['Test Name', 'Complexity'])['Participant identifier'].size().reset_index()
list_ordering = ['Easy','Medium','Difficult']  
test_names['Complexity'] = test_names['Complexity'] .astype("category", categories=list_ordering, ordered=True)
test_names = test_names.sort_values(['Complexity', 'Participant identifier'])
my_range=range(0,len(test_names))
my_color=np.where(test_names['Complexity']=='Easy',"#ffa600",
                  np.where(test_names['Complexity']=='Medium',"#f95d6a","#a05195"))

plt.hlines(y=test_names['Test Name'], xmin=0, xmax=test_names['Participant identifier'], color=my_color,linewidth=3, alpha =0.8)
plt.scatter(test_names['Participant identifier'], my_range, color=my_color, s=80, alpha=1)
plt.title("Participation across tests by complexity", fontsize=20, x=0.5,y=1.02)
plt.xlabel('Number of Participants', fontsize=20)
plt.ylabel('',fontsize=20)
plt.yticks(fontsize=15)
plt.xticks(fontsize=15)
plt.grid()
custom_lines = [Line2D([0], [0], color="#ffa600", lw=4),
                Line2D([0], [0], color="#f95d6a", lw=4),
                Line2D([0], [0], color="#a05195", lw=4)]
plt.legend(custom_lines, ['Easy', 'Medium', 'Difficult'], loc='lower right')
#plb.savefig('Lollipo_Part',dpi=100,bbox_inches='tight')
```

![Lollipop Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Heatmap-Lollipop/output_11_1.png "Participation across tests by complexity")

---

### Participants who scored full across tests by complexity

```python
max_score = test_scores[test_scores['Percent'] == 100]
max_score = max_score.groupby(['Test Name', 'Complexity'])['Participant identifier'].size().reset_index()

fig = plt.figure(figsize=(12,10))
list_ordering = ['Easy','Medium','Difficult']  
max_score['Complexity'] = max_score['Complexity'].astype("category", categories=list_ordering, ordered=True)
max_score =max_score.sort_values(['Complexity', 'Participant identifier'])
my_range=range(0,len(max_score))
my_color=np.where(max_score['Complexity']=='Easy',"#ffa600",
                  np.where(max_score['Complexity']=='Medium',"#f95d6a","#a05195"))

plt.hlines(y=max_score['Test Name'], xmin=0, xmax=max_score['Participant identifier'], color=my_color,linewidth=3, alpha =0.8)
plt.scatter(max_score['Participant identifier'], my_range, color=my_color, s=80, alpha=1)
plt.title("Participants who scored full across tests by complexity", fontsize=20, x=0.5,y=1.02)
plt.xlabel('Number of Participants', fontsize=20)
plt.ylabel('',fontsize=20)
plt.yticks(fontsize=15)
plt.xticks(fontsize=15)
plt.grid()
custom_lines = [Line2D([0], [0], color="#ffa600", lw=4),
                Line2D([0], [0], color="#f95d6a", lw=4),
                Line2D([0], [0], color="#a05195", lw=4)]
plt.legend(custom_lines, ['Easy', 'Medium', 'Difficult'], loc='lower right')
#plb.savefig('Lollipo_FullScore',dpi=100,bbox_inches='tight')
```

![Lollipop Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Heatmap-Lollipop/output_13_1.png "Participants who scored full across tests by complexity")

---

### Score percentage distribution by no. of tests given

```python
fig = plt.figure(figsize=(10,7))
participant = test_scores.groupby(['Participant identifier','Track','Designation']).agg({'Test Name':'size', 'Score':'sum',
                                                                               'maximum_score':'sum'}).reset_index()
participant['Percent'] =  round((participant['Score']/participant['maximum_score'])*100,2)
sns.scatterplot(x="Test Name", y="Percent", data=participant)
plt.xlabel('Number of tests given', fontsize=20)
plt.ylabel('Score %',fontsize=20)
plt.yticks(fontsize=15)
plt.xticks(fontsize=15)
plt.grid()
plt.title("Score percentage distribution by no. of tests given", fontsize=20, x=0.5,y=1.02)
#plb.savefig('Sacatter_TestvsScore',dpi=100,bbox_inches='tight')

```

![Scatter Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Heatmap-Lollipop/output_14_1.png "Participants who scored full across tests by complexity")

---
<b> Jupyter Notebook Link </b>   - [Part 4 - Plotting Using Seaborn - Heatmap, Lollipop Plot, Scatter Plot](https://nbviewer.jupyter.org/github/aakashkh/Sample-Jupyter-Notebooks/blob/master/Visualization%20With%20Seaborn/Test%20Names.ipynb){:target="_blank"}

---