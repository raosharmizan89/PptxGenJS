# Corrupted XML Fix - Complete

## Problem Summary

After fixing the `removeBrokenPics` issue, we discovered that **3 of the 57 embedded layout XML definitions were corrupted** in `src/cust-xml-slide-layouts.ts`:

- **Layout ID 12** (slideLayout13): "Content + Photo Black"
- **Layout ID 13** (slideLayout14): "Content + Photo Blue"  
- **Layout ID 27** (slideLayout28): "Statement Photo"

### Corruption Details

The XML had mismatched closing tags, specifically `</p:blipFill>` appearing without corresponding opening tags:

```xml
<!-- CORRUPTED -->
<a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr>...

<!-- SHOULD BE -->
<a:stretch><a:fillRect/></a:stretch></p:spPr>...
```

This caused XML parse errors when PowerPoint tried to read the generated PPTX files.

## Root Cause

The embedded XML definitions in `src/cust-xml-slide-layouts.ts` contained malformed XML that was copied from a corrupted source. The `removeBrokenPics` function was masking this issue by stripping placeholder images, but once we stopped calling it, the underlying XML corruption became apparent.

## Solution

### 1. Extract Correct XML from Reference File

Used the correct `test_all_layouts_GOOD.pptx` file to extract valid XML:

```bash
python3 -c "
import zipfile
for layout_id in [12, 13, 27]:
    with zipfile.ZipFile('test_all_layouts_GOOD.pptx', 'r') as z:
        layout_num = layout_id + 1
        xml = z.read(f'ppt/slideLayouts/slideLayout{layout_num}.xml')
        with open(f'correct_layout_{layout_id}.xml', 'wb') as f:
            f.write(xml)
"
```

### 2. Replace Corrupted XML in Source File

Created Python script to find and replace the corrupted layout definitions:

```python
import re

for layout_id in [12, 13, 27]:
    with open(f'correct_layout_{layout_id}.xml', 'r') as f:
        correct_xml = f.read()
    
    with open('src/cust-xml-slide-layouts.ts', 'r') as f:
        content = f.read()
    
    # Find and replace the XML in the template literal
    pattern = rf'(\{{\s*id:\s*{layout_id}\s*,\s*name:\s*[\'"][^\'"]+[\'"]\s*,\s*xml:\s*`)([^`]+)(`\s*\}})'
    
    def replace_func(match):
        return match.group(1) + correct_xml + match.group(3)
    
    content = re.sub(pattern, replace_func, content, flags=re.DOTALL)
    
    with open('src/cust-xml-slide-layouts.ts', 'w') as f:
        f.write(content)
```

### 3. Clean Rebuild

```bash
rm -rf dist/ src/bld/
npm run build
```

### 4. Verification

Generated new PPTX file and verified all 57 layouts match the reference:

```bash
python3 compare_all_layouts.py
```

**Result**: ✅ ALL 57 LAYOUTS MATCH PERFECTLY!

## Verification Results

```
✅ ALL 57 LAYOUTS MATCH PERFECTLY!

Sample layouts verified:
  Layout 1: "Content - no subtitle" (5 placeholders)
  Layout 13: "Content + Photo Black" (7 placeholders)
  Layout 14: "Content + Photo Blue" (7 placeholders)
  Layout 28: "Statement Photo" (2 placeholders)
  Layout 57: "~    " (0 placeholders)
```

## Files Modified

1. **src/cust-xml-slide-layouts.ts**
   - Replaced corrupted XML for layout IDs 12, 13, 27
   - XML now matches reference file exactly

## Key Learnings

1. **Embedded XML Must Be Valid**: Pre-validated XML should never be modified by sanitization functions
2. **Regex Replacement Works for Template Literals**: The pattern successfully handled multi-line XML within backticks
3. **Clean Builds Matter**: Removing `dist/` and `src/bld/` ensured no cached artifacts
4. **Verification Is Critical**: Always verify generated files match expected structure

## Status

✅ **COMPLETE** - All 57 custom slide layouts now generate correctly with proper names and placeholders.

## Testing

To verify the fix:

```bash
# Build
npm run build

# Generate test file
node -e "const pptxgen = require('./src/bld/pptxgen.cjs.js'); const prs = new pptxgen(); prs.defineSlideMaster({ title: 'Test' }); prs.addSlide(); prs.writeFile({ fileName: 'test.pptx' });"

# Compare with reference
python3 -c "
import zipfile
import xml.etree.ElementTree as ET

def get_layout(pptx, num):
    with zipfile.ZipFile(pptx, 'r') as z:
        xml = z.read(f'ppt/slideLayouts/slideLayout{num}.xml')
        root = ET.fromstring(xml)
        ns = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}
        return root.find('.//p:cSld', ns).get('name')

for i in [13, 14, 28]:
    print(f'Layout {i}: {get_layout(\"test.pptx\", i)}')
"
```

Expected output:
```
Layout 13: Content + Photo Black
Layout 14: Content + Photo Blue
Layout 28: Statement Photo
```
