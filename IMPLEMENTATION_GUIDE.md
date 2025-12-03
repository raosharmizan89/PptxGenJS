# Step-by-Step Implementation Guide for Workflow.txt Fixes

**Status:** ✅ Step 1 Complete - Templates regenerated with coordinates  
**Next:** Step 2 - Update workflow.txt prompts

---

## ✅ COMPLETED: Step 1 - Regenerate Templates

**File:** `tools/step_templates.llm.json`  
**Status:** Generated successfully with coordinate-based code

**What changed:**
- All 56 layouts now have code with explicit `x, y, w, h` coordinates
- Icons use `{ data: ctx.iconName, x: ..., y: ..., w: ..., h: ... }`
- Photos/images use `{ path: ctx.photoUrl, x: ..., y: ..., w: ..., h: ... }`
- Text uses `{ x: ..., y: ..., w: ..., h: ... }`
- NO placeholder targeting by name

**Example output:**
```json
"code": [
  "slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })",
  "slide.addText(ctx.body, { x: 0.62, y: 1.375, w: 12.1, h: 4.75 })",
  "if (ctx.iconLeft) slide.addImage({ data: ctx.iconLeft, x: 0.613, y: 1.38, w: 1.27, h: 1.27 })"
]
```

---

## 🔄 IN PROGRESS: Step 2 - Update Workflow.txt

### Change 2.1: Update `step_generateSlide` System Prompt

**Location:** workflow.txt, step_generateSlide:prompt section

**Add this section BEFORE existing rules:**

```yaml
**CRITICAL: PptxGenJS Coordinate-Based Positioning**

PptxGenJS does NOT support placeholder targeting by name. You MUST use explicit x, y, w, h coordinates for ALL content.

**Positioning Rules:**
1. ALL addText() calls MUST include { x: number, y: number, w: number, h: number }
2. ALL addImage() calls MUST include x, y, w, h coordinates
3. NEVER use { placeholder: 'Name' } syntax - it will fail
4. Coordinates are in inches (already provided in template code)
5. DO NOT modify x, y, w, h values - use them exactly as provided

**Code Transformation Pattern:**

Template provides:
  slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })

You MUST generate:
  slide1.addText("Market Analysis Q4", { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })

**Image/Icon Rules:**
- Icons (base64 SVG): Use data: property
  Example: slide1.addImage({ data: iconDataUrl, x: 1.5, y: 2.5, w: 1.27, h: 1.27 })
  
- Photos/Images (URLs): Use path: property
  Example: slide1.addImage({ path: imageUrl, x: 2, y: 1, w: 5, h: 4 })

**Data Property Detection:**
- If icon/image starts with "data:image/" → use data: property
- If icon/image starts with "http://" or "https://" → use path: property

**Placeholder Inheritance:**
- Footer and slide number placeholders are auto-populated by PptxGenJS
- DO NOT generate code for them
- Only generate code for content placeholders with coordinates in the template
```

### Change 2.2: Update Variable Replacement Logic

**Add this section to step_generateSlide:**

```yaml
**Variable Replacement from Context:**

The template code contains ctx.* variables. Replace them with actual values:

From step_slidePlan_output:
{
  "slideNumber": 1,
  "templateName": "Content - no subtitle",
  "ctx": {
    "title": "Market Overview",
    "body": ["Revenue up 15%", "Margins improved"],
    "footnote": "Source: Company data 2024"
  }
}

Template code:
  slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })
  slide.addText(ctx.body, { x: 0.62, y: 1.375, w: 12.1, h: 4.75 })

Your output:
  let slide1 = pptx.addSlide({ masterName: "Content - no subtitle" });
  slide1.addText("Market Overview", { x: 0.62, y: 0.38, w: 12.096, h: 0.904 });
  slide1.addText(["Revenue up 15%", "Margins improved"], { x: 0.62, y: 1.375, w: 12.1, h: 4.75 });
  slide1.addText("Source: Company data 2024", { x: 0.62, y: 6.219, w: 12.096, h: 0.575 });
```

### Change 2.3: Add Icon Data URL Injection Rules

**Add to CRITICAL RULES FOR ICONS section:**

```yaml
**Icon Data URL Injection:**

Icons from step_iconSelect_output come as array:
[
  { "iconNumber": 1, "descriptionKeywords": "...", "iconDataUrl": "data:image/svg+xml;base64,..." },
  { "iconNumber": 2, "descriptionKeywords": "...", "iconDataUrl": "data:image/svg+xml;base64,..." }
]

When template code contains:
  if (ctx.iconLeft) slide.addImage({ data: ctx.iconLeft, x: 0.613, y: 1.38, w: 1.27, h: 1.27 })

Map icons from array:
- iconLeft = icons[0].iconDataUrl
- iconMiddle = icons[1].iconDataUrl  
- iconRight = icons[2].iconDataUrl
- icon1 = icons[0].iconDataUrl
- icon2 = icons[1].iconDataUrl
- etc.

Your output:
  slide1.addImage({ data: "data:image/svg+xml;base64,PHN2Zy...", x: 0.613, y: 1.38, w: 1.27, h: 1.27 });

**CRITICAL:**
- Use complete iconDataUrl value - do not truncate
- Icons MUST use data: property (not path:)
- Keep x, y, w, h exactly as provided
- Different icon layouts use different sizes (1.27, 0.93, 0.80)
```

### Change 2.4: Update Image Selection Rules

**Add to CRITICAL RULES FOR IMAGES section:**

```yaml
**Image URL Injection:**

Images from step_imageSelect_output contain URLs.

When template code contains:
  if (ctx.photoUrl) slide.addImage({ path: ctx.photoUrl, x: 7.234, y: 0, w: 6.099, h: 7.5 })

Your output (replace ctx.photoUrl with actual URL):
  slide1.addImage({ path: "https://example.com/photo.jpg", x: 7.234, y: 0, w: 6.099, h: 7.5 });

**Images MUST use path: property (not data:)**
```

---

## 📝 CHANGES NEEDED IN WORKFLOW.TXT

### Summary of Required Edits:

1. **step_generateSlide system prompt:**
   - Add coordinate-based positioning rules (BEFORE existing content)
   - Add variable replacement logic
   - Update icon injection rules (use data: property)
   - Update image injection rules (use path: property)
   - Remove all references to placeholder targeting

2. **step_slidePlan (NO CHANGES NEEDED)**
   - Current ctx structure already works perfectly
   - Keeps division/disclaimer logic intact

3. **step_templateList (OPTIONAL - simplify if needed):**
   - Can remove "placeholders" array from output
   - LLM only needs: name, template, instructions, code

---

## 🧪 TESTING PLAN

### Test Case 1: Simple Content Slide
**Layout:** Content - no subtitle  
**Expected:** Title, body bullets, footnote appear at correct positions  
**Verify:** Logo appears from master, no overlapping text

### Test Case 2: Icon Layout
**Layout:** Icons 3 Columns Vertical  
**Expected:** 3 icons render as SVG, text appears below each  
**Verify:** Icons use data: property, correct sizes (1.27x1.27)

### Test Case 3: Photo Layout
**Layout:** Content + Photo White  
**Expected:** Photo on right, content on left  
**Verify:** Photo uses path: property, correct positioning

### Test Case 4: Multi-Column Layout
**Layout:** Content 4 Columns  
**Expected:** 4 columns with subtitles and content  
**Verify:** No overlap between columns, even spacing

### Test Case 5: Chart Layout
**Layout:** Chart - Horizontal 2  
**Expected:** Chart renders at full width  
**Verify:** Chart data passed correctly to addChart()

---

## ✅ VALIDATION CHECKLIST

Before deploying to production:

- [ ] All 56 layouts have code in step_templates.llm.json
- [ ] Code uses x, y, w, h coordinates (no placeholder: syntax)
- [ ] Icons use data: property
- [ ] Photos/images use path: property
- [ ] step_generateSlide prompt updated with coordinate rules
- [ ] Generated PPTX tested with at least 5 different layouts
- [ ] No JavaScript console errors
- [ ] Logos appear on all slides
- [ ] Footer/slide numbers auto-populate
- [ ] Text positioning is accurate (no overlaps)
- [ ] Icons render correctly as SVG
- [ ] Photos load from URLs

---

## 🚀 DEPLOYMENT STEPS

1. ✅ **DONE:** Run generate-templates-with-coords.mjs
2. ✅ **DONE:** Verify step_templates.llm.json has coordinate-based code
3. **TODO:** Copy new step_templates.llm.json content into workflow.txt step_templates:data
4. **TODO:** Update step_generateSlide system prompt in workflow.txt
5. **TODO:** Test with 1 simple slide
6. **TODO:** Test with icon layout
7. **TODO:** Test with photo layout
8. **TODO:** Full test with multi-slide presentation
9. **TODO:** Validate generated PPTX in PowerPoint/LibreOffice

---

## 📊 BEFORE vs AFTER

### BEFORE (Broken):
```javascript
// Template code (WRONG APPROACH):
slide.addText(ctx.title, { placeholder: 'Title 6' })

// Generated code (FAILS):
slide1.addText("Market Analysis", { placeholder: 'Title 6' })
// ❌ Creates new placeholder, doesn't position text
```

### AFTER (Fixed):
```javascript
// Template code (CORRECT APPROACH):
slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })

// Generated code (WORKS):
slide1.addText("Market Analysis", { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })
// ✅ Positions text at exact coordinates
```

---

**Next Action:** Update workflow.txt with the changes outlined above, then test.
