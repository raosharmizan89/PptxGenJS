# CDN Deployment Instructions

## Current Status

✅ **Local bundle is built and working**: `./dist/pptxgen.bundle.js`
- Includes JSZip (no separate script needed)
- Includes all layout selection fixes
- Size: 1014K

## To Use with CDN

### Step 1: Commit and Push to GitHub

```bash
cd /workspaces/PptxGenJS

# Add the updated dist files
git add dist/pptxgen.bundle.js
git add dist/pptxgen.bundle.js.map
git add dist/pptxgen.min.js
git add dist/pptxgen.min.js.map
git add dist/pptxgen.cjs.js
git add dist/pptxgen.es.js

# Also add any updated source files if needed
git add src/

# Commit
git commit -m "Build updated bundle with layout selection fixes"

# Push to GitHub
git push origin master
```

### Step 2: Create a Git Tag (Recommended)

Creating a tag allows you to use a specific version with jsDelivr CDN:

```bash
# Create a new version tag (update version number as needed)
git tag v0.9.1

# Push the tag to GitHub
git push origin v0.9.1
```

### Step 3: Update test.html to Use CDN

After pushing to GitHub, update test.html:

```html
<!-- Option 1: Use specific version tag -->
<script src="https://cdn.jsdelivr.net/gh/raosharmizan89/PptxGenJS@v0.9.1/dist/pptxgen.bundle.js"></script>

<!-- Option 2: Use latest from master branch (updates automatically) -->
<script src="https://cdn.jsdelivr.net/gh/raosharmizan89/PptxGenJS@master/dist/pptxgen.bundle.js"></script>

<!-- Option 3: Use latest stable version (cdn.jsdelivr.net caches this) -->
<script src="https://cdn.jsdelivr.net/gh/raosharmizan89/PptxGenJS/dist/pptxgen.bundle.js"></script>
```

**Recommended**: Use Option 1 with a version tag for stability.

### Step 4: Wait for CDN to Update

jsDelivr CDN may cache files. To force a refresh:
- Use a new version tag (v0.9.1, v0.9.2, etc.)
- Or add `?v=timestamp` to the URL during testing
- CDN typically updates within a few minutes

## For Testing NOW (Before CDN Push)

### Option A: Use Local Bundle (Current Setup)

test.html is currently configured to use:
```html
<script src="./dist/pptxgen.bundle.js"></script>
```

This works immediately and includes all fixes.

**Test at**: `http://localhost:8000/test.html`

### Option B: Simulate CDN

You can test the bundle as if it were from CDN:

```bash
# The local file is already in the right location
# Just access it via the local server
```

The current setup in test.html (`./dist/pptxgen.bundle.js`) works exactly like the CDN version would.

## Verification

After deployment to CDN:

1. Open test.html with CDN URL
2. Check browser console - no errors
3. Should see layout selection messages
4. Generate PPTX
5. Verify layouts in PowerPoint

## What's in the Bundle

The `pptxgen.bundle.js` includes:
- JSZip library (minified)
- Polyfills (if any)
- PptxGenJS with all layout selection functionality

**No separate JSZip script tag needed!**

## Current test.html Configuration

✅ **Working now** with local bundle:
```html
<script src="./dist/pptxgen.bundle.js"></script>
```

This is identical to what the CDN would serve, just loaded locally.

## Summary

**To use CDN version:**
1. ✅ Build complete (`npm run ship` done)
2. 📝 Push to GitHub (you need to do this)
3. 📝 Create version tag (optional but recommended)
4. 📝 Update test.html to use CDN URL
5. 📝 Wait for CDN cache (or use version tag)

**For immediate testing:**
- ✅ Current setup works with `./dist/pptxgen.bundle.js`
- Test now at `http://localhost:8000/test.html`
