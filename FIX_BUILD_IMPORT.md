# FIX SUMMARY: Restored Missing Import in gen-xml.ts

## Problem Identified
The build was failing due to a missing import in `src/gen-xml.ts`. The file was attempting to import `CUSTOM_PPT_SLIDE_LAYOUT1_REL_XML` from `./cust-xml-slide-layout1`, but this file did not exist in the source directory.

### Error Message
```
[plugin rpt2] src/gen-xml.ts:46:50 - error TS2307: Cannot find module './cust-xml-slide-layout1' or its corresponding type declarations.
```

## Root Cause
The old codebase had a fallback for the default layout (layout 1) that used a custom hardcoded relationships XML. However, when the custom slide layouts system was refactored to use embedded CUSTOM_SLIDE_LAYOUT_DEFS and CUSTOM_SLIDE_LAYOUT_RELS arrays (all 57 layouts), this old code path and its import were left orphaned.

The only reference was at line 1697 in gen-xml.ts:
```typescript
if (slideLayouts[layoutNumber - 1] && slideLayouts[layoutNumber - 1]._name === DEF_PRES_LAYOUT_NAME) 
  return CUSTOM_PPT_SLIDE_LAYOUT1_REL_XML
```

This condition would almost never be true since all layouts are now custom embedded layouts with proper names.

## Fix Applied

### 1. Removed Broken Import (Line 46)
**Removed:**
```typescript
import { CUSTOM_PPT_SLIDE_LAYOUT1_REL_XML } from './cust-xml-slide-layout1'
```

### 2. Simplified makeXmlSlideLayoutRel Function (Lines 1695-1704)
**Before:**
```typescript
export function makeXmlSlideLayoutRel (layoutNumber: number, slideLayouts: SlideLayout[]): string {
	// If the default layout is being generated, return the custom rel XML
	if (slideLayouts[layoutNumber - 1] && slideLayouts[layoutNumber - 1]._name === DEF_PRES_LAYOUT_NAME) 
		return CUSTOM_PPT_SLIDE_LAYOUT1_REL_XML

	return slideObjectRelationsToXml(slideLayouts[layoutNumber - 1], [
		{
			target: '../slideMasters/slideMaster1.xml',
			type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster',
		},
	])
}
```

**After:**
```typescript
export function makeXmlSlideLayoutRel (layoutNumber: number, slideLayouts: SlideLayout[]): string {
	return slideObjectRelationsToXml(slideLayouts[layoutNumber - 1], [
		{
			target: '../slideMasters/slideMaster1.xml',
			type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster',
		},
	])
}
```

## Impact
- **Build Status**: ✅ Build now succeeds (was previously failing)
- **Slide Layouts**: All 57 custom embedded slide layouts are now properly generated
- **Generated PPTX Files**: Now have all 57 layouts in the correct order with correct names

## Verification
A test was created to verify the fix:
- Created test file that instantiates PptxGenJS and calls `writeFile()`
- Confirmed that `prs.slideLayouts.length === 57`
- All 57 layouts are present with correct names
- File generates successfully without errors

## Files Modified
- `/workspaces/PptxGenJS/src/gen-xml.ts` - Removed broken import and simplified fallback logic

## Files Verified as Complete
- `src/cust-xml-slide-layouts.ts` - Contains all 57 layout definitions (id: 0-56)
- `src/cust-xml-slide-layout-rels.ts` - Contains all 57 layout relationship definitions
- Both arrays properly ordered and synchronized

## Conclusion
The issue was a leftover import and code path from the pre-refactor era when the system used dynamically generated layouts with one hardcoded exception for the default layout. With the new custom embedded layout system, this code is no longer needed and was causing build failures.

The removal of this dead code path ensures that all 57 layouts are properly generated in every PPTX file created with PptxGenJS using the custom layout system.
