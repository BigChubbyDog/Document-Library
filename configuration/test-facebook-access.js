#!/usr/bin/env node

/**
 * Facebook Access Test
 * Quick test to see what Facebook access we currently have
 */

const { execSync } = require('child_process');

async function testCurrentFacebookAccess() {
    console.log('🔍 TESTING CURRENT FACEBOOK ACCESS');
    console.log('=' .repeat(45));
    
    try {
        // Get current token from Key Vault
        console.log('📋 Getting current token from Azure Key Vault...');
        const token = execSync('az keyvault secret show --vault-name mortgage-leads-kv-2025 --name facebook-access-token --query "value" -o tsv', 
            { encoding: 'utf8' }).trim();
        
        console.log(`✅ Token retrieved (${token.length} characters)`);
        
        // Test 1: Basic user info
        console.log('\n🧪 Test 1: Basic User Access...');
        const userResponse = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${token}`);
        const userData = await userResponse.json();
        
        if (userData.error) {
            console.log(`❌ User access failed: ${userData.error.message}`);
        } else {
            console.log(`✅ User: ${userData.name} (ID: ${userData.id})`);
        }
        
        // Test 2: Check what pages we can see
        console.log('\n🧪 Test 2: Page Access...');
        const pagesResponse = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${token}`);
        const pagesData = await pagesResponse.json();
        
        if (pagesData.error) {
            console.log(`❌ Pages access failed: ${pagesData.error.message}`);
            console.log('💡 This suggests we need different permissions');
        } else if (pagesData.data && pagesData.data.length > 0) {
            console.log(`✅ Found ${pagesData.data.length} page(s):`);
            pagesData.data.forEach(page => {
                console.log(`   📄 ${page.name} (ID: ${page.id})`);
                if (page.id === '102409121765907') {
                    console.log('   🎯 Found "Mortgage Loans Co" page!');
                    console.log(`   🔑 Page token available: ${page.access_token ? 'Yes' : 'No'}`);
                }
            });
        } else {
            console.log('❌ No pages found - you may not be an admin of any pages');
        }
        
        // Test 3: Check current permissions
        console.log('\n🧪 Test 3: Current Permissions...');
        const permResponse = await fetch(`https://graph.facebook.com/v21.0/me/permissions?access_token=${token}`);
        const permData = await permResponse.json();
        
        if (permData.error) {
            console.log(`❌ Permission check failed: ${permData.error.message}`);
        } else {
            const grantedPerms = permData.data.filter(p => p.status === 'granted').map(p => p.permission);
            console.log(`✅ Current permissions (${grantedPerms.length}):`);
            grantedPerms.forEach(perm => {
                console.log(`   ✔️  ${perm}`);
            });
            
            // Check if we have the key permissions we need
            const neededPerms = ['manage_pages', 'pages_show_list', 'pages_manage_ads'];
            const missingPerms = neededPerms.filter(p => !grantedPerms.includes(p));
            
            if (missingPerms.length > 0) {
                console.log(`\n⚠️  Missing key permissions: ${missingPerms.join(', ')}`);
            }
        }
        
        console.log('\n📊 DIAGNOSIS:');
        
        if (userData.error) {
            console.log('🔴 CRITICAL: Basic token authentication failed');
            console.log('💡 Solution: Get a new token from Facebook Graph API Explorer');
        } else if (pagesData.error || !pagesData.data || pagesData.data.length === 0) {
            console.log('🟡 ISSUE: No page access detected');
            console.log('💡 Solutions:');
            console.log('   1. Use Facebook Business Manager (most reliable)');
            console.log('   2. Get User Token with "manage_pages" permission');
            console.log('   3. Ensure you\'re an admin of "Mortgage Loans Co" page');
        } else {
            const mortgagePage = pagesData.data.find(p => p.id === '102409121765907');
            if (mortgagePage) {
                console.log('🟢 GOOD: You have access to "Mortgage Loans Co" page!');
                if (mortgagePage.access_token) {
                    console.log('✅ Page token available - we can use this!');
                    console.log('\n🔑 SOLUTION: Update Key Vault with page token:');
                    console.log(`az keyvault secret set --vault-name mortgage-leads-kv-2025 --name facebook-access-token --value "${mortgagePage.access_token}"`);
                } else {
                    console.log('⚠️  Page token not included - need more permissions');
                }
            } else {
                console.log('🟡 "Mortgage Loans Co" page not found in accessible pages');
                console.log('💡 Check if you\'re an admin of this specific page');
            }
        }
        
    } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
    }
}

// Execute test
if (require.main === module) {
    testCurrentFacebookAccess()
        .then(() => {
            console.log('\n🎯 NEXT STEPS BASED ON RESULTS:');
            console.log('1. If you saw page access: Great! Use the page token');
            console.log('2. If no page access: Try Facebook Business Manager');
            console.log('3. If token failed: Get new token from Graph API Explorer');
            console.log('4. If all else fails: Deploy without Facebook for now');
            
            console.log('\n💡 Business Manager is open in your browser - try Method 1!');
        })
        .catch(error => {
            console.error('❌ Test error:', error);
        });
}

module.exports = { testCurrentFacebookAccess };
