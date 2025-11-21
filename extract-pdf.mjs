import fs from 'fs'
import pdfParse from 'pdf-parse'

const pdfPath = 'c:\\Users\\Oranolio\\Desktop\\MetzlerCares\\Website Audit and Improvement Plan.pdf'
const outputPath = 'c:\\Users\\Oranolio\\Desktop\\MetzlerCares\\website_improvement_plan.txt'

console.log('Starting PDF extraction...')
console.log('PDF exists:', fs.existsSync(pdfPath))

if (fs.existsSync(pdfPath)) {
  console.log('PDF size:', fs.statSync(pdfPath).size, 'bytes')

  const dataBuffer = fs.readFileSync(pdfPath)

  try {
    const data = await pdfParse(dataBuffer)
    console.log('PDF parsing successful')
    console.log('Pages:', data.numpages)
    console.log('Text length:', data.text.length)

    // Write to file
    fs.writeFileSync(outputPath, data.text, 'utf8')
    console.log('Text saved to:', outputPath)

    // Show first 2000 characters
    console.log('\nFirst 2000 characters:')
    console.log(data.text.substring(0, 2000))
  } catch (error) {
    console.error('Error parsing PDF:', error)
  }
} else {
  console.error('PDF file not found at:', pdfPath)
}
