# GitHub Image Hosting Guide

This folder contains images for the tech blog, hosted directly on GitHub's CDN.

## Folder Structure
- `posts/` - Images used in blog posts
- `banners/` - Header/banner images
- `diagrams/` - Technical diagrams and charts

## How to Use

### 1. Upload Images
Add images to the appropriate folder and commit to the repository.

### 2. Get Direct URLs
After pushing to GitHub, your images will be available at:
```
https://raw.githubusercontent.com/[USERNAME]/tech-blog/main/images/[FOLDER]/[FILENAME]
```

**Example:**
```
https://raw.githubusercontent.com/yourusername/tech-blog/main/images/posts/database-schema.png
```

### 3. Use in Blog Posts
Simply paste the GitHub CDN URL into your blog post image field.

## Benefits
- ✅ Free hosting with unlimited bandwidth (public repos)
- ✅ Fast CDN delivery worldwide
- ✅ Version controlled images
- ✅ No expiration dates
- ✅ Perfect for technical diagrams and code screenshots

## Best Practices
- Use descriptive filenames: `jwt-authentication-flow.png` not `image1.png`
- Organize by post or topic in subfolders
- Optimize images before uploading (compress for web)
- Use appropriate formats: PNG for diagrams, JPG for photos

## File Size Recommendations
- Blog post images: < 500KB each
- Diagrams: < 200KB each
- Thumbnails: < 100KB each 