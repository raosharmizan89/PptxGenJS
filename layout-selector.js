/**
 * Dynamic Layout Selection System for PptxGenJS
 * Analyzes slide content and selects appropriate layout templates
 */

/**
 * Analyzes slide content structure to determine content type
 * @param {Object} slideData - The slide content data
 * @returns {Object} Analysis result with content characteristics
 */
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

    // Check for explicit layout hint
    if (slideData.layoutHint) {
        analysis.layoutHint = slideData.layoutHint;
    }

    // Check for title slide
    if (slideData.title && slideData.subtitle && !slideData.mainContent) {
        analysis.isTitle = true;
    }

    // Check for contact slide
    if (slideData.type === 'contact' || (slideData.headline && slideData.headline.toLowerCase().includes('contact'))) {
        analysis.isContact = true;
    }

    // Check headline/title
    if (slideData.headline || slideData.title) {
        analysis.hasHeadline = true;
        const headlineText = slideData.headline || slideData.title || '';
        // Check if title is long (2-line title)
        if (headlineText.length > 60) {
            analysis.hasTwoLineTitle = true;
        }
    }

    // Check subheadline
    if (slideData.subheadline || slideData.subtitle) {
        analysis.hasSubheadline = true;
    }

    // Check main content
    if (slideData.mainContent) {
        analysis.hasMainContent = true;
        analysis.contentLength = slideData.mainContent.length;
    }

    // Check for left/right content
    if (slideData.leftContent && slideData.rightContent) {
        analysis.hasLeftRightContent = true;
    }

    // Check for icons
    if (slideData.icons && Array.isArray(slideData.icons)) {
        analysis.hasIcons = true;
        analysis.iconCount = slideData.icons.length;
    }

    // Check for chart
    if (slideData.chart || slideData.chartData) {
        analysis.hasChart = true;
    }

    // Check for image
    if (slideData.image || slideData.imagePath) {
        analysis.hasImage = true;
    }

    // Check for table
    if (slideData.table || slideData.tableData) {
        analysis.hasTable = true;
    }

    return analysis;
}

/**
 * Selects appropriate layout based on content analysis
 * @param {Object} analysis - Content analysis from analyzeSlideContent
 * @returns {string} Layout name to use
 */
function selectLayout(analysis) {
    // Explicit layout hint takes precedence
    if (analysis.layoutHint) {
        return analysis.layoutHint;
    }

    // Contact slide
    if (analysis.isContact) {
        return "Contact us";
    }

    // Title slide
    if (analysis.isTitle) {
        return "Title White - reports and presentations (hIHS)";
    }

    // Icon-based layouts
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

    // Chart layouts
    if (analysis.hasChart) {
        if (analysis.hasSubheadline) {
            return "Chart w/Sub-headline";
        }
        return "Chart - no sub-headline";
    }

    // Two-column content layouts
    if (analysis.hasLeftRightContent) {
        return "Two Content + Subtitles";
    }

    // Content layouts with varying title lengths
    if (analysis.hasMainContent) {
        if (analysis.hasTwoLineTitle && analysis.hasSubheadline) {
            return "Content w 2 Line Title and Sub-headline";
        }
        if (analysis.hasSubheadline) {
            return "Content w/Sub-headline";
        }
        return "Content - no subtitle";
    }

    // Image-based layouts
    if (analysis.hasImage) {
        return "Content w/Sub-headline"; // Can be customized
    }

    // Default fallback
    return "Content - no subtitle";
}

/**
 * Main function to get layout for slide content
 * @param {Object} slideData - The slide content data
 * @returns {string} Layout name to use
 */
function getLayoutForContent(slideData) {
    const analysis = analyzeSlideContent(slideData);
    return selectLayout(analysis);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeSlideContent,
        selectLayout,
        getLayoutForContent
    };
}
