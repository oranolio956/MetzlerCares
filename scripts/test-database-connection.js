// Test database connection and verify schema
import { createClient } from '@supabase/supabase-js'

// Configuration - LIVE VALUES
const supabaseUrl = 'https://tmbuvfmgjpfppqgeabho.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYnV2Zm1nanBmcHBxZ2VhYmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njg2MjQsImV4cCI6MjA3ODQ0NDYyNH0.SUfAH1UNVwOA916bD7FbUvzX9n7clrnEPd4fB_7lPj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabaseConnection() {
  console.log('🔍 Testing Metzler Cares Database Connection')
  console.log('==========================================\n')

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })

    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message)
      return false
    }
    console.log('✅ Connection successful')

    // Test 2: Check required tables exist
    console.log('\n2. Checking database tables...')
    const requiredTables = [
      'profiles',
      'beneficiaries',
      'applications',
      'sober_living_partners',
      'scholarship_payments',
      'beneficiary_outcomes',
      'consents',
      'impact_stories',
      'local_resources',
      'audit_log'
    ]

    let tablesFound = 0
    for (const table of requiredTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (!error) {
          console.log(`✅ ${table} - Found`)
          tablesFound++
        } else {
          console.log(`❌ ${table} - Error: ${error.message}`)
        }
      } catch (err) {
        console.log(`❌ ${table} - Not found`)
      }
    }

    console.log(`\n📊 Tables check: ${tablesFound}/${requiredTables.length} found`)

    // Test 3: Check RLS policies
    console.log('\n3. Testing Row Level Security...')
    // This is a basic test - in production, test with actual user sessions
    console.log('⚠️  RLS testing requires authenticated user context')
    console.log('   Manual testing needed in application')

    // Test 4: Check sample data
    console.log('\n4. Checking sample data...')
    const tablesToCheck = ['beneficiaries', 'applications', 'sober_living_partners']

    for (const table of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (!error) {
          console.log(`📋 ${table}: ${count || 0} records`)
        }
      } catch (err) {
        console.log(`❌ ${table}: Error checking records`)
      }
    }

    // Summary
    console.log('\n🎯 CONNECTION TEST SUMMARY')
    console.log('==========================')
    console.log('✅ Database connection: SUCCESS')
    console.log(`📊 Tables found: ${tablesFound}/${requiredTables.length}`)
    console.log('🔒 RLS: Manual verification needed')
    console.log('📋 Sample data: Checked')

    if (tablesFound === requiredTables.length) {
      console.log('\n🎉 DATABASE IS READY FOR PRODUCTION!')
      return true
    } else {
      console.log('\n⚠️  Some tables missing. Run supabase-schema.sql')
      return false
    }

  } catch (error) {
    console.error('\n❌ Database test failed:', error.message)
    return false
  }
}

// Instructions
console.log('📋 SETUP INSTRUCTIONS:')
console.log('======================')
console.log('1. Go to: https://supabase.com/dashboard')
console.log('2. Select project: tmbuvfmgjpfppqgeabho')
console.log('3. Go to Settings → API')
console.log('4. Copy "anon public" key')
console.log('5. Replace YOUR_ANON_KEY_HERE in this file')
console.log('6. Run: node scripts/test-database-connection.js')
console.log('7. If tables missing, run supabase-schema.sql in SQL Editor')
console.log('')

// Run the test
testDatabaseConnection().then(success => {
  if (success) {
    console.log('\n🚀 Ready to deploy!')
  } else {
    console.log('\n⚠️  Issues found - please resolve before deploying')
  }
  process.exit(success ? 0 : 1)
})
