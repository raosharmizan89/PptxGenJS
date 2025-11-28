const PptxGenJS = require('./src/bld/pptxgen.cjs.js');
const fs = require('fs');
const path = require('path');

async function generateTestPPT() {
    try {
        console.log('🚀 Generating test PPTX with custom layout...\n');
        
        const pptx = new PptxGenJS();
        
        // Set metadata
        pptx.author = "EDP PPT Gen";
        pptx.title = "Custom Layout Test";
        pptx.subject = "Testing Custom OOXML Layouts";
        pptx.company = "S&P Global";
        
        console.log('✓ Presentation created');
        console.log('  - Slide layouts count:', pptx.slideLayouts.length);
        console.log('  - Default layout name:', pptx.slideLayouts[0]._name);
        
        // Slide 1: Title slide
        const slide1 = pptx.addSlide();
        slide1.addText("EDP Custom Layout Test", {
            x: 0.5,
            y: 2.0,
            w: 9,
            h: 1.5,
            fontSize: 44,
            bold: true,
            color: "D6002A"
        });
        
        slide1.addText("Slide 1: Testing Custom Layout from cust-xml-slide-layout1.ts", {
            x: 0.5,
            y: 3.7,
            w: 9,
            h: 1,
            fontSize: 18,
            color: "404040"
        });
        
        console.log('✓ Slide 1 created (Title slide)');
        
        // Slide 2: Content slide with bullets
        const slide2 = pptx.addSlide();
        slide2.addText("Content Example", {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 32,
            bold: true,
            color: "D6002A"
        });
        
        slide2.addText("This presentation uses the custom OOXML structure:", {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 0.5,
            fontSize: 14
        });
        
        slide2.addText([
            { text: "Custom slide master from CUSTOM_PPT_SLIDE_MASTER_XML", options: { bullet: true, fontSize: 12 } },
            { text: "Custom slide layout from CUSTOM_PPT_SLIDE_LAYOUT1_XML", options: { bullet: true, fontSize: 12 } },
            { text: "No default Microsoft blank layout", options: { bullet: true, fontSize: 12 } },
            { text: "S&P Global branding in master (2025)", options: { bullet: true, fontSize: 12 } }
        ], {
            x: 0.5,
            y: 2.2,
            w: 9,
            h: 3,
            fontSize: 12
        });
        
        console.log('✓ Slide 2 created (Content with bullets)');
        
        // Slide 3: Verification checklist
        const slide3 = pptx.addSlide();
        slide3.addText("Verification Checklist", {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 32,
            bold: true,
            color: "D6002A"
        });
        
        slide3.addText([
            { text: "✓ Custom slideLayout1.xml embedded", options: { bullet: true, fontSize: 12, color: "167527" } },
            { text: "✓ Custom slideMaster1.xml with 2025 S&P Global branding", options: { bullet: true, fontSize: 12, color: "167527" } },
            { text: "✓ Custom presentation.xml structure", options: { bullet: true, fontSize: 12, color: "167527" } },
            { text: "✓ No default blank Microsoft layouts", options: { bullet: true, fontSize: 12, color: "167527" } }
        ], {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 3,
            fontSize: 12
        });
        
        console.log('✓ Slide 3 created (Verification)');
        
        // Save to workspace
        const outputPath = '/workspaces/PptxGenJS/CustomLayout_Test.pptx';
        await pptx.writeFile({ fileName: outputPath });
        
        console.log('\n✅ PPTX generated successfully!');
        console.log('📁 File saved to:', outputPath);
        
        // Verify file was created
        const stats = fs.statSync(outputPath);
        console.log('📊 File size:', (stats.size / 1024).toFixed(2), 'KB');
        console.log('\n✓ Ready to download!');
        
        return outputPath;
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

generateTestPPT();
