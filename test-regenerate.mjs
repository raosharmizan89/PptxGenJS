import PptxGenJS from './dist/pptxgen.cjs.js'
import fs from 'fs'

// Create a new presentation
const pres = new PptxGenJS()

// Set some basic properties
pres.defineLayout({ name: 'LAYOUT_16x9', width: 13.333, height: 7.5 })
pres.layout = 'LAYOUT_16x9'

// Add one slide for each layout
console.log(`Total layouts available: ${pres.slideLayouts.length}`)

pres.slideLayouts.forEach((layout, idx) => {
  const slide = pres.addSlide()
  slide.layout = layout._name
  slide.addText(`Slide ${idx + 1}: ${layout._name}`, {
    x: 0.5,
    y: 0.5,
    w: 12,
    h: 1,
    fontSize: 18,
    bold: true,
  })
})

// Save the presentation
const filename = 'test_all_layouts_DIRECT.pptx'
pres.writeFile({ fileName: filename })

console.log(`✅ Created ${filename} with ${pres.slides.length} slides`)

// Extract and verify
import { exec } from 'child_process'
exec(`unzip -q ${filename} -d extracted_direct_new && ls extracted_direct_new/ppt/slideLayouts/ | wc -l`, (err, stdout) => {
  if (err) {
    console.log('Could not extract for verification')
  } else {
    const count = parseInt(stdout.trim())
    console.log(`✅ Extracted file contains ${count} slide layout files`)
  }
})
