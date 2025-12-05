# Content w/Sub-headline Layout Integration

## Summary
Successfully integrated the "Content w/Sub-headline" layout as **ID 1** in the CUSTOM_SLIDE_LAYOUT_DEFS, positioned between "Content - no subtitle" (ID 0) and "Content w 2 Line Title and Sub-headline" (ID 2).

## Changes Made

### 1. Layout XML Integration
**File:** `src/cust-xml-slide-layouts.ts`

- **Added** "Content w/Sub-headline" layout with 6 placeholders as ID 1
- **Updated** all subsequent layout IDs (incremented by 1)
- **Total layouts:** Now 57 (was 56)

**Layout Sequence:**
```
ID 0: Content - no subtitle
ID 1: Content w/Sub-headline  ← NEW
ID 2: Content w 2 Line Title and Sub-headline
ID 3: Two Content
... (remaining 53 layouts)
```

### 2. Relationship File Update
**File:** `src/cust-xml-slide-layout-rels.ts`

- **Added** relationship entry for ID 1
- **Updated** all subsequent relationship IDs to match layout IDs
- **Total relationships:** 57 entries matching the 57 layouts

### 3. Build Process
- ✅ Compiled successfully with `npm run build`
- ✅ Bundled successfully with `npm run ship`
- ✅ No TypeScript or build errors

## Layout Structure

### Placeholders (6 total)
The "Content w/Sub-headline" layout includes:

1. **Footer Placeholder 1** (type: "ftr", idx: 20)
2. **Slide Number Placeholder 5** (type: "sldNum", idx: 12)
3. **Title 6** (type: "title")
4. **Sub-headline** (type: "body", idx: 13)
5. **Content Placeholder 2** (idx: 17)
6. **Footnote** (type: "body", idx: 15)

### Placeholder Positions
- Title: x=567039, y=342900, w=11062709, h=460551
- Sub-headline: x=567039, y=899026, w=11064240, h=278706
- Content: x=563712, y=1257300, w=11064240, h=4343400
- Footnote: x=567039, y=5687045, w=11060912, h=525368

## Usage

### Recommended Approach (with defineSlideMaster)

```javascript
import pptxgen from './src/bld/pptxgen.es.js';

const pptx = new pptxgen();

// Define the layout with placeholders
pptx.defineSlideMaster({
  title: "Content w/Sub-headline",
  objects: [
    { placeholder: { options: { name: "Title 6", type: "title", x: 0.44, y: 0.27, w: 8.64, h: 0.36 }}},
    { placeholder: { options: { name: "Sub-headline", type: "body", x: 0.44, y: 0.70, w: 8.64, h: 0.22 }}},
    { placeholder: { options: { name: "Content Placeholder 2", type: "body", x: 0.44, y: 0.98, w: 8.64, h: 3.39 }}},
    { placeholder: { options: { name: "Footnote", type: "body", x: 0.44, y: 4.44, w: 8.64, h: 0.41 }}}
  ]
});

// Create slide using the layout
const slide = pptx.addSlide({ masterName: "Content w/Sub-headline" });

// Add content via placeholders
slide.addText("Technology Innovation", { placeholder: "Title 6" });
slide.addText("Driving digital transformation in 2025", { placeholder: "Sub-headline" });
slide.addText([
  { text: "• Cloud-native architecture", options: { breakLine: true } },
  { text: "• AI-powered analytics", options: { breakLine: true } },
  { text: "• Enhanced security protocols", options: { breakLine: true } },
  { text: "• Real-time collaboration tools" }
], { placeholder: "Content Placeholder 2" });
slide.addText("Source: Technology Strategy 2025", { placeholder: "Footnote" });

await pptx.writeFile({ fileName: 'presentation.pptx' });
```

## Verification Results

### Test File
Created: `test-content-with-subheadline.mjs`

### Test Output
```
Creating presentation with "Content w/Sub-headline" layout...

BEFORE createSlideMaster, newLayout._slideObjects: 0
AFTER createSlideMaster, newLayout._slideObjects: 6
Layout Info:
  - Name: Content w/Sub-headline
  - _slideObjects count: 6
  - Placeholders:
    [0] Footer Placeholder 1
    [1] Slide Number Placeholder 5
    [2] Title 6
    [3] Sub-headline
    [4] Content Placeholder 2
    [5] Footnote

✓ Added title via placeholder
✓ Added sub-headline via placeholder
✓ Added content via placeholder
✓ Added footnote via placeholder
✓ Presentation saved successfully!
File size: 654.32 KB
```

### Generated File Validation
- ✅ File created: `presentation-content-with-subheadline.pptx` (654.32 KB)
- ✅ Layout count: 57 slide layouts
- ✅ Layout position: slideLayout2.xml (ID 1)
- ✅ Layout name: "Content w/Sub-headline"
- ✅ All content populated correctly via placeholders
- ✅ File opens successfully in PowerPoint

### XML Verification
```bash
# Check layout name
$ unzip -p presentation-content-with-subheadline.pptx ppt/slideLayouts/slideLayout2.xml | grep 'name='
name="Content w/Sub-headline"

# Check slide content
$ unzip -p presentation-content-with-subheadline.pptx ppt/slides/slide1.xml | grep '<a:t>'
<a:t>Technology Innovation</a:t>
<a:t>Driving digital transformation in 2025</a:t>
<a:t>• Cloud-native architecture</a:t>
<a:t>• AI-powered analytics</a:t>
<a:t>• Enhanced security protocols</a:t>
<a:t>• Real-time collaboration tools</a:t>
<a:t>Source: Technology Strategy 2025</a:t>
```

## Layout Order

The complete layout sequence is now:
```
0. Content - no subtitle
1. Content w/Sub-headline  ← NEWLY ADDED
2. Content w 2 Line Title and Sub-headline
3. Two Content
4. Two Content + Subtitles
5. Content 4 Columns
6. Content 5 Columns
7. Content with Sidebar
8. Title Only
9. Blank
... (48 more layouts)
```

## Technical Notes

### Architecture Limitation
Like other layouts in CUSTOM_SLIDE_LAYOUT_DEFS, the "Content w/Sub-headline" layout stores only XML strings. The layout has **empty `_slideObjects`** by default.

**Workaround:** Use `defineSlideMaster()` to create the layout with parsed placeholders in `_slideObjects`. This enables full placeholder functionality.

### Placeholder XML Structure
The layout uses `<p:spPr/>` (empty shape properties) for placeholders, allowing PowerPoint to use the layout's positioning automatically. This matches the structure in good-presentation-test.pptx.

## Files Modified

1. **src/cust-xml-slide-layouts.ts** - Added layout XML as ID 1, updated all subsequent IDs
2. **src/cust-xml-slide-layout-rels.ts** - Added relationship entry for ID 1, updated all subsequent IDs
3. **test-content-with-subheadline.mjs** - Created test script demonstrating usage

## Build Commands

```bash
# Rebuild the project
npm run build

# Create distribution bundle
npm run ship

# Run test
node test-content-with-subheadline.mjs
```

## Status

✅ **INTEGRATION COMPLETE**

The "Content w/Sub-headline" layout is now fully integrated as ID 1 and ready for use in presentations.
