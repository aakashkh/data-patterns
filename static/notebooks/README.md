# 📓 Jupyter Notebooks

This folder contains Jupyter notebooks that accompany blog posts on the Data Patterns site.

## 📁 Structure

```
notebooks/
└── concepts/
    └── polars_data_types_blog.ipynb
```

Each notebook corresponds to a blog post in the `content/` directory.

## 🔗 How Notebooks Are Linked

Notebooks are linked from blog posts using Hugo alert shortcodes:

```markdown
{{< alert icon="📓" >}}
**Interactive Notebook Available!** Follow along with the code examples by downloading the [Jupyter notebook](/data-patterns/notebooks/concepts/notebook-name.ipynb) for this post.
{{< /alert >}}
```

## 📥 Accessing Notebooks

### On the Website
- Visit any blog post that has a notebook
- Click the download link in the alert box
- The notebook will download to your computer

### Direct URLs
Notebooks are served at: `https://aakashkh.github.io/data-patterns/notebooks/{category}/{notebook-name}.ipynb`

Example: `https://aakashkh.github.io/data-patterns/notebooks/concepts/polars_data_types_blog.ipynb`

## 🚀 Running Notebooks Locally

1. **Download the notebook** from the blog post or this repository
2. **Install dependencies**:
   ```bash
   pip install jupyter polars pandas numpy
   ```
3. **Launch Jupyter**:
   ```bash
   jupyter notebook
   ```
4. **Open the downloaded notebook** and run the cells

## 🔧 For Contributors

### Adding a New Notebook

1. **Create your notebook** in `content/{category}/`
2. **Run the helper script**:
   ```powershell
   .\add-notebook.ps1 -NotebookName "your-notebook-name" -Category "concepts"
   ```
3. **Add the generated alert box** to your blog post
4. **Test locally**: `hugo server`
5. **Commit both files**:
   ```bash
   git add content/{category}/your-post.md
   git add static/notebooks/{category}/your-notebook.ipynb
   git commit -m "Add notebook for your-post"
   ```

### Best Practices

- ✅ Clear outputs before committing: `jupyter nbconvert --clear-output --inplace notebook.ipynb`
- ✅ Test notebooks run from top to bottom without errors
- ✅ Include markdown cells with explanations
- ✅ Keep notebooks focused on a single topic
- ✅ Match notebook names to blog post slugs

## 📚 Available Notebooks

| Notebook | Blog Post | Category |
|----------|-----------|----------|
| `polars_data_types_blog.ipynb` | Mastering Polars Data Types and Missing Values | concepts |

## 🎯 Interactive Options

You can also run notebooks interactively online:

### Google Colab
Click the "Open in Colab" badge on the blog post (if available)

### Binder
Click the "Launch Binder" badge on the blog post (if available)

### nbviewer
View notebooks in read-only mode via nbviewer links

---

**Questions?** See `NOTEBOOK_GUIDE.md` in the project root for detailed documentation.
