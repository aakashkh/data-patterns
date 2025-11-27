---
title: "Concepts"
linkTitle: "Concepts"
menu:
  main:
    weight: 10
type: "concepts"
---

<!-- 
# Concepts Section Guide (README)

## How to Organize Posts
The "Concepts" section is organized by **Series**. The association between a post and a series is defined entirely by the `series` parameter in the frontmatter of each Markdown file.

### Available Series
- **SQL**: Set `series: "sql"`
- **Azure**: Set `series: "azure"`
- **Python**:
  - **Polars**: Set `series: "polars"`
  - **Pandas**: Set `series: "pandas"`

## How to Add a New Post
To add a new post, create a new Markdown file in `content/concepts/` (e.g., `my-new-post.md`) and use the following frontmatter template:

```yaml
---
title: "Your Post Title"
date: 2025-11-27T12:00:00+05:30
description: "A short description for the card preview."
categories: ["Category1", "Category2"]
tags: ["tag1", "tag2"]
toc: true
series: "sql"  # CHANGE THIS to: sql, azure, pandas, or polars
weight: 3      # CHANGE THIS to control the order (1, 2, 3...)
---
```

## Directory Structure
All posts live flat in `content/concepts/`. The `_index.md` file (this file) defines the section properties.
-->