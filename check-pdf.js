import fs from 'fs'

const pdfPath = 'c:\\Users\\Oranolio\\Desktop\\MetzlerCares\\Website Audit and Improvement Plan.pdf'

console.log('Checking PDF file...')
console.log('PDF exists:', fs.existsSync(pdfPath))

if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath)
  console.log('PDF size:', stats.size, 'bytes')
  console.log('PDF modified:', stats.mtime)

  // Read first few bytes to check if it's a valid PDF
  const buffer = fs.readFileSync(pdfPath, { encoding: null, start: 0, end: 100 })
  console.log('First 100 bytes (hex):', buffer.toString('hex'))
  console.log('First 100 bytes (ascii):', buffer.toString('ascii').replace(/[^\x20-\x7E]/g, '.'))

  // Try to find text content by searching for common PDF patterns
  const fullBuffer = fs.readFileSync(pdfPath)
  const content = fullBuffer.toString('ascii')

  // Look for text patterns
  const textMatches = content.match(/\(([^)]+)\)/g)
  if (textMatches) {
    console.log('\nFound potential text content:')
    textMatches.slice(0, 20).forEach(match => console.log(match))
  }
} else {
  console.error('PDF file not found at:', pdfPath)
}
