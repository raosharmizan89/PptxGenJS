    # PptxGenJS Custom Layout System - Documentation Index

## 📚 Documentation Overview

This repository contains a comprehensive custom slide layout system with **55 pre-defined layouts** matching `comprehensive-test.pptx`. This index helps you find the right document for your needs.

---

## 🎯 Quick Navigation

### For Beginners
**Start Here** → [`ANALYSIS_SUMMARY.md`](ANALYSIS_SUMMARY.md)
- What is this system?
- How does it work?
- Quick start example
- What you need to know

**CRITICAL** → [`LAYOUT_SYSTEM_CLARIFICATION.md`](LAYOUT_SYSTEM_CLARIFICATION.md)
- **READ THIS FIRST** if confused about placeholders
- Explains what layouts actually do
- Why `{ placeholder: "name" }` doesn't work
- Technical proof from extracted PPTX files
- Correct vs incorrect usage patterns

**Want Editable Placeholders?** → [`EDITABLE_PLACEHOLDERS_GUIDE.md`](EDITABLE_PLACEHOLDERS_GUIDE.md)
- **How to create ACTUAL editable placeholders**
- Use `defineSlideMaster()` instead of custom layouts
- Complete working examples
- Cannot be combined with 55 custom layouts
- Choose this OR custom layouts (not both)

**⭐ Remove Placeholder Margins** → [`PLACEHOLDER_MARGINS_GUIDE.md`](PLACEHOLDER_MARGINS_GUIDE.md)
- **How to remove margins from placeholders** for exact positioning
- Use `margin: 0` in placeholder options
- Complete examples with zero margins
- Why margins matter for positioning
- PowerPoint bodyPr attribute reference

### For Implementers
**Main Guide** → [`WORKFLOW_COMPREHENSIVE_GUIDE.md`](WORKFLOW_COMPREHENSIVE_GUIDE.md)
- Complete list of 55 layouts
- Step-by-step workflow
- Detailed code examples
- Layout selection guide
- Troubleshooting

### For Developers
**Placeholder Guide** → [`PLACEHOLDER_POPULATION_GUIDE.md`](PLACEHOLDER_POPULATION_GUIDE.md)
- How to populate placeholders
- Complete working examples
- Coordinate reference
- Helper functions
- Best practices

**Quick Reference** → [`LAYOUT_QUICK_REFERENCE.md`](LAYOUT_QUICK_REFERENCE.md)
- Compact layout list
- Copy-paste code snippets
- Fast lookup while coding

**Technical Deep Dive** → [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md)
- Internal architecture
- XML structure breakdown
- Coordinate system explained
- File relationships
- Debugging tips

---

## 📖 Document Descriptions

### 1. ANALYSIS_SUMMARY.md
**Purpose**: Executive summary and quick start  
**Audience**: Everyone  
**Length**: ~15 min read  
**Contains**:
- Overview of findings
- How the system works
- Complete list of 55 layouts
- Quick start example
- Key insights
- What you DON'T need to do

**When to Read**: First document to read for understanding the system

---

### 2. WORKFLOW_COMPREHENSIVE_GUIDE.md
**Purpose**: Complete implementation guide  
**Audience**: Developers implementing PPT generation  
**Length**: ~30 min read  
**Contains**:
- Architecture explanation
- All 55 layouts with categories
- Detailed workflow steps
- Multiple code examples
- Layout selection guide (by content type)
- Troubleshooting section
- Important notes and tips

**When to Read**: Before implementing PPT generation logic

---

### 3. LAYOUT_QUICK_REFERENCE.md
**Purpose**: Fast lookup during development  
**Audience**: Developers actively coding  
**Length**: ~5 min read  
**Contains**:
- All 55 layouts grouped by category
- Copy-paste ready code snippets
- Quick tips
- Simple example

**When to Read**: While writing code, need to find a layout name quickly

---

### 4. TECHNICAL_ARCHITECTURE.md
**Purpose**: Deep technical understanding  
**Audience**: Advanced developers, maintainers  
**Length**: ~45 min read  
**Contains**:
- Architecture diagram
- File structure and relationships
- XML structure breakdown
- EMU ↔ Inch conversion explained
- Logo system details
- Coordinate system
- Layout registration process
- Debugging tips
- Modification guide

**When to Read**: Need to understand internals or modify the system

---

## 🗂️ File Organization

```
Documentation Files:
├── ANALYSIS_SUMMARY.md              ← Start here (overview)
├── WORKFLOW_COMPREHENSIVE_GUIDE.md  ← Implementation guide
├── LAYOUT_QUICK_REFERENCE.md        ← Quick lookup
├── TECHNICAL_ARCHITECTURE.md        ← Deep dive
└── DOCUMENTATION_INDEX.md           ← This file

Source Files:
├── src/cust-xml-slide-layouts.ts    ← Layout XML definitions (55 layouts)
├── src/pptxgen.ts                   ← Main library (auto-loads layouts)
└── src/bld/pptxgen.cjs.js          ← Compiled library

Tool Files:
├── tools/step_templates.data.json   ← Raw layout data
├── tools/step_templates.llm.json    ← Generated templates with coordinates
├── tools/generate-templates-with-coords.mjs  ← Generator script
└── tools/test-templates-v2.mjs      ← Validation tests (10 tests)

Reference Files:
├── comprehensive-test.pptx          ← Reference PPTX (55 layouts)
└── demos/modules/demo_master.mjs    ← Example usage
```

---

## 🎓 Learning Path

### Beginner Path (Total: ~50 min)
1. Read [`ANALYSIS_SUMMARY.md`](ANALYSIS_SUMMARY.md) (15 min)
2. Read [`WORKFLOW_COMPREHENSIVE_GUIDE.md`](WORKFLOW_COMPREHENSIVE_GUIDE.md) (30 min)
3. Bookmark [`LAYOUT_QUICK_REFERENCE.md`](LAYOUT_QUICK_REFERENCE.md) (5 min)
4. **Result**: Ready to generate presentations!

### Advanced Path (Total: ~95 min)
1. Complete Beginner Path (50 min)
2. Read [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md) (45 min)
3. **Result**: Can modify and extend the system!

### Quick Lookup (Total: ~5 min)
1. Go to [`LAYOUT_QUICK_REFERENCE.md`](LAYOUT_QUICK_REFERENCE.md)
2. Find layout name
3. Copy code snippet
4. **Result**: Keep coding!

---

## 🔍 Find Information By Topic

### How do I select a layout?
→ [`ANALYSIS_SUMMARY.md`](ANALYSIS_SUMMARY.md#how-it-works) or [`WORKFLOW_COMPREHENSIVE_GUIDE.md`](WORKFLOW_COMPREHENSIVE_GUIDE.md#step-2-add-slides-using-layout-names)

### What layouts are available?
→ [`LAYOUT_QUICK_REFERENCE.md`](LAYOUT_QUICK_REFERENCE.md) (all layouts) or [`WORKFLOW_COMPREHENSIVE_GUIDE.md`](WORKFLOW_COMPREHENSIVE_GUIDE.md#complete-list-of-55-slide-layouts-in-order) (categorized)

### How do I add content to a slide?
→ [`WORKFLOW_COMPREHENSIVE_GUIDE.md`](WORKFLOW_COMPREHENSIVE_GUIDE.md#step-3-add-content-to-slides)

### What coordinates should I use?
→ `tools/step_templates.llm.json` (exact coordinates) or [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#coordinate-system) (conversion formula)

### How does the system work internally?
→ [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#architecture-diagram)

### Where are logos configured?
→ [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#logo-system)

### How do I troubleshoot errors?
→ [`WORKFLOW_COMPREHENSIVE_GUIDE.md`](WORKFLOW_COMPREHENSIVE_GUIDE.md#troubleshooting) or [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#debugging-tips)

### Can I modify layouts?
→ [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#modifying-layouts)

### How do EMU and inches relate?
→ [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#emu-to-inches-conversion)

### What's the relationship with comprehensive-test.pptx?
→ [`ANALYSIS_SUMMARY.md`](ANALYSIS_SUMMARY.md#exact-match-with-comprehensive-testpptx) or [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#relationship-to-comprehensive-testpptx)

---

## 📝 Quick Facts

- **Total Layouts**: 55 (46 functional + 9 separators)
- **Layout Source**: `src/cust-xml-slide-layouts.ts`
- **Auto-Loading**: Yes, on `import pptxgen`
- **Manual Setup**: None required
- **Coordinate System**: Inches (API) / EMU (XML)
- **Slide Dimensions**: 10" × 7.5" (4:3 aspect ratio)
- **Logo Variants**: 4 (redBlack, blackBlack, redWhite, whiteWhite)
- **Test Suite**: 10 validation tests (all passing ✅)

---

## 🚀 Getting Started (30 seconds)

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// Select a layout by name
const slide = pptx.addSlide({ masterName: "Two Content" });

// Add content
slide.addText("Hello World", { x: 1, y: 1, fontSize: 36 });

// Save
await pptx.writeFile({ fileName: "output.pptx" });
```

**That's it!** Layouts are automatically loaded and ready to use.

---

## 💡 Key Concepts

### 1. Pre-Defined Layouts
All 55 layouts are **already defined** in the codebase. You don't need to create or configure them.

### 2. Auto-Loading
Layouts **automatically load** when you `import pptxgen`. No manual registration needed.

### 3. Name-Based Selection
Use `pptx.addSlide({ masterName: "LayoutName" })` to select layouts. Names are **case-sensitive**.

### 4. Exact Match
Generated presentations have the **exact same layout structure** as `comprehensive-test.pptx`.

### 5. Embedded Logos
Logos are **pre-positioned** in layouts. They appear automatically based on the selected layout.

---

## 🎯 Common Use Cases

### Use Case 1: Create a simple presentation
**Read**: [`ANALYSIS_SUMMARY.md`](ANALYSIS_SUMMARY.md#quick-start-example)  
**Copy Code From**: [`LAYOUT_QUICK_REFERENCE.md`](LAYOUT_QUICK_REFERENCE.md#example)

### Use Case 2: Find a specific layout
**Go To**: [`LAYOUT_QUICK_REFERENCE.md`](LAYOUT_QUICK_REFERENCE.md#all-55-slide-layouts-in-order)  
**Or**: [`WORKFLOW_COMPREHENSIVE_GUIDE.md`](WORKFLOW_COMPREHENSIVE_GUIDE.md#layout-selection-guide)

### Use Case 3: Understand coordinate system
**Read**: [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#coordinate-system)  
**Reference**: `tools/step_templates.llm.json`

### Use Case 4: Debug layout issues
**Read**: [`WORKFLOW_COMPREHENSIVE_GUIDE.md`](WORKFLOW_COMPREHENSIVE_GUIDE.md#troubleshooting)  
**Then**: [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#debugging-tips)

### Use Case 5: Modify or extend layouts
**Read**: [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md#modifying-layouts)  
**Validate With**: `tools/test-templates-v2.mjs`

---

## 🔧 Developer Tools

### Validation
```bash
# Run validation tests
node tools/test-templates-v2.mjs
```

**Expected**: ✅ All 10 tests passing

### Template Generation
```bash
# Regenerate LLM templates
node tools/generate-templates-with-coords.mjs
```

**Output**: Updated `tools/step_templates.llm.json`

### PPTX Inspection
```bash
# Extract comprehensive-test.pptx
unzip comprehensive-test.pptx -d comprehensive-test-extracted/

# View layout XML
cat comprehensive-test-extracted/ppt/slideLayouts/slideLayout1.xml
```

---

## 📞 Support

### Have Questions?
1. Check this index for relevant document
2. Search document using Ctrl+F
3. Review code examples in guides
4. Inspect `tools/step_templates.llm.json` for coordinates

### Found an Issue?
1. Run validation: `node tools/test-templates-v2.mjs`
2. Check troubleshooting: [`WORKFLOW_COMPREHENSIVE_GUIDE.md#troubleshooting`](WORKFLOW_COMPREHENSIVE_GUIDE.md#troubleshooting)
3. Review architecture: [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md)

---

## 📚 Additional Resources

- **PptxGenJS Documentation**: https://gitbrent.github.io/PptxGenJS/docs/
- **API Reference**: https://gitbrent.github.io/PptxGenJS/docs/api.html
- **Demo Examples**: `/demos/modules/` folder
- **Coordinate Templates**: `tools/step_templates.llm.json`

---

## ✅ Checklist: Before You Start

- [ ] Read [`ANALYSIS_SUMMARY.md`](ANALYSIS_SUMMARY.md) for overview
- [ ] Review [`WORKFLOW_COMPREHENSIVE_GUIDE.md`](WORKFLOW_COMPREHENSIVE_GUIDE.md) for implementation
- [ ] Bookmark [`LAYOUT_QUICK_REFERENCE.md`](LAYOUT_QUICK_REFERENCE.md) for quick lookup
- [ ] Understand layout names are case-sensitive
- [ ] Know that layouts auto-load (no manual setup)
- [ ] Know that coordinates are in inches
- [ ] Understand logos are pre-configured

**Once checked**: You're ready to generate presentations! 🚀

---

## 📊 Documentation Statistics

| Document | Words | Reading Time | Audience | Purpose |
|----------|-------|--------------|----------|---------|
| ANALYSIS_SUMMARY.md | ~3,500 | 15 min | Everyone | Overview & Quick Start |
| WORKFLOW_COMPREHENSIVE_GUIDE.md | ~6,000 | 30 min | Implementers | Complete Guide |
| LAYOUT_QUICK_REFERENCE.md | ~1,200 | 5 min | Developers | Fast Lookup |
| TECHNICAL_ARCHITECTURE.md | ~8,500 | 45 min | Advanced | Deep Dive |
| **Total** | **~19,200** | **~95 min** | - | - |

---

**Happy Coding!** 🎉
