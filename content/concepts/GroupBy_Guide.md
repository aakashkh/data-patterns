# pandas groupby() — A Practical Guide
### Based on the Miles Travel Itinerary Project

---

## What is groupby()?

`groupby()` splits a DataFrame into buckets based on one or more column values, lets you run a function on each bucket independently, then stitches all the results back together into one DataFrame.

The mental model:

```
Full DataFrame
      |
      |-- groupby('TravelID')
      |
      ├── Group: TravelID = "T001"  →  apply function  →  result
      ├── Group: TravelID = "T002"  →  apply function  →  result
      └── Group: TravelID = "T003"  →  apply function  →  result
                                                              |
                                                     concat all results
                                                              |
                                                     Final DataFrame
```

---

## The Data We're Working With

Imagine this is our travel itinerary data:

| iteneraryID | TravelID | dep_city  | arr_city  | dep_dt              | arr_dt              |
|-------------|----------|-----------|-----------|---------------------|---------------------|
| 1           | T001     | Taipei    | Bangkok   | 2026-11-01 08:00    | 2026-11-01 11:30    |
| 2           | T001     | Bangkok   | Sydney    | 2026-11-01 14:00    | 2026-11-02 05:00    |
| 3           | T001     | Sydney    | Auckland  | 2026-11-10 09:00    | 2026-11-10 14:00    |
| 4           | T002     | Delhi     | Dubai     | 2026-11-05 22:00    | 2026-11-06 00:30    |
| 5           | T002     | Dubai     | London    | 2026-11-06 03:00    | 2026-11-06 08:00    |
| 6           | T003     | New York  | Paris     | 2026-11-15 18:00    | 2026-11-16 06:00    |

- T001: Taipei→Bangkok (layover 2.5h) → Sydney (8 days gap) → Auckland
- T002: Delhi→Dubai (layover 2.5h) → London
- T003: New York→Paris (single leg)

---

## Part 1 — groupby with a Single Column

### Syntax
```python
df.groupby('TravelID', group_keys=False).apply(your_function)
```

### What happens internally

When you call `df.groupby('TravelID')`, pandas creates 3 separate mini-DataFrames:

**Group T001:**
| iteneraryID | TravelID | dep_city | arr_city | dep_dt           |
|-------------|----------|----------|----------|------------------|
| 1           | T001     | Taipei   | Bangkok  | 2026-11-01 08:00 |
| 2           | T001     | Bangkok  | Sydney   | 2026-11-01 14:00 |
| 3           | T001     | Sydney   | Auckland | 2026-11-10 09:00 |

**Group T002:**
| iteneraryID | TravelID | dep_city | arr_city | dep_dt           |
|-------------|----------|----------|----------|------------------|
| 4           | T002     | Delhi    | Dubai    | 2026-11-05 22:00 |
| 5           | T002     | Dubai    | London   | 2026-11-06 03:00 |

**Group T003:**
| iteneraryID | TravelID | dep_city | arr_city | dep_dt           |
|-------------|----------|----------|----------|------------------|
| 6           | T003     | New York | Paris    | 2026-11-15 18:00 |

Your function receives each of these one at a time.

---

## Part 2 — group_keys=False Explained

```python
# group_keys=True (default) — adds TravelID as an extra index level
df.groupby('TravelID').apply(fn)

# Result index looks like:
# TravelID
# T001      0
#           1
#           2
# T002      3
#           4
```

```python
# group_keys=False — keeps the original flat index
df.groupby('TravelID', group_keys=False).apply(fn)

# Result index looks like:
# 0
# 1
# 2
# 3
# 4
```

**Rule of thumb:** If your function returns a DataFrame (not a single aggregated value), always use `group_keys=False` to keep the result flat and usable.

---

## Part 3 — Real Example 1: Layover Detection

This is exactly what the Miles project does. The function runs per `TravelID` and looks at rows relative to each other.

```python
def assign_layover_flags(group):
    group = group.copy()                        # never modify the original group in-place
    prev_arr = group['arr_dt'].shift(1)         # shift arr_dt down by 1 row
    gap = group['dep_dt'] - prev_arr            # gap = current departure - previous arrival
    group['is_layover'] = (gap < pd.Timedelta(hours=24)) & gap.notna()
    group['travel_segment'] = (~group['is_layover']).cumsum()
    return group

df = df.groupby('TravelID', group_keys=False).apply(assign_layover_flags)
```

### Step-by-step for Group T001

**After shift(1):**

| row | dep_dt           | arr_dt           | prev_arr (shifted) | gap        |
|-----|------------------|------------------|--------------------|------------|
| 1   | 2026-11-01 08:00 | 2026-11-01 11:30 | NaT                | NaT        |
| 2   | 2026-11-01 14:00 | 2026-11-02 05:00 | 2026-11-01 11:30   | 2.5 hours  |
| 3   | 2026-11-10 09:00 | 2026-11-10 14:00 | 2026-11-02 05:00   | 8.17 days  |

**is_layover:**
- Row 1: NaT gap → False (first leg, no previous arrival)
- Row 2: 2.5h < 24h → **True** (layover!)
- Row 3: 8.17 days > 24h → False (new independent travel)

**travel_segment via cumsum():**

`~is_layover` = [True, False, True] = [1, 0, 1]

`cumsum()` = [1, 1, 2]

| row | dep_city | arr_city | is_layover | travel_segment |
|-----|----------|----------|------------|----------------|
| 1   | Taipei   | Bangkok  | False      | 1              |
| 2   | Bangkok  | Sydney   | True       | 1  ← same!     |
| 3   | Sydney   | Auckland | False      | 2              |

### Why group_keys=False matters here

Without it, `shift(1)` would accidentally bleed the last row of T001 into the first row of T002 if the index were continuous. By grouping first, `shift(1)` only looks within T001's rows — the first row of every group always gets `NaT` as the previous arrival.

---

## Part 4 — Real Example 2: Segment Distance (Grouping by Two Columns)

```python
coords = city_coords.set_index('City')[['Latitude', 'Longitude']]

def calc_segment_distance(group):
    origin      = group['dep_city'].iloc[0]   # first row's departure city
    destination = group['arr_city'].iloc[-1]  # last row's arrival city
    group['segment_dep_city'] = origin
    group['segment_arr_city'] = destination
    try:
        p1 = tuple(coords.loc[origin])
        p2 = tuple(coords.loc[destination])
        if any(pd.isna(v) for v in p1 + p2):
            raise ValueError
        km    = geodesic(p1, p2).km
        miles = geodesic(p1, p2).miles
    except (KeyError, ValueError):
        km, miles = pd.NA, pd.NA
    group['segment_km']    = km
    group['segment_miles'] = miles
    return group

df = df.groupby(['TravelID', 'travel_segment'], group_keys=False).apply(calc_segment_distance)
```

### Grouping by two columns

`groupby(['TravelID', 'travel_segment'])` creates a group for every unique **combination**:

| Group Key          | Rows included              |
|--------------------|----------------------------|
| (T001, 1)          | Taipei→Bangkok, Bangkok→Sydney |
| (T001, 2)          | Sydney→Auckland            |
| (T002, 1)          | Delhi→Dubai, Dubai→London  |
| (T003, 1)          | New York→Paris             |

### What the function does per group

**Group (T001, 1):** Taipei → Bangkok → Sydney
- `iloc[0]` dep_city = **Taipei**
- `iloc[-1]` arr_city = **Sydney**
- Distance = Taipei to Sydney (skipping Bangkok entirely)
- Both rows get `segment_dep_city=Taipei`, `segment_arr_city=Sydney`, same km/miles

**Group (T001, 2):** Sydney → Auckland
- `iloc[0]` dep_city = **Sydney**
- `iloc[-1]` arr_city = **Auckland**
- Single leg, so segment distance = leg distance

### Final output for T001

| dep_city | arr_city | is_layover | travel_segment | segment_dep_city | segment_arr_city | segment_km |
|----------|----------|------------|----------------|------------------|------------------|------------|
| Taipei   | Bangkok  | False      | 1              | Taipei           | Sydney           | 7823       |
| Bangkok  | Sydney   | True       | 1              | Taipei           | Sydney           | 7823       |
| Sydney   | Auckland | False      | 2              | Sydney           | Auckland         | 2162       |

---

## Part 5 — Common groupby Patterns

### Pattern 1: Aggregation (collapse group to one row)
```python
# Total distance per TravelID
df.groupby('TravelID')['distance_km'].sum()

# Multiple aggregations at once
df.groupby('TravelID').agg(
    total_km    = ('distance_km', 'sum'),
    total_miles = ('distance_miles', 'sum'),
    num_legs    = ('iteneraryID', 'count')
)
```

### Pattern 2: Transform (keep same shape, broadcast result back)
```python
# Stamp the total segment km on every row (alternative to apply)
df['segment_km'] = df.groupby(['TravelID', 'travel_segment'])['distance_km'].transform('sum')
```
`transform` is faster than `apply` when you just need to broadcast a simple aggregation back to all rows.

### Pattern 3: Filter (drop entire groups that don't meet a condition)
```python
# Keep only TravelIDs that have more than 1 leg
df = df.groupby('TravelID').filter(lambda g: len(g) > 1)
```

### Pattern 4: First / Last row of each group
```python
# Get the departure city of the first leg per TravelID
df.groupby('TravelID')['dep_city'].first()

# Get the arrival city of the last leg per TravelID
df.groupby('TravelID')['arr_city'].last()
```

### Pattern 5: Rank within group
```python
# Rank legs chronologically within each TravelID
df['leg_number'] = df.groupby('TravelID')['dep_dt'].rank(method='first').astype(int)
```

### Pattern 6: Cumulative operations within group
```python
# Cumulative distance travelled so far within each TravelID
df['cumulative_km'] = df.groupby('TravelID')['distance_km'].cumsum()
```

### Pattern 7: shift() within group (used in layover detection)
```python
# Previous arrival time within the same TravelID
df['prev_arr_dt'] = df.groupby('TravelID')['arr_dt'].shift(1)

# Next departure time within the same TravelID
df['next_dep_dt'] = df.groupby('TravelID')['dep_dt'].shift(-1)
```

---

## Part 6 — apply() vs transform() vs agg()

| Method        | Output shape          | Use when                                              |
|---------------|-----------------------|-------------------------------------------------------|
| `apply(fn)`   | Flexible (you decide) | Complex logic, multiple new columns, row-level access |
| `transform(fn)` | Same as input       | Broadcast a single aggregation back to all rows       |
| `agg(fn)`     | One row per group     | Summarizing / collapsing groups                       |
| `filter(fn)`  | Subset of input       | Dropping entire groups based on a condition           |

### When to use apply()
Use `apply()` when your logic needs to:
- Access multiple columns at once (`group['dep_city'].iloc[0]`)
- Use row position (`iloc[0]`, `iloc[-1]`)
- Add multiple new columns in one pass
- Use `shift()` safely within group boundaries

```python
# All of these require apply()
def assign_layover_flags(group):
    group = group.copy()
    prev_arr = group['arr_dt'].shift(1)          # needs row position awareness
    gap = group['dep_dt'] - prev_arr
    group['is_layover'] = (gap < pd.Timedelta(hours=24)) & gap.notna()
    group['travel_segment'] = (~group['is_layover']).cumsum()  # cumsum across group
    return group
```

### When to use transform()
Use `transform()` when you just need one simple aggregation stamped on every row:

```python
# Faster and cleaner than apply() for this case
df['segment_km'] = df.groupby(['TravelID', 'travel_segment'])['distance_km'].transform('sum')
```

---

## Part 7 — The group.copy() Rule

Always call `group.copy()` at the start of your `apply` function:

```python
def assign_layover_flags(group):
    group = group.copy()   # ← always do this
    ...
```

Without it, you are modifying a **slice** of the original DataFrame, which triggers pandas' `SettingWithCopyWarning` and can produce unpredictable results. The copy ensures you're working on an independent object.

---

## Part 8 — Iterating Over Groups (for debugging)

When building or debugging a group function, you can iterate over groups manually to inspect what each group looks like before running apply:

```python
for key, group in df.groupby('TravelID'):
    print(f"\n--- TravelID: {key} ---")
    print(group[['dep_city', 'arr_city', 'dep_dt', 'arr_dt']])
```

For two-column groupby:
```python
for (travel_id, segment), group in df.groupby(['TravelID', 'travel_segment']):
    print(f"\n--- TravelID: {travel_id}, Segment: {segment} ---")
    print(group[['dep_city', 'arr_city', 'is_layover']])
```

This is the fastest way to verify your function logic before applying it to the full DataFrame.

---

## Part 9 — Quick Reference Card

```python
# Single column group
df.groupby('TravelID', group_keys=False).apply(fn)

# Multi column group
df.groupby(['TravelID', 'travel_segment'], group_keys=False).apply(fn)

# Aggregation
df.groupby('TravelID')['distance_km'].sum()
df.groupby('TravelID').agg(total=('distance_km', 'sum'), count=('iteneraryID', 'count'))

# Broadcast back to all rows
df['col'] = df.groupby('TravelID')['distance_km'].transform('sum')

# Drop groups
df = df.groupby('TravelID').filter(lambda g: len(g) > 1)

# First/last value per group
df.groupby('TravelID')['dep_city'].first()
df.groupby('TravelID')['arr_city'].last()

# Shift within group (safe — doesn't bleed across groups)
df['prev_arr'] = df.groupby('TravelID')['arr_dt'].shift(1)

# Rank within group
df['leg_num'] = df.groupby('TravelID')['dep_dt'].rank(method='first').astype(int)

# Cumulative sum within group
df['cum_km'] = df.groupby('TravelID')['distance_km'].cumsum()

# Iterate for debugging
for key, group in df.groupby('TravelID'):
    print(key, group.shape)
```
