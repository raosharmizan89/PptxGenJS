# Quick Start: Dynamic Layout Selection

## TL;DR

Instead of hardcoding layout names, let the content decide:

```javascript
// ❌ OLD WAY (Hardcoded)
let slide = pptx.addSlide({ masterName: "Content w/Sub-headline" });

// ✅ NEW WAY (Dynamic)
let slide = pptx.addSlide({ masterName: getLayoutForContent(slideData) });
```

## 3-Step Usage

### Step 1: Define Your Content

```javascript
const slideData = {
    headline: "Your Title Here",
    subheadline: "Your subtitle",
    mainContent: "Your content...",
    slideNumber: "2"
};
```

### Step 2: Get the Layout

```javascript
const layout = getLayoutForContent(slideData);
// Returns: "Content w/Sub-headline"
```

### Step 3: Create the Slide

```javascript
const slide = pptx.addSlide({ masterName: layout });
slide.addText(slideData.headline, { placeholder: "headline" });
slide.addText(slideData.subheadline, { placeholder: "subheadline" });
slide.addText(slideData.mainContent, { placeholder: "mainContent" });
```

## Content Types → Layouts

| If your data has... | You get this layout |
|---------------------|---------------------|
| `title` + `subtitle` (no mainContent) | Title slide |
| `headline` + `subheadline` + `mainContent` | Content w/Sub-headline |
| `headline` + `mainContent` (no subheadline) | Content - no subtitle |
| `icons: [{...}, {...}, {...}]` (3 items) | Icons 3 Columns Vertical |
| `icons: [{...}, {...}, {...}, {...}]` (4 items) | Icons 4 Columns Vertical |
| Long `headline` (>60 chars) + `subheadline` + `mainContent` | Content w 2 Line Title and Sub-headline |
| `leftContent` + `rightContent` | Two Content + Subtitles |
| `type: 'contact'` | Contact us |

## Complete Example

```javascript
// Icon slide example
const iconSlideData = {
    headline: "Three Benefits",
    subheadline: "Why choose us",
    icons: [
        { data: "data:image/svg...", title: "Fast", content: "Quick turnaround" },
        { data: "data:image/svg...", title: "Reliable", content: "99.9% uptime" },
        { data: "data:image/svg...", title: "Secure", content: "Enterprise encryption" }
    ],
    slideNumber: "3",
    footer: "Company Name / December 2025"
};

const layout = getLayoutForContent(iconSlideData);
// Returns: "Icons 3 Columns Vertical"

const slide = pptx.addSlide({ masterName: layout });
slide.addText(iconSlideData.slideNumber, { placeholder: "slideNumber" });
slide.addText(iconSlideData.headline, { placeholder: "headline" });
slide.addText(iconSlideData.subheadline, { placeholder: "subheadline" });

iconSlideData.icons.forEach((icon, i) => {
    const num = i + 1;
    slide.addImage({ data: icon.data, placeholder: `icon${num}` });
    slide.addText(icon.title, { placeholder: `subtitle${num}` });
    slide.addText(icon.content, { placeholder: `content${num}` });
});
```

## Manual Override

Need a specific layout regardless of content?

```javascript
const slideData = {
    layoutHint: "Custom Layout Name",  // Force this layout
    headline: "Title",
    mainContent: "Content..."
};

const layout = getLayoutForContent(slideData);
// Returns: "Custom Layout Name" (ignores automatic selection)
```

## Test It

```bash
node test-dynamic-layouts.mjs
```

Output file: `test-dynamic-layouts-output.pptx` (112 KB, 7 slides)

## Key Functions

```javascript
// Analyze what type of content you have
const analysis = analyzeSlideContent(slideData);

// Get the best layout for that content
const layout = selectLayout(analysis);

// Or do both in one step
const layout = getLayoutForContent(slideData);
```

## Where to Find It

- **Browser (test.html):** Functions added at lines ~138-287
- **Node.js:** Use `layout-selector.js` or inline from `test-dynamic-layouts.mjs`
- **Documentation:** See `DYNAMIC_LAYOUT_SOLUTION.md` for full details

## Common Patterns

### Title Slide
```javascript
{ title: "...", subtitle: "...", authorInfo: "...", date: "..." }
→ "Title White - reports and presentations (hIHS)"
```

### Content Slide
```javascript
{ headline: "...", subheadline: "...", mainContent: "..." }
→ "Content w/Sub-headline"
```

### Icon Slide
```javascript
{ headline: "...", icons: [{}, {}, {}] }
→ "Icons 3 Columns Vertical"
```

### Two-Column Slide
```javascript
{ headline: "...", leftContent: "...", rightContent: "..." }
→ "Two Content + Subtitles"
```

### Contact Slide
```javascript
{ type: 'contact' }
→ "Contact us"
```

## Pro Tips

✅ **Use descriptive headlines** - Long headlines (>60 chars) get 2-line layouts automatically

✅ **Structure your data** - Consistent property names = consistent layout selection

✅ **Test early** - Run `test-dynamic-layouts.mjs` to see all layouts in action

✅ **Override when needed** - Use `layoutHint` for special cases

✅ **Check placeholder names** - Must match exactly (case-sensitive)

## Troubleshooting in 10 Seconds

**Wrong layout selected?**
→ Add `layoutHint: "Layout Name"` to force it

**Placeholder not found?**
→ Check placeholder name spelling and case

**Text not showing?**
→ Verify layout has that placeholder (check layout definitions)

---

**See full documentation:** `DYNAMIC_LAYOUT_SOLUTION.md`
