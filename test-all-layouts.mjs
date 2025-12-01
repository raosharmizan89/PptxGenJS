#!/usr/bin/env node
/**
 * Comprehensive test of all 57 slide layouts
 * Tests that every layout can be used and generates slides correctly
 */

import PptxGenJS from './src/bld/pptxgen.es.js';

console.log('🧪 Comprehensive Test: All 57 Custom Slide Layouts\n');
console.log('================================================\n');

const pptx = new PptxGenJS();
pptx.author = 'Comprehensive Layout Test';
pptx.company = 'PptxGenJS';
pptx.title = 'All 57 Custom Layouts';

// All 56 custom layout names from the registry
const allLayoutNames = [
	'Content w/Sub-headline',
	'Content w 2 Line Title and Sub-headline',
	'Two Content',
	'Two Content + Subtitles ',
	'Content 4 Columns',
	'Content 5 Columns',
	'Content with Sidebar',
	'Title Only',
	'Blank',
	'Content + Image/Icon',
	'Content + Photo White',
	'Content + Photo Black',
	'Content + Photo Blue',
	'~        ',
	'Icons 3 Columns Vertical',
	'Icons 3 Columns Horizontal',
	'Icons 4 Columns + Content',
	'Icons 4 Columns + Content Black',
	'Icons 4 Columns + Content Blue',
	'Icons 2 x 3 Columns',
	'~     ',
	'Content + Chart/Table 1',
	'Chart - Horizontal 2',
	'Chart + Statement 2',
	'Chart + Statement 3',
	'~   ',
	'Statement Photo',
	'Statement Black',
	'Statement White',
	'~',
	'Section Header',
	'Divider 4 Photo',
	'Divider 1',
	'Divider 2',
	'~  ',
	'Two Placeholders',
	'Three Placeholders 1',
	'Three Placeholders 2',
	'Three Placeholders 3',
	'Four Placeholders',
	'~ ',
	'Title Image Bottom',
	'Title White - reports and presentations (hIHS)',
	'~         ',
	'Divider Photo 2',
	'Agenda - presentations',
	'TOC - reports',
	'~          ',
	'Single Author',
	'2 Authors',
	'3 Authors',
	'4 Authors',
	'~           ',
	'Energy',
	'Companies & Transactions',
	'~    '
];

console.log(`Testing all ${allLayoutNames.length} custom layouts:\n`);

let successCount = 0;
let failCount = 0;
const failures = [];

allLayoutNames.forEach((layoutName, idx) => {
	try {
		const slide = pptx.addSlide({ masterName: layoutName });
		
		// Add test content to verify the slide is created
		slide.addText(`Layout ${idx + 1}: ${layoutName}`, {
			x: 0.5, y: 0.3, w: 9, h: 0.4,
			fontSize: 14, bold: true, color: '000000'
		});
		
		slide.addText(`Successfully generated using masterName parameter`, {
			x: 0.5, y: 0.8, w: 9, h: 0.3,
			fontSize: 11, color: '666666'
		});
		
		console.log(`  ✅ ${String(idx + 1).padStart(2, ' ')}. ${layoutName}`);
		successCount++;
	} catch (error) {
		console.error(`  ❌ ${String(idx + 1).padStart(2, ' ')}. ${layoutName}: ${error.message}`);
		failures.push({ idx: idx + 1, name: layoutName, error: error.message });
		failCount++;
	}
});

// Add one slide with default layout
console.log('\n  Adding default layout slide...');
const defaultSlide = pptx.addSlide();
defaultSlide.addText('Default Layout (57th slide)', {
	x: 0.5, y: 2, w: 9, h: 0.5,
	fontSize: 24, bold: true, color: '000000'
});
console.log('  ✅ Default layout added\n');

console.log('================================================\n');
console.log('📊 Test Results:');
console.log(`   ✅ Success: ${successCount}/${allLayoutNames.length} layouts`);
console.log(`   ❌ Failed:  ${failCount}/${allLayoutNames.length} layouts\n`);

if (failures.length > 0) {
	console.log('❌ Failed Layouts:');
	failures.forEach(f => {
		console.log(`   ${f.idx}. ${f.name}`);
		console.log(`      Error: ${f.error}`);
	});
	console.log('');
}

console.log('💾 Generating PPTX file: comprehensive-test.pptx');
await pptx.writeFile({ fileName: 'comprehensive-test.pptx' });

console.log('\n✨ File generated successfully!');
console.log('\n📋 Validation Checklist:');
console.log('   □ Open comprehensive-test.pptx in PowerPoint');
console.log('   □ Verify it opens WITHOUT any repair prompt');
console.log(`   □ Verify the file contains ${allLayoutNames.length + 1} slides`);
console.log('   □ Browse through slides to check different layouts render correctly');
console.log('   □ Check that no company logos or images are visible');
console.log('\n   ⚠️  Critical: If PowerPoint asks to repair, check for:');
console.log('      - XML validation errors in layout files');
console.log('      - Broken relationship references');
console.log('      - Missing required XML elements\n');

if (successCount === allLayoutNames.length) {
	console.log('🎉 SUCCESS! All 57 layouts (56 custom + 1 default) work correctly!\n');
	process.exit(0);
} else {
	console.log(`⚠️  WARNING: ${failCount} layout(s) failed. Check errors above.\n`);
	process.exit(1);
}
