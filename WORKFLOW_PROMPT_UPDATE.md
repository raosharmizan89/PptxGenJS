# Quick Reference: workflow.txt Prompt Addition

## Add This Section to step_generateSlide System Prompt

```markdown
---

## 🎯 CRITICAL: Slide Layout Selection

### Required Syntax
Every slide MUST specify its layout using the masterName parameter:

```javascript
const slide = pptx.addSlide({ masterName: "Layout Name Here" });
```

### Why This Matters
- Each layout has different embedded logos (division-specific)
- Each layout has different background elements
- Using wrong layout = wrong logo appears on slide
- Default behavior (no masterName) = uses first layout (Content - no subtitle)

### Layout Selection Rules

1. **ALWAYS specify masterName** - Never call `pptx.addSlide()` without it
2. **Use exact layout name** - Case-sensitive, must match step_templates exactly
3. **Match content type** - Choose layout based on slide content:
   - Title slides → Title layouts
   - Icon content → Icon layouts
   - Photo content → Photo layouts
   - Charts/data → Chart layouts
   - Multi-column → Column layouts
   - Statements → Statement layouts
   - Section breaks → Divider layouts

### Common Layout Patterns

**Title Slides:**
```javascript
const slide = pptx.addSlide({ masterName: "Title White - reports and presentations (hIHS)" });
const slide = pptx.addSlide({ masterName: "Title Image Bottom" });
const slide = pptx.addSlide({ masterName: "Energy" });
const slide = pptx.addSlide({ masterName: "Companies & Transactions" });
```

**Content Slides:**
```javascript
const slide = pptx.addSlide({ masterName: "Content - no subtitle" });
const slide = pptx.addSlide({ masterName: "Content w 2 Line Title and Sub-headline" });
const slide = pptx.addSlide({ masterName: "Content w/Sub-headline" });
const slide = pptx.addSlide({ masterName: "Title Only" });
```

**Multi-Column Content:**
```javascript
const slide = pptx.addSlide({ masterName: "Two Content" });
const slide = pptx.addSlide({ masterName: "Two Content + Subtitles " });
const slide = pptx.addSlide({ masterName: "Content 4 Columns" });
const slide = pptx.addSlide({ masterName: "Content 5 Columns" });
const slide = pptx.addSlide({ masterName: "Content with Sidebar" });
```

**Icon Layouts:**
```javascript
const slide = pptx.addSlide({ masterName: "Icons 3 Columns Vertical" });
const slide = pptx.addSlide({ masterName: "Icons 3 Columns Horizontal" });
const slide = pptx.addSlide({ masterName: "Icons 4 Columns + Content" });
const slide = pptx.addSlide({ masterName: "Icons 4 Columns + Content Black" });
const slide = pptx.addSlide({ masterName: "Icons 4 Columns + Content Blue" });
const slide = pptx.addSlide({ masterName: "Icons 2 x 3 Columns" });
```

**Photo/Image Layouts:**
```javascript
const slide = pptx.addSlide({ masterName: "Content + Photo White" });
const slide = pptx.addSlide({ masterName: "Content + Photo Black" });
const slide = pptx.addSlide({ masterName: "Content + Photo Blue" });
const slide = pptx.addSlide({ masterName: "Content + Image/Icon" });
const slide = pptx.addSlide({ masterName: "Statement Photo" });
```

**Chart/Data Layouts:**
```javascript
const slide = pptx.addSlide({ masterName: "Chart - Horizontal 2" });
const slide = pptx.addSlide({ masterName: "Chart + Statement 2" });
const slide = pptx.addSlide({ masterName: "Chart + Statement 3" });
const slide = pptx.addSlide({ masterName: "Content + Chart/Table 1" });
```

**Statement/Emphasis Layouts:**
```javascript
const slide = pptx.addSlide({ masterName: "Statement White" });
const slide = pptx.addSlide({ masterName: "Statement Black" });
const slide = pptx.addSlide({ masterName: "Statement Photo" });
```

**Section Dividers:**
```javascript
const slide = pptx.addSlide({ masterName: "Section Header" });
const slide = pptx.addSlide({ masterName: "Divider 1" });
const slide = pptx.addSlide({ masterName: "Divider 2" });
const slide = pptx.addSlide({ masterName: "Divider Photo 2" });
const slide = pptx.addSlide({ masterName: "Divider 4 Photo" });
```

**Special Purpose:**
```javascript
const slide = pptx.addSlide({ masterName: "Blank" });
const slide = pptx.addSlide({ masterName: "Contact us" });
const slide = pptx.addSlide({ masterName: "Agenda - presentations" });
const slide = pptx.addSlide({ masterName: "TOC - reports" });
const slide = pptx.addSlide({ masterName: "Single Author" });
const slide = pptx.addSlide({ masterName: "2 Authors" });
const slide = pptx.addSlide({ masterName: "3 Authors" });
const slide = pptx.addSlide({ masterName: "4 Authors" });
```

### Selection Process

When generating code:

1. **Analyze slide_data context** - What type of content is being presented?
2. **Review step_templates** - Find layouts matching the content type
3. **Select best match** - Choose layout with appropriate placeholders
4. **Use exact name** - Copy layout name exactly (including spaces, capitalization)
5. **Generate code** - First line: `const slide = pptx.addSlide({ masterName: "..." });`

### Validation

Every generated code block must:
- ✅ Start with: `const slide = pptx.addSlide({ masterName: "..." });`
- ✅ Use a valid layout name from step_templates
- ✅ Match layout to content type (icons → icon layout, charts → chart layout)
- ❌ Never use: `const slide = pptx.addSlide();` (missing masterName)

### Error Prevention

Common mistakes to avoid:
- ❌ `const slide = pptx.addSlide();` - Missing masterName
- ❌ `const slide = pptx.addSlide({ masterName: "content" });` - Wrong name (case mismatch)
- ❌ Using icon layout for chart content - Wrong layout type
- ❌ Using chart layout for icon content - Wrong layout type

### Complete Example

**User Request:** "Create a slide with 3 key insights represented by icons"

**Correct Code:**
```javascript
const slide = pptx.addSlide({ masterName: "Icons 3 Columns Vertical" });
slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.504 });
if (ctx.iconLeft) slide.addImage({ data: ctx.iconLeft, x: 0.613, y: 1.38, w: 1.27, h: 1.27 });
slide.addText(ctx.leftSubtitle, { x: 0.613, y: 2.882, w: 3.689, h: 0.419 });
// ... remaining code
```

**Why this is correct:**
- ✅ Specifies masterName parameter
- ✅ Uses appropriate icon layout
- ✅ Layout name matches step_templates exactly
- ✅ Will inherit correct logo from icon layout
- ✅ Content positioned with coordinates

---

## Implementation in Code Generation

When the LLM generates slide code, it MUST:

1. Review the slide_data to understand content type
2. Select appropriate layout from step_templates
3. First line of code: `const slide = pptx.addSlide({ masterName: "[exact layout name]" });`
4. Remaining lines: Position content with coordinates from selected template
5. Verify layout name matches step_templates exactly

**Template:**
```javascript
const slide = pptx.addSlide({ masterName: "[EXACT_LAYOUT_NAME_FROM_STEP_TEMPLATES]" });
// ... content positioning code with x, y, w, h coordinates
```

---

## 56 Available Layouts

All available layouts from step_templates (use exact names):

1. Content - no subtitle
2. Content w 2 Line Title and Sub-headline
3. Two Content
4. Two Content + Subtitles 
5. Content 4 Columns
6. Content 5 Columns
7. Content with Sidebar
8. Title Only
9. Blank
10. Content + Image/Icon
11. Content + Photo White
12. Content + Photo Black
13. Content + Photo Blue
14. Icons 3 Columns Vertical
15. Icons 3 Columns Horizontal
16. Icons 4 Columns + Content
17. Icons 4 Columns + Content Black
18. Icons 4 Columns + Content Blue
19. Icons 2 x 3 Columns
20. Content + Chart/Table 1
21. Chart - Horizontal 2
22. Chart + Statement 2
23. Chart + Statement 3
24. Statement Photo
25. Statement Black
26. Statement White
27. Section Header
28. Divider 4 Photo
29. Divider 1
30. Divider 2
31. Divider Photo 2
32. Two Placeholders
33. Three Placeholders 1
34. Three Placeholders 2
35. Three Placeholders 3
36. Four Placeholders
37. Single Author
38. 2 Authors
39. 3 Authors
40. 4 Authors
41. Agenda - presentations
42. TOC - reports
43. Title White - reports and presentations (hIHS)
44. Title Image Bottom
45. Energy
46. Companies & Transactions
47. Contact us
48. Content w/Sub-headline

[Additional layouts 49-56 available in step_templates]

---

## Summary

**One simple rule:** ALWAYS use `pptx.addSlide({ masterName: "..." })` with the exact layout name from step_templates.

This ensures:
- ✅ Correct divisional logos appear
- ✅ Appropriate background elements
- ✅ Proper visual styling
- ✅ Layout-specific features (icons, charts, photos)

**Never forget the masterName parameter!**
```
