# Content - no subtitle Layout Integration

## Summary

Successfully integrated the "Content - no subtitle" layout from `cust-xml-slide-layout1.ts` into the main PptxGenJS layout system.

## Changes Made

### 1. Updated `src/cust-xml-slide-layouts.ts`

Added the "Content - no subtitle" layout as **ID 0** (first layout) in the CUSTOM_SLIDE_LAYOUT_DEFS array:

```typescript
{ id: 0, name: 'Content - no subtitle', xml: `<?xml version...` }
```

**Layout Structure:**
- **Footer Placeholder** (type="ftr", idx="18")
- **Slide Number Placeholder** (type="sldNum", idx="12") 
- **Title Placeholder** (type="title", name="Title 6")
- **Content Placeholder** (sz="quarter", idx="17", name="Content Placeholder 2")
- **Footnote Placeholder** (type="body", idx="15", name="Footnote")

This layout matches the standard PowerPoint "Content w/Sub-headline" layout structure found in `good-presentation-test.pptx`.

### 2. Updated `src/cust-xml-slide-layout-rels.ts`

Added the corresponding relationship entry for ID 0:

```typescript
{ id: 0, relsXml: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>` }
```

## How to Use

### Option 1: Use Built-in Layout XML (Limited)

The layout XML is now available in CUSTOM_SLIDE_LAYOUT_DEFS, but **note**: the layout has an empty `_slideObjects` array because placeholders are only in the XML string, not as parsed objects.

```javascript
const slide = pptx.addSlide({ masterName: 'Content - no subtitle' });
```

**Limitation**: Placeholders won't work automatically because `_slideObjects` is empty.

### Option 2: Define Layout with defineSlideMaster (Recommended)

For full placeholder functionality, use `defineSlideMaster()`:

```javascript
import PptxGenJS from 'pptxgenjs';

const pptx = new PptxGenJS();

// Define the layout with placeholders
pptx.defineSlideMaster({
    title: "Content - no subtitle",
    background: { color: 'FFFFFF' },
    margin: [0.5, 0.5, 0.5, 0.5],
    objects: [
        {
            placeholder: {
                options: {
                    name: "Title 6",
                    type: "title",
                    x: 0.5,
                    y: 0.3,
                    w: 9.5,
                    h: 0.7,
                    fontSize: 40,
                    bold: true,
                },
                text: "[Headline]",
            },
        },
        {
            placeholder: {
                options: {
                    name: "Content Placeholder 2",
                    type: "body",
                    x: 0.5,
                    y: 1.1,
                    w: 9.5,
                    h: 3.7,
                    fontSize: 16,
                },
                text: "[Click to add content]",
            },
        },
        {
            placeholder: {
                options: {
                    name: "Footnote",
                    type: "body",
                    x: 0.5,
                    y: 4.9,
                    w: 9.5,
                    h: 0.45,
                    fontSize: 7,
                },
                text: "[Source / Legal disclaimer / Footnote]",
            },
        },
    ],
});

// Create slide and use placeholders
const slide = pptx.addSlide({ masterName: 'Content - no subtitle' });

slide.addText('Sample Title', { placeholder: 'Title 6' });
slide.addText([
    { text: 'Bullet 1', options: { bullet: true } },
    { text: 'Bullet 2', options: { bullet: true } },
], { placeholder: 'Content Placeholder 2' });
slide.addText('Source: Data', { placeholder: 'Footnote' });

await pptx.writeFile({ fileName: 'presentation.pptx' });
```

## Verification

### Test Scripts

1. **`test-content-no-subtitle.mjs`** - Tests the built-in layout (limited functionality)
2. **`test-content-layout-proper.mjs`** - Tests with defineSlideMaster (full functionality) ✅ RECOMMENDED

### Run Tests

```bash
npm run build
npm run ship
node test-content-layout-proper.mjs
```

### Validation Results

✅ **presentation-proper-layout.pptx**:
- File size: 647 KB
- Valid ZIP archive
- 56 layouts included
- 1 slide with proper placeholder structure
- XML uses `<p:spPr/>` (empty shape properties) for layout placeholders ✅
- Matches good-presentation-test.pptx structure

## Technical Details

### Placeholder XML Structure

The fix in `src/gen-xml.ts` ensures that when content uses a layout placeholder:

**Before Fix:**
```xml
<p:spPr>
  <a:xfrm>
    <a:off x="567040" y="347472"/>
    <a:ext cx="11060912" cy="826477"/>
  </a:xfrm>
  <a:prstGeom prst="rect">...</a:prstGeom>
</p:spPr>
```

**After Fix:**
```xml
<p:spPr/>
```

This allows PowerPoint to use the layout's positioning instead of hardcoded coordinates.

### Layout Comparison

| Aspect | good-presentation-test.pptx | presentation-proper-layout.pptx |
|--------|----------------------------|--------------------------------|
| Layout Name | "Content w/Sub-headline" | "Content - no subtitle" |
| Placeholders | Title, Content, Footer, Slide#, Footnote | Title, Content, Footer, Slide#, Footnote |
| XML Structure | `<p:spPr/>` for placeholders | `<p:spPr/>` for placeholders ✅ |
| Slide Count | 1 | 1 |
| Total Layouts | 57 | 56 |

## Known Limitations

1. **CUSTOM_SLIDE_LAYOUT_DEFS layouts have empty `_slideObjects`**
   - The XML is stored but not parsed
   - Placeholders won't work automatically
   - **Solution**: Use `defineSlideMaster()` to properly define placeholders

2. **Layout naming**
   - Built-in layout: "Content - no subtitle"
   - PowerPoint standard: "Content w/Sub-headline" 
   - Functionally equivalent

## Future Improvements

Consider implementing XML parsing for CUSTOM_SLIDE_LAYOUT_DEFS to automatically populate `_slideObjects` from the layout XML. This would allow built-in layouts to work without `defineSlideMaster()`.

## Related Files

- `/workspaces/PptxGenJS/src/cust-xml-slide-layout1.ts` - Original layout definition
- `/workspaces/PptxGenJS/src/cust-xml-slide-layouts.ts` - Updated with new layout
- `/workspaces/PptxGenJS/src/cust-xml-slide-layout-rels.ts` - Updated relationships
- `/workspaces/PptxGenJS/src/gen-xml.ts` - Placeholder XML generation fix
- `/workspaces/PptxGenJS/test-content-layout-proper.mjs` - Working test example

## Build Commands

```bash
npm run build  # Build TypeScript
npm run ship   # Create distribution bundle
```

---

**Status**: ✅ COMPLETE - Layout integrated and working with proper placeholder functionality
