---
layout : post
title : Part 2 - Plotting Using Seaborn - Distribution Plot, Facet Grid
categories: [python, visualisation]
tags: [python, seaborn, matplotlib, pandas, plot, dist plot, distribution, facet, grid]
---

---
### Introduction and Data preparation
Please follow the folloing links regarding data preparation and previous posts to follow along -

* <b> For Data Preparation </b>  - [Part 0 - Plotting Using Seaborn - Data Preparation](/python/visualisation/2019/08/20/Plotting-Seaborn-Data-Preparation.html){:target="_blank"}

* <b> For Part 1 </b> - [Part 1 - Plotting Using Seaborn - Violin, Box and Line Plot](/python/visualisation/2019/08/21/Plotting-Seaborn-Violin-Box-Line.html){:target="_blank"}

---

### Subset of data based on complexity

```python
test_scores_easy = test_scores[test_scores['Complexity']=='Easy']
test_scores_medium = test_scores[test_scores['Complexity']=='Medium']
test_scores_hard = test_scores[test_scores['Complexity']=='Difficult']
```
---

### Distribution of score percentage across track in test with easy complexity

```python
sns.set(style="whitegrid")
g = sns.FacetGrid(test_scores_easy, col='Track', row='Test Name', height = 4, aspect =2.5)
g.map(sns.distplot, "Percent", kde = False, hist = True, rug = False)
g.set_titles(size =20)
g.set_xlabels(size = 25)
g.set_ylabels(size = 25, label = "Participants")
g.set_yticklabels(fontsize =25)
g.set_xticklabels(fontsize =25, labels = [0,0,20,40,60,80,100])
g.fig.suptitle('Distribution of score percentage across track in test with easy complexity', fontsize=40, x = 0.5, y = 1.05)
#plb.savefig('Distribution_easy.png',dpi=50,bbox_inches='tight')
```

<!--break-->

![Distribution Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Distribution-Facet-Grid/output_5_1.png "Distribution of score percentage across track in test with easy complexity")

---

### Distribution of score percentage across track in test with medium complexity

```python
sns.set(style="whitegrid")
g = sns.FacetGrid(test_scores_medium, col='Track', row='Test Name', height = 4, aspect =2.5)
g.map(sns.distplot, "Percent", kde = False, hist = True, rug = False)
g.set_titles(size =20)
g.set_xlabels(size = 25)
g.set_ylabels(size = 25, label = "Participants")
g.set_yticklabels(fontsize =25)
g.set_xticklabels(fontsize =25, labels = [0,0,20,40,60,80,100])
g.fig.suptitle('Distribution of score percentage across track in test with medium complexity', fontsize=40, x = 0.5, y = 1.05)
#plb.savefig('Distribution_medium.png',dpi=50,bbox_inches='tight')
```

![Distribution Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Distribution-Facet-Grid/output_6_1.png "Distribution of score percentage across track in test with medium complexity")

---

### Distribution of score percentage across track in test with difficult complexity

```python
sns.set(style = "whitegrid")
g = sns.FacetGrid(test_scores_hard, col='Track', row='Test Name', height = 4, aspect =2.5)
g.map(sns.distplot, "Percent", kde = False, hist = True, rug = False)
g.set_titles(size =20)
g.set_xlabels(size = 25)
g.set_ylabels(size = 25, label = "Participants")
g.set_yticklabels(fontsize =25)
g.set_xticklabels(fontsize =25, labels = [0,0,20,40,60,80,100])
g.fig.suptitle('Distribution of score percentage across track in test with difficult complexity', fontsize=40, x = 0.5, y = 1.05)
#plb.savefig('Distribution_hard',dpi=50,bbox_inches='tight')
```

![Distribution Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Distribution-Facet-Grid/output_7_1.png "Distribution of score percentage across track in test with difficult complexity")

---
<b> Jupyter Notebook Link </b>   - [Part 2 - Plotting Using Seaborn - Distribution Plot, Facet Grid](https://nbviewer.jupyter.org/github/aakashkh/Sample-Jupyter-Notebooks/blob/master/Visualization%20With%20Seaborn/Complexity%20Analysis.ipynb){:target="_blank"}
---