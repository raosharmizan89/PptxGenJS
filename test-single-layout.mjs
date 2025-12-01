#!/usr/bin/env node
/**
 * Minimal test: Generate PPTX with just ONE custom layout
 */

import pptxgen from './src/bld/pptxgen.es.js'

console.log('🧪 Minimal Test: Single Custom Layout\n')
console.log('================================================\n')

const pptx = new pptxgen()

// Add one slide using the first custom layout
const slide = pptx.addSlide({ masterName: 'Content w/Sub-headline' })
slide.addText('[Test Headline]', { x: 1, y: 1, w: 8, h: 1, fontSize: 24 })
slide.addText('[Test content for validation]', { x: 1, y: 2.5, w: 8, h: 2, fontSize: 14 })

console.log('✅ Added 1 slide with custom layout\n')

const fileName = 'single-layout-test.pptx'
await pptx.writeFile({ fileName })

console.log(`\n💾 File generated: ${fileName}`)
console.log('\n📋 Validation Steps:')
console.log('   1. Open this file in PowerPoint 2510')
console.log('   2. Check if repair prompt appears')
console.log('   3. If no prompt → issue is cumulative (multiple layouts)')
console.log('   4. If prompt appears → issue is with layout structure itself\n')
console.log('🎉 Test complete!')
