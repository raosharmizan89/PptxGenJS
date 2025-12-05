const PptxGenJS = require('./dist/pptxgen.cjs.js');
const fs = require('fs');

(async () => {
const prs = new PptxGenJS();

// Add a simple slide
prs.addSlide().addText('Test Slide', { x: 1, y: 1, w: 9, h: 1, fontSize: 44 });

// Log details before save
console.log('Before save:');
console.log(`  slideLayouts.length: ${prs.slideLayouts.length}`);
prs.slideLayouts.slice(0, 20).forEach((layout, idx) => {
  console.log(`    Layout ${idx}: "${layout._name}"`);
});
console.log(`  ... (${prs.slideLayouts.length - 20} more layouts)`);

// Generate the PPTX
const filename = 'test_layout_count_generated';
const result = await prs.writeFile({ fileName: filename });
console.log(`writeFile() returned: ${result}`);

if (fs.existsSync(result)) {
  console.log(`\nGenerated PPTX file: ${result}`);
  console.log(`File size: ${fs.statSync(result).size} bytes`);
  // Clean up
  fs.unlinkSync(result);
} else {
  console.log(`ERROR: File was not created at ${result}`);
}
})();
