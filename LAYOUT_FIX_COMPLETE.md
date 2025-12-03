# Layout Selection Fix - Implementation Complete

## 🎯 Problem Summary

**Issue:** All slides in generated presentations were using the same layout (slideLayout1.xml - "Content - no subtitle"), causing:
1. Wrong/missing divisional logos on slides
2. Incorrect background elements and styling
3. All 8 slides referencing slideLayout1.xml instead of their intended layouts

**Root Cause:** PptxGenJS requires explicit `masterName` parameter when calling `pptx.addSlide()`:
```javascript
// ❌ WRONG - Uses default (first) layout
const slide = pptx.addSlide();

// ✅ CORRECT - Specifies which layout to use
const slide = pptx.addSlide({ masterName: "Icons 3 Columns Vertical" });
```

---

## ✅ Solution Implemented

### 1. Updated Template Generation Script

**File:** `tools/generate-templates-with-coords.mjs`

**Changes:**
- Added `masterName` field to output JSON for each layout
- First code line now includes: `const slide = pptx.addSlide({ masterName: "..." });`
- MasterName value matches layout name exactly (case-sensitive)

```javascript
// Before
function generateLayoutCode(layout) {
  const { name, placeholders } = layout;
  const code = [];
  // ... placeholder code generation
}

// After
function generateLayoutCode(layout) {
  const { name, placeholders } = layout;
  const code = [];
  
  // CRITICAL: First line must specify the masterName
  code.push(`const slide = pptx.addSlide({ masterName: "${name}" });`);
  
  // ... placeholder code generation
}
```

### 2. Regenerated Templates

**File:** `tools/step_templates.llm.json`

All 56 layouts now include:
- `masterName` field
- First code line with correct `pptx.addSlide({ masterName: "..." })`

**Example:**
```json
{
  "name": "Icons 3 Columns Vertical",
  "masterName": "Icons 3 Columns Vertical",
  "template": "...",
  "instructions": "...",
  "code": [
    "const slide = pptx.addSlide({ masterName: \"Icons 3 Columns Vertical\" });",
    "slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.504 });",
    ...
  ]
}
```

### 3. Comprehensive Testing

**File:** `tools/test-templates-v2.mjs`

Created enhanced test suite with 10 validation tests:

1. ✅ Layout Count (56 layouts)
2. ✅ MasterName Field Exists
3. ✅ MasterName Matches Layout Name
4. ✅ First Code Line Includes MasterName
5. ✅ No Placeholder Targeting Syntax
6. ✅ Coordinate-Based Positioning
7. ✅ Icon Layouts Use data: Property
8. ✅ Photo Layouts Use path: Property
9. ✅ JSON Structure Validation
10. ✅ Units Configuration

**All 10 tests PASSED** ✅

---

## 📋 Next Steps for workflow.txt

### Step 1: Update step_templates:data Section

Replace the entire `step_templates:data` section with the new `step_templates.llm.json` content.

**Location in workflow.txt:**
```
step_templates:data:
  # Copy entire contents of tools/step_templates.llm.json here
```

### Step 2: Update step_generateSlide System Prompt

Add this critical section to the prompt:

```markdown
## CRITICAL: Slide Layout Selection

**You MUST specify the masterName when creating slides:**

✅ CORRECT:
```javascript
const slide = pptx.addSlide({ masterName: "Icons 3 Columns Vertical" });
slide.addText(ctx.title, { x: 0.62, y: 0.38, w: 12.096, h: 0.904 });
```

❌ WRONG - This will use wrong layout and wrong logos:
```javascript
const slide = pptx.addSlide();  // Defaults to "Content - no subtitle"
```

**Rules:**
1. ALWAYS call `pptx.addSlide({ masterName: "<LayoutName>" })`
2. The masterName MUST match a layout name from step_templates exactly
3. Layout names are case-sensitive (use exact match from step_templates)
4. Each layout has different embedded logos and background elements
5. Using wrong layout = wrong divisional logo appears on slide

**Layout Selection Examples:**
- Title slide → `{ masterName: "Title White - reports and presentations (hIHS)" }`
- Icons → `{ masterName: "Icons 3 Columns Vertical" }`
- Photo → `{ masterName: "Content + Photo White" }`
- Chart → `{ masterName: "Chart - Horizontal 2" }`
- Multi-column → `{ masterName: "Content 4 Columns" }`

**How to Choose:**
1. Review the slide_data context
2. Identify content type (icons, photos, charts, multi-column, etc.)
3. Match to appropriate layout from step_templates
4. Use exact layout name as masterName parameter
```

### Step 3: Add Layout Selection to Code Generation Logic

Ensure the LLM's generated code ALWAYS includes the masterName parameter.

**Example instruction to add:**
```
When generating code, your first line must be:
const slide = pptx.addSlide({ masterName: "[exact layout name from step_templates]" });

The layout name must match the selected template exactly.
```

---

## 🧪 Validation

After updating workflow.txt, validate by:

### Test 1: Check Generated Code
```bash
# Review generated presentation code
# Ensure each slide has: pptx.addSlide({ masterName: "..." })
```

### Test 2: Extract and Verify Presentation
```bash
# Generate test presentation
unzip -o presentation.zip -d test_extracted

# Check which layouts each slide uses
for i in {1..8}; do 
  echo "Slide $i:" 
  grep 'slideLayout' test_extracted/ppt/slides/_rels/slide${i}.xml.rels
done

# Should show DIFFERENT slideLayout numbers (not all slideLayout1.xml)
```

### Test 3: Verify Logos
```bash
# Open presentation in PowerPoint/LibreOffice
# Check that:
# - Title slides have title-specific logos
# - Icon slides have icon-specific backgrounds
# - Photo slides have photo-specific layouts
# - Chart slides have chart-specific styling
```

---

## 📊 Layout to Logo Mapping Reference

| Layout Range | Has Logos | Layout Types |
|--------------|-----------|--------------|
| Layout 1 | ❌ No | Content - no subtitle |
| Layouts 2-9 | ⚠️ Varies | Content variants |
| Layouts 10-46 | ✅ Yes | Icons, Photos, Charts, Multi-column |

**Important:** Each of the 56 defined layouts has specific background elements, logos, and styling. Using the wrong layout = wrong visual appearance.

---

## 🎨 How Slide Layouts Work in PptxGenJS

### Slide Master
- Contains base placeholder definitions (Footer, Slide Number, Title, Body)
- Defines overall theme and styling
- Location: `ppt/slideMasters/slideMaster1.xml`

### Slide Layouts (56 total)
- Extend the master with layout-specific elements
- Add logos, background images, and additional placeholders
- Each has unique name (e.g., "Icons 3 Columns Vertical")
- Location: `ppt/slideLayouts/slideLayout1.xml` through `slideLayout46.xml`

### Individual Slides
- Reference a specific layout via `masterName` parameter
- Inherit logos and backgrounds from the layout
- Add content using coordinate-based positioning
- **Do NOT use `<p:ph>` placeholder tags** (PptxGenJS coordinate approach)
- Location: `ppt/slides/slide1.xml`, `slide2.xml`, etc.

### The Flow:
```
pptx.addSlide({ masterName: "Icons 3 Columns Vertical" })
    ↓
Selects slideLayout matching "Icons 3 Columns Vertical" 
    ↓
Slide inherits layout's logos, backgrounds, styling
    ↓
Content added with explicit x, y, w, h coordinates
    ↓
Result: Correct layout with correct logos + positioned content
```

---

## 🚀 Expected Outcome

After implementing this fix in workflow.txt:

### Before (Broken):
- ❌ All slides → slideLayout1.xml
- ❌ Wrong/missing logos
- ❌ Incorrect backgrounds
- ❌ Same visual style for all slides

### After (Fixed):
- ✅ Each slide → Correct slideLayout (1-46)
- ✅ Correct divisional logos per layout type
- ✅ Proper backgrounds and styling
- ✅ Visual variety matching content type

**Example:**
- Slide 1 (Title) → slideLayout2.xml → Title-specific logo
- Slide 2 (Icons) → slideLayout10.xml → Icon layout with proper logo
- Slide 3 (Chart) → slideLayout20.xml → Chart layout with proper logo
- Slide 4 (Photo) → slideLayout25.xml → Photo layout with proper logo

All driven by the `masterName` parameter! 🎯

---

## 📁 Files Modified

1. ✅ `tools/generate-templates-with-coords.mjs` - Added masterName generation
2. ✅ `tools/step_templates.llm.json` - Regenerated with masterName field
3. ✅ `tools/test-templates-v2.mjs` - Created enhanced validation tests
4. ✅ `LAYOUT_SELECTION_FIX.md` - Root cause analysis document
5. ⏳ `workflow.txt` - **PENDING** - User needs to update with new templates + prompt

---

## ⚠️ Important Notes

### Why Placeholders Don't Appear in Slides

**This is expected behavior with PptxGenJS's coordinate-based approach:**

- ✅ Slide Master HAS `<p:ph>` placeholder definitions
- ✅ Slide Layouts HAVE `<p:ph>` placeholder definitions  
- ❌ Individual Slides DO NOT have `<p:ph>` tags (by design)
- ✅ Content uses explicit `<p:sp>` shapes with x, y, w, h coordinates

**What matters:**
1. Slides reference the CORRECT layout (via masterName)
2. Layouts have logos/backgrounds defined
3. Content uses accurate coordinates from step_templates.data.json

**The coordinate-based approach:**
- Does NOT use placeholder targeting in individual slides
- DOES inherit backgrounds/logos from selected layout
- DOES position all content with explicit coordinates
- This is the correct and intended behavior ✅

---

## 🎯 Deployment Checklist

- [x] Update generation script with masterName logic
- [x] Regenerate step_templates.llm.json
- [x] Validate all 56 layouts (10 tests passed)
- [x] Document root cause and solution
- [ ] Update workflow.txt step_templates:data section
- [ ] Update workflow.txt step_generateSlide prompt
- [ ] Test with live workflow
- [ ] Verify correct layouts in generated presentation
- [ ] Confirm logos appear on correct slides

---

**Status:** ✅ Solution Complete - Ready for workflow.txt Integration

**Next Action:** User should update workflow.txt per instructions above.
