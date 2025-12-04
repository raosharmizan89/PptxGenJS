// Test layout selection logic

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
                return "Icons 4 Columns + Content"; // FIXED: Changed from "Icons 4 Columns Vertical"
            default:
                return "Icons 3 Columns Vertical";
        }
    }

    if (analysis.hasChart) {
        // FIXED: No exact "Chart w/Sub-headline" or "Chart - no sub-headline" layouts exist
        // Using closest available chart layout
        return "Content + Chart/Table 1";
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

// Test with actual slide data
const slide1Data = {
    title: "Data Center Investment Moves Macro Needle",
    subtitle: "Infrastructure Growth Driving Economic Transformation",
    authorInfo: "Mizan Bin Abdul Rahman / Market Intelligence / Senior Analyst",
    reportType: "MARKET BRIEFING",
    date: "December 3, 2025",
    image: "https://snp-mediaportal.qbank.se/assets/deployedFiles/c7ca8c7d873a5b91534e3755925f5d7c.jpg"
};

const slide2Data = {
    slideNumber: "2",
    headline: "The Data Center Investment Boom",
    subheadline: "Unprecedented growth reshaping global infrastructure landscape",
    footer: "Data Center Investment / December 2025",
    mainContent: `Data center investments have reached unprecedented levels...`,
    source: "Source: S&P Global Market Intelligence"
};

const slide3Data = {
    slideNumber: "3",
    headline: "Economic Impact Across Multiple Sectors",
    subheadline: "Data center investments create significant multiplier effects",
    footer: "Data Center Investment / December 2025",
    source: "Source: S&P Global Market Intelligence",
    icons: [
        { data: "...", title: "Employment Growth", content: "..." },
        { data: "...", title: "Infrastructure Investment", content: "..." },
        { data: "...", title: "Economic Output", content: "..." }
    ]
};

const slide4Data = {
    slideNumber: "4",
    headline: "Market Drivers and Investment Momentum Behind Data Center Growth", // 72 chars
    subheadline: "AI workloads and cloud migration accelerating infrastructure demand",
    footer: "Data Center Investment / December 2025",
    mainContent: `The explosive growth in artificial intelligence applications...`,
    source: "Source: S&P Global Market Intelligence"
};

const slide5Data = {
    slideNumber: "5",
    headline: "Market Outlook and Strategic Implications",
    subheadline: "Sustained growth trajectory with emerging challenges",
    footer: "Data Center Investment / December 2025",
    leftSubtitle: "Growth Momentum",
    leftContent: `The data center investment boom...`,
    rightSubtitle: "Key Challenges",
    rightContent: `Power grid constraints...`,
    source: "Source: S&P Global Market Intelligence"
};

const contactSlideData = {
    type: 'contact',
    slideNumber: "6"
};

// Test each slide
console.log("=== LAYOUT SELECTION TEST ===\n");

console.log("Slide 1:");
console.log("  Data:", JSON.stringify({title: slide1Data.title, subtitle: slide1Data.subtitle, image: !!slide1Data.image, mainContent: !!slide1Data.mainContent}, null, 2));
console.log("  Analysis:", analyzeSlideContent(slide1Data));
console.log("  Selected Layout:", getLayoutForContent(slide1Data));
console.log("  EXPECTED: Title White - reports and presentations (hIHS)\n");

console.log("Slide 2:");
console.log("  Data:", JSON.stringify({headline: slide2Data.headline, subheadline: slide2Data.subheadline, mainContent: !!slide2Data.mainContent}, null, 2));
console.log("  Analysis:", analyzeSlideContent(slide2Data));
console.log("  Selected Layout:", getLayoutForContent(slide2Data));
console.log("  EXPECTED: Content w/Sub-headline\n");

console.log("Slide 3:");
console.log("  Data:", JSON.stringify({headline: slide3Data.headline, iconCount: slide3Data.icons.length}, null, 2));
console.log("  Analysis:", analyzeSlideContent(slide3Data));
console.log("  Selected Layout:", getLayoutForContent(slide3Data));
console.log("  EXPECTED: Icons 3 Columns Vertical\n");

console.log("Slide 4:");
console.log("  Data:", JSON.stringify({headline: slide4Data.headline, headlineLength: slide4Data.headline.length, subheadline: slide4Data.subheadline, mainContent: !!slide4Data.mainContent}, null, 2));
console.log("  Analysis:", analyzeSlideContent(slide4Data));
console.log("  Selected Layout:", getLayoutForContent(slide4Data));
console.log("  EXPECTED: Content w 2 Line Title and Sub-headline\n");

console.log("Slide 5:");
console.log("  Data:", JSON.stringify({headline: slide5Data.headline, leftContent: !!slide5Data.leftContent, rightContent: !!slide5Data.rightContent}, null, 2));
console.log("  Analysis:", analyzeSlideContent(slide5Data));
console.log("  Selected Layout:", getLayoutForContent(slide5Data));
console.log("  EXPECTED: Two Content + Subtitles\n");

console.log("Slide 6 (Contact):");
console.log("  Data:", JSON.stringify(contactSlideData, null, 2));
console.log("  Analysis:", analyzeSlideContent(contactSlideData));
console.log("  Selected Layout:", getLayoutForContent(contactSlideData));
console.log("  EXPECTED: Contact us\n");
