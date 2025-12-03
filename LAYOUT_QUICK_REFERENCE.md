# Layout Quick Reference

## All 55 Slide Layouts (In Order)

```javascript
// HOW TO USE:
const slide = pptx.addSlide({ masterName: "LayoutName" });
```

---

### Content Layouts (1-12)
```javascript
pptx.addSlide({ masterName: "Content w 2 Line Title and Sub-headline" })
pptx.addSlide({ masterName: "Two Content" })
pptx.addSlide({ masterName: "Two Content + Subtitles " })
pptx.addSlide({ masterName: "Content 4 Columns" })
pptx.addSlide({ masterName: "Content 5 Columns" })
pptx.addSlide({ masterName: "Content with Sidebar" })
pptx.addSlide({ masterName: "Title Only" })
pptx.addSlide({ masterName: "Blank" })
pptx.addSlide({ masterName: "Content + Image/Icon" })
pptx.addSlide({ masterName: "Content + Photo White" })
pptx.addSlide({ masterName: "Content + Photo Black" })
pptx.addSlide({ masterName: "Content + Photo Blue" })
```

### Icon Layouts (14-19)
```javascript
pptx.addSlide({ masterName: "Icons 3 Columns Vertical" })
pptx.addSlide({ masterName: "Icons 3 Columns Horizontal" })
pptx.addSlide({ masterName: "Icons 4 Columns + Content" })
pptx.addSlide({ masterName: "Icons 4 Columns + Content Black" })
pptx.addSlide({ masterName: "Icons 4 Columns + Content Blue" })
pptx.addSlide({ masterName: "Icons 2 x 3 Columns" })
```

### Chart/Table Layouts (21-24)
```javascript
pptx.addSlide({ masterName: "Content + Chart/Table 1" })
pptx.addSlide({ masterName: "Chart - Horizontal 2" })
pptx.addSlide({ masterName: "Chart + Statement 2" })
pptx.addSlide({ masterName: "Chart + Statement 3" })
```

### Statement Layouts (26-28)
```javascript
pptx.addSlide({ masterName: "Statement Photo" })
pptx.addSlide({ masterName: "Statement Black" })
pptx.addSlide({ masterName: "Statement White" })
```

### Divider/Section Layouts (30-33)
```javascript
pptx.addSlide({ masterName: "Section Header" })
pptx.addSlide({ masterName: "Divider 4 Photo" })
pptx.addSlide({ masterName: "Divider 1" })
pptx.addSlide({ masterName: "Divider 2" })
```

### Placeholder Layouts (35-39)
```javascript
pptx.addSlide({ masterName: "Two Placeholders" })
pptx.addSlide({ masterName: "Three Placeholders 1" })
pptx.addSlide({ masterName: "Three Placeholders 2" })
pptx.addSlide({ masterName: "Three Placeholders 3" })
pptx.addSlide({ masterName: "Four Placeholders" })
```

### Title Layouts (41-42)
```javascript
pptx.addSlide({ masterName: "Title Image Bottom" })
pptx.addSlide({ masterName: "Title White - reports and presentations (hIHS)" })
```

### Special Layouts (44-46)
```javascript
pptx.addSlide({ masterName: "Divider Photo 2" })
pptx.addSlide({ masterName: "Agenda - presentations" })
pptx.addSlide({ masterName: "TOC - reports" })
```

### Author Layouts (48-51)
```javascript
pptx.addSlide({ masterName: "Single Author" })
pptx.addSlide({ masterName: "2 Authors" })
pptx.addSlide({ masterName: "3 Authors" })
pptx.addSlide({ masterName: "4 Authors" })
```

### Category Layouts (53-54)
```javascript
pptx.addSlide({ masterName: "Energy" })
pptx.addSlide({ masterName: "Companies & Transactions" })
```

---

## Quick Tips

✅ **Names are case-sensitive** - use exact names shown above  
✅ **Layouts auto-load** - no need to call `defineSlideMaster()`  
✅ **Logos included** - pre-configured in each layout  
✅ **Coordinates in inches** - use (x, y, w, h) for positioning  

## Example

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// Add title slide
const slide1 = pptx.addSlide({ masterName: "Title White - reports and presentations (hIHS)" });
slide1.addText("My Presentation", { x: 1, y: 2, fontSize: 44, bold: true });

// Add content slide
const slide2 = pptx.addSlide({ masterName: "Two Content" });
slide2.addText("Agenda", { x: 0.5, y: 0.5, fontSize: 36, bold: true });
slide2.addText([
  { text: "Introduction", options: { bullet: true } },
  { text: "Main Content", options: { bullet: true } },
  { text: "Conclusion", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: 5, h: 3 });

// Save
await pptx.writeFile({ fileName: "presentation.pptx" });
```

---

**For detailed guide, see**: `WORKFLOW_COMPREHENSIVE_GUIDE.md`
