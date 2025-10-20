# Data Patterns

A Hugo-powered site (Docsy theme) for data engineering and analytics notes.

## Folder Structure

- **`archetypes/`**
- **`assets/`**
- **`content/`**
- **`content/en/`**
- **`content/en/blog/`**
- **`content/en/docs/`**
- **`data/`**
- **`i18n/`**
- **`layouts/`**
- **`public/`**
- **`resources/`**
- **`static/`**
- **`themes/`**
- **`hugo.yaml`**
- **`.gitignore`**

## Write a New Blog Post

The site is configured with `contentDir: content/en`, so blog posts live under `content/en/blog/`.

- **Using Hugo (recommended)**
  1. Run:
     ```bash
     hugo new blog/my-new-post.md
     ```
     This creates `content/en/blog/my-new-post.md` with default front matter from `archetypes/default.md` (draft=true).
  2. Edit the file and set `title`, `date`, `tags`, etc. Keep `draft: true` while editing.
  3. Preview locally (includes drafts):
     ```bash
     hugo server -D
     ```
  4. When ready to publish, set `draft: false` and commit.

- **Manual (if not using Hugo CLI)**
  1. Create a new file under `content/en/blog/` like `YYYY-MM-DD-my-new-post.md`.
  2. Add front matter similar to:
     ```toml
     +++
     title = "My New Post"
     date = "2025-01-01T10:00:00Z"
     draft = true
     tags = ["tag1", "tag2"]
     categories = ["category"]
     +++
     ```
  3. Write your content below the front matter.
  4. Switch `draft` to `false` when publishing.

## Notes

- Blog permalinks are configured as `/:section/:year/:month/:day/:slug/` in `hugo.yaml`.
- Search is offline (`params.offlineSearch: true`).
- The Docsy theme is imported but disabled in `module.imports` (can be enabled if needed).
