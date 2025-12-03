# Placeholder Fix Analysis - Critical Issues & Resolution Plan

**Date:** December 3, 2025  
**Issue:** Placeholders not appearing in generated PowerPoint slide masters and layouts

---

## 🔴 CRITICAL ISSUES IDENTIFIED

### Issue #1: PptxGenJS Does NOT Support Placeholder Definitions in `defineSlideMaster()`

**Problem:**
- The workflow.txt is trying to define slide masters using `pptx.defineSlideMaster()` with only logo images
- PptxGenJS's `defineSlideMaster()` API **does not support defining placeholders** in the master definition
- Placeholders are **NOT** part of the PptxGenJS API for `defineSlideMaster()`
- The library only allows defining background images, shapes, and text objects in masters

**Evidence:**
```javascript
// What workflow.txt currently does (INCORRECT ASSUMPTION):
pptx.defineSlideMaster({
    title: "Content - no subtitle",
    objects: [
        { image: { path: redBlackLogo, x: 0.34, y: 0.04, w: 1.06, h: 0.28 } }
    ]
});
// ❌ NO PLACEHOLDER DEFINITIONS - PptxGenJS doesn't support them here!
```

**Impact:**
- No placeholders are created in the generated PPTX
- All slide layouts are blank except for logos
- The LLM cannot populate content because there are no placeholders to target

---

### Issue #2: Incorrect Use of `placeholder` Property in `addText()`/`addImage()`

**Problem:**
- The workflow assumes `{ placeholder: 'Name' }` will target pre-existing placeholders
- PptxGenJS's `placeholder` property **creates a new placeholder name** for that object, it doesn't target an existing one
- To position content, you must use explicit `x, y, w, h` coordinates

**What the code thinks it does:**
```javascript
slide.addText("My Title", { placeholder: 'Title 6' });
// ❌ WRONG: This creates a NEW placeholder named "Title 6", doesn't fill an existing one
```

**What it actually should do:**
```javascript
slide.addText("My Title", { x: 0.62, y: 0.38, w: 12.096, h: 0.904 });
// ✅ CORRECT: Positions text using coordinates from step_templates.data.json
```

**Impact:**
- Content is added as regular objects, not filling placeholders
- Positioning is likely broken or missing
- The entire placeholder-targeting strategy is incompatible with PptxGenJS

---

### Issue #3: Fundamental Architecture Mismatch

**Problem:**
- The workflow was designed assuming Office Open XML placeholder behavior (like native PowerPoint VBA/OOXML editing)
- PptxGenJS is a **generation library**, not a templating library
- It creates presentations from scratch, it doesn't use or populate Office XML placeholders

**Current workflow assumption:**
```
1. Define masters with placeholders (via defineSlideMaster) ❌ NOT SUPPORTED
2. Add slides using those masters
3. Populate placeholders by name ❌ NOT HOW PptxGenJS WORKS
```

**PptxGenJS reality:**
```
1. Define masters with background elements only (logos, shapes, images)
2. Add slides using those masters
3. Add content using explicit x, y, w, h coordinates ✅ REQUIRED APPROACH
```

**Impact:**
- The entire step_templates.data.json coordinate system exists but is not being used
- The LLM is generating code that won't work with PptxGenJS
- Major refactoring required in workflow.txt

---

## ✅ RESOLUTION PLAN - STEP BY STEP

### Step 1: Update `step_templates.llm.json` Code Examples

**Action:** Remove all `placeholder:` targeting and use `x, y, w, h` coordinates instead.

**Change from:**
```json
"code": [
  "slide.addText(ctx.title, { placeholder: 'Title 6' })"
]
```

**Change to:**
```json
"code": [
  "slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })"
]
```

**Implementation:**
- Read coordinates from `step_templates.data.json`
- Generate code snippets with explicit positioning for every placeholder
- Include all x, y, w, h values in the code arrays

---

### Step 2: Create Helper Step to Merge Template Metadata with Coordinates

**Action:** Add a new workflow step that combines layout names, instructions, and coordinate data.

**New step:**
```yaml
step_templatesFull:jmespath
##data:
{
  "llm": ${step_templates_output},
  "coords": ${step_templatesCoords_output}
}
##expression:
llm.layouts[*].{
  name: name,
  template: template,
  instructions: instructions,
  code: code,
  coordinates: coords.layouts[?name == @.name].placeholders | [0]
}
```

This will give the LLM both code examples AND coordinate data in one structure.

---

### Step 3: Update `step_generateSlide` System Prompt

**Critical changes needed:**

**Add this section:**
```
**CRITICAL: PptxGenJS Positioning Rules**
1. PptxGenJS does NOT support placeholder targeting by name
2. You MUST use explicit x, y, w, h coordinates for ALL content
3. Coordinates are provided in inches from step_templates.data.json
4. NEVER use { placeholder: 'Name' } syntax - it will not work
5. Always use: { x: <number>, y: <number>, w: <number>, h: <number> }

**Code Generation Pattern:**
Template provides code like:
  slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })

You MUST generate:
  slide1.addText("Actual Title Text", { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })

**For placeholders marked "inheritFromMaster":**
- Skip them - they are auto-populated by PptxGenJS from the master
- Only generate code for placeholders with x, y, w, h coordinates
```

---

### Step 4: Fix Icon Layouts Coordinate Injection

**Problem:** Icon layouts need dynamic coordinates but icons aren't in `step_templates.data.json`.

**Solution:** Create a separate icon coordinates lookup:

```yaml
step_iconCoordinates:data
{
  "Icons 3 Columns Vertical": {
    "iconLeft": { "x": 0.613, "y": 1.38, "w": 1.27, "h": 1.27 },
    "iconMiddle": { "x": 4.822, "y": 1.38, "w": 1.27, "h": 1.27 },
    "iconRight": { "x": 9.03, "y": 1.38, "w": 1.27, "h": 1.27 }
  },
  "Icons 3 Columns Horizontal": {
    "iconLeft": { "x": 0.623, "y": 1.38, "w": 0.93, "h": 0.93 },
    "iconMiddle": { "x": 0.623, "y": 2.965, "w": 0.93, "h": 0.93 },
    "iconRight": { "x": 0.62, "y": 4.549, "w": 0.93, "h": 0.93 }
  }
  // ... etc for all icon layouts
}
```

Then inject coordinates when generating icon code:
```javascript
if (ctx.iconLeft) slide.addImage({ 
  data: ctx.iconLeft, 
  x: 0.613, 
  y: 1.38, 
  w: 1.27, 
  h: 1.27 
})
```

---

### Step 5: Regenerate Complete `step_templates.llm.json`

**Action:** Run a script to build the complete templates file with coordinates embedded in code.

**Script logic:**
```javascript
1. Load step_templates.data.json
2. For each layout:
   a. Get all placeholders
   b. Filter out inheritFromMaster=true
   c. Generate addText/addImage calls with x, y, w, h
   d. Build code array
3. Write to step_templates.llm.json
```

**Output example:**
```json
{
  "name": "Content - no subtitle",
  "template": "Standard content slide...",
  "instructions": "Use for main content...",
  "code": [
    "slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.904 })",
    "slide.addText(ctx.body, { x: 0.62, y: 1.375, w: 12.1, h: 4.75 })",
    "slide.addText(ctx.footnote, { x: 0.62, y: 6.219, w: 12.096, h: 0.575 })"
  ]
}
```

---

### Step 6: Verify Footer & Slide Number Inheritance

**Action:** Ensure footer and slide number placeholders are handled correctly.

**Check in `step_templates.data.json`:**
- Placeholders with `"inheritFromMaster": true` should NOT have code generated
- These inherit from the master automatically via PptxGenJS

**Example:**
```json
{
  "name": "Footer Placeholder 1",
  "type": "ftr",
  "idx": 18,
  "inheritFromMaster": true
}
// ✅ No code generated - PptxGenJS handles this automatically
```

---

### Step 7: Update Workflow JMESPath Expressions

**Action:** Simplify template selection to avoid placeholder references.

**Change from:**
```yaml
step_templateList:jmespath
##expression:
layouts[*].{name: name, template: template, instructions: instructions, placeholders: placeholders}
```

**Change to:**
```yaml
step_templateList:jmespath
##expression:
layouts[*].{name: name, template: template, instructions: instructions}
```

Remove `placeholders` array from LLM context - it's confusing and not needed with coordinate-based approach.

---

### Step 8: Test with Single Layout

**Action:** Test the fixed approach with one simple layout before rolling out to all 56.

**Test layout:** "Content - no subtitle"

**Expected workflow:**
1. LLM receives layout code with coordinates
2. LLM generates:
   ```javascript
   let slide1 = pptx.addSlide({ masterName: "Content - no subtitle" });
   slide1.addText("Market Analysis Q4", { x: 0.62, y: 0.38, w: 12.096, h: 0.904 });
   slide1.addText(["Revenue up 15%", "Margin improved"], { x: 0.62, y: 1.375, w: 12.1, h: 4.75 });
   slide1.addText("Source: Internal data", { x: 0.62, y: 6.219, w: 12.096, h: 0.575 });
   ```
3. Verify in generated PPTX that text appears at correct positions
4. Verify logo appears from master definition

---

### Step 9: Roll Out to All 56 Layouts

**Action:** Once single layout works, regenerate all templates and test.

**Validation checklist:**
- ✅ All 56 layouts have coordinate-based code
- ✅ Icons use `data:` property with coordinates
- ✅ Images use `path:` property with coordinates  
- ✅ Charts use coordinates
- ✅ No `placeholder:` syntax anywhere
- ✅ Footer/slide number inheritance working
- ✅ Logos appear correctly from masters

---

## 📋 FILE CHANGES REQUIRED

| File | Change Type | Priority |
|------|-------------|----------|
| `step_templates.llm.json` | **MAJOR REWRITE** | 🔴 CRITICAL |
| `workflow.txt` (step_generateSlide prompt) | **UPDATE** | 🔴 CRITICAL |
| `workflow.txt` (step_templateList) | **MINOR UPDATE** | 🟡 MEDIUM |
| `tools/generate-templates-with-coords.mjs` | **NEW FILE** | 🔴 CRITICAL |
| `tools/icon-coordinates.json` | **NEW FILE** | 🟡 MEDIUM |

---

## 🎯 SUCCESS CRITERIA

1. ✅ Generated PPTX has all text in correct positions (no overlaps)
2. ✅ Logos appear on every slide from master
3. ✅ Icons render with correct SVG data and positioning
4. ✅ Footer and slide numbers auto-populate
5. ✅ No placeholder-related errors in browser console
6. ✅ LLM generates valid PptxGenJS code without manual editing

---

## ⚠️ KNOWN LIMITATIONS

1. **No true placeholder editing:** PptxGenJS creates new objects, doesn't populate OOXML placeholders
2. **Manual coordinate management:** Any layout changes require updating step_templates.data.json
3. **No placeholder inheritance:** Can't extend/override placeholder positions like in native PowerPoint
4. **Limited master features:** Masters only support static background elements (logos, images, shapes)

---

## 📚 NEXT STEPS

1. **Immediate:** Create script to regenerate step_templates.llm.json with coordinates
2. **Immediate:** Update step_generateSlide system prompt
3. **Immediate:** Test with 1 layout
4. **Short-term:** Roll out to all 56 layouts
5. **Short-term:** Create icon coordinates lookup
6. **Long-term:** Consider caching generated code to reduce LLM calls

---

**Status:** Ready for implementation  
**Estimated Effort:** 2-3 hours for full resolution  
**Risk Level:** Medium (well-understood problem, clear solution path)
