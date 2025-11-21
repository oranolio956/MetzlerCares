import { createClient } from '@sanity/client'
import fs from 'fs'

// Initialize Sanity client
const client = createClient({
  projectId: 'your-project-id', // You'll need to replace this
  dataset: 'production',
  useCdn: false,
  token: 'your-token', // You'll need to add your Sanity auth token
  apiVersion: '2024-01-01'
})

// Read all the data files
const treatmentFacilities = JSON.parse(fs.readFileSync('colorado-facilities-data.json', 'utf8'))
const soberLivingHomes = JSON.parse(fs.readFileSync('colorado-sober-living-data.json', 'utf8'))
const aaMeetings = JSON.parse(fs.readFileSync('colorado-aa-meetings-data.json', 'utf8'))

const allFacilities = [...treatmentFacilities, ...soberLivingHomes, ...aaMeetings]

async function importFacilities() {
  console.log(`Importing ${allFacilities.length} total facilities...`)
  console.log(`- Treatment facilities: ${treatmentFacilities.length}`)
  console.log(`- Sober living homes: ${soberLivingHomes.length}`)
  console.log(`- AA meetings: ${aaMeetings.length}`)

  // Import in batches to avoid rate limits
  const batchSize = 50
  let imported = 0

  for (let i = 0; i < allFacilities.length; i += batchSize) {
    const batch = allFacilities.slice(i, i + batchSize)
    const transaction = client.transaction()

    for (const facility of batch) {
      transaction.create(facility)
    }

    try {
      const result = await transaction.commit()
      imported += batch.length
      console.log(
        `Imported batch ${Math.floor(i / batchSize) + 1}: ${batch.length} facilities (${imported}/${
          allFacilities.length
        })`
      )
    } catch (error) {
      console.error(`Error importing batch ${Math.floor(i / batchSize) + 1}:`, error)
      // Continue with next batch instead of stopping
    }

    // Small delay between batches
    if (i + batchSize < allFacilities.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  console.log('Import completed!')
}

importFacilities()
