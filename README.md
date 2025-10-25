# Data Patterns

A Hugo-powered site using the Docsy theme, focused on data engineering and analytics.

## 🚀 Features

- 📝 Clean, responsive blog layout with modern UI
- 🔍 Built-in search functionality with Lunr.js
- 📱 Mobile-first, responsive design
- 🎨 Customizable theme with SCSS support
- 📊 Syntax highlighting with Hugo's built-in Chroma
- 🏗️ Modular content organization
- 📊 Data visualization support
- 🔗 Automatic table of contents
- 🌐 Multilingual support (i18n ready)
- 📱 Social media sharing capabilities
- 🔍 SEO optimized
- ⚡ Fast page loads with asset minification

## 📑 Table of Contents (TOC)

### Enabling TOC for Blog Posts

1. **Per Post Basis**
   Add the following to your post's front matter:
   ```yaml
   ---
   # Required
   toc: true                    # Enable table of contents
   
   # Optional TOC Settings
   toc_float: true             # Make TOC float on the side (true/false)
   toc_label: "Contents"       # Customize TOC title
   toc_icon: "list"            # Add an icon (uses Font Awesome icons)
   toc_sticky: true            # Make TOC sticky on scroll (true/false)
   toc_expand: true            # Expand all TOC sections by default (true/false)
   toc_depth: 4                # Maximum heading level to include (1-6)
   ---
   ```
   
   **Available Icons**: You can use any Font Awesome icon name (without the `fa-` prefix) from [Font Awesome Icons](https://fontawesome.com/icons?d=gallery&s=duotone&m=free).

2. **Global TOC Settings**
   The following settings are configured in `config/_default/config.toml`:
   ```toml
   [markup.tableOfContents]
     startLevel = 2  # Start with h2 headings
     endLevel = 4    # Include up to h4 headings
     ordered = false  # Use unordered lists for TOC
   ```

## ✍️ Markdown Features

The site supports the following Markdown features through Goldmark (Hugo's default markdown renderer):

### Basic Formatting
- **Bold**, *italic*, ~~strikethrough~~, `inline code`
- Headers (`# H1` to `###### H6`)
- Links and images
- Lists (ordered and unordered)
- Blockquotes
- Horizontal rules

### Extended Features
- Tables
- Task lists
- Definition lists
- Footnotes
- Strikethrough
- Autolinking
- Typographic replacements (smart quotes, dashes, etc.)

## 🖼️ Image Management

### Image Organization
All blog post images should be stored in the `static/img/posts/` directory, organized by post date and slug:

```
static/
└── img/
    └── posts/
        ├── YYYY-MM-DD-post-slug/
        │   ├── image1.png
        │   ├── image2.jpg
        │   └── ...
        └── ...
```

### Adding Images to Posts
Use the following markdown syntax to include images in your posts:

```markdown
![Alt text for accessibility](/img/posts/YYYY-MM-DD-post-slug/image-name.png "Optional hover text")
```

### Best Practices
1. **Naming Conventions**:
   - Use lowercase with hyphens for image filenames (e.g., `my-image.png`)
   - Be descriptive with filenames
   - Include the post date in the folder name for better organization

2. **Image Optimization**:
   - Compress images before uploading (aim for <200KB per image)
   - Use appropriate formats:
     - PNG for diagrams and screenshots with text
     - JPG for photographs
     - SVG for logos and icons
   - Recommended dimensions:
     - Full-width images: 1200-2000px width
     - Content images: 600-800px width

3. **Accessibility**:
   - Always include descriptive alt text
   - Keep the hover text (title) concise but informative
   - For complex images, consider adding a caption using HTML:
     ```html
     <figure>
       <img src="/img/posts/YYYY-MM-DD-post-slug/image.png" alt="Descriptive alt text">
       <figcaption>Detailed description of the image content</figcaption>
     </figure>
     ```

### Example
```markdown
![Sample visualization](/img/posts/2023-10-25-data-visualization/example-chart.png "Sample bar chart showing monthly data")
```

### Updating Existing Posts
When updating posts with images:
1. Move images to the appropriate directory under `static/img/posts/`
2. Update all image paths in the markdown files
3. Test that all images load correctly in both development and production

### Code Blocks

````markdown
```python
def hello():
    print("Hello, World!")
```
````

### Front Matter Example

```yaml
---
title: "Your Blog Post Title"
date: 2024-04-18T00:00:00+05:30
description: "A brief description of your post"
categories: ["category1", "category2"]
tags: ["tag1", "tag2", "tag3"]
weight: 100
toc: true
draft: false
---
```

### Supported Front Matter Fields
- `title`: Post title (required)
- `date`: Publication date (required)
- `lastmod`: Last modified date
- `description`: Short description for SEO and previews
- `categories`: Array of categories
- `tags`: Array of tags
- `weight`: Sorting weight (lower numbers appear first)
- `toc`: Enable/disable table of contents
- `draft`: Mark as draft (won't be published)
- `images`: Array of image paths for social sharing

## 🛠️ Getting Started

### Prerequisites

- [Hugo](https://gohugo.io/getting-started/installing/) (Extended version required for SCSS support)
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (for development and theme customization)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) (for managing frontend dependencies)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aakashkh/data-patterns.git
   cd data-patterns
   ```

2. **Install dependencies**:
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Or with Yarn
   yarn install
   ```

3. **Start the development server**:
   ```bash
   # For development (includes drafts)
   hugo server -D --disableFastRender
   
   # For production build
   hugo --minify
   
   # For production build with drafts
   hugo -D --minify
   ```

3. Open your browser to `http://localhost:1313`

## 📝 Content Management

### Blog Posts

#### Using Hugo CLI (Recommended)
```bash
# Create a new blog post with date prefix
hugo new blog/YYYY-MM-DD-post-title.md

# Create a post in a specific section
hugo new blog/section-name/YYYY-MM-DD-post-title.md

# Create a post with default front matter
hugo new --kind blog-post blog/YYYY-MM-DD-post-title.md
```

#### Manual Creation
1. Create a new file in `content/en/blog/` following this pattern:
   - Filename: `YYYY-MM-DD-post-title.md`
   - Example: `2025-10-20-getting-started.md`

2. Add front matter:
   ```yaml
   ---
   title: "Your Post Title"
   date: "2025-10-20T14:30:00+05:30"
   draft: true
   tags: ["tag1", "tag2"]
   categories: ["category"]
   ---
   ```

### Static Pages
```bash
# Create a new page in the root section
hugo new your-page.md

# Create a page in a specific section
hugo new section-name/page-name.md

# Create a page with a specific template
hugo new --kind page-bundle section-name/page-name
```

## 🎨 Customization

## ⚙️ Configuration

### Site Configuration
- Main configuration: `hugo.yaml`
- Environment-specific settings: `config/` directory
- Theme settings: `config/_default/`

### Styling
- Custom SCSS: `assets/scss/`
- Theme overrides: `layouts/`
- Custom CSS: `static/css/`

### Search
- Search provider: Lunr.js (client-side)
- Configuration: `hugo.yaml` under `params.offlineSearch`
- Search index: Generated at build time

### Performance
- Minification: Enabled by default in production
- Asset pipeline: Hugo Pipes for CSS/JS processing
- Image processing: Built-in image processing with Hugo Pipes

## 📦 Dependencies

### Required
- Hugo Extended (v0.100.0+ recommended)
- Node.js (v16+)
- npm or Yarn

### Development Dependencies
- PostCSS
- Autoprefixer
- CSSNano
- Terser (for JS minification)

## 🧪 Testing

```bash
# Run HTML validation
npm run test:html

# Run accessibility tests
npm run test:a11y

# Run all tests
npm test
```

## 🚀 Deployment

### GitHub Pages
The site is configured to deploy to GitHub Pages. Push to the `main` branch to trigger a build.

### Manual Build
```bash
# Build the site
hugo

# Output will be in the `public/` directory
```

## 📂 Project Structure

```
data-patterns/
├── .github/                 # GitHub workflows and templates
├── assets/                  # SCSS, JS, and other assets
│   ├── css/                 # Compiled CSS
│   ├── js/                  # Custom JavaScript
│   └── scss/                # SCSS source files
├── content/                 # Website content
│   └── en/                  # English content
│       ├── blog/            # Blog posts
│       └── _index.md        # Homepage content
├── data/                    # Data files
├── i18n/                    # Translation files
├── layouts/                 # HTML templates
│   ├── _default/            # Default templates
│   ├── partials/            # Reusable partials
│   └── shortcodes/          # Custom shortcodes
├── static/                  # Static files
│   ├── images/              # Global images
│   ├── fonts/               # Custom fonts
│   └── uploads/             # User uploads
├── themes/                  # Theme directory
├── .gitignore               # Git ignore rules
├── hugo.yaml                # Main configuration
├── package.json             # Node.js dependencies
└── README.md                # This file
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Set up your development environment:
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   hugo server -D
   ```
4. Make your changes
5. Run tests: `npm test`
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style
- Follow [Hugo's coding style guide](https://gohugo.io/contribute/documentation/)
- Use semantic HTML5
- Follow BEM methodology for CSS
- Use ESLint and StyleLint for code quality

### Commit Messages
- Use the [Conventional Commits](https://www.conventionalcommits.org/) specification
- Start with type: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Keep the first line under 72 characters
- Reference issues and pull requests liberally

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Docsy Theme Documentation](https://www.docsy.dev/docs/)
- [Hugo Forum](https://discourse.gohugo.io/)
- [Hugo Themes](https://themes.gohugo.io/)

## 🔧 Troubleshooting

### Common Issues

#### Missing Dependencies
```bash
# If you get errors about missing modules
hugo mod tidy

# If you get SCSS compilation errors
npm install
```

#### Development Server Not Starting
- Make sure you're using Hugo Extended
- Check for port conflicts (default is 1313)
- Ensure all dependencies are installed

## 🚀 Deployment

### GitHub Pages
```bash
# Build for production
hugo --minify

# Deploy to GitHub Pages
./deploy.sh
```

### Netlify
- Set build command: `hugo --gc --minify`
- Set publish directory: `public`
- Set environment variable: `HUGO_VERSION = 0.100.0` (or your Hugo version)

### Vercel
- Set build command: `hugo --gc --minify`
- Set output directory: `public`
- Set environment variable: `HUGO_VERSION = 0.100.0`

---

Built with ❤️ using [Hugo](https://gohugo.io) and [Docsy](https://www.docsy.dev/)

## 📝 Notes

- Blog permalinks: `/:section/:year/:month/:day/:slug/` (configured in `hugo.yaml`)
- Search: Offline search with Lunr.js (`params.offlineSearch: true`)
- Theme: Docsy (imported as a Hugo Module)
- Performance: Optimized for fast loading with lazy loading and asset minification
- Security: Content Security Policy (CSP) headers configured
- SEO: Optimized with JSON-LD structured data and OpenGraph tags
- Analytics: Google Analytics and Google Tag Manager support included
- Comments: Disqus integration available (uncomment in config)
