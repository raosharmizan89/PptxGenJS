# Technical Architecture: Custom Slide Layouts System

## Overview

This document explains **how the custom slide layout system works** in PptxGenJS, mapping the relationship between `comprehensive-test.pptx` (55 layouts) and the codebase.

---

## Architecture Diagram

```
comprehensive-test.pptx (Reference PPTX)
    ↓ (Extracted)
ppt/slideLayouts/*.xml (55 XML files)
    ↓ (Imported to codebase)
src/cust-xml-slide-layouts.ts (CUSTOM_SLIDE_LAYOUT_DEFS array)
    ↓ (Auto-loaded at runtime)
src/pptxgen.ts (PptxGenJS._slideLayouts)
    ↓ (Selected by user)
pptx.addSlide({ masterName: "LayoutName" })
    ↓ (Renders to PPTX)
output.pptx
```

---

## Key Components

### 1. Layout Source: `src/cust-xml-slide-layouts.ts`

This file contains the **complete XML definitions** for all 55 slide layouts:

```typescript
// AUTO-GENERATED - Do not edit manually
export const CUSTOM_SLIDE_LAYOUT_DEFS = [
  { 
    id: 1, 
    name: 'Content w 2 Line Title and Sub-headline', 
    xml: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <p:sldLayout ...>...</p:sldLayout>` 
  },
  { 
    id: 2, 
    name: 'Two Content', 
    xml: `...` 
  },
  // ... 55 total layouts
];
```

**Structure**:
- `id`: Sequential number (1-55)
- `name`: Exact layout name (used for masterName selection)
- `xml`: Complete OpenXML definition including:
  - Placeholders (title, content, footer, slide number)
  - Background shapes (logos, rectangles)
  - Guides and grids
  - Color schemes
  - Text styling

---

### 2. Auto-Loading: `src/pptxgen.ts`

PptxGenJS automatically imports and registers layouts on initialization:

```typescript
// Line 116: Import
import { CUSTOM_SLIDE_LAYOUT_DEFS } from './cust-xml-slide-layouts'

// Lines 416-417: Auto-register layouts
this._slideLayouts = (CUSTOM_SLIDE_LAYOUT_DEFS && CUSTOM_SLIDE_LAYOUT_DEFS.length > 0)
  ? CUSTOM_SLIDE_LAYOUT_DEFS.map((def, idx) => ({
      _name: def.name,
      _rels: [],
      _relsChart: [],
      _relsMedia: [],
      _slide: null
    }))
  : []
```

**Process**:
1. Check if `CUSTOM_SLIDE_LAYOUT_DEFS` exists and has entries
2. Map each layout to internal `_slideLayouts` structure
3. Store layout name and prepare relationship arrays
4. Layouts are now available for `pptx.addSlide({ masterName: "..." })`

---

### 3. Slide Creation: `src/pptxgen.ts` (addNewSlide method)

When user calls `pptx.addSlide({ masterName: "LayoutName" })`:

```typescript
// Line 473: addNewSlide method
private readonly addNewSlide = (options?: AddSlideProps): PresSlide => {
  // ...
  
  // Find matching layout by name
  const layoutIndex = this._slideLayouts.findIndex(
    layout => layout._name === options?.masterName
  );
  
  if (layoutIndex >= 0) {
    // Use custom layout XML from CUSTOM_SLIDE_LAYOUT_DEFS
    const def = CUSTOM_SLIDE_LAYOUT_DEFS[layoutIndex];
    slide.setXml(def.xml);
  }
  
  // ...
}
```

**Process**:
1. User provides `masterName` parameter
2. Search `_slideLayouts` array for matching name
3. Retrieve corresponding XML from `CUSTOM_SLIDE_LAYOUT_DEFS`
4. Inject XML into new slide
5. Return slide object for content manipulation

---

## Layout XML Structure

Each layout XML contains:

### Placeholders
```xml
<p:ph type="title" hasCustomPrompt="1"/>
<p:ph type="body" sz="quarter" idx="17" hasCustomPrompt="1"/>
<p:ph type="ftr" sz="quarter" idx="20"/>
<p:ph type="sldNum" sz="quarter" idx="12"/>
```

**Types**:
- `title`: Headline/title text
- `body`: Content area (bullet points, paragraphs)
- `ftr`: Footer text
- `sldNum`: Slide number
- `pic`: Image placeholder

### Background Elements
```xml
<p:sp>
  <p:nvSpPr>
    <p:cNvPr id="6" name="Rectangle 5"/>
  </p:nvSpPr>
  <p:spPr>
    <a:solidFill><a:schemeClr val="accent5"/></a:solidFill>
  </p:spPr>
</p:sp>
```

**Elements**:
- Rectangles (colored backgrounds)
- Logos (embedded images)
- Decorative shapes
- Guide lines

### Positioning (EMU Units)
```xml
<a:xfrm>
  <a:off x="567039" y="342900"/>
  <a:ext cx="11062709" cy="826477"/>
</a:xfrm>
```

**Conversion**:
- EMU (English Metric Units): Used in XML
- Inches: Used in PptxGenJS API
- Conversion: 1 inch = 914,400 EMU
- Example: x=567039 EMU = 0.62 inches

---

## Relationship to comprehensive-test.pptx

### Structure Comparison

| comprehensive-test.pptx | Codebase | Purpose |
|------------------------|----------|---------|
| `ppt/slideLayouts/slideLayout1.xml` | `CUSTOM_SLIDE_LAYOUT_DEFS[0]` | Layout #1 definition |
| `ppt/slideLayouts/slideLayout2.xml` | `CUSTOM_SLIDE_LAYOUT_DEFS[1]` | Layout #2 definition |
| `...` | `...` | ... |
| `ppt/slideLayouts/slideLayout55.xml` | `CUSTOM_SLIDE_LAYOUT_DEFS[54]` | Layout #55 definition |
| `ppt/slideMasters/slideMaster1.xml` | (Managed by PptxGenJS) | Master slide definition |
| `ppt/slides/slide1.xml` | (Generated at runtime) | Actual slide content |

### Extraction Process (Historical)

The layouts in `src/cust-xml-slide-layouts.ts` were originally extracted from `comprehensive-test.pptx`:

```bash
# 1. Unzip PPTX
unzip comprehensive-test.pptx -d extracted/

# 2. Read layout XML files
cd extracted/ppt/slideLayouts/
for file in slideLayout*.xml; do
  # Extract layout name from XML
  name=$(grep -o 'name="[^"]*"' $file | head -1)
  
  # Add to CUSTOM_SLIDE_LAYOUT_DEFS array
  echo "{ id: $i, name: '$name', xml: \`$(cat $file)\` },"
done

# 3. Compile into cust-xml-slide-layouts.ts
```

---

## Coordinate System

### EMU to Inches Conversion

PptxGenJS uses **inches** for positioning, but PowerPoint XML uses **EMU (English Metric Units)**:

```javascript
// Conversion functions
function emuToInches(emu) {
  return Math.round((emu / 914400) * 100) / 100; // Round to 2 decimals
}

function inchesToEmu(inches) {
  return Math.round(inches * 914400);
}
```

### Standard Slide Dimensions
- **Width**: 10 inches (9,144,000 EMU)
- **Height**: 7.5 inches (6,858,000 EMU)
- **Aspect Ratio**: 4:3 (standard)

### Example Coordinates

From Layout #1 (`Content w 2 Line Title and Sub-headline`):

```xml
<!-- Title placeholder -->
<a:xfrm>
  <a:off x="567039" y="342900"/>
  <a:ext cx="11062709" cy="826477"/>
</a:xfrm>
```

**Conversion**:
- `x = 567039 EMU = 0.62 inches` (left margin)
- `y = 342900 EMU = 0.38 inches` (top margin)
- `w = 11062709 EMU = 12.1 inches` (width)
- `h = 826477 EMU = 0.9 inches` (height)

**In PptxGenJS**:
```javascript
slide.addText("Headline", { 
  x: 0.62, 
  y: 0.38, 
  w: 12.1, 
  h: 0.9, 
  fontSize: 36, 
  bold: true 
});
```

---

## Layout Template Data

### tools/step_templates.llm.json

This file provides **LLM-friendly coordinate templates** for 46 layouts (excludes 10 separator layouts):

```json
{
  "name": "Content w 2 Line Title and Sub-headline",
  "masterName": "Content w 2 Line Title and Sub-headline",
  "template": "2-line title slide with headline, sub-headline, content area, footnote",
  "instructions": "Use for slides with main headline + supporting sub-headline",
  "placeholders": {
    "content": { "x": 0.62, "y": 1.79, "w": 12.1, "h": 4.34, "type": "bullets" },
    "subHeadline": { "x": 0.62, "y": 0.98, "w": 12.1, "h": 0.3, "type": "text" },
    "headline": { "x": 0.62, "y": 0.38, "w": 12.1, "h": 0.9, "type": "title" },
    "footnote": { "x": 0.62, "y": 6.22, "w": 12.1, "h": 0.57, "type": "footnote" }
  },
  "code": "const slide = pptx.addSlide({ masterName: \"Content w 2 Line Title and Sub-headline\" });\nslide.addText(\"[Headline]\", { x: 0.62, y: 0.38, w: 12.1, h: 0.9, fontSize: 36, bold: true });\nslide.addText(\"[Sub-headline]\", { x: 0.62, y: 0.98, w: 12.1, h: 0.3, fontSize: 18 });\nslide.addText([\n  { text: \"[Click to add content]\", options: { bullet: true } }\n], { x: 0.62, y: 1.79, w: 12.1, h: 4.34 });\nslide.addText(\"[Source / Legal disclaimer / Footnote]\", { x: 0.62, y: 6.22, w: 12.1, h: 0.57, fontSize: 7 });"
}
```

**Purpose**:
- Provide ready-to-use coordinate values
- Show placeholder names and types
- Include example code snippets
- Enable AI/LLM-assisted PPT generation

---

## Generation Workflow

### tools/generate-templates-with-coords.mjs

This script generates `step_templates.llm.json` from `step_templates.data.json`:

```javascript
// 1. Read layout definitions
const layouts = JSON.parse(fs.readFileSync('step_templates.data.json'));

// 2. For each layout
layouts.forEach(layout => {
  // Convert EMU to inches
  const placeholders = convertCoordinates(layout.placeholders);
  
  // Generate code snippet
  const code = generateCodeSnippet(layout.name, placeholders);
  
  // Add masterName field
  const output = {
    name: layout.name,
    masterName: layout.name, // ← CRITICAL: enables layout selection
    template: layout.template,
    instructions: layout.instructions,
    placeholders: placeholders,
    code: code
  };
  
  // Write to output
  llmTemplates.push(output);
});

// 3. Save to step_templates.llm.json
fs.writeFileSync('step_templates.llm.json', JSON.stringify(llmTemplates, null, 2));
```

**Key Point**: The `masterName` field ensures the generated code includes the correct layout selection.

---

## Validation & Testing

### tools/test-templates-v2.mjs

Comprehensive test suite with 10 validation tests:

```javascript
// Test 1: Total layout count
assert.equal(templates.length, 56, "Should have 56 layouts");

// Test 2: masterName field exists
templates.forEach(t => {
  assert(t.masterName, `Layout ${t.name} missing masterName`);
});

// Test 3: masterName matches name
templates.forEach(t => {
  assert.equal(t.masterName, t.name, "masterName should match name");
});

// Test 4: Code includes masterName
templates.forEach(t => {
  if (t.code) {
    assert(
      t.code.includes(`masterName: "${t.masterName}"`),
      `Code for ${t.name} missing masterName`
    );
  }
});

// Test 5-10: Validate coordinates, formatting, JSON structure, etc.
```

**Results**: All 10 tests passing ✅

---

## Logo System

### Logo Variants

Four logo variants are used across layouts:

1. **redBlackLogo**: Red logo on black background
2. **blackBlackLogo**: Black logo on black background  
3. **redWhiteLogo**: Red logo on white background
4. **whiteWhiteLogo**: White logo on white background

### Logo Positions

```javascript
// Position 2: Content slides (bottom right)
const step_logoPosition2_output = {
  x: 11.17,
  y: 6.39,
  w: 0.83,
  h: 0.4
};

// Position 3: Title slides (top right)
const step_logoPosition3_output = {
  x: 11.17,
  y: 0.05,
  w: 0.83,
  h: 0.4
};
```

### Logo Assignment Logic

Logos are **pre-embedded** in layout XML:

```xml
<!-- Example from Content + Photo Black layout -->
<p:pic>
  <p:blipFill>
    <a:blip r:embed="rId2"/> <!-- Logo image reference -->
  </p:blipFill>
  <p:spPr>
    <a:xfrm>
      <a:off x="10219200" y="5846400"/> <!-- Position in EMU -->
      <a:ext cx="762000" cy="365760"/>   <!-- Size in EMU -->
    </a:xfrm>
  </p:spPr>
</p:pic>
```

**Automatic Selection**:
- Content slides → redBlackLogo (position 2)
- Title slides → redWhiteLogo (position 3)
- Dark backgrounds → whiteWhiteLogo
- No manual logo placement needed!

---

## File Relationships

```
Repository Structure:
│
├── comprehensive-test.pptx         ← Reference PPTX (55 layouts)
│
├── src/
│   ├── cust-xml-slide-layouts.ts   ← Layout XML definitions
│   ├── pptxgen.ts                  ← Main library (auto-loads layouts)
│   └── bld/
│       └── pptxgen.cjs.js          ← Compiled library
│
├── tools/
│   ├── step_templates.data.json    ← Raw layout data (EMU coordinates)
│   ├── step_templates.llm.json     ← Generated templates (inch coordinates)
│   ├── generate-templates-with-coords.mjs  ← Generator script
│   └── test-templates-v2.mjs       ← Validation tests
│
└── demos/
    └── modules/
        └── demo_master.mjs         ← Example usage of masterName
```

---

## Summary

### How It Works (Step-by-Step)

1. **Define**: Layouts defined in `src/cust-xml-slide-layouts.ts` (55 entries)
2. **Import**: `src/pptxgen.ts` imports `CUSTOM_SLIDE_LAYOUT_DEFS`
3. **Register**: Layouts auto-loaded to `this._slideLayouts` on initialization
4. **Select**: User calls `pptx.addSlide({ masterName: "LayoutName" })`
5. **Inject**: Layout XML injected into new slide
6. **Render**: Content added via PptxGenJS API (addText, addImage, etc.)
7. **Export**: Final PPTX generated with correct layout structure

### Key Principles

✅ **Pre-defined Layouts**: All layouts embedded in codebase  
✅ **Auto-loading**: No manual registration needed  
✅ **Name-based Selection**: Use exact layout names  
✅ **XML Preservation**: Complete layout structure maintained  
✅ **Coordinate System**: EMU (XML) ↔ Inches (API)  
✅ **Logo Integration**: Logos pre-positioned in layouts  

---

## Developer Notes

### Modifying Layouts

To add/modify layouts:

1. **Extract XML** from reference PPTX
2. **Add to** `src/cust-xml-slide-layouts.ts`
3. **Update** `step_templates.data.json` with coordinates
4. **Regenerate** `step_templates.llm.json`
5. **Test** with `test-templates-v2.mjs`
6. **Rebuild** library

### Debugging Tips

```javascript
// Check loaded layouts
console.log(pptx._slideLayouts.map(l => l._name));

// Verify layout selection
const layout = pptx._slideLayouts.find(l => l._name === "Two Content");
console.log(layout ? "Found" : "Not found");

// Inspect XML
const def = CUSTOM_SLIDE_LAYOUT_DEFS.find(d => d.name === "Two Content");
console.log(def.xml);
```

---

This architecture ensures **exact fidelity** between `comprehensive-test.pptx` and generated presentations, with all 55 layouts preserved in the same order and structure.
