# Debug Instructions for Layout Issue

## Current Status

The console shows correct layout selection, but the PowerPoint file still shows all slides using "Content - no subtitle".

## Debugging Steps

### 1. Check Console Output

When you generate the PowerPoint, you should now see output like:

```
Creating slide1 with layout: Title White - reports and presentations (hIHS)
Creating slide2 with layout: Content w/Sub-headline
Creating slide3 with layout: Icons 3 Columns Vertical
Creating slide4 with layout: Content w 2 Line Title and Sub-headline
Creating slide5 with layout: Two Content + Subtitles
Creating slideContact with layout: Contact us
```

**Question:** Do you see this output? If not, what do you see?

### 2. Check PowerPoint File

Open the generated PowerPoint and:

1. **Right-click on slide 1** → Select "Layout"
2. **What layout is selected/highlighted?**
3. Do the same for slides 2, 3, 4, 5, and 6

### 3. Possible Issues

#### Issue A: Layout Names Don't Match Exactly
- PptxGenJS is case-sensitive
- Extra spaces or invisible characters cause mismatch
- Solution: Added character code logging to detect this

#### Issue B: PptxGenJS Version Issue
- The test.html uses: `https://cdn.jsdelivr.net/gh/raosharmizan89/PptxGenJS@0.9.0/dist/pptxgen.bundle.js`
- This might be an older version that doesn't support `masterName` parameter correctly
- Solution: Try using latest version or different parameter name

#### Issue C: defineSlideMaster Order vs masterName
- Maybe PptxGenJS uses layout index instead of name
- The first layout defined is "Title White...", not "Content - no subtitle"
- But all slides are using "Content - no subtitle" which is defined 3rd
- This suggests a different issue

### 4. What to Try

**Test 1: Hardcode a layout name**

Temporarily change line 3648 in test.html from:
```javascript
const slide1LayoutName = getLayoutForContent(slide1Data);
let slide1 = pptx.addSlide({ masterName: slide1LayoutName });
```

To:
```javascript
let slide1 = pptx.addSlide({ masterName: "Content w/Sub-headline" });
```

If this works, the issue is with the layout selection function. If it doesn't work, the issue is with how PptxGenJS processes the `masterName` parameter.

**Test 2: Check if layout parameter name is correct**

Try changing `masterName` to just `master`:
```javascript
let slide1 = pptx.addSlide({ master: "Title White - reports and presentations (hIHS)" });
```

**Test 3: Try using layout index instead**

```javascript
let slide1 = pptx.addSlide({ layout: 1 }); // Try index 1, 2, 3, etc.
```

## Next Steps

Please provide:
1. Console output when generating the PowerPoint
2. Which layout is actually selected for each slide in PowerPoint
3. Results of Test 1 (hardcoded layout name)

This will help identify whether the issue is:
- A. The layout selection logic
- B. The layout name matching
- C. The PptxGenJS library itself
- D. How the parameter is passed to addSlide()
