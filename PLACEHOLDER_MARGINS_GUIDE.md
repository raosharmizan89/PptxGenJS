# Placeholder Margins Guide

## Problem

When using `defineSlideMaster()` to create editable placeholders, PowerPoint adds default margins (insets) around the text. This creates unwanted spacing that prevents exact positioning of content.

## Solution

Use the **`margin`** option when defining placeholders to control the text insets (`lIns`, `tIns`, `rIns`, `bIns` in PowerPoint XML).

## How to Remove Margins from Placeholders

### Option 1: Zero Margins (Number)

Set `margin: 0` to remove all margins:

```javascript
pptx.defineSlideMaster({
  title: 'My Custom Master',
  slideNumber: { x: 1.0, y: 7.0, w: 1.0, h: 0.4 },
  objects: [
    {
      placeholder: {
        options: {
          name: 'title',
          type: 'title',
          x: 0.6,
          y: 0.3,
          w: 11.1,
          h: 0.85,
          margin: 0  // ← ZERO MARGINS on all sides
        }
      }
    },
    {
      placeholder: {
        options: {
          name: 'body',
          type: 'body',
          x: 0.6,
          y: 1.3,
          w: 11.1,
          h: 4.3,
          margin: 0  // ← ZERO MARGINS
        }
      }
    }
  ]
});
```

### Option 2: Individual Margins (Array)

Set `margin: [left, right, bottom, top]` for precise control:

```javascript
{
  placeholder: {
    options: {
      name: 'title',
      type: 'title',
      x: 0.6,
      y: 0.3,
      w: 11.1,
      h: 0.85,
      margin: [0, 0, 0, 0]  // ← [left, right, bottom, top] in inches
    }
  }
}
```

### Option 3: Custom Margins

Add specific margins where needed:

```javascript
{
  placeholder: {
    options: {
      name: 'body',
      type: 'body',
      x: 0.6,
      y: 1.3,
      w: 11.1,
      h: 4.3,
      margin: [0.05, 0.05, 0.05, 0.05]  // ← Small margins (0.05 inch = ~1.27mm)
    }
  }
}
```

## How It Works

The `margin` option sets PowerPoint's `<a:bodyPr>` attributes:

- **lIns** = Left Inset (margin[0])
- **rIns** = Right Inset (margin[1])
- **bIns** = Bottom Inset (margin[2])
- **tIns** = Top Inset (margin[3])

### Source Code Reference

From `src/gen-xml.ts` (lines 398-407):

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

## Complete Example with Zero Margins

```javascript
const pptx = new PptxGenJS();

// Define custom slide master with ZERO-MARGIN placeholders
pptx.defineSlideMaster({
  title: 'Comprehensive Test Master',
  slideNumber: { x: 1.0, y: 7.0, w: 1.0, h: 0.4 },
  objects: [
    // Background shapes (no margins needed)
    {
      rect: {
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
        fill: { color: 'FFFFFF' }
      }
    },
    
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
          margin: 0,        // ← ZERO margins
          fontSize: 40,
          bold: true,
          color: '000000'
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
          fontSize: 18,
          color: '000000'
        }
      }
    }
  ]
});

// Use the master in slides
const slide1 = pptx.addSlide({ masterName: 'Comprehensive Test Master' });
slide1.addText('My Title', { placeholder: 'title' });
slide1.addText('My content text', { placeholder: 'body' });

pptx.writeFile({ fileName: 'Zero-Margin-Placeholders.pptx' });
```

## Why This Matters

1. **Exact Positioning**: Zero margins ensure text appears exactly where you specify (x, y coordinates)
2. **Matches Templates**: Comprehensive-test.pptx layouts use `lIns="0" tIns="0" rIns="0" bIns="0"`
3. **Predictable Layout**: No unexpected spacing when populating placeholders

## Comparison: With vs Without Margins

### DEFAULT (has margins):
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
      // margin not specified = default PowerPoint margins (~0.1 inch)
    }
  }
}
```
**Result**: Text appears indented from edges of placeholder box

### ZERO MARGINS (recommended):
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
      margin: 0  // ← ZERO margins
    }
  }
}
```
**Result**: Text starts exactly at placeholder edges (x, y position)

## TypeScript Interface

The `margin` option is defined in PptxGenJS types:

```typescript
export interface TextPropsOptions extends PositionOptions, OptsDataOrPath, TextGlowProps {
  // ... other options ...
  margin?: number | number[];  // number = all sides, [L,R,B,T] = individual
  // ... other options ...
}
```

## Related Files

- **Source Code**: `src/gen-xml.ts` (lines 398-407) - margin processing
- **Type Definitions**: `types/index.d.ts` - `TextPropsOptions.margin`
- **Implementation**: `src/gen-objects.ts` (lines 1079-1086) - deprecated `inset` option (use `margin` instead)

## Additional Notes

### Deprecated `inset` Option

There's an old `inset` option that also sets margins:

```javascript
// ⚠️ DEPRECATED - use `margin` instead
{
  placeholder: {
    options: {
      name: 'title',
      type: 'title',
      inset: 0  // ← Works but deprecated since v3.10.0
    }
  }
}
```

**Recommendation**: Use `margin` instead of `inset` for future compatibility.

### Units

- Margin values are in **inches** by default
- PowerPoint XML stores as **EMU** (English Metric Units): 1 inch = 914,400 EMU
- PptxGenJS converts automatically via `valToPts()` function

## Summary

✅ **To remove placeholder margins**: Set `margin: 0`  
✅ **For custom margins**: Use `margin: [left, right, bottom, top]` in inches  
✅ **For exact positioning**: Always use zero margins to match your x/y coordinates  
✅ **To match comprehensive-test.pptx**: All placeholders there use zero margins (`lIns="0" tIns="0" rIns="0" bIns="0"`)
