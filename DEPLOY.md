# Instructions for GitHub Pages Deployment

## 🚀 Setup Instructions

### 1. Update package.json
Replace `[USERNAME]` in the `homepage` field with your GitHub username:
```json
"homepage": "https://[USERNAME].github.io/nihon"
```

### 2. Initialize Git Repository
```bash
cd /path/to/nihon
git init
git add .
git commit -m "Initial commit for GitHub Pages"
```

### 3. Create GitHub Repository
1. Go to GitHub and create a new repository named `nihon`
2. Add remote and push:
```bash
git remote add origin https://github.com/[USERNAME]/nihon.git
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to your repository's Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` and `/ (root)`
4. Save

### 5. Configure GitHub Actions
The workflow will automatically:
- Build the project on push to main
- Deploy to GitHub Pages
- Create the `gh-pages` branch

## 📋 Changes Made

### ✅ Next.js Configuration
- Changed `output: "standalone"` to `output: "export"`
- Added `trailingSlash: true` for GitHub Pages
- Added `images.unoptimized: true`
- Configured `basePath` and `assetPrefix` for `/nihon` subdirectory

### ✅ GitHub Actions Workflow
- Created `.github/workflows/deploy.yml`
- Automated build and deploy process
- Uses Node.js 20 for compatibility

### ✅ Static Export Adaptations
- Removed API routes (not supported in static export)
- Updated icons to use local paths
- Added mock data structure for static compatibility
- Updated metadata for GitHub Pages

### ✅ Package.json Updates
- Added `homepage` field for GitHub Pages
- Simplified build script
- Removed server-specific scripts

## 🎯 Features Preserved
- ✅ All UI components and styling
- ✅ Static data (kanji, vocabulary, grammar)
- ✅ Responsive design
- ✅ Dark/light theme
- ✅ Animations and interactions
- ✅ All learning modules

## ⚠️ Notes
- API functionality removed (static export limitation)
- Images unoptimized (static hosting)
- Requires manual dependency installation for local testing

## 🔧 Local Testing
```bash
npm install
npm run build
# The static files will be in the 'out' directory
```

After pushing to GitHub, your app will be available at:
`https://[USERNAME].github.io/nihon`