/**
 * Database Connection Test Script
 * Run with: node test-db-connection.js
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Database Connection...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

// Test 1: Basic connection with anon key
async function testAnonConnection() {
  console.log('Test 1: Testing connection with anon key...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection by checking auth
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✓ Connection successful with anon key');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Test 2: Check if we can access auth
async function testAuthConnection() {
  console.log('\nTest 2: Testing auth connection...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // This will fail if auth is not properly configured
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Auth connection failed:', error.message);
      return false;
    }
    
    console.log('✓ Auth connection successful');
    return true;
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    return false;
  }
}

// Test 3: Test service role connection (if available)
async function testServiceRoleConnection() {
  if (!serviceRoleKey) {
    console.log('\nTest 3: Skipping service role test (no key provided)');
    return true;
  }
  
  console.log('\nTest 3: Testing service role connection...');
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Test basic admin operations
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Service role connection failed:', error.message);
      return false;
    }
    
    console.log('✓ Service role connection successful');
    console.log(`  - Total users: ${data.users.length}`);
    return true;
  } catch (error) {
    console.error('❌ Service role error:', error.message);
    return false;
  }
}

// Test 4: Check expected tables
async function testDatabaseSchema() {
  console.log('\nTest 4: Checking database schema...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const expectedTables = ['users'];
    const results = [];
    
    for (const table of expectedTables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        
        if (error && error.code === 'PGRST116') {
          console.log(`  ✗ Table '${table}' not found`);
          results.push(false);
        } else if (error) {
          console.log(`  ⚠ Table '${table}' error: ${error.message}`);
          results.push(false);
        } else {
          console.log(`  ✓ Table '${table}' exists`);
          results.push(true);
        }
      } catch (error) {
        console.log(`  ✗ Table '${table}' error: ${error.message}`);
        results.push(false);
      }
    }
    
    return results.every(r => r);
  } catch (error) {
    console.error('❌ Schema check error:', error.message);
    return false;
  }
}

// Test 5: Test GitHub OAuth configuration
async function testOAuthConfiguration() {
  console.log('\nTest 5: Checking OAuth configuration...');
  
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
  
  if (githubClientId && githubClientSecret) {
    console.log('⚠ GitHub OAuth credentials found in .env.local');
    console.log('  These should be configured in Supabase Dashboard, not in your app');
    console.log('  Supabase Dashboard → Authentication → Providers → GitHub');
    return false;
  } else {
    console.log('✓ GitHub OAuth credentials not in .env.local (correct)');
    return true;
  }
}

// Run all tests
async function runTests() {
  console.log('Environment Configuration:');
  console.log(`  Supabase URL: ${supabaseUrl}`);
  console.log(`  Site URL: ${process.env.NEXT_PUBLIC_SITE_URL}`);
  console.log('');

  const results = {
    anonConnection: await testAnonConnection(),
    authConnection: await testAuthConnection(),
    serviceRoleConnection: await testServiceRoleConnection(),
    databaseSchema: await testDatabaseSchema(),
    oauthConfiguration: await testOAuthConfiguration(),
  };

  console.log('\n' + '='.repeat(50));
  console.log('Test Results Summary:');
  console.log('='.repeat(50));
  
  const allPassed = Object.values(results).every(r => r);
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${test}`);
  });

  console.log('='.repeat(50));
  
  if (!results.databaseSchema) {
    console.log('\n📋 To fix database schema issues:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Run the SQL commands from setup-database-schema.sql');
    console.log('3. This will create the required tables and security policies');
  }
  
  if (!results.oauthConfiguration) {
    console.log('\n🔧 To fix OAuth configuration:');
    console.log('1. Remove GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET from .env.local');
    console.log('2. Go to Supabase Dashboard → Authentication → Providers → GitHub');
    console.log('3. Enable GitHub provider and add your GitHub OAuth credentials there');
    console.log('4. Set the redirect URL to: http://localhost:3000/auth/callback');
  }
  
  if (allPassed) {
    console.log('✓ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed. Please review the issues above.');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});