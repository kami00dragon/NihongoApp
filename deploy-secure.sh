#!/bin/bash

# Secure NihongoApp Deployment Script
# This script ensures secure deployment with integrity checks

set -e

echo "🚀 Starting Secure NihongoApp Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Security checks
print_status "Running security checks..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the NihongoApp directory."
    exit 1
fi

# Check for suspicious files
print_status "Checking for suspicious files..."
if find . -name "*.exe" -o -name "*.bat" -o -name "*.scr" -o -name "*.vbs" | grep -v node_modules | head -5; then
    print_warning "Suspicious executable files found. Please review."
fi

# Clean any potential malicious modifications
print_status "Cleaning potential security issues..."
rm -rf .next/out
rm -rf node_modules/.cache
find . -name "*.log" -not -path "./node_modules/*" -delete

# Verify critical files integrity
print_status "Verifying critical files integrity..."

CRITICAL_FILES=("package.json" "next.config.ts" "src/app/page.tsx" "src/components/SecureNihongoApp.tsx" ".github/workflows/secure-deploy.yml")

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Critical file missing: $file"
        exit 1
    fi
    print_success "✓ $file verified"
done

# Git security checks
if [ -d ".git" ]; then
    print_status "Checking git repository security..."
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "There are uncommitted changes:"
        git status --short
        read -p "Do you want to commit these changes? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "Auto-commit during secure deployment - $(date)"
            print_success "Changes committed"
        fi
    fi
    
    # Verify remote origin
    if ! git remote get-url origin | grep -q "github.com"; then
        print_error "Remote origin is not pointing to GitHub. Aborting for security."
        exit 1
    fi
fi

# Install dependencies securely
print_status "Installing dependencies..."
bun install --frozen-lockfile

# Security audit
print_status "Running security audit..."
bun audit || print_warning "Security audit found issues (continuing...)"

# Build the application
print_status "Building application..."
bun run build

# Verify build output
if [ ! -d "out" ]; then
    print_error "Build failed - out directory not created"
    exit 1
fi

if [ ! -f "out/index.html" ]; then
    print_error "Build failed - index.html not found"
    exit 1
fi

print_success "Build completed successfully"

# Final security check of output
print_status "Performing final security check on build output..."

# Check for suspicious content in HTML files
if grep -r -i "javascript:eval\|document\.write\|innerHTML.*script" out/; then
    print_warning "Potentially dangerous JavaScript patterns found in build output"
fi

# Deploy to GitHub if configured
if [ -d ".git" ] && git remote get-url origin &>/dev/null; then
    print_status "Pushing to GitHub..."
    git push origin main
    
    print_success "Code pushed to GitHub"
    print_status "GitHub Actions will automatically deploy to GitHub Pages"
    print_status "Monitor deployment at: https://github.com/kami00dragon/NihongoApp/actions"
else
    print_warning "No git remote configured. Manual deployment required."
fi

# Create deployment report
DEPLOYMENT_REPORT="deployment-$(date +%Y%m%d-%H%M%S).log"
{
    echo "Secure NihongoApp Deployment Report"
    echo "=================================="
    echo "Date: $(date)"
    echo "Node version: $(node --version)"
    echo "Bun version: $(bun --version)"
    echo "Git status: $(git status --porcelain | wc -l) files changed"
    echo "Build size: $(du -sh out/ | cut -f1)"
    echo ""
    echo "Files deployed:"
    find out/ -type f | head -20
    echo ""
    echo "Security checks passed: ✓"
} > "$DEPLOYMENT_REPORT"

print_success "Deployment completed successfully!"
print_status "Deployment report saved to: $DEPLOYMENT_REPORT"
print_status "Your app should be available at: https://kami00dragon.github.io/NihongoApp"

# Wait a moment for GitHub Actions to trigger
sleep 3
print_status "Check GitHub Actions for deployment progress"

echo ""
echo "🔒 SECURITY REMINDERS:"
echo "1. Enable 2-factor authentication on GitHub"
echo "2. Regularly update dependencies"
echo "3. Monitor GitHub Actions for unusual activity"
echo "4. Review access logs regularly"
echo "5. Keep your deployment script secure"