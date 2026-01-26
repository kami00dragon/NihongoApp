# NihongoApp - Learn Japanese

A comprehensive web application for learning Japanese language with silabarios, vocabulary, grammar, and JLPT N5-N1 particles.

## 🚀 Deployment

This project is configured for GitHub Pages deployment using static export.

## 📋 Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Framer Motion** - Animations and interactions

## 🌐 GitHub Pages Setup

1. **Configure Repository Settings**:
   - Go to your repository's Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` and `/ (root)`

2. **Update package.json**:
   Replace `[USERNAME]` in the `homepage` field with your GitHub username:
   ```json
   "homepage": "https://[USERNAME].github.io/nihon"
   ```

3. **Enable GitHub Pages**:
   The GitHub Actions workflow will automatically build and deploy to GitHub Pages when you push to the `main` branch.

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (static export)
npm run build
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── data/            # Static data files
└── lib/             # Utility functions

public/              # Static assets
```

## 🎯 Features

- **Silabarios**: Hiragana and Katakana learning
- **Vocabulary**: Japanese-Spanish and Japanese-Japanese vocabulary
- **Grammar**: JLPT N5-N1 grammar topics and particles
- **Numbers and Dates**: Japanese number systems and date formats
- **Kanji**: Complete JLPT kanji database
- **Interactive Games**: Learning activities and exercises

## 📱 Responsive Design

Mobile-first design with dark/light theme support and smooth animations.

## 🔒 Static Export Notes

This project uses Next.js static export for GitHub Pages compatibility:
- API routes are converted to static data
- Images are unoptimized for static hosting
- Base path configured for GitHub Pages subdirectory