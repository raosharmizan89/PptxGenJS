# Fixed: "PptxGenJS is not a constructor" Error

## Error
```
Error: PptxGenJS is not a constructor
```

## Root Cause
The built `pptxgen.js` file uses UMD (Universal Module Definition) format and expects `JSZip` to be available globally:

```javascript
var PptxGenJS = (function (JSZip) {
    // ... code ...
    return PptxGenJS;
})(JSZip);  // <-- JSZip was undefined!
```

When JSZip is undefined, the entire PptxGenJS module fails to initialize properly.

## Solution
Added JSZip library before PptxGenJS in test.html:

**BEFORE:**
```html
<script src="./src/bld/pptxgen.js"></script>
```

**AFTER:**
```html
<script src="./libs/jszip.min.js"></script>
<script src="./src/bld/pptxgen.js"></script>
```

## Files Changed
- **test.html** - Line 7: Added JSZip script tag before PptxGenJS

## Verification
Now when you load test.html:
1. JSZip loads first and creates `window.JSZip`
2. PptxGenJS loads and receives JSZip as a parameter
3. PptxGenJS constructor is properly created and available

## Test Instructions
1. Refresh your browser at `http://localhost:8000/test.html`
2. Open console (F12) - should see no more "not a constructor" errors
3. Should see layout selection messages
4. Click generate/download button
5. Verify generated PPTX has correct layouts

The dynamic layout selection should now work completely! 🎉
