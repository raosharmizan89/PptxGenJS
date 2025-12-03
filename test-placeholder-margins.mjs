#!/usr/bin/env node
/**
 * Test script to verify that margin: 0 works correctly for placeholders
 */

import pptxgen from './src/bld/pptxgen.es.js';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

console.log('\n🧪 Testing Placeholder Margin Fix...\n');

const pptx = new pptxgen();

// Define slide master with ZERO-MARGIN placeholders
pptx.defineSlideMaster({
  title: 'Zero Margin Test',
  background: { color: 'FFFFFF' },
  objects: [
    {
      placeholder: {
        options: {
          name: 'title',
          type: 'title',
          x: 0.567,
          y: 0.323,
          w: 11.063,
          h: 0.845,
          margin: 0,  // ← This should now work!
          fontSize: 40,
          bold: true
        },
        text: 'Title Placeholder'
      }
    },
    {
      placeholder: {
        options: {
          name: 'body',
          type: 'body',
          x: 0.567,
          y: 1.289,
          w: 11.064,
          h: 4.261,
          margin: 0,  // ← This should now work!
          fontSize: 18
        },
        text: 'Body Placeholder'
      }
    }
  ]
});

// Create a slide using the master
const slide = pptx.addSlide({ masterName: 'Zero Margin Test' });
slide.addText('Test Title', { placeholder: 'title' });
slide.addText('Test body content', { placeholder: 'body' });

// Save the file
const fileName = 'test-zero-margins.pptx';
await pptx.writeFile({ fileName });

console.log(`✅ Generated: ${fileName}`);

// Extract and check the XML
console.log('\n📦 Extracting PPTX to verify margins...');

const extractDir = 'test-zero-margins-extracted';

// Clean up old extraction
if (fs.existsSync(extractDir)) {
  fs.rmSync(extractDir, { recursive: true });
}

// Extract PPTX
await execPromise(`unzip -q ${fileName} -d ${extractDir}`);

// Find the slideLayout files
const layoutDir = `${extractDir}/ppt/slideLayouts`;
const layoutFiles = fs.readdirSync(layoutDir).filter(f => f.endsWith('.xml'));
console.log(`\n📄 Found ${layoutFiles.length} layout files`);

// Find the layout file that contains "Zero Margin Test"
let testLayoutFile = null;
for (const file of layoutFiles) {
  const content = fs.readFileSync(`${layoutDir}/${file}`, 'utf-8');
  if (content.includes('Zero Margin Test')) {
    testLayoutFile = file;
    break;
  }
}

if (!testLayoutFile) {
  console.log('❌ ERROR: Could not find "Zero Margin Test" layout!');
  process.exit(1);
}

console.log(`   Reading: ${testLayoutFile} (our test layout)`);
const layoutPath = `${layoutDir}/${testLayoutFile}`;
const layoutXML = fs.readFileSync(layoutPath, 'utf-8');

console.log('\n🔍 Checking for zero margins in layout XML...\n');

// Check for zero margin patterns
const zeroMarginPattern = /lIns="0"\s+tIns="0"\s+rIns="0"\s+bIns="0"/g;
const matches = layoutXML.match(zeroMarginPattern);

if (matches && matches.length > 0) {
  console.log(`✅ SUCCESS! Found ${matches.length} placeholder(s) with zero margins:`);
  console.log(`   Pattern: lIns="0" tIns="0" rIns="0" bIns="0"`);
  
  // Show a snippet
  const snippetStart = layoutXML.indexOf('lIns="0"') - 50;
  const snippetEnd = layoutXML.indexOf('lIns="0"') + 100;
  const snippet = layoutXML.substring(snippetStart, snippetEnd);
  console.log(`\n   Sample XML:`);
  console.log(`   ${snippet.replace(/\n/g, ' ').replace(/\s+/g, ' ')}`);
  
} else {
  console.log('❌ FAILED! No zero margins found in layout XML');
  
  // Check what margins were actually set
  const bodyPrPattern = /<a:bodyPr[^>]*>/g;
  const bodyPrMatches = layoutXML.match(bodyPrPattern);
  if (bodyPrMatches) {
    console.log(`\n   Found ${bodyPrMatches.length} <a:bodyPr> tags:`);
    bodyPrMatches.forEach((match, i) => {
      console.log(`   ${i + 1}. ${match}`);
    });
  }
}

console.log('\n🧹 Cleaning up...');
// fs.rmSync(extractDir, { recursive: true });
// fs.unlinkSync(fileName);

console.log('\n✨ Test complete!\n');
