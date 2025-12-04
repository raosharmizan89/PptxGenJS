# Complete Testing Guide - Dynamic Layout Selection

## Quick Start

### 1. Start the Local Server
The server is already running on port 8000. If you need to restart it:
```bash
cd /workspaces/PptxGenJS
python3 -m http.server 8000
```

### 2. Access test.html
Open your browser to: `http://localhost:8000/test.html`

### 3. Monitor the Console
- Right-click → "Inspect" → "Console" tab
- Look for messages like:
  ```
  Creating slide1 with layout: Title White - reports and presentations (hIHS)
  Layout exists in slideLayouts? true
  Slide1 created with layout: Title White - reports and presentations (hIHS)
  ```

### 4. Generate and Download the PPTX
- Click the download/generate button on test.html
- Wait for the file to download
- Open it in PowerPoint

### 5. Verify Layouts
Each slide should now display with its intended layout:
- **Slide 1**: "Title White - reports and presentations (hIHS)" layout
  - Should show: Title area + Subtitle + Author info + Logo
- **Slide 2**: "Content w/Sub-headline" layout
  - Should show: Headline + Content area
- **Slide 3**: "Icons 3 Columns Vertical" layout
  - Should show: 3 icon/content sections
- **Slide 4**: "Content w 2 Line Title and Sub-headline" layout
  - Should show: 2-line title + Subtitle + Content
- **Slide 5**: "Two Content + Subtitles" layout
  - Should show: Two content areas with subtitles
- **Slide 6**: "Contact us" layout
  - Should show: Contact information layout

## How to Rebuild if You Make Changes

If you modify any source files in `src/*.ts`, rebuild the JavaScript:

```bash
cd /workspaces/PptxGenJS
npm run build
```

This creates updated files in `src/bld/`:
- `pptxgen.js` (UMD format - used by test.html)
- `pptxgen.es.js` (ES modules)
- `pptxgen.cjs.js` (CommonJS)

**Important**: After rebuilding, reload test.html in your browser (Ctrl+F5 or Cmd+Shift+R for hard refresh).

## What Was Fixed

**The Problem**: 
- test.html was loading PptxGenJS from CDN (old version)
- Your layout selection code was in test.html only
- The CDN version didn't know about your layout selection

**The Solution**:
- Built the project locally with `npm run build`
- Updated test.html to load from `./src/bld/pptxgen.js` (local build)
- Now test.html + PptxGenJS work together correctly

## Troubleshooting

### Issue: "Layout doesn't match expected"
1. Check browser console for layout name
2. Verify the layout name matches exactly (case-sensitive):
   - Layout selection returns: `"Content w/Sub-headline"`
   - Layout definition should be: `title: "Content w/Sub-headline"`
3. Check that all 47 layouts are defined (look at console output)

### Issue: "All slides show same layout"
1. Reload page with hard refresh (Ctrl+F5)
2. Check that you rebuilt: `npm run build`
3. Check console for `getLayoutIdxForSlide` working correctly

### Issue: "Slides are blank"
1. Check that layout placeholders are defined correctly
2. Verify content is being added after slide creation
3. Check browser console for JavaScript errors

### Issue: ".js not found" or 404 error
1. Confirm server is running: `python3 -m http.server 8000`
2. Confirm you're accessing `http://localhost:8000/test.html`
3. Confirm `src/bld/pptxgen.js` exists: `ls -lh /workspaces/PptxGenJS/src/bld/pptxgen.js`

## File Structure for Reference

```
/workspaces/PptxGenJS/
├── test.html                          # Your test file (loads local build)
├── src/
│   ├── pptxgen.ts                    # Main library (TypeScript source)
│   ├── slide.ts                       # Slide class (stores _slideLayout)
│   ├── gen-xml.ts                    # XML generation (includes getLayoutIdxForSlide)
│   ├── bld/
│   │   ├── pptxgen.js                # Built version (loaded by test.html) ✓
│   │   ├── pptxgen.es.js             # ES module version
│   │   └── pptxgen.cjs.js            # CommonJS version
│   └── ...other source files
├── package.json                       # Build scripts (npm run build)
└── ...other files
```

## Expected Console Output When Everything Works

```
Creating slide1 with layout: Title White - reports and presentations (hIHS)
About to call pptx.addSlide with: {masterName: "Title White - reports and presentations (hIHS)"}
Layout exists in slideLayouts? true
Available layouts: (47) ['DEFAULT', 'Title White - reports and presentations (hIHS)', 'Title Image Bottom', ...]
Slide1 object properties: ['addSlide', 'getSlide', '_name', '_presLayout', '_rels', '_relsChart', '_relsMedia', ...]
Slide1 created with layout: Title White - reports and presentations (hIHS)

Layout Selection Debug: {
  slideData: {...},
  analysis: {isTitle: true, ...},
  selectedLayout: "Title White - reports and presentations (hIHS)",
  layoutNameLength: 50,
  layoutNameCharCodes: [...]
}

Creating slide2 with layout: Content w/Sub-headline
About to call pptx.addSlide with: {masterName: "Content w/Sub-headline"}
...and so on for slides 3-6
```

## Next Steps

1. ✅ Fix applied - test.html now loads local build
2. ✅ Project built successfully
3. 📝 **Your task**: Open test.html and verify each slide has the correct layout
4. 📝 **Report**: Let me know if layouts are now correctly applied in PowerPoint

If everything works, you have successfully implemented dynamic layout selection! 🎉
