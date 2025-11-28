# 📓 Jupyter Notebook Integration Guide

This guide explains how to integrate Jupyter notebooks with your Hugo blog posts.

## 📁 Folder Structure

```
data-patterns/
├── content/
│   └── concepts/
│       ├── polars-01.md
│       ├── polars_data_types_blog.md
│       └── ... (other markdown files)
└── static/
    └── notebooks/
        └── concepts/
            ├── polars_data_types_blog.ipynb
            └── ... (other notebooks)
```

### Why This Structure?

- **`static/notebooks/`**: Hugo serves everything in `static/` as-is at the root of your site
- **Mirror content structure**: Keeps notebooks organized the same way as your content
- **Easy to maintain**: Clear 1:1 mapping between blog posts and notebooks
- **Git-friendly**: Notebooks are versioned alongside your content

## 🔗 Linking to Notebooks in Blog Posts

### Method 1: Alert Box (Recommended) ⭐

Add this at the beginning of your blog post (after the introduction):

```markdown
{{< alert icon="📓" >}}
**Interactive Notebook Available!** Follow along with the code examples by downloading the [Jupyter notebook](/data-patterns/notebooks/concepts/your-notebook.ipynb) for this post.
{{< /alert >}}
```

**Benefits:**
- Eye-catching and professional
- Clearly visible to readers
- Consistent styling across all posts

### Method 2: Simple Download Link

Add anywhere in your post:

```markdown
📥 **[Download the Jupyter notebook](/data-patterns/notebooks/concepts/your-notebook.ipynb)** to follow along with the code examples.
```

### Method 3: Inline Badge

```markdown
[![Open in Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange?logo=jupyter)](/data-patterns/notebooks/concepts/your-notebook.ipynb)
```

### Method 4: Section at the End

Add a "Resources" section at the end of your post:

```markdown
## 📚 Resources

- **Jupyter Notebook**: [Download the interactive notebook](/data-patterns/notebooks/concepts/your-notebook.ipynb)
- **GitHub**: [View source code](https://github.com/aakashkh/data-patterns)
```

## 🚀 Advanced Options

### Option A: Google Colab Integration

Add a "Open in Colab" badge:

```markdown
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/aakashkh/data-patterns/blob/main/static/notebooks/concepts/your-notebook.ipynb)
```

**Requirements:**
- Notebook must be pushed to GitHub
- Update the path to match your GitHub repo structure

### Option B: Binder Integration

For fully interactive notebooks in the browser:

```markdown
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/aakashkh/data-patterns/main?filepath=static/notebooks/concepts/your-notebook.ipynb)
```

**Requirements:**
- Notebook must be on GitHub
- May need a `requirements.txt` in your repo root

### Option C: nbviewer

For read-only notebook viewing:

```markdown
[![nbviewer](https://img.shields.io/badge/render-nbviewer-orange.svg)](https://nbviewer.org/github/aakashkh/data-patterns/blob/main/static/notebooks/concepts/your-notebook.ipynb)
```

## 📋 Workflow for Adding New Notebooks

### Step 1: Create Your Notebook
Work on your notebook in `content/concepts/` or a separate working directory.

### Step 2: Copy to Static Folder
```bash
# From the project root
cp content/concepts/your-notebook.ipynb static/notebooks/concepts/
```

Or use PowerShell:
```powershell
Copy-Item content\concepts\your-notebook.ipynb static\notebooks\concepts\
```

### Step 3: Add Link to Blog Post
Add the alert box or download link to your markdown file:

```markdown
{{< alert icon="📓" >}}
**Interactive Notebook Available!** Follow along with the code examples by downloading the [Jupyter notebook](/data-patterns/notebooks/concepts/your-notebook.ipynb) for this post.
{{< /alert >}}
```

### Step 4: Test Locally
```bash
hugo server
```

Visit your blog post and verify the download link works.

### Step 5: Commit Both Files
```bash
git add content/concepts/your-post.md
git add static/notebooks/concepts/your-notebook.ipynb
git commit -m "Add blog post with notebook: Your Post Title"
git push
```

## 🎨 Customization Options

### Custom Alert Styles

You can customize the alert appearance by using different icons:

```markdown
{{< alert icon="💻" >}}
**Code Examples**: Download the notebook to run all examples locally.
{{< /alert >}}

{{< alert icon="🔬" >}}
**Experiment**: Try the interactive notebook to explore the concepts hands-on.
{{< /alert >}}

{{< alert icon="📊" >}}
**Data Analysis**: Get the notebook with all datasets and visualizations.
{{< /alert >}}
```

### Multiple Notebook Links

If you have multiple notebooks for a single post:

```markdown
{{< alert icon="📓" >}}
**Interactive Notebooks Available:**
- [Part 1: Basics](/data-patterns/notebooks/concepts/topic-part1.ipynb)
- [Part 2: Advanced](/data-patterns/notebooks/concepts/topic-part2.ipynb)
- [Part 3: Practice](/data-patterns/notebooks/concepts/topic-part3.ipynb)
{{< /alert >}}
```

## 🔧 Troubleshooting

### Link Not Working?

1. **Check the path**: Make sure it starts with `/data-patterns/` (your baseURL)
2. **Verify file location**: Notebook should be in `static/notebooks/concepts/`
3. **Rebuild**: Run `hugo server` again
4. **Check browser console**: Look for 404 errors

### Notebook Too Large?

If your notebook file is very large (>5MB):

1. **Clear outputs**: `jupyter nbconvert --clear-output --inplace your-notebook.ipynb`
2. **Use Git LFS**: For very large notebooks or datasets
3. **External hosting**: Consider hosting on GitHub and linking directly

### Want to Display Notebook Content Inline?

For embedding notebook content directly in the blog (not just linking):

1. **Convert to HTML**: `jupyter nbconvert --to html your-notebook.ipynb`
2. **Use Hugo shortcode**: Create a custom shortcode to embed the HTML
3. **Or use iframe**: Embed the HTML file in an iframe

## 📝 Best Practices

1. **Always clear outputs before committing**: Keeps file size small
   ```bash
   jupyter nbconvert --clear-output --inplace *.ipynb
   ```

2. **Keep notebooks focused**: One notebook per blog post concept

3. **Add README cells**: Include instructions at the top of each notebook

4. **Test notebooks**: Ensure they run from top to bottom without errors

5. **Version control**: Commit notebooks alongside blog posts

6. **Consistent naming**: Match notebook names to blog post slugs

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Copy notebook to static | `copy content\concepts\notebook.ipynb static\notebooks\concepts\` |
| Clear notebook outputs | `jupyter nbconvert --clear-output --inplace notebook.ipynb` |
| Test locally | `hugo server` |
| View notebook URL | `http://localhost:1313/data-patterns/notebooks/concepts/notebook.ipynb` |

## 📚 Example Implementation

See `polars_data_types_blog.md` for a complete example of notebook integration.

---

**Need help?** Check the [Hugo documentation](https://gohugo.io/content-management/static-files/) or open an issue on GitHub.
