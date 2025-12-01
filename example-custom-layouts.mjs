#!/usr/bin/env node
/**
 * Example: Using Custom Slide Layouts
 * Demonstrates how to create presentations with the 57 available layouts
 */

import PptxGenJS from './src/bld/pptxgen.es.js';

console.log('📊 Creating a presentation with custom layouts...\n');

const pptx = new PptxGenJS();
pptx.author = 'Your Name';
pptx.company = 'Your Company';
pptx.title = 'Custom Layout Demo';

// Example 1: Title slide with section header
console.log('Creating slides:');

const titleSlide = pptx.addSlide({ masterName: 'Section Header' });
titleSlide.addText('Custom Layouts Demo', { 
	x: 1, y: 2.5, w: 8, h: 1,
	fontSize: 44, bold: true, color: '000000'
});
titleSlide.addText('Demonstrating 57 Available Layouts', {
	x: 1, y: 3.5, w: 8, h: 0.5,
	fontSize: 24, color: '666666'
});
console.log('  ✅ 1. Section Header');

// Example 2: Content with sub-headline
const contentSlide = pptx.addSlide({ masterName: 'Content w/Sub-headline' });
contentSlide.addText('Main Topic', {
	x: 0.5, y: 0.5, w: 9, h: 0.6,
	fontSize: 28, bold: true
});
contentSlide.addText('Supporting detail or subtitle', {
	x: 0.5, y: 1.2, w: 9, h: 0.4,
	fontSize: 18, color: '666666'
});
contentSlide.addText('• Key point one\n• Key point two\n• Key point three', {
	x: 0.5, y: 2, w: 9, h: 2,
	fontSize: 16, bullet: true
});
console.log('  ✅ 2. Content w/Sub-headline');

// Example 3: Two column layout
const twoColSlide = pptx.addSlide({ masterName: 'Two Content' });
twoColSlide.addText('Comparison Layout', {
	x: 0.5, y: 0.5, w: 9, h: 0.6,
	fontSize: 28, bold: true
});
twoColSlide.addText('Option A', {
	x: 0.5, y: 1.5, w: 4, h: 0.4,
	fontSize: 20, bold: true, color: '0066CC'
});
twoColSlide.addText('• Advantage 1\n• Advantage 2', {
	x: 0.5, y: 2, w: 4, h: 1.5,
	fontSize: 14, bullet: true
});
twoColSlide.addText('Option B', {
	x: 5.5, y: 1.5, w: 4, h: 0.4,
	fontSize: 20, bold: true, color: '0066CC'
});
twoColSlide.addText('• Advantage 1\n• Advantage 2', {
	x: 5.5, y: 2, w: 4, h: 1.5,
	fontSize: 14, bullet: true
});
console.log('  ✅ 3. Two Content');

// Example 4: Title only (for custom content)
const customSlide = pptx.addSlide({ masterName: 'Title Only' });
customSlide.addText('Data Visualization', {
	x: 0.5, y: 0.5, w: 9, h: 0.6,
	fontSize: 28, bold: true
});
// Add a chart
customSlide.addChart(pptx.ChartType.bar, [
	{
		name: 'Q1',
		labels: ['Product A', 'Product B', 'Product C'],
		values: [25, 40, 35]
	}
], {
	x: 1, y: 1.5, w: 8, h: 3.5,
	chartColors: ['0066CC', '00AA44', 'FF6633']
});
console.log('  ✅ 4. Title Only (with chart)');

// Example 5: Blank layout for fully custom content
const blankSlide = pptx.addSlide({ masterName: 'Blank' });
blankSlide.addText('Fully Custom Layout', {
	x: 0.5, y: 2, w: 9, h: 1,
	fontSize: 36, bold: true, align: 'center', color: '0066CC'
});
blankSlide.addText('Use this layout for complete creative freedom', {
	x: 0.5, y: 3, w: 9, h: 0.5,
	fontSize: 18, align: 'center', color: '666666'
});
console.log('  ✅ 5. Blank');

// Example 6: Using author layout
const authorSlide = pptx.addSlide({ masterName: 'Single Author' });
authorSlide.addText('Prepared by:', {
	x: 1, y: 2, w: 8, h: 0.5,
	fontSize: 24, color: '666666'
});
authorSlide.addText('Your Name\nTitle\nEmail@company.com', {
	x: 1, y: 2.7, w: 8, h: 1.5,
	fontSize: 20, color: '000000'
});
console.log('  ✅ 6. Single Author\n');

// Generate the file
console.log('💾 Generating PPTX...');
await pptx.writeFile({ fileName: 'custom-layout-example.pptx' });

console.log('✨ Success! File created: custom-layout-example.pptx\n');
console.log('📝 This example demonstrates:');
console.log('   • Section Header layout for title slides');
console.log('   • Content w/Sub-headline for standard content');
console.log('   • Two Content for comparisons');
console.log('   • Title Only for charts and visualizations');
console.log('   • Blank for full customization');
console.log('   • Single Author for attribution\n');
console.log('💡 All 57 layouts are available - see CUSTOM_LAYOUTS_IMPLEMENTATION.md for the full list\n');
