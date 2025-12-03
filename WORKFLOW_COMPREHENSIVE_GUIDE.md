# Comprehensive Guide: Creating Presentations with Exact Slide Master and Layouts

## Overview

This guide explains how to use **PptxGenJS** in this repository to generate PowerPoint presentations with the **exact slide master and layouts** as defined in `comprehensive-test.pptx` (which contains 55 slide layouts).

The repository contains **pre-defined custom slide layouts** that are embedded in the library. These layouts are automatically included when you build/use PptxGenJS from this repository.

---

## Architecture

### How Custom Layouts Work

1. **Source Definition**: All 55 custom layouts are defined in `src/cust-xml-slide-layouts.ts`
2. **Auto-Import**: When PptxGenJS initializes, it automatically loads these layouts from `CUSTOM_SLIDE_LAYOUT_DEFS`
3. **Layout Selection**: Users select layouts by name using `pptx.addSlide({ masterName: "LayoutName" })`

```typescript
// From src/pptxgen.ts (lines 416-417)
this._slideLayouts = (CUSTOM_SLIDE_LAYOUT_DEFS && CUSTOM_SLIDE_LAYOUT_DEFS.length > 0)
  ? CUSTOM_SLIDE_LAYOUT_DEFS.map((def, idx) => ({ ... }))
```

---

## Complete List of 55 Slide Layouts (In Order)

These layouts are **exactly as they appear** in `comprehensive-test.pptx`:

### Content Layouts (1-12)
1. `Content w 2 Line Title and Sub-headline`
2. `Two Content`
3. `Two Content + Subtitles `
4. `Content 4 Columns`
5. `Content 5 Columns`
6. `Content with Sidebar`
7. `Title Only`
8. `Blank`
9. `Content + Image/Icon`
10. `Content + Photo White`
11. `Content + Photo Black`
12. `Content + Photo Blue`

### Separator #1
13. `~        ` (Separator)

### Icon Layouts (14-19)
14. `Icons 3 Columns Vertical`
15. `Icons 3 Columns Horizontal`
16. `Icons 4 Columns + Content`
17. `Icons 4 Columns + Content Black`
18. `Icons 4 Columns + Content Blue`
19. `Icons 2 x 3 Columns`

### Separator #2
20. `~     ` (Separator)

### Chart/Table Layouts (21-24)
21. `Content + Chart/Table 1`
22. `Chart - Horizontal 2`
23. `Chart + Statement 2`
24. `Chart + Statement 3`

### Separator #3
25. `~   ` (Separator)

### Statement Layouts (26-28)
26. `Statement Photo`
27. `Statement Black`
28. `Statement White`

### Separator #4
29. `~` (Separator)

### Divider/Section Layouts (30-33)
30. `Section Header`
31. `Divider 4 Photo`
32. `Divider 1`
33. `Divider 2`

### Separator #5
34. `~  ` (Separator)

### Placeholder Layouts (35-39)
35. `Two Placeholders`
36. `Three Placeholders 1`
37. `Three Placeholders 2`
38. `Three Placeholders 3`
39. `Four Placeholders`

### Separator #6
40. `~ ` (Separator)

### Title Layouts (41-42)
41. `Title Image Bottom`
42. `Title White - reports and presentations (hIHS)`

### Separator #7
43. `~         ` (Separator)

### Special Layouts (44-46)
44. `Divider Photo 2`
45. `Agenda - presentations`
46. `TOC - reports`

### Separator #8
47. `~          ` (Separator)

### Author Layouts (48-51)
48. `Single Author`
49. `2 Authors`
50. `3 Authors`
51. `4 Authors`

### Separator #9
52. `~           ` (Separator)

### Category Layouts (53-54)
53. `Energy`
54. `Companies & Transactions`

### Separator #10
55. `~` (Separator)

---

## Workflow Steps to Generate Exact PPT

### Step 1: Initialize PptxGenJS

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();
```

**Note**: The custom layouts are **automatically loaded** when you import PptxGenJS from this repository. No additional configuration needed!

---

### Step 2: Add Slides Using Layout Names

Use the `masterName` parameter with **exact layout names** from the list above:

```javascript
// Example 1: Title slide
const slide1 = pptx.addSlide({ masterName: "Content w 2 Line Title and Sub-headline" });

// Example 2: Two-column content
const slide2 = pptx.addSlide({ masterName: "Two Content" });

// Example 3: Icon layout
const slide3 = pptx.addSlide({ masterName: "Icons 3 Columns Vertical" });

// Example 4: Chart layout
const slide4 = pptx.addSlide({ masterName: "Content + Chart/Table 1" });

// Example 5: Statement slide
const slide5 = pptx.addSlide({ masterName: "Statement Photo" });

// Example 6: Section header
const slide6 = pptx.addSlide({ masterName: "Section Header" });

// Example 7: Blank slide
const slide7 = pptx.addSlide({ masterName: "Blank" });
```

---

### Step 3: Add Content to Slides

Once you've selected a layout, add content using standard PptxGenJS methods:

```javascript
// Add text
slide1.addText("Your Headline Here", { 
  x: 0.5, 
  y: 0.5, 
  fontSize: 36, 
  bold: true 
});

// Add bullet points
slide2.addText([
  { text: "First point", options: { bullet: true } },
  { text: "Second point", options: { bullet: true } },
  { text: "Third point", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: 5.0, h: 3.0 });

// Add images
slide3.addImage({ 
  path: "path/to/image.png", 
  x: 1.0, 
  y: 2.0, 
  w: 3.0, 
  h: 2.0 
});

// Add charts
const chartData = [{
  name: "Sales",
  labels: ["Q1", "Q2", "Q3", "Q4"],
  values: [100, 200, 150, 300]
}];
slide4.addChart(pptx.charts.BAR, chartData, { 
  x: 1.0, 
  y: 1.5, 
  w: 8.0, 
  h: 4.0 
});

// Add shapes
slide5.addShape(pptx.ShapeType.rect, { 
  x: 0.5, 
  y: 0.5, 
  w: 3.0, 
  h: 1.5, 
  fill: { color: "0088CC" } 
});
```

---

### Step 4: Save the Presentation

```javascript
// Save to file (Node.js)
await pptx.writeFile({ fileName: "output.pptx" });

// Or download in browser
pptx.writeFile({ fileName: "output.pptx" });
```

---

## Important Notes

### 1. **Layout Names Must Match Exactly**
The layout names are **case-sensitive** and must match exactly as shown in the list above:

```javascript
✅ CORRECT: pptx.addSlide({ masterName: "Content w 2 Line Title and Sub-headline" })
❌ WRONG:   pptx.addSlide({ masterName: "Content W 2 Line Title And Sub-Headline" })
❌ WRONG:   pptx.addSlide({ masterName: "content w 2 line title and sub-headline" })
```

### 2. **Separator Layouts**
Layouts with names like `~` are **separator entries** and may not render visible content. They are included to maintain the exact layout order from `comprehensive-test.pptx`.

### 3. **No Need to Call defineSlideMaster()**
The layouts are **pre-defined in the codebase**. You do **NOT** need to call `defineSlideMaster()` because:
- All layouts are loaded from `src/cust-xml-slide-layouts.ts`
- They are automatically registered when PptxGenJS initializes
- Each layout includes complete XML definitions with all placeholders, logos, and formatting

### 4. **Layout XML is Pre-Configured**
Each layout includes:
- ✅ Placeholder positions (title, content, footer, slide number)
- ✅ Background elements (logos, shapes, rectangles)
- ✅ Text styling and formatting
- ✅ Color schemes
- ✅ Layout-specific guides and grids

---

## Example: Creating a Complete Presentation

Here's a complete example that uses multiple layouts:

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// Slide 1: Title slide
const slide1 = pptx.addSlide({ masterName: "Title White - reports and presentations (hIHS)" });
slide1.addText("Quarterly Report", { x: 1.0, y: 2.0, fontSize: 44, bold: true });
slide1.addText("Q4 2024", { x: 1.0, y: 3.0, fontSize: 28 });

// Slide 2: TOC
const slide2 = pptx.addSlide({ masterName: "TOC - reports" });
slide2.addText("Table of Contents", { x: 0.5, y: 0.5, fontSize: 36, bold: true });

// Slide 3: Section Header
const slide3 = pptx.addSlide({ masterName: "Section Header" });
slide3.addText("Executive Summary", { x: 1.0, y: 2.5, fontSize: 40, bold: true });

// Slide 4: Two-column content
const slide4 = pptx.addSlide({ masterName: "Two Content" });
slide4.addText("Key Findings", { x: 0.5, y: 0.5, fontSize: 32, bold: true });
slide4.addText(
  [
    { text: "Revenue up 20%", options: { bullet: true } },
    { text: "Costs down 15%", options: { bullet: true } },
    { text: "Market share increased", options: { bullet: true } }
  ], 
  { x: 0.5, y: 1.5, w: 5.0, h: 3.0 }
);
slide4.addText(
  [
    { text: "New products launched", options: { bullet: true } },
    { text: "Customer satisfaction up", options: { bullet: true } },
    { text: "Team expanded by 30%", options: { bullet: true } }
  ], 
  { x: 6.5, y: 1.5, w: 5.0, h: 3.0 }
);

// Slide 5: Chart slide
const slide5 = pptx.addSlide({ masterName: "Content + Chart/Table 1" });
const chartData = [{
  name: "Revenue",
  labels: ["Q1", "Q2", "Q3", "Q4"],
  values: [100, 150, 180, 220]
}];
slide5.addText("Quarterly Revenue", { x: 0.5, y: 0.5, fontSize: 32, bold: true });
slide5.addChart(pptx.charts.BAR, chartData, { x: 1.0, y: 1.5, w: 10.0, h: 4.0 });

// Slide 6: Thank you / closing
const slide6 = pptx.addSlide({ masterName: "Single Author" });
slide6.addText("Questions?", { x: 1.0, y: 2.0, fontSize: 44, bold: true });

// Save
await pptx.writeFile({ fileName: "quarterly-report.pptx" });
```

---

## Layout Selection Guide

Choose the appropriate layout based on your content:

| Content Type | Recommended Layout |
|-------------|-------------------|
| Cover/Title slide | `Title White - reports and presentations (hIHS)` |
| Table of Contents | `TOC - reports` |
| Section divider | `Section Header`, `Divider 1`, `Divider 2` |
| Text content (1 column) | `Content w 2 Line Title and Sub-headline` |
| Text content (2 columns) | `Two Content`, `Two Content + Subtitles` |
| Text content (4 columns) | `Content 4 Columns` |
| Text content (5 columns) | `Content 5 Columns` |
| Content + sidebar | `Content with Sidebar` |
| Icons (3 columns) | `Icons 3 Columns Vertical`, `Icons 3 Columns Horizontal` |
| Icons (4 columns) | `Icons 4 Columns + Content` |
| Icons (grid) | `Icons 2 x 3 Columns` |
| Chart/Table | `Content + Chart/Table 1`, `Chart - Horizontal 2` |
| Chart + text | `Chart + Statement 2`, `Chart + Statement 3` |
| Statement slide | `Statement Photo`, `Statement Black`, `Statement White` |
| Photo background | `Content + Photo White`, `Content + Photo Black`, `Content + Photo Blue` |
| Blank/Custom | `Blank`, `Title Only` |
| Authors/Credits | `Single Author`, `2 Authors`, `3 Authors`, `4 Authors` |

---

## Troubleshooting

### Layout not found error
**Error**: `Console warning: "masterName not found"`

**Solution**: Check that the layout name matches **exactly** (case-sensitive) from the list above.

### Logos not appearing
**Cause**: Logos are **pre-embedded** in the layout XML definitions.

**Solution**: The logos should appear automatically based on the layout. They are defined in the XML as background elements.

### Wrong slide layout rendered
**Cause**: Wrong `masterName` specified.

**Solution**: Double-check the layout name against the complete list above.

---

## Next Steps

1. Review the complete list of 55 layouts above
2. Identify which layouts match your content needs
3. Use `pptx.addSlide({ masterName: "LayoutName" })` to select layouts
4. Add content using coordinates (x, y, w, h in inches)
5. Refer to `tools/step_templates.llm.json` for coordinate references for each layout

---

## Reference Files

- **Layout Definitions**: `src/cust-xml-slide-layouts.ts` (55 layouts with XML)
- **Layout Registration**: `src/pptxgen.ts` (lines 416-417, auto-loads CUSTOM_SLIDE_LAYOUT_DEFS)
- **Coordinate Templates**: `tools/step_templates.llm.json` (46 layouts with coordinates)
- **Reference PPTX**: `comprehensive-test.pptx` (gold standard with all 55 layouts)
- **Demo Examples**: `demos/modules/demo_master.mjs` (shows masterName usage)

---

## Summary

✅ **No need to define layouts** - they're pre-loaded from `src/cust-xml-slide-layouts.ts`  
✅ **55 layouts available** - matching comprehensive-test.pptx exactly  
✅ **Simple selection** - use `pptx.addSlide({ masterName: "LayoutName" })`  
✅ **Exact order preserved** - layouts 1-55 in the same sequence as comprehensive-test.pptx  
✅ **Logos pre-configured** - embedded in layout XML definitions  

This workflow ensures your generated presentations have the **exact same slide master and layout structure** as `comprehensive-test.pptx`.
