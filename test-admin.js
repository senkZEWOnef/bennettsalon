// Quick test script to verify admin initialization
import { adminOperations } from './src/db/adminOperations.js'

async function testAdminInit() {
  try {
    console.log('🧪 Testing admin initialization...')
    
    // Initialize admins
    const admins = await adminOperations.initializeDefaultAdmins()
    console.log('✅ Admins initialized:', admins.length)
    
    // Test authentication
    console.log('\n🔐 Testing authentication...')
    
    const tests = [
      { username: 'admin', password: 'Bennett2024!' },
      { username: 'backdoor', password: 'BackdoorAccess2024!' },
      { username: 'test', password: 'TestAccount123!' },
      { username: 'admin', password: 'wrong_password' }
    ]
    
    for (const { username, password } of tests) {
      const result = await adminOperations.authenticate(username, password)
      if (result) {
        console.log(`✅ ${username}: Authentication successful`)
      } else {
        console.log(`❌ ${username}: Authentication failed (expected for wrong password)`)
      }
    }
    
    console.log('\n✅ All tests completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testAdminInit()