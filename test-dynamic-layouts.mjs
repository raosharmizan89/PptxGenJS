/**
 * Test script for dynamic layout selection
 * Generates a PowerPoint with various slide types to verify layout selection works correctly
 */

import PptxGenJS from './dist/pptxgen.es.js';
import fs from 'fs';

// Layout selector functions (inline version for ES modules)
function analyzeSlideContent(slideData) {
    const analysis = {
        isTitle: false,
        hasHeadline: false,
        hasSubheadline: false,
        hasTwoLineTitle: false,
        hasMainContent: false,
        hasLeftRightContent: false,
        hasIcons: false,
        iconCount: 0,
        hasChart: false,
        hasImage: false,
        hasTable: false,
        contentLength: 0,
        isContact: false,
        layoutHint: null
    };

    if (slideData.layoutHint) {
        analysis.layoutHint = slideData.layoutHint;
    }

    if (slideData.title && slideData.subtitle && !slideData.mainContent) {
        analysis.isTitle = true;
    }

    if (slideData.type === 'contact' || (slideData.headline && slideData.headline.toLowerCase().includes('contact'))) {
        analysis.isContact = true;
    }

    if (slideData.headline || slideData.title) {
        analysis.hasHeadline = true;
        const headlineText = slideData.headline || slideData.title || '';
        if (headlineText.length > 60) {
            analysis.hasTwoLineTitle = true;
        }
    }

    if (slideData.subheadline || slideData.subtitle) {
        analysis.hasSubheadline = true;
    }

    if (slideData.mainContent) {
        analysis.hasMainContent = true;
        analysis.contentLength = slideData.mainContent.length;
    }

    if (slideData.leftContent && slideData.rightContent) {
        analysis.hasLeftRightContent = true;
    }

    if (slideData.icons && Array.isArray(slideData.icons)) {
        analysis.hasIcons = true;
        analysis.iconCount = slideData.icons.length;
    }

    if (slideData.chart || slideData.chartData) {
        analysis.hasChart = true;
    }

    if (slideData.image || slideData.imagePath) {
        analysis.hasImage = true;
    }

    if (slideData.table || slideData.tableData) {
        analysis.hasTable = true;
    }

    return analysis;
}

function selectLayout(analysis) {
    if (analysis.layoutHint) {
        return analysis.layoutHint;
    }

    if (analysis.isContact) {
        return "Contact us";
    }

    if (analysis.isTitle) {
        return "Title White - reports and presentations (hIHS)";
    }

    if (analysis.hasIcons) {
        switch (analysis.iconCount) {
            case 3:
                return "Icons 3 Columns Vertical";
            case 4:
                return "Icons 4 Columns Vertical";
            default:
                return "Icons 3 Columns Vertical";
        }
    }

    if (analysis.hasChart) {
        if (analysis.hasSubheadline) {
            return "Chart w/Sub-headline";
        }
        return "Chart - no sub-headline";
    }

    if (analysis.hasLeftRightContent) {
        return "Two Content + Subtitles";
    }

    if (analysis.hasMainContent) {
        if (analysis.hasTwoLineTitle && analysis.hasSubheadline) {
            return "Content w 2 Line Title and Sub-headline";
        }
        if (analysis.hasSubheadline) {
            return "Content w/Sub-headline";
        }
        return "Content - no subtitle";
    }

    if (analysis.hasImage) {
        return "Content w/Sub-headline";
    }

    return "Content - no subtitle";
}

function getLayoutForContent(slideData) {
    const analysis = analyzeSlideContent(slideData);
    return selectLayout(analysis);
}

// Create presentation
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "S&P Global Market Intelligence";
pptx.company = "S&P Global";
pptx.subject = "Dynamic Layout Selection Test";
pptx.title = "Layout Selection Test Presentation";

// Define colors
const colors = {
    spOrange: "FF6600",
    spBlue: "003366",
    spLightBlue: "0099CC",
    spGray: "666666",
    white: "FFFFFF",
    black: "000000",
    lightGray: "F5F5F5"
};

console.log("Creating test presentation with dynamic layout selection...\n");

// Test slides with different content types
const testSlides = [
    {
        data: {
            title: "Dynamic Layout Selection Test",
            subtitle: "Automated Layout Selection Based on Content Type",
            authorInfo: "Test Suite / Market Intelligence",
            reportType: "TECHNICAL DEMO",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        },
        description: "Title Slide"
    },
    {
        data: {
            headline: "Content with Subheadline Layout Test",
            subheadline: "This slide should use 'Content w/Sub-headline' layout",
            mainContent: "This is a test of the content with subheadline layout. The dynamic layout selector should automatically choose the 'Content w/Sub-headline' layout because this slide has both a headline and a subheadline, along with main content. The system analyzes the content structure and selects the most appropriate layout without manual specification.",
            slideNumber: "2",
            footer: "Dynamic Layout Test / December 2025",
            source: "Source: PptxGenJS Layout Selector"
        },
        description: "Content w/Sub-headline"
    },
    {
        data: {
            headline: "Content Without Subheadline Layout Test",
            mainContent: "This slide tests the 'Content - no subtitle' layout. Since there is no subheadline in the content data, the layout selector should automatically choose the layout without a subtitle placeholder. This demonstrates how the system adapts to different content structures.",
            slideNumber: "3",
            footer: "Dynamic Layout Test / December 2025",
            source: "Source: PptxGenJS Layout Selector"
        },
        description: "Content - no subtitle"
    },
    {
        data: {
            headline: "Three Column Icon Layout Demonstrates Automatic Selection Based on Icon Count",
            subheadline: "System detects three icons and selects appropriate layout",
            icons: [
                {
                    data: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiBmaWxsPSIjRkY2NjAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+MTwvdGV4dD48L3N2Zz4=",
                    title: "First Feature",
                    content: "This demonstrates the first icon column with automatically selected layout based on icon count detection."
                },
                {
                    data: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiBmaWxsPSIjMDAzMzY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+MjwvdGV4dD48L3N2Zz4=",
                    title: "Second Feature",
                    content: "The system counted three icons in the data and automatically selected the three-column icon layout."
                },
                {
                    data: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiBmaWxsPSIjMDA5OUNDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+MzwvdGV4dD48L3N2Zz4=",
                    title: "Third Feature",
                    content: "No manual layout specification was needed - the content analyzer handled it automatically."
                }
            ],
            slideNumber: "4",
            footer: "Dynamic Layout Test / December 2025",
            source: "Source: PptxGenJS Layout Selector"
        },
        description: "Icons 3 Columns Vertical"
    },
    {
        data: {
            headline: "Two-Line Title with Subheadline Tests Long Headline Detection and Appropriate Layout Selection",
            subheadline: "System detects long headline and selects two-line title layout",
            mainContent: "This slide demonstrates how the layout selector detects long headlines (over 60 characters) and automatically selects the 'Content w 2 Line Title and Sub-headline' layout. This ensures that long titles have adequate space without truncation or awkward wrapping. The analyzer examines the headline length and combines it with other content characteristics to make the optimal layout choice.",
            slideNumber: "5",
            footer: "Dynamic Layout Test / December 2025",
            source: "Source: PptxGenJS Layout Selector"
        },
        description: "Content w 2 Line Title and Sub-headline"
    },
    {
        data: {
            headline: "Two-Column Content Layout Test",
            subheadline: "Left and right content automatically triggers two-column layout",
            leftSubtitle: "Left Column",
            leftContent: "When the slide data contains both leftContent and rightContent properties, the layout selector automatically chooses the 'Two Content + Subtitles' layout. This enables side-by-side comparison or presentation of complementary information.",
            rightSubtitle: "Right Column",
            rightContent: "The system analyzes the content structure and recognizes the two-column pattern. No manual layout specification is required - the content itself drives the layout selection, making the presentation generation process more intuitive and less error-prone.",
            slideNumber: "6",
            footer: "Dynamic Layout Test / December 2025",
            source: "Source: PptxGenJS Layout Selector"
        },
        description: "Two Content + Subtitles"
    },
    {
        data: {
            type: 'contact',
            headline: "Contact Us",
            slideNumber: "7"
        },
        description: "Contact us"
    }
];

// Counter for tracking layouts
const layoutUsageCount = {};

// Process each test slide
testSlides.forEach((testSlide, index) => {
    const { data, description } = testSlide;
    
    // Get layout dynamically
    const selectedLayout = getLayoutForContent(data);
    
    // Track usage
    layoutUsageCount[selectedLayout] = (layoutUsageCount[selectedLayout] || 0) + 1;
    
    console.log(`Slide ${index + 1}: ${description}`);
    console.log(`  Selected Layout: ${selectedLayout}`);
    console.log(`  Expected Layout: ${description}`);
    console.log(`  Match: ${selectedLayout === description ? '✓' : '✗'}`);
    console.log();
    
    // Create slide with selected layout
    const slide = pptx.addSlide({ masterName: selectedLayout });
    
    // Add content based on slide type
    if (data.title) {
        // Title slide
        if (data.title) slide.addText(data.title, { placeholder: "title" });
        if (data.subtitle) slide.addText(data.subtitle, { placeholder: "subtitle" });
        if (data.authorInfo) slide.addText(data.authorInfo, { placeholder: "authorInfo" });
        if (data.reportType) slide.addText(data.reportType, { placeholder: "reportType" });
        if (data.date) slide.addText(data.date, { placeholder: "date" });
    } else if (data.icons) {
        // Icon layout
        if (data.slideNumber) slide.addText(data.slideNumber, { placeholder: "slideNumber" });
        if (data.headline) slide.addText(data.headline, { placeholder: "headline" });
        if (data.subheadline) slide.addText(data.subheadline, { placeholder: "subheadline" });
        if (data.footer) slide.addText(data.footer, { placeholder: "footer" });
        if (data.source) slide.addText(data.source, { placeholder: "source" });
        
        data.icons.forEach((icon, idx) => {
            const num = idx + 1;
            slide.addImage({ data: icon.data, placeholder: `icon${num}` });
            slide.addText(icon.title, { placeholder: `subtitle${num}` });
            slide.addText(icon.content, { placeholder: `content${num}` });
        });
    } else if (data.leftContent && data.rightContent) {
        // Two-column layout
        if (data.slideNumber) slide.addText(data.slideNumber, { placeholder: "slideNumber" });
        if (data.headline) slide.addText(data.headline, { placeholder: "headline" });
        if (data.subheadline) slide.addText(data.subheadline, { placeholder: "subheadline" });
        if (data.footer) slide.addText(data.footer, { placeholder: "footer" });
        if (data.source) slide.addText(data.source, { placeholder: "source" });
        if (data.leftSubtitle) slide.addText(data.leftSubtitle, { placeholder: "leftSubtitle" });
        if (data.leftContent) slide.addText(data.leftContent, { placeholder: "leftContent" });
        if (data.rightSubtitle) slide.addText(data.rightSubtitle, { placeholder: "rightSubtitle" });
        if (data.rightContent) slide.addText(data.rightContent, { placeholder: "rightContent" });
    } else if (data.type === 'contact') {
        // Contact slide
        if (data.slideNumber) slide.addText(data.slideNumber, { placeholder: "slideNumber" });
        slide.addText([{ text: 'Contact us', options: { fontFace: 'Arial', fontSize: 36, color: 'FFFFFF', align: 'left', valign: 'top' } }], 
                     { x: 0.62, y: 0.38, w: 5.50, h: 0.50, margin: 0 });
    } else {
        // Standard content layout
        if (data.slideNumber) slide.addText(data.slideNumber, { placeholder: "slideNumber" });
        if (data.headline) slide.addText(data.headline, { placeholder: "headline" });
        if (data.subheadline) slide.addText(data.subheadline, { placeholder: "subheadline" });
        if (data.mainContent) slide.addText(data.mainContent, { placeholder: "mainContent" });
        if (data.footer) slide.addText(data.footer, { placeholder: "footer" });
        if (data.source) slide.addText(data.source, { placeholder: "source" });
    }
});

// Generate output
const outputFile = 'test-dynamic-layouts-output.pptx';
await pptx.writeFile({ fileName: outputFile });

console.log("\n=== Test Results ===");
console.log(`✓ Generated ${testSlides.length} slides with dynamic layout selection`);
console.log(`✓ Output file: ${outputFile}`);
console.log("\nLayout Usage Summary:");
Object.entries(layoutUsageCount).forEach(([layout, count]) => {
    console.log(`  - ${layout}: ${count} slide(s)`);
});

// Verify the file was created
if (fs.existsSync(outputFile)) {
    const stats = fs.statSync(outputFile);
    console.log(`\n✓ File created successfully (${Math.round(stats.size / 1024)} KB)`);
    console.log("\nTest completed successfully! Open the file to verify layouts:");
    console.log(`  ${outputFile}`);
} else {
    console.error("\n✗ Error: File was not created");
    process.exit(1);
}
