# NihongoApp GitHub Pages Fix

## Problem Diagnosis
The GitHub Pages site at `https://kami00dragon.github.io/NihongoApp/` was showing 404 errors because of incorrect basePath configuration in `next.config.ts`.

## Root Cause
The `next.config.ts` file had:
```typescript
basePath: process.env.NODE_ENV === 'production' ? '/nihon' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/nihon' : '',
```

But GitHub Pages deploys to `/NihongoApp/` (case-sensitive), not `/nihon/`.

## Solution Applied
1. ✅ Fixed `next.config.ts` to use `/NihongoApp` instead of `/nihon`
2. ✅ Rebuilt the application with correct paths
3. ✅ Created GitHub Actions workflow for automatic deployment
4. ✅ Created fix script for future maintenance

## Files Modified
- `next.config.ts` - Fixed basePath and assetPrefix
- `.github/workflows/deploy.yml` - Added automatic deployment workflow

## Next Steps
To complete the fix, the repository owner needs to:
1. Commit the changes: `git add . && git commit -m "Fix GitHub Pages deployment"`
2. Push to GitHub: `git push origin main`
3. Enable GitHub Pages in repository settings if not already enabled
4. Select source as "GitHub Actions" (for the workflow) or "main branch" (for manual)

## Verification
After deployment, the site should work correctly at:
- https://kami00dragon.github.io/NihongoApp/

All static assets will load from the correct `/NihongoApp/` path.