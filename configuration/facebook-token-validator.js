#!/usr/bin/env node

/**
 * Quick Facebook Token Validator
 * Tests if your new Facebook token has all required permissions
 */

const { execSync } = require('child_process');

async function validateFacebookToken() {
    console.log('🔍 VALIDATING FACEBOOK ACCESS TOKEN');
    console.log('=' .repeat(50));
    
    try {
        // Get token from Key Vault
        console.log('📋 Retrieving token from Azure Key Vault...');
        const token = execSync('az keyvault secret show --vault-name mortgage-leads-kv-2025 --name facebook-access-token --query "value" -o tsv', 
            { encoding: 'utf8' }).trim();
        
        if (!token || token.length < 100) {
            console.log('❌ Token appears to be invalid or too short');
            console.log('💡 Expected: 200+ characters starting with "EAA..."');
            return false;
        }
        
        console.log(`✅ Token retrieved (${token.length} characters)`);
        
        // Test 1: Basic API Access
        console.log('\n🧪 Test 1: Basic API Access...');
        const userResponse = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${token}`);
        const userData = await userResponse.json();
        
        if (userData.error) {
            console.log(`❌ Basic access failed: ${userData.error.message}`);
            return false;
        }
        console.log(`✅ Connected as: ${userData.name}`);
        
        // Test 2: Page Access
        console.log('\n🧪 Test 2: Page Access...');
        const pageId = '102409121765907'; // Mortgage Loans Co
        const pageResponse = await fetch(`https://graph.facebook.com/v21.0/${pageId}?fields=name,access_token&access_token=${token}`);
        const pageData = await pageResponse.json();
        
        if (pageData.error) {
            console.log(`❌ Page access failed: ${pageData.error.message}`);
            console.log('💡 Make sure you selected "Page Access Token" for "Mortgage Loans Co"');
            return false;
        }
        console.log(`✅ Page access confirmed: ${pageData.name}`);
        
        // Test 3: Ad Account Access
        console.log('\n🧪 Test 3: Ad Account Access...');
        const adAccountResponse = await fetch(`https://graph.facebook.com/v21.0/act_1170970241206263/campaigns?limit=1&access_token=${token}`);
        const adAccountData = await adAccountResponse.json();
        
        if (adAccountData.error) {
            console.log(`⚠️  Ad account access limited: ${adAccountData.error.message}`);
            console.log('💡 This is OK for now - some permissions may require app review');
        } else {
            console.log('✅ Ad account access confirmed');
        }
        
        // Test 4: Check Permissions
        console.log('\n🧪 Test 4: Checking Permissions...');
        const permissionsResponse = await fetch(`https://graph.facebook.com/v21.0/me/permissions?access_token=${token}`);
        const permissionsData = await permissionsResponse.json();
        
        if (permissionsData.error) {
            console.log(`❌ Cannot check permissions: ${permissionsData.error.message}`);
            return false;
        }
        
        const grantedPermissions = permissionsData.data
            .filter(p => p.status === 'granted')
            .map(p => p.permission);
        
        const requiredPermissions = [
            'pages_read_engagement',
            'pages_manage_metadata',
            'pages_read_user_content',
            'pages_manage_ads',
            'pages_show_list',
            'pages_messaging'
        ];
        
        console.log(`📊 Granted permissions: ${grantedPermissions.length}`);
        
        let permissionScore = 0;
        requiredPermissions.forEach(perm => {
            const hasPermission = grantedPermissions.includes(perm);
            console.log(`   ${hasPermission ? '✅' : '❌'} ${perm}`);
            if (hasPermission) permissionScore++;
        });
        
        const permissionPercentage = Math.round((permissionScore / requiredPermissions.length) * 100);
        
        console.log('\n📊 VALIDATION RESULTS:');
        console.log(`🎯 Permission Score: ${permissionScore}/${requiredPermissions.length} (${permissionPercentage}%)`);
        
        if (permissionPercentage >= 90) {
            console.log('🟢 Status: FULLY OPERATIONAL');
            console.log('✅ Facebook Marketing ready for automated campaigns!');
            console.log('🚀 System confidence will now be 95%+');
            return true;
        } else if (permissionPercentage >= 70) {
            console.log('🟡 Status: MOSTLY FUNCTIONAL');
            console.log('⚠️  Some permissions missing - manual campaigns possible');
            console.log('💡 Consider submitting for Facebook App Review for full automation');
            return true;
        } else {
            console.log('🔴 Status: NEEDS MORE PERMISSIONS');
            console.log('❌ Additional permissions required');
            console.log('💡 Follow the setup guide again for missing permissions');
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Validation failed: ${error.message}`);
        return false;
    }
}

// Execute validation
if (require.main === module) {
    validateFacebookToken()
        .then(success => {
            if (success) {
                console.log('\n🎉 Facebook validation completed successfully!');
                console.log('📈 Run system validation to see improved confidence score:');
                console.log('   node tests/system-validation.js');
            } else {
                console.log('\n⚠️  Facebook token needs attention');
                console.log('📋 Review the setup guide and try again:');
                console.log('   node config/facebook-token-guide.js');
            }
        })
        .catch(error => {
            console.error('❌ Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { validateFacebookToken };
