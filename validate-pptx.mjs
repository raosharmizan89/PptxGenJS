#!/usr/bin/env node
/**
 * Validate PPTX files for common issues that cause PowerPoint repair prompts
 * Usage: node validate-pptx.mjs [filename.pptx]
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const filename = process.argv[2] || 'comprehensive-test.pptx';
const filepath = resolve(filename);

console.log('🔍 PPTX Validation Tool\n');
console.log(`📁 File: ${filename}`);

if (!existsSync(filepath)) {
	console.error(`❌ Error: File not found: ${filepath}`);
	process.exit(1);
}

// Get file size
const sizeOutput = execSync(`ls -lh "${filepath}" | awk '{print $5}'`).toString().trim();
console.log(`📊 Size: ${sizeOutput}`);

// Test archive integrity
console.log('\n🔐 Testing ZIP archive integrity...');
try {
	execSync(`unzip -t "${filepath}" 2>&1 | tail -1`);
	console.log('   ✅ Archive is valid');
} catch (error) {
	console.error('   ❌ Archive has errors!');
	console.error(error.stdout.toString());
	process.exit(1);
}

// Count layouts
console.log('\n📑 Counting slide layouts...');
try {
	const layoutsOutput = execSync(`unzip -l "${filepath}" | grep 'ppt/slideLayouts/slideLayout[0-9]*.xml$' | wc -l`).toString().trim();
	console.log(`   Found ${layoutsOutput} layout files`);
} catch (error) {
	console.error('   ❌ Error counting layouts');
}

// Check for picture placeholders
console.log('\n🖼️  Checking for picture placeholders...');
try {
	const picturePlaceholders = execSync(`unzip -p "${filepath}" 'ppt/slideLayouts/*.xml' | grep -o 'Picture Placeholder' | wc -l`).toString().trim();
	if (parseInt(picturePlaceholders) > 0) {
		console.log(`   ⚠️  Found ${picturePlaceholders} picture placeholders`);
	} else {
		console.log('   ✅ No picture placeholders found');
	}
} catch (error) {
	console.error('   ❌ Error checking picture placeholders');
}

// Check for [Insert photo] text
console.log('\n📝 Checking for [Insert photo] text...');
try {
	const insertPhotoText = execSync(`unzip -p "${filepath}" 'ppt/slideLayouts/*.xml' | grep -o '\\[Insert photo\\]' | wc -l`).toString().trim();
	if (parseInt(insertPhotoText) > 0) {
		console.log(`   ⚠️  Found ${insertPhotoText} instances of "[Insert photo]" text`);
	} else {
		console.log('   ✅ No [Insert photo] text found');
	}
} catch (error) {
	console.error('   ❌ Error checking [Insert photo] text');
}

// Check for image references in rels
console.log('\n🔗 Checking for image references in relationships...');
try {
	const imageRels = execSync(`unzip -p "${filepath}" 'ppt/slideLayouts/_rels/*.rels' | grep -o '/image' | wc -l`).toString().trim();
	if (parseInt(imageRels) > 0) {
		console.log(`   ⚠️  Found ${imageRels} image relationship references`);
	} else {
		console.log('   ✅ No image relationship references found');
	}
} catch (error) {
	console.error('   ❌ Error checking image relationships');
}

// Check for <a:blip> elements
console.log('\n🎨 Checking for <a:blip> image elements...');
try {
	const blipElements = execSync(`unzip -p "${filepath}" 'ppt/slideLayouts/*.xml' | grep -o '<a:blip' | wc -l`).toString().trim();
	if (parseInt(blipElements) > 0) {
		console.log(`   ⚠️  Found ${blipElements} <a:blip> elements`);
	} else {
		console.log('   ✅ No <a:blip> elements found');
	}
} catch (error) {
	console.error('   ❌ Error checking <a:blip> elements');
}

// Check copyright year
console.log('\n©️  Checking copyright year...');
try {
	const copyrightYear = execSync(`unzip -p "${filepath}" 'ppt/slideLayouts/*.xml' | grep -o '© [0-9]\\{4\\}' | head -1`).toString().trim();
	const currentYear = new Date().getFullYear();
	if (copyrightYear) {
		const year = copyrightYear.match(/\d{4}/)[0];
		if (parseInt(year) === currentYear) {
			console.log(`   ✅ Copyright year is current: ${copyrightYear}`);
		} else {
			console.log(`   ⚠️  Copyright year may be outdated: ${copyrightYear} (current: ${currentYear})`);
		}
	} else {
		console.log('   ℹ️  No copyright text found');
	}
} catch (error) {
	console.error('   ❌ Error checking copyright year');
}

// Count total slides
console.log('\n📄 Counting slides...');
try {
	const slidesOutput = execSync(`unzip -l "${filepath}" | grep 'ppt/slides/slide[0-9]*.xml$' | wc -l`).toString().trim();
	console.log(`   Found ${slidesOutput} slides`);
} catch (error) {
	console.error('   ❌ Error counting slides');
}

console.log('\n' + '='.repeat(50));
console.log('✨ Validation complete!');
console.log('='.repeat(50));
console.log('\n💡 Next steps:');
console.log('   1. Open this file in PowerPoint');
console.log('   2. Check if it opens WITHOUT a repair prompt');
console.log('   3. If it still asks for repair, check the specific error message');
console.log('   4. Run this script on other PPTX files to compare\n');
