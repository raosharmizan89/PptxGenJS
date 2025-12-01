#!/usr/bin/env node
/**
 * Test script to verify all 57 custom layouts work without causing repair prompts
 */

import PptxGenJS from './src/bld/pptxgen.es.js';

console.log('🧪 Testing custom slide layouts...\n');

const pptx = new PptxGenJS();
pptx.author = 'Layout Test';
pptx.company = 'Test';
pptx.title = '57 Custom Layouts Test';

// Test a subset of the layouts to verify they work
const testLayouts = [
	'Content w/Sub-headline',
	'Two Content',
	'Content 4 Columns',
	'Title Only',
	'Blank',
	'Content + Photo White',
	'Section Header',
	'Single Author'
];

console.log(`Testing ${testLayouts.length} sample layouts:\n`);

testLayouts.forEach((layoutName, idx) => {
	try {
		const slide = pptx.addSlide({ masterName: layoutName });
		
		// Add some test content
		slide.addText(`Test Slide ${idx + 1}`, {
			x: 0.5, y: 0.5, w: 9, h: 0.5,
			fontSize: 24, bold: true, color: '000000'
		});
		
		slide.addText(`Layout: "${layoutName}"`, {
			x: 0.5, y: 1.5, w: 9, h: 0.5,
			fontSize: 16, color: '666666'
		});
		
		console.log(`  ✅ ${idx + 1}. ${layoutName}`);
	} catch (error) {
		console.error(`  ❌ ${idx + 1}. ${layoutName}: ${error.message}`);
	}
});

// Add one more slide with the default layout
const defaultSlide = pptx.addSlide();
defaultSlide.addText('Default Layout Test', {
	x: 0.5, y: 0.5, w: 9, h: 0.5,
	fontSize: 24, bold: true, color: '000000'
});

console.log('\n💾 Generating PPTX file...');
await pptx.writeFile({ fileName: 'test-57-layouts.pptx' });

console.log('✨ Success! File generated: test-57-layouts.pptx');
console.log('\n📋 Next steps:');
console.log('   1. Open test-57-layouts.pptx in PowerPoint');
console.log('   2. Verify it opens WITHOUT a repair prompt');
console.log('   3. Check that all test slides display correctly');
console.log('\n   If PowerPoint asks to repair the file, there may be an issue with:');
console.log('   - Missing or incorrect relationship IDs');
console.log('   - Invalid XML structure');
console.log('   - Mismatched layout counts');
