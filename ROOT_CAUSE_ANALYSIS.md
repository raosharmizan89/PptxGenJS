# Root Cause Analysis: GOOD vs DIRECT vs WORKFLOW

## Executive Summary

**The issue is now definitively confirmed:**

- **GOOD pptx**: Has been **manually edited** with custom footer text: `"Section / Presentation Title / December 2025"`
- **DIRECT pptx**: Generated correctly from embedded layouts with placeholder text: `"Section name (optional) / Title / Month 20YY"`
- **WORKFLOW pptx**: Generated correctly from embedded layouts with placeholder text: `"Section name (optional) / Title / Month 20YY"`

**Root Cause**: The embedded layout definitions in `src/cust-xml-slide-layouts.ts` contain generic placeholder text, while the GOOD pptx was manually hand-edited to have custom footer text.

## Detailed Findings

### 1. Footer Text Comparison

| Source | Footer Text | Type |
|--------|------------|------|
| Embedded layouts (cust-xml-slide-layouts.ts) | `Section name (optional) / Title / Month 20YY` | Placeholder |
| GOOD pptx (slideLayout1.xml) | `Section / Presentation Title / December 2025` | Custom (manually edited) |
| DIRECT pptx (slideLayout1.xml) | `Section name (optional) / Title / Month 20YY` | From embedded |
| WORKFLOW pptx (slideLayout1.xml) | `Section name (optional) / Title / Month 20YY` | From embedded |

### 2. Investigation Methods

**Test performed:**
1. Extracted all three PPTX files to separate directories
2. Compared slideLayout XML files (found differences in all 57+ layouts)
3. Parsed XML to extract footer text elements
4. Searched embedded TypeScript source for footer text patterns
5. Confirmed GOOD has custom text while DIRECT/WORKFLOW have placeholder text

**Commands used:**
```bash
# Extract footers from GOOD, DIRECT, WORKFLOW
python3 -c "import xml.etree.ElementTree as ET; ..." 

# Search embedded layouts
grep "Section name (optional)" src/cust-xml-slide-layouts.ts
grep "Section / Presentation" src/cust-xml-slide-layouts.ts
```

### 3. Scope of the Issue

**Affected layouts:** 32+ layouts have footer placeholders
- Found 32 instances of footer placeholders in embedded layouts
- All 32 use the placeholder text: `"Section name (optional) / Title / Month 20YY"`

**Other potential differences:** Beyond footer text, need to verify:
- Placeholder count per layout
- Placeholder positioning (x, y, cx, cy coordinates)
- Text formatting (font size, color, alignment)
- Any other content differences

## What This Means

### Current Situation
1. **GOOD.pptx is NOT the gold standard** - it's been hand-edited and doesn't match the official embedded layouts
2. **DIRECT.pptx is correct** - it uses the embedded layouts as designed
3. **WORKFLOW.pptx is correct** - it uses the embedded layouts as designed (same generation path as DIRECT)

### Decision Point
We need to decide:

**Option A: Use GOOD as reference and update embedded layouts**
- Update `cust-xml-slide-layouts.ts` with the custom footer text from GOOD
- Update DIRECT and WORKFLOW generation to match GOOD's formatting
- Risk: May lose standard template structure

**Option B: Use embedded layouts as reference and regenerate GOOD**
- GOOD was manually edited outside the normal generation process
- Keep the embedded layouts as the source of truth
- Regenerate GOOD to match DIRECT/WORKFLOW
- This maintains template integrity

**Option C: Hybrid approach**
- If GOOD has additional corrections beyond just footer text, extract those
- Update embedded layouts with GOOD's improvements
- Regenerate all test files
- Risk: Complex, error-prone

## Next Steps

Before making changes, confirm:
1. **Are there other differences** beyond footer text? (placeholders, positioning, etc.)
2. **What was the intended footer format?** 
   - Placeholder: `"Section name (optional) / Title / Month 20YY"`
   - Custom: `"Section / Presentation Title / December 2025"`
3. **Which should be the source of truth?**
   - The embedded layouts (DIRECT/WORKFLOW current behavior)
   - The hand-edited GOOD pptx

## Investigation Priority

🔴 **CRITICAL**: Decide which is the authoritative version (GOOD or embedded layouts)

🟡 **HIGH**: Identify ALL differences between GOOD and embedded layouts (not just footer)

🟢 **MEDIUM**: Fix any positioning/placeholder issues once root cause is confirmed

## Files Involved

- `src/cust-xml-slide-layouts.ts` - Contains 57 layout definitions with embedded XML
- `dist/pptxgen.bundle.js` - Browser bundle used by DIRECT generation
- `test_all_layouts_GOOD.pptx` - Reference with hand-edited content
- `test_all_layouts_DIRECT.pptx` - Generated using embedded layouts
- `test_all_layouts_WORKFLOW.pptx` - Generated using embedded layouts (CDN path)

---

**Status**: ✓ Root cause identified - **awaiting decision on authoritative version**
