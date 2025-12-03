# ✅ SOLUTION: How to Remove Placeholder Margins

## Your Question
> "If I use defineSlideMaster there will always be inset margins in placeholders. How do I add placeholders in slide layouts without margins?"

## Answer
**Use `margin: 0` in the placeholder options!**

## Quick Fix

### ❌ BEFORE (has unwanted margins):
```javascript
{
  placeholder: {
    options: {
      name: 'title',
      type: 'title',
      x: 0.567,
      y: 0.323,
      w: 11.063,
      h: 0.845
      // No margin specified = PowerPoint adds default ~0.1 inch padding
    }
  }
}
```

### ✅ AFTER (zero margins):
```javascript
{
  placeholder: {
    options: {
      name: 'title',
      type: 'title',
      x: 0.567,
      y: 0.323,
      w: 11.063,
      h: 0.845,
      margin: 0  // ← ADD THIS LINE
    }
  }
}
```

## Complete Working Example

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// Define slide master with ZERO-MARGIN placeholders
pptx.defineSlideMaster({
  title: 'My Custom Master',
  background: { color: 'FFFFFF' },
  objects: [
    // Title placeholder - ZERO margins
    {
      placeholder: {
        options: {
          name: 'title',
          type: 'title',
          x: 0.567,
          y: 0.323,
          w: 11.063,
          h: 0.845,
          margin: 0,        // ← ZERO margins for exact positioning
          fontSize: 40,
          bold: true
        }
      }
    },
    
    // Body placeholder - ZERO margins
    {
      placeholder: {
        options: {
          name: 'body',
          type: 'body',
          x: 0.567,
          y: 1.289,
          w: 11.064,
          h: 4.261,
          margin: 0,        // ← ZERO margins
          fontSize: 18
        }
      }
    }
  ]
});

// Use the master
const slide = pptx.addSlide({ masterName: 'My Custom Master' });
slide.addText('My Title', { placeholder: 'title' });
slide.addText('My content', { placeholder: 'body' });

await pptx.writeFile({ fileName: 'zero-margins.pptx' });
```

## Why This Works

The `margin` option controls PowerPoint's `<a:bodyPr>` text inset attributes:

```xml
<!-- With margin: 0 -->
<a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>

<!-- Without margin option (PowerPoint default) -->
<a:bodyPr lIns="91440" tIns="45720" rIns="91440" bIns="45720"/>
<!-- These values = ~0.1 inch padding -->
```

**lIns** = Left Inset  
**tIns** = Top Inset  
**rIns** = Right Inset  
**bIns** = Bottom Inset  

## Advanced: Custom Margins

You can also set individual margins using an array:

```javascript
{
  placeholder: {
    options: {
      name: 'title',
      type: 'title',
      x: 0.567,
      y: 0.323,
      w: 11.063,
      h: 0.845,
      margin: [0.05, 0.05, 0.05, 0.05]  // [left, right, bottom, top] in inches
    }
  }
}
```

## Comparison with Custom Layouts

Your 55 custom layouts in `src/cust-xml-slide-layouts.ts` **already have zero margins**:

```xml
<!-- From custom layout XML -->
<a:bodyPr vert="horz" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="t">
```

This is why you need `margin: 0` when using `defineSlideMaster()` - to **match** the behavior of your custom layouts!

## Source Code Reference

The margin handling is in `src/gen-xml.ts` (lines 398-407):

```typescript
if (slideItemObj.options.margin && Array.isArray(slideItemObj.options.margin)) {
    slideItemObj.options._bodyProp.lIns = valToPts(slideItemObj.options.margin[0] || 0)
    slideItemObj.options._bodyProp.rIns = valToPts(slideItemObj.options.margin[1] || 0)
    slideItemObj.options._bodyProp.bIns = valToPts(slideItemObj.options.margin[2] || 0)
    slideItemObj.options._bodyProp.tIns = valToPts(slideItemObj.options.margin[3] || 0)
} else if (typeof slideItemObj.options.margin === 'number') {
    slideItemObj.options._bodyProp.lIns = valToPts(slideItemObj.options.margin)
    slideItemObj.options._bodyProp.rIns = valToPts(slideItemObj.options.margin)
    slideItemObj.options._bodyProp.bIns = valToPts(slideItemObj.options.margin)
    slideItemObj.options._bodyProp.tIns = valToPts(slideItemObj.options.margin)
}
```

## Summary

✅ **Solution**: Add `margin: 0` to all placeholder options  
✅ **Why**: Removes PowerPoint's default text padding (~0.1 inch)  
✅ **Result**: Text appears exactly at your x/y coordinates  
✅ **Matches**: Your custom layouts which also use zero margins  

## Documentation

For complete details, see:
- **[PLACEHOLDER_MARGINS_GUIDE.md](./PLACEHOLDER_MARGINS_GUIDE.md)** - Full margin control documentation
- **[EDITABLE_PLACEHOLDERS_GUIDE.md](./EDITABLE_PLACEHOLDERS_GUIDE.md)** - Updated with margin examples
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Documentation index
