---
layout : post
title : Part 3 - Plotting Using Seaborn - Donut
categories: [python, visualisation]
tags: [python, seaborn, matplotlib, pandas, plot, donut]
---
---

## DONUTS

```python
company_headcount = pd.melt(test_participant, id_vars=['Designation'], 
                            value_vars=['Engineering', 'Quality Assurance', 'Support']) \
                        .rename(columns={"variable": "Track", "value": "Headcount"})

for_donuts = test_scores.groupby(['Track','Designation'])[['Participant identifier']].nunique().reset_index()
```


```python
participant_matrix = pd.merge(company_headcount,for_donuts,how = 'left',left_on = ['Track', 'Designation'],
                              right_on= ['Track', 'Designation'])
participant_matrix_eng = participant_matrix[participant_matrix['Track'] == 'Engineering']
participant_matrix_sup = participant_matrix[participant_matrix['Track'] == 'Support']
participant_matrix_qa = participant_matrix[participant_matrix['Track'] == 'Quality Assurance']
```

<!--break-->
---

```python
participant_matrix = participant_matrix.groupby(['Track'])[['Headcount','Participant identifier']].sum().reset_index()
participant_matrix['Headcount Percent'] = round(participant_matrix['Headcount']/participant_matrix['Headcount'].sum(),4)*100
participant_matrix['Percent'] =  round((participant_matrix['Participant identifier']*participant_matrix['Headcount Percent']/participant_matrix['Headcount']),2)
participant_matrix['Not Participated'] = participant_matrix['Headcount Percent'] - participant_matrix['Percent']
participant_matrix['actual percent'] = participant_matrix['Participant identifier']*100/participant_matrix['Headcount'].sum()
group_names=list(participant_matrix['Track'] + " (" + participant_matrix['Headcount'].astype(int).astype(str) + ", "+ participant_matrix['Headcount Percent'].astype(int).astype(str) + "% )")
group_size=list(participant_matrix['Headcount Percent'])


subgroup_names=[(str(int(round(x,0)))+"%") for t in  list(zip(participant_matrix['Percent'], 
                                                              participant_matrix['Not Participated'])) for x in t]
subgroup_size=[x for t in  list(zip(participant_matrix['Percent'], participant_matrix['Not Participated'])) for x in t]

pie_size= list(participant_matrix['actual percent'])
pie_size.append(100 - sum(pie_size))
pie_name = list(zip(participant_matrix['Track'], participant_matrix['Participant identifier'].astype(int)))
NotParticipated = "Not Participated, " + str(int(participant_matrix['Headcount'].sum() - participant_matrix['Participant identifier'].sum()))
pie_name.append(NotParticipated)
    
# Create colors
a, b, c, d, e=["#e4f1fe","#c5eff7", "#81cfe0","#00b5cc","#52b3d9"]
 
bbox_props = dict(boxstyle="square, pad=0.3", fc="w", ec="k", lw=0.72)
# First Ring (outside)
fig, ax = plt.subplots(figsize=(15,15))
ax.axis('equal')
mypie, autotexts = ax.pie(group_size, radius=1.5, labels=group_names, colors=[a,b,c,d,e] ,labeldistance=1,
                         textprops=dict(color="black"))
plt.setp( mypie, width=0.3, edgecolor='white')
plt.setp(autotexts, size=24, weight="bold")

 
# Second Ring (Inside)
mypie2,autotexts2 = ax.pie(subgroup_size, radius=1.2, labels=subgroup_names, labeldistance=1.1, 
                   colors=["#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675"],
                    textprops=dict(color="black")
                 )

mypie3,autotexts3 = ax.pie(pie_size, radius=0.7, labels=pie_name, labeldistance=1, 
                  colors=["#e4f1fe","#c5eff7", "#81cfe0","#ff7675"],
                    textprops=dict(color="black"),rotatelabels =True
                 )

fig.suptitle('Participation proportion of all Track', fontsize=50, x = 0.5, y = 1.05)

plt.setp(autotexts2, size=24, weight="bold")
plt.setp(autotexts3, size=15, weight="bold")
plt.setp(mypie2,width=0.3, edgecolor='white')
plt.setp(mypie3,width=0.7, edgecolor='white')
#plb.savefig('Participation.png',dpi=100,bbox_inches='tight')
```

![Donut Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Donut/output_6_1.png "Participation proportion of all Track")




```python
participant_matrix_eng['Headcount Percent'] = round(participant_matrix_eng['Headcount']/participant_matrix_eng['Headcount'].sum(),4)*100
participant_matrix_eng['Percent'] =  round((participant_matrix_eng['Participant identifier']*participant_matrix_eng['Headcount Percent']/participant_matrix_eng['Headcount']),2)
participant_matrix_eng['Not Participated'] = participant_matrix_eng['Headcount Percent'] - participant_matrix_eng['Percent']
participant_matrix_eng['actual percent'] = participant_matrix_eng['Participant identifier']*100/participant_matrix['Headcount'].sum()
group_names=list(participant_matrix_eng['Designation'] + " (" + participant_matrix_eng['Headcount'].astype(int).astype(str) + ", "+ participant_matrix_eng['Headcount Percent'].astype(int).astype(str) + "% )")
group_size=list(participant_matrix_eng['Headcount Percent'])
subgroup_names=[(str(int(x))+"%") for t in  list(zip(participant_matrix_eng['Percent'], participant_matrix_eng['Not Participated'])) for x in t]
subgroup_size=[x for t in  list(zip(participant_matrix_eng['Percent'], participant_matrix_eng['Not Participated'])) for x in t]
pie_size= list(participant_matrix_eng['actual percent'])
pie_size.append(100 - sum(pie_size))
pie_name = list(zip(participant_matrix_eng['Designation'], participant_matrix_eng['Participant identifier'].astype(int)))
NotParticipated = "Not Participated, " + str(int(participant_matrix_eng['Headcount'].sum() - participant_matrix_eng['Participant identifier'].sum()))
pie_name.append(NotParticipated)
    
    
# Create colors
a, b, c, d, e=["#e4f1fe","#c5eff7", "#81cfe0","#00b5cc","#52b3d9"]
 
bbox_props = dict(boxstyle="square,pad=0.3", fc="w", ec="k", lw=0.72)
# First Ring (outside)
fig, ax = plt.subplots(figsize=(15,15))
ax.axis('equal')
mypie, autotexts = ax.pie(group_size, radius=1.5, labels=group_names, colors=[a,b,c,d,e] ,labeldistance=1.1,
                         textprops=dict(color="black"))
plt.setp( mypie, width=0.3, edgecolor='white')
plt.setp(autotexts, size=24, weight="bold")

 
# Second Ring (Inside)
mypie2,autotexts2 = ax.pie(subgroup_size, radius=1.2, labels=subgroup_names, labeldistance=1.11, 
                   colors=["#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675"],
                    textprops=dict(color="black"))

mypie3,autotexts3 = ax.pie(pie_size, radius=0.7, labels=pie_name, labeldistance=0.9, 
                  colors=["#e4f1fe","#c5eff7", "#81cfe0","#00b5cc","#52b3d9","#ff7675"],
                    textprops=dict(color="black"),  rotatelabels =True
                 )
fig.suptitle('Participation proportion of various designation from Engineering Track', fontsize=50, x = 0.5, y = 1.05)

plt.setp(autotexts2, size=24, weight="bold")
plt.setp(mypie2,width=0.3, edgecolor='white')
plt.setp(autotexts3, size=15, weight="bold")
plt.setp(mypie3,width=0.7, edgecolor='white')

#plb.savefig('Eng_Participation.png',dpi=100,bbox_inches='tight')
```
![Donut Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Donut/output_7_1.png "Participation proportion of various designation from Engineering Track")


```python
participant_matrix_qa['Headcount Percent'] = round(participant_matrix_qa['Headcount']/participant_matrix_qa['Headcount'].sum(),4)*100
participant_matrix_qa['Percent'] =  round((participant_matrix_qa['Participant identifier']*participant_matrix_qa['Headcount Percent']/participant_matrix_qa['Headcount']),2)
participant_matrix_qa['Not Participated'] = participant_matrix_qa['Headcount Percent'] - participant_matrix_qa['Percent']
participant_matrix_qa['actual percent'] = participant_matrix_qa['Participant identifier']*100/participant_matrix['Headcount'].sum()
participant_matrix_qa = participant_matrix_qa.dropna()
group_names=list(participant_matrix_qa['Designation'] + " (" + participant_matrix_qa['Headcount'].astype(int).astype(str) + ", "+ participant_matrix_qa['Headcount Percent'].astype(int).astype(str) + "% )")
group_size=list(participant_matrix_qa['Headcount Percent'])
subgroup_names=[(str(int(x))+"%") for t in  list(zip(participant_matrix_qa['Percent'], participant_matrix_qa['Not Participated'])) for x in t]
subgroup_size=[x for t in  list(zip(participant_matrix_qa['Percent'], participant_matrix_qa['Not Participated'])) for x in t]
pie_size= list(participant_matrix_qa['actual percent'])
pie_size.append(100 - sum(pie_size))
pie_name = list(zip(participant_matrix_qa['Designation'], participant_matrix_qa['Participant identifier'].astype(int)))
NotParticipated = "Not Participated, " + str(int(participant_matrix_qa['Headcount'].sum() - participant_matrix_qa['Participant identifier'].sum()))
pie_name.append(NotParticipated)
    
    
# Create colors
a, b, c, d, e=["#e4f1fe","#c5eff7", "#81cfe0","#00b5cc","#52b3d9"]
 
bbox_props = dict(boxstyle="square,pad=0.3", fc="w", ec="k", lw=0.72)
# First Ring (outside)
fig, ax = plt.subplots(figsize=(15,15))
ax.axis('equal')
mypie, autotexts = ax.pie(group_size, radius=1.5, labels=group_names, colors=[a,b,c,d,e] ,labeldistance=1.1,
                         textprops=dict(color="black"))
plt.setp( mypie, width=0.3, edgecolor='white')
plt.setp(autotexts, size=24, weight="bold")

 
# Second Ring (Inside)
mypie2,autotexts2 = ax.pie(subgroup_size, radius=1.2, labels=subgroup_names, labeldistance=1.11, 
                   colors=["#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675"],
                    textprops=dict(color="black"))

mypie3,autotexts3 = ax.pie(pie_size, radius=0.7, labels=pie_name, labeldistance=1, 
                  colors=["#e4f1fe","#c5eff7", "#81cfe0","#ff7675"],
                    textprops=dict(color="black"),  rotatelabels =True
                 )
fig.suptitle('Participation proportion of various designation from QA Track', fontsize=50, x = 0.5, y = 1.05)

plt.setp(autotexts2, size=24, weight="bold")
plt.setp(mypie2,width=0.3, edgecolor='white')
plt.setp(autotexts3, size=18, weight="bold")
plt.setp(mypie3,width=0.7, edgecolor='white')
#plb.savefig('QA_Participation.png',dpi=100,bbox_inches='tight')
```

![Donut Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Donut/output_8_1.png "Participation proportion of various designation from QA Track")


```python
participant_matrix_sup['Headcount Percent'] = round(participant_matrix_sup['Headcount']/participant_matrix_sup['Headcount'].sum(),4)*100
participant_matrix_sup['Percent'] =  round((participant_matrix_sup['Participant identifier']*participant_matrix_sup['Headcount Percent']/participant_matrix_sup['Headcount']),2)
participant_matrix_sup['Not Participated'] = participant_matrix_sup['Headcount Percent'] - participant_matrix_sup['Percent']
participant_matrix_sup['actual percent'] = participant_matrix_sup['Participant identifier']*100/participant_matrix['Headcount'].sum()
participant_matrix_sup = participant_matrix_sup.dropna()
group_names=list(participant_matrix_sup['Designation'] + " (" + participant_matrix_sup['Headcount'].astype(int).astype(str) + ", "+ participant_matrix_sup['Headcount Percent'].astype(int).astype(str) + "% )")
group_size=list(participant_matrix_sup['Headcount Percent'])
subgroup_names=[(str(int(x))+"%") for t in  list(zip(participant_matrix_sup['Percent'], participant_matrix_sup['Not Participated'])) for x in t]
subgroup_size=[x for t in  list(zip(participant_matrix_sup['Percent'], participant_matrix_sup['Not Participated'])) for x in t]
pie_size= list(participant_matrix_sup['actual percent'])
pie_size.append(100 - sum(pie_size))
pie_name = list(zip(participant_matrix_sup['Designation'], participant_matrix_sup['Participant identifier'].astype(int)))
NotParticipated = "Not Participated, " + str(int(participant_matrix_sup['Headcount'].sum() - participant_matrix_sup['Participant identifier'].sum()))
pie_name.append(NotParticipated)
    
    
# Create colors
a, b, c, d, e=["#e4f1fe","#c5eff7", "#81cfe0","#00b5cc","#52b3d9"]
 
bbox_props = dict(boxstyle="square,pad=0.3", fc="w", ec="k", lw=0.72)
# First Ring (outside)
fig, ax = plt.subplots(figsize=(15,15))
ax.axis('equal')
mypie, autotexts = ax.pie(group_size, radius=1.5, labels=group_names, colors=[a,b,c,d,e] ,labeldistance=1.1,
                         textprops=dict(color="black"))
plt.setp( mypie, width=0.3, edgecolor='white')
plt.setp(autotexts, size=24, weight="bold")

 
# Second Ring (Inside)
mypie2,autotexts2 = ax.pie(subgroup_size, radius=1.2, labels=subgroup_names, labeldistance=1.11, 
                   colors=["#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675","#55efc4","#ff7675"],
                    textprops=dict(color="black"))

mypie3,autotexts3 = ax.pie(pie_size, radius=0.7, labeldistance=1,
                  colors=["#e4f1fe","#c5eff7", "#81cfe0","#00b5cc","#ff7675"],
                    textprops=dict(color="black"),  rotatelabels =True
                 )
fig.suptitle('Participation proportion of various designation from Support Track', fontsize=50, x = 0.5, y = 1.1)

plt.setp(autotexts2, size=24, weight="bold")
plt.setp(mypie2,width=0.3, edgecolor='white')
plt.setp(autotexts3, size=14, weight="bold")
plt.setp(mypie3,width=0.7, edgecolor='white')
#plb.savefig('Sup_Participation.png',dpi=100,bbox_inches='tight')
```

![Donut Plot](/static/img/posts/python/2019-08-23-Plotting-Seaborn-Donut/output_9_1.png "Participation proportion of various designation from Support Track")
