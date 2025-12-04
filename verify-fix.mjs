#!/usr/bin/env node
/**
 * Verification script to test dynamic layout selection
 * This tests the core functionality without needing a browser
 */

import PptxGenJS from './src/bld/pptxgen.js';

console.log('✓ Loaded PptxGenJS');

const pres = new PptxGenJS();

// Define some test layouts
pres.defineSlideMaster({
    title: "Layout A",
    background: { color: "FFFFFF" },
    objects: []
});

pres.defineSlideMaster({
    title: "Layout B",
    background: { color: "F0F0F0" },
    objects: []
});

pres.defineSlideMaster({
    title: "Layout C",
    background: { color: "E0E0E0" },
    objects: []
});

console.log('✓ Defined 3 test layouts');
console.log('Available layouts:', pres.slideLayouts.map(l => l._name));

// Test 1: Create slides with different layouts
console.log('\n=== Test 1: Creating slides with different layouts ===');

const slide1 = pres.addSlide({ masterName: "Layout A" });
console.log('Slide 1 - masterName: "Layout A"');
console.log('  → slide._slideLayout exists:', !!slide1._slideLayout);
console.log('  → slide._slideLayout._name:', slide1._slideLayout?._name);

const slide2 = pres.addSlide({ masterName: "Layout B" });
console.log('Slide 2 - masterName: "Layout B"');
console.log('  → slide._slideLayout exists:', !!slide2._slideLayout);
console.log('  → slide._slideLayout._name:', slide2._slideLayout?._name);

const slide3 = pres.addSlide({ masterName: "Layout C" });
console.log('Slide 3 - masterName: "Layout C"');
console.log('  → slide._slideLayout exists:', !!slide3._slideLayout);
console.log('  → slide._slideLayout._name:', slide3._slideLayout?._name);

// Test 2: Verify the internal getLayoutIdxForSlide would work
console.log('\n=== Test 2: Verifying layout index resolution ===');

function getLayoutIdxForSlide(slides, slideLayouts, slideNumber) {
	const slide = slides[slideNumber - 1];
	if (!slide) return 1;
	const layoutName = slide._slideLayout?._name;
	if (!layoutName) return 1;
	const idx = slideLayouts.findIndex(l => l._name === layoutName);
	return idx >= 0 ? idx + 1 : 1;
}

const slides = [slide1, slide2, slide3];
for (let i = 1; i <= slides.length; i++) {
    const idx = getLayoutIdxForSlide(pres.slides, pres.slideLayouts, i);
    const expectedLayout = slides[i-1]._slideLayout?._name;
    const actualLayout = pres.slideLayouts[idx - 1]?._name;
    console.log(`Slide ${i}: Expected="${expectedLayout}", Resolved to layout index ${idx} = "${actualLayout}"`);
    
    if (expectedLayout === actualLayout) {
        console.log(`  ✓ PASS`);
    } else {
        console.log(`  ✗ FAIL`);
    }
}

console.log('\n✓ All verification tests completed!');
