# Security and Deployment Guide for NihongoApp

## 🚨 EMERGENCY RECOVERY PROCEDURES

### Immediate Actions if Compromise is Suspected:

1. **Reset all credentials:**
   ```bash
   # Change GitHub password immediately
   # Revoke all personal access tokens
   # Enable 2-factor authentication
   ```

2. **Force clean deployment:**
   ```bash
   git clean -fd
   git reset --hard HEAD
   git push --force origin main
   ```

## 🔒 SECURITY MEASURES IMPLEMENTED

### 1. GitHub Actions Security
- **Permission Restrictions**: Minimal permissions required for deployment
- **Secret Scanning**: TruffleHog integration for secret detection
- **Dependency Scanning**: npm audit for vulnerability detection
- **Build Verification**: Multiple validation checkpoints

### 2. Code Security
- **No Hardcoded Secrets**: All sensitive data in environment variables
- **Dependency Locking**: bun.lock for reproducible builds
- **Input Validation**: Zod schemas for all user inputs
- **CSRF Protection**: Next.js built-in protections

### 3. Deployment Security
- **Atomic Deployments**: No partial deployments
- **Rollback Capability**: Easy reversion via git
- **SSL Enforcement**: HTTPS only on GitHub Pages
- **Content Security Policy**: Restrictive headers

## 🚀 DEPLOYMENT INSTRUCTIONS

### Step 1: Repository Setup
```bash
# Clone or navigate to repository
cd NihongoApp

# Ensure clean state
git clean -fd
git status

# Add remote if needed
git remote add origin https://github.com/kami00dragon/NihongoApp.git
```

### Step 2: Configure GitHub Pages
1. Go to repository Settings → Pages
2. Source: "GitHub Actions"
3. Ensure Actions are enabled in repository settings

### Step 3: Deploy
```bash
# Commit all changes
git add .
git commit -m "Secure deployment - $(date)"
git push origin main
```

### Step 4: Verify Deployment
- Check Actions tab for workflow status
- Wait 5-10 minutes for GitHub Pages to update
- Visit: https://kami00dragon.github.io/NihongoApp

## 🛡️ ONGOING SECURITY MONITORING

### Daily Checks:
1. Review GitHub Actions logs
2. Check for unauthorized commits
3. Monitor dependency updates
4. Verify website functionality

### Weekly Security Tasks:
1. Update dependencies: `bun update`
2. Run security audit: `npm audit`
3. Review access logs
4. Backup important data

## 🔄 AUTOMATED RECOVERY

### If deployment fails:
```bash
# Reset to last known good state
git log --oneline -10
git reset --hard <commit-hash>
git push --force origin main

# Trigger rebuild
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

### If files are modified unexpectedly:
```bash
# Find what changed
git diff --name-only HEAD~1 HEAD

# Reset specific files
git checkout HEAD -- <filename>

# Complete reset if needed
git reset --hard origin/main
git clean -fd
git push --force origin main
```

## 📱 APP FEATURES (VERIFIED)

### Core Learning Components:
- ✅ Hiragana/Katakana learning cards
- ✅ Vocabulary practice with JLPT levels
- ✅ Grammar lessons and examples
- ✅ Interactive quiz system
- ✅ Progress tracking

### Technical Features:
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark/Light theme support
- ✅ Offline capability
- ✅ Fast loading with Next.js static generation
- ✅ Accessibility features

## 🚨 INCIDENT RESPONSE

### If compromise is detected:
1. **Immediate**: Change all passwords and tokens
2. **Isolate**: Revoke all repository access
3. **Assess**: Review git history and logs
4. **Clean**: Reset to known good state
5. **Recover**: Redeploy from clean commit
6. **Monitor**: Enhanced surveillance for 30 days

### Contact channels:
- GitHub Support: https://support.github.com
- Security issues: Create private repository issue

---

**Last Updated**: $(date)
**Security Version**: 1.0.0
**Deployment Status**: Active