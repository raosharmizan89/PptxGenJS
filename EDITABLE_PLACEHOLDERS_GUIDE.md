# 🎨 How to Create Editable Placeholders in PptxGenJS

## ⚠️ **CRITICAL: Always Set `margin: 0` for Exact Positioning**

When creating placeholders, **always include `margin: 0`** in the options to remove default text insets:

```javascript
{
  placeholder: {
    options: {
      name: 'title',
      type: 'title',
      x: 0.6,
      y: 0.5,
      w: 12,
      h: 1.5,
      margin: 0  // ← REQUIRED for exact positioning!
    }
  }
}
```

**Without `margin: 0`**: PowerPoint adds ~0.1 inch padding, causing text to appear indented  
**With `margin: 0`**: Text appears exactly at your x/y coordinates  

📖 **See**: [PLACEHOLDER_MARGINS_GUIDE.md](./PLACEHOLDER_MARGINS_GUIDE.md) for complete margin control documentation.

---

## The Two Systems: Custom Layouts vs. Editable Placeholders

---

## ⚠️ **Important: Two Different Approaches**

### **System 1: Custom Layouts (Current Repository)**
- ✅ Uses pre-defined XML layouts (55 total)
- ✅ Provides visual design (logos, backgrounds)
- ❌ **NO editable placeholders**
- ❌ Requires manual positioning with coordinates

### **System 2: Programmatic Slide Masters (What You Need)**
- ✅ Uses `defineSlideMaster()` to create masters
- ✅ **HAS editable placeholders**
- ✅ Supports `{ placeholder: "name" }` syntax
- ❌ Doesn't use the 55 pre-defined layouts

**You cannot have both systems at once.**

---

## 🛠️ **How to Create Editable Placeholders**

### **Step 1: Define a Slide Master with Placeholders**

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// Define a slide master with editable placeholders
pptx.defineSlideMaster({
  title: 'MY_MASTER',
  background: { color: 'FFFFFF' },
  objects: [
    // Title placeholder
    {
      placeholder: {
        options: {
          name: 'title',
          type: 'title',
          x: 0.6,
          y: 0.5,
          w: 12,
          h: 1.5,
          margin: 0,  // ← ZERO margins for exact positioning
        },
        text: '(title placeholder)'
      }
    },
    // Body placeholder
    {
      placeholder: {
        options: {
          name: 'body',
          type: 'body',
          x: 0.6,
          y: 2.0,
          w: 12.0,
          h: 4.5,
          margin: 0,  // ← ZERO margins
        },
        text: '(body placeholder)'
      }
    },
    // Custom placeholder
    {
      placeholder: {
        options: {
          name: 'footer',
          type: 'body',
          x: 0.6,
          y: 6.8,
          w: 12.0,
          h: 0.5,
          margin: 0,  // ← ZERO margins
        },
        text: '(footer placeholder)'
      }
    }
  ],
  slideNumber: { x: 11.0, y: 6.9 }
});
```

### **Step 2: Use the Master with Placeholders**

```javascript
// Create slide using your custom master
const slide = pptx.addSlide({ masterName: 'MY_MASTER' });

// Now you can use placeholder names!
slide.addText('My Presentation Title', { 
  placeholder: 'title' 
});

slide.addText([
  { text: 'First bullet point', options: { bullet: true } },
  { text: 'Second bullet point', options: { bullet: true } },
  { text: 'Third bullet point', options: { bullet: true } }
], { 
  placeholder: 'body' 
});

slide.addText('Source: Company Data', { 
  placeholder: 'footer' 
});

// Save
await pptx.writeFile({ fileName: 'editable-placeholders.pptx' });
```

---

## 📋 **Complete Working Example**

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// 1. Define master with placeholders
pptx.defineSlideMaster({
  title: 'CONTENT_MASTER',
  background: { color: 'F5F5F5' },
  objects: [
    // Header/Title placeholder
    {
      placeholder: {
        options: {
          name: 'header',
          type: 'title',
          x: 0.5,
          y: 0.3,
          w: 9.0,
          h: 1.0,
          margin: 0,  // ← ZERO margins
        },
        text: 'Click to add title'
      }
    },
    // Subtitle placeholder
    {
      placeholder: {
        options: {
          name: 'subtitle',
          type: 'body',
          x: 0.5,
          y: 1.5,
          w: 9.0,
          h: 0.5,
          margin: 0,  // ← ZERO margins
        },
        text: 'Click to add subtitle'
      }
    },
    // Main content placeholder
    {
      placeholder: {
        options: {
          name: 'content',
          type: 'body',
          x: 0.5,
          y: 2.2,
          w: 9.0,
          h: 4.0,
          margin: 0,  // ← ZERO margins
        },
        text: 'Click to add content'
      }
    },
    // Logo (not a placeholder - static element)
    {
      image: {
        x: 8.5,
        y: 0.2,
        w: 1.2,
        h: 0.8,
        path: 'https://example.com/logo.png'
      }
    },
    // Footer text (static)
    {
      text: {
        text: '© 2025 Company Name',
        options: {
          x: 0.5,
          y: 6.8,
          w: 5.0,
          h: 0.3,
          fontSize: 8,
          color: '666666'
        }
      }
    }
  ],
  slideNumber: { x: 9.0, y: 6.8 }
});

// 2. Create slides using the master
const slide1 = pptx.addSlide({ masterName: 'CONTENT_MASTER' });
slide1.addText('Quarterly Results', { placeholder: 'header' });
slide1.addText('Q4 2024 Performance', { placeholder: 'subtitle' });
slide1.addText([
  { text: 'Revenue up 15%', options: { bullet: true } },
  { text: 'New customers: 250', options: { bullet: true } },
  { text: 'Market expansion successful', options: { bullet: true } }
], { placeholder: 'content' });

const slide2 = pptx.addSlide({ masterName: 'CONTENT_MASTER' });
slide2.addText('Future Plans', { placeholder: 'header' });
slide2.addText('2025 Strategy', { placeholder: 'subtitle' });
slide2.addText([
  { text: 'Launch new products', options: { bullet: true } },
  { text: 'Enter Asian markets', options: { bullet: true } },
  { text: 'Increase R&D spending', options: { bullet: true } }
], { placeholder: 'content' });

// 3. Save
await pptx.writeFile({ fileName: 'my-presentation.pptx' });
```

---

## 🎨 **Advanced: Multiple Masters with Different Layouts**

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// Master 1: Title Slide
pptx.defineSlideMaster({
  title: 'TITLE_MASTER',
  background: { color: '1F4E78' },
  objects: [
    {
      placeholder: {
        options: {
          name: 'title',
          type: 'title',
          x: 1.0,
          y: 2.5,
          w: 8.0,
          h: 1.5,
        },
        text: 'Presentation Title'
      }
    },
    {
      placeholder: {
        options: {
          name: 'subtitle',
          type: 'body',
          x: 1.0,
          y: 4.2,
          w: 8.0,
          h: 1.0,
        },
        text: 'Subtitle'
      }
    }
  ]
});

// Master 2: Two Column Content
pptx.defineSlideMaster({
  title: 'TWO_COLUMN_MASTER',
  background: { color: 'FFFFFF' },
  objects: [
    // Title
    {
      placeholder: {
        options: {
          name: 'title',
          type: 'title',
          x: 0.5,
          y: 0.3,
          w: 9.0,
          h: 0.8,
        },
        text: 'Slide Title'
      }
    },
    // Left column
    {
      placeholder: {
        options: {
          name: 'leftContent',
          type: 'body',
          x: 0.5,
          y: 1.5,
          w: 4.4,
          h: 5.0,
        },
        text: 'Left content'
      }
    },
    // Right column
    {
      placeholder: {
        options: {
          name: 'rightContent',
          type: 'body',
          x: 5.1,
          y: 1.5,
          w: 4.4,
          h: 5.0,
        },
        text: 'Right content'
      }
    }
  ]
});

// Master 3: Content + Image
pptx.defineSlideMaster({
  title: 'CONTENT_IMAGE_MASTER',
  background: { color: 'FFFFFF' },
  objects: [
    {
      placeholder: {
        options: {
          name: 'title',
          type: 'title',
          x: 0.5,
          y: 0.3,
          w: 5.0,
          h: 0.8,
        },
        text: 'Title'
      }
    },
    {
      placeholder: {
        options: {
          name: 'content',
          type: 'body',
          x: 0.5,
          y: 1.5,
          w: 5.0,
          h: 5.0,
        },
        text: 'Content'
      }
    },
    {
      placeholder: {
        options: {
          name: 'image',
          type: 'pic',
          x: 5.7,
          y: 1.0,
          w: 4.0,
          h: 5.5,
        },
        text: 'Image'
      }
    }
  ]
});

// Use different masters for different slides
const titleSlide = pptx.addSlide({ masterName: 'TITLE_MASTER' });
titleSlide.addText('My Presentation', { placeholder: 'title' });
titleSlide.addText('December 2024', { placeholder: 'subtitle' });

const contentSlide = pptx.addSlide({ masterName: 'TWO_COLUMN_MASTER' });
contentSlide.addText('Comparison', { placeholder: 'title' });
contentSlide.addText('Benefits:\n• Cost savings\n• Flexibility', { placeholder: 'leftContent' });
contentSlide.addText('Challenges:\n• Complexity\n• Training', { placeholder: 'rightContent' });

const imageSlide = pptx.addSlide({ masterName: 'CONTENT_IMAGE_MASTER' });
imageSlide.addText('Product Launch', { placeholder: 'title' });
imageSlide.addText('Key features...', { placeholder: 'content' });
imageSlide.addImage({ path: 'product.jpg', placeholder: 'image' });

await pptx.writeFile({ fileName: 'multi-master.pptx' });
```

---

## 📖 **Placeholder Options Reference**

### **Required Options**
```javascript
{
  placeholder: {
    options: {
      name: 'uniqueName',      // Required: unique identifier
      type: 'title',           // Required: 'title', 'body', 'pic', 'chart', 'table'
      x: 0.5,                  // Required: X position (inches)
      y: 1.0,                  // Required: Y position (inches)
      w: 8.0,                  // Required: Width (inches)
      h: 4.0,                  // Required: Height (inches)
    },
    text: 'Placeholder text'   // Optional: default text shown in placeholder
  }
}
```

### **Placeholder Types**
- `'title'` - Title placeholder (large text, centered)
- `'body'` - Body/content placeholder (bullets, paragraphs)
- `'pic'` - Image/picture placeholder
- `'chart'` - Chart placeholder
- `'table'` - Table placeholder

### **Additional Formatting Options**
```javascript
{
  placeholder: {
    options: {
      name: 'myPlaceholder',
      type: 'body',
      x: 1, y: 2, w: 8, h: 4,
      fontSize: 14,
      fontFace: 'Arial',
      color: '333333',
      align: 'left',
      valign: 'top',
      bold: false,
      italic: false
    },
    text: 'Placeholder text'
  }
}
```

---

## 🆚 **Comparison: Custom Layouts vs. Editable Placeholders**

| Feature | Custom Layouts (55 in repo) | Editable Placeholders |
|---------|----------------------------|----------------------|
| **Definition** | Pre-defined XML files | `defineSlideMaster()` |
| **Placeholders** | ❌ No | ✅ Yes |
| **Syntax** | Manual coordinates | `{ placeholder: "name" }` |
| **Visual Design** | ✅ Professional (logos, etc.) | Custom (you define) |
| **Flexibility** | Position anywhere | Must use placeholders |
| **Use Case** | Production slides | Template-based workflows |
| **Learning Curve** | Higher | Lower |
| **Code Example** | `slide.addText("text", {x,y,w,h})` | `slide.addText("text", {placeholder:"name"})` |

---

## ⚙️ **Can I Combine Both Systems?**

**Short Answer: No**

You must choose one approach:

### **Option A: Use Custom Layouts (Current System)**
```javascript
const slide = pptx.addSlide({ masterName: "Two Content" });
// Get visual design from pre-defined layouts
// Position all content manually with coordinates
slide.addText("Title", { x: 0.62, y: 0.38, w: 12.1, h: 0.5 });
```

### **Option B: Use Editable Placeholders**
```javascript
pptx.defineSlideMaster({ title: 'MY_MASTER', objects: [...] });
const slide = pptx.addSlide({ masterName: 'MY_MASTER' });
// Use placeholder system
slide.addText("Title", { placeholder: 'title' });
```

**You cannot use `{ masterName: "Two Content" }` (from the 55 layouts) AND have editable placeholders.**

---

## 🎯 **Which System Should I Use?**

### **Use Custom Layouts (Current Repo) When:**
- ✅ You need the exact visual design from comprehensive-test.pptx
- ✅ You want professional logos and styling
- ✅ You're okay with manual positioning
- ✅ You need all 55 pre-defined layouts

### **Use Editable Placeholders When:**
- ✅ You want "fill-in-the-blank" templates
- ✅ You need programmatic control over layout definition
- ✅ You prefer `{ placeholder: "name" }` syntax
- ✅ You want to open the PPTX in PowerPoint and edit placeholders

---

## 💡 **Recommended Workflow for Placeholders**

```javascript
import pptxgen from 'pptxgenjs';

// 1. Define your masters once (can save this as a module)
function setupMasters(pptx) {
  // Title slide master
  pptx.defineSlideMaster({
    title: 'TITLE_SLIDE',
    background: { color: '1F4E78' },
    objects: [
      {
        placeholder: {
          options: { name: 'title', type: 'title', x: 1, y: 2.5, w: 8, h: 1.5 },
          text: 'Presentation Title'
        }
      },
      {
        placeholder: {
          options: { name: 'subtitle', type: 'body', x: 1, y: 4.2, w: 8, h: 1 },
          text: 'Subtitle'
        }
      }
    ]
  });

  // Content slide master
  pptx.defineSlideMaster({
    title: 'CONTENT_SLIDE',
    background: { color: 'FFFFFF' },
    objects: [
      {
        placeholder: {
          options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9, h: 0.8 }
        }
      },
      {
        placeholder: {
          options: { name: 'body', type: 'body', x: 0.5, y: 1.5, w: 9, h: 5 }
        }
      }
    ]
  });
}

// 2. Create presentation function
function createPresentation(data) {
  const pptx = new pptxgen();
  setupMasters(pptx);

  // Title slide
  const titleSlide = pptx.addSlide({ masterName: 'TITLE_SLIDE' });
  titleSlide.addText(data.title, { placeholder: 'title' });
  titleSlide.addText(data.subtitle, { placeholder: 'subtitle' });

  // Content slides
  data.slides.forEach(slideData => {
    const slide = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
    slide.addText(slideData.title, { placeholder: 'title' });
    slide.addText(slideData.content, { placeholder: 'body' });
  });

  return pptx;
}

// 3. Use it
const presentation = createPresentation({
  title: 'Q4 Results',
  subtitle: 'December 2024',
  slides: [
    { title: 'Revenue', content: 'Up 15%...' },
    { title: 'Customers', content: '250 new...' }
  ]
});

await presentation.writeFile({ fileName: 'output.pptx' });
```

---

## 📚 **Additional Resources**

- **PptxGenJS Documentation**: https://gitbrent.github.io/PptxGenJS/docs/masters.html
- **Demo Examples**: `/demos/modules/demo_master.mjs` (in this repo)
- **API Reference**: https://gitbrent.github.io/PptxGenJS/docs/api-masters.html

---

## ❓ **FAQ**

### **Q: Can I convert the 55 custom layouts to use placeholders?**
A: Not easily. The custom layouts are pre-baked XML. You'd need to:
1. Extract the visual design from each layout
2. Recreate them using `defineSlideMaster()`
3. Add placeholder definitions
This is a significant undertaking.

### **Q: If I use `defineSlideMaster()`, do I lose the 55 layouts?**
A: Yes. When you use `defineSlideMaster()`, you're creating your own masters. The 55 pre-defined layouts won't be available.

### **Q: Can I use both systems in the same presentation?**
A: No. A presentation uses either:
- Pre-defined layouts (the 55 XML files), OR
- Programmatically defined masters

You can't mix them.

### **Q: Which system gives better results?**
A: It depends:
- **Custom layouts** = Professional design, more manual work
- **Editable placeholders** = Easier to use, more flexible, but you design everything

### **Q: How do I see what placeholders are available?**
A: They're the ones you define! With `defineSlideMaster()`, you create the placeholders and give them names. Then you reference those names when adding content.

---

## 🚀 **Quick Start: Create Your First Placeholder**

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// Define a simple master
pptx.defineSlideMaster({
  title: 'SIMPLE',
  objects: [{
    placeholder: {
      options: {
        name: 'content',
        type: 'body',
        x: 1, y: 1, w: 8, h: 5
      }
    }
  }]
});

// Use it
const slide = pptx.addSlide({ masterName: 'SIMPLE' });
slide.addText('Hello, placeholders!', { placeholder: 'content' });

await pptx.writeFile({ fileName: 'first-placeholder.pptx' });
```

**That's it!** Now you have editable placeholders. 🎉

---

## 🎓 **Summary**

To add editable placeholders:

1. **Use `defineSlideMaster()`** - NOT the 55 pre-defined layouts
2. **Define placeholders** with unique names
3. **Reference placeholders** using `{ placeholder: 'name' }`
4. **Cannot combine** with the custom layout system

**The 55 custom layouts and editable placeholders are mutually exclusive systems.**
