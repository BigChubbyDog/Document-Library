#!/usr/bin/env node

/**
 * Facebook Token Verification Suite
 * Comprehensive verification of Facebook token storage and functionality
 */

const { execSync } = require('child_process');

async function verifyFacebookTokenStorage() {
    console.log('🔍 FACEBOOK TOKEN VERIFICATION SUITE');
    console.log('=' .repeat(50));
    
    const verificationResults = {
        keyVaultStorage: false,
        tokenFormat: false,
        basicAccess: false,
        pageAccess: false,
        adAccountAccess: false,
        permissions: [],
        overallScore: 0
    };
    
    try {
        // 1. Check Azure Key Vault Storage
        console.log('\n📋 Step 1: Verifying Azure Key Vault Storage...');
        const token = execSync('az keyvault secret show --vault-name mortgage-leads-kv-2025 --name facebook-access-token --query "value" -o tsv', 
            { encoding: 'utf8' }).trim();
        
        if (token && token.length > 100) {
            console.log(`✅ Token found in Key Vault (${token.length} characters)`);
            verificationResults.keyVaultStorage = true;
            
            // Check token format
            if (token.startsWith('EAA')) {
                console.log('✅ Token format is correct (starts with "EAA")');
                verificationResults.tokenFormat = true;
            } else {
                console.log('⚠️  Token format unusual (doesn\'t start with "EAA")');
            }
        } else {
            console.log('❌ Token not found or too short in Key Vault');
            return verificationResults;
        }
        
        // 2. Test Basic API Access
        console.log('\n📋 Step 2: Testing Basic Facebook API Access...');
        try {
            const userResponse = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${token}`);
            const userData = await userResponse.json();
            
            if (userData.error) {
                console.log(`❌ Basic access failed: ${userData.error.message}`);
            } else {
                console.log(`✅ Basic access successful - Connected as: ${userData.name}`);
                verificationResults.basicAccess = true;
            }
        } catch (error) {
            console.log(`❌ Basic access test failed: ${error.message}`);
        }
        
        // 3. Test Page Access
        console.log('\n📋 Step 3: Testing Page Access...');
        try {
            const pageResponse = await fetch(`https://graph.facebook.com/v21.0/102409121765907?fields=name,access_token&access_token=${token}`);
            const pageData = await pageResponse.json();
            
            if (pageData.error) {
                console.log(`❌ Page access failed: ${pageData.error.message}`);
            } else {
                console.log(`✅ Page access successful - ${pageData.name}`);
                verificationResults.pageAccess = true;
            }
        } catch (error) {
            console.log(`❌ Page access test failed: ${error.message}`);
        }
        
        // 4. Test Ad Account Access
        console.log('\n📋 Step 4: Testing Ad Account Access...');
        try {
            const adResponse = await fetch(`https://graph.facebook.com/v21.0/act_1170970241206263/campaigns?limit=1&access_token=${token}`);
            const adData = await adResponse.json();
            
            if (adData.error) {
                console.log(`⚠️  Ad account access limited: ${adData.error.message}`);
                console.log('💡 This may be normal for new tokens - permissions can take time to propagate');
            } else {
                console.log('✅ Ad account access confirmed');
                verificationResults.adAccountAccess = true;
            }
        } catch (error) {
            console.log(`❌ Ad account test failed: ${error.message}`);
        }
        
        // 5. Check Token Permissions
        console.log('\n📋 Step 5: Checking Token Permissions...');
        try {
            const permResponse = await fetch(`https://graph.facebook.com/v21.0/me/permissions?access_token=${token}`);
            const permData = await permResponse.json();
            
            if (permData.error) {
                console.log(`❌ Permission check failed: ${permData.error.message}`);
            } else {
                const grantedPerms = permData.data.filter(p => p.status === 'granted').map(p => p.permission);
                verificationResults.permissions = grantedPerms;
                
                console.log(`✅ Found ${grantedPerms.length} granted permissions:`);
                grantedPerms.forEach(perm => {
                    console.log(`   ✔️  ${perm}`);
                });
                
                // Check for key permissions
                const keyPermissions = ['ads_management', 'ads_read', 'pages_manage_ads', 'pages_read_engagement'];
                const hasKeyPerms = keyPermissions.filter(p => grantedPerms.includes(p));
                
                if (hasKeyPerms.length > 0) {
                    console.log(`\n🎯 Key marketing permissions found: ${hasKeyPerms.join(', ')}`);
                } else {
                    console.log('\n⚠️  No key marketing permissions detected - may need Business Manager token');
                }
            }
        } catch (error) {
            console.log(`❌ Permission check failed: ${error.message}`);
        }
        
        // 6. Check Environment Variables
        console.log('\n📋 Step 6: Checking Environment Variable Sync...');
        try {
            const fs = require('fs');
            const envPath = '/Users/logan/Mortgage-Campaign-Intelligence/mortgage-campaign-intelligence/.env';
            
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                if (envContent.includes('FB_ACCESS_TOKEN=') && envContent.includes(token.substring(0, 20))) {
                    console.log('✅ Environment file (.env) is synced with Key Vault');
                } else {
                    console.log('⚠️  Environment file may need updating');
                    console.log('💡 Consider updating .env file with new token for local development');
                }
            } else {
                console.log('ℹ️  No .env file found - Key Vault is primary source (this is fine)');
            }
        } catch (error) {
            console.log(`⚠️  Environment check failed: ${error.message}`);
        }
        
        // 7. Calculate Overall Score
        const scores = [
            verificationResults.keyVaultStorage ? 30 : 0,  // Storage
            verificationResults.tokenFormat ? 10 : 0,      // Format
            verificationResults.basicAccess ? 25 : 0,      // Basic access
            verificationResults.pageAccess ? 25 : 0,       // Page access
            verificationResults.adAccountAccess ? 10 : 0   // Ad account (optional)
        ];
        
        verificationResults.overallScore = scores.reduce((a, b) => a + b, 0);
        
        // 8. Generate Report
        console.log('\n' + '='.repeat(50));
        console.log('📊 VERIFICATION REPORT');
        console.log('='.repeat(50));
        
        console.log(`\n🎯 Overall Score: ${verificationResults.overallScore}%`);
        
        if (verificationResults.overallScore >= 90) {
            console.log('🟢 Status: FULLY OPERATIONAL');
            console.log('✅ Facebook Marketing ready for automated campaigns!');
        } else if (verificationResults.overallScore >= 70) {
            console.log('🟡 Status: MOSTLY OPERATIONAL');
            console.log('✅ Core functionality working, some features may need time to activate');
        } else if (verificationResults.overallScore >= 50) {
            console.log('🟠 Status: PARTIALLY OPERATIONAL');
            console.log('⚠️  Basic access working, advanced features may need additional setup');
        } else {
            console.log('🔴 Status: NEEDS ATTENTION');
            console.log('❌ Multiple issues detected, may need different token');
        }
        
        console.log('\n📋 Component Status:');
        console.log(`   🔐 Key Vault Storage: ${verificationResults.keyVaultStorage ? '✅' : '❌'}`);
        console.log(`   📝 Token Format: ${verificationResults.tokenFormat ? '✅' : '❌'}`);
        console.log(`   🔌 Basic API Access: ${verificationResults.basicAccess ? '✅' : '❌'}`);
        console.log(`   📄 Page Access: ${verificationResults.pageAccess ? '✅' : '❌'}`);
        console.log(`   📈 Ad Account Access: ${verificationResults.adAccountAccess ? '✅' : '⚠️ '}`);
        console.log(`   🎫 Permissions Count: ${verificationResults.permissions.length}`);
        
        return verificationResults;
        
    } catch (error) {
        console.log(`❌ Verification failed: ${error.message}`);
        return verificationResults;
    }
}

// Execute verification
if (require.main === module) {
    verifyFacebookTokenStorage()
        .then(results => {
            if (results.overallScore >= 70) {
                console.log('\n🎉 VERIFICATION SUCCESSFUL!');
                console.log('📈 Running full system validation to update confidence score...');
                
                // Run full system validation
                try {
                    execSync('node tests/system-validation.js', { stdio: 'inherit' });
                } catch (error) {
                    console.log('⚠️  System validation had issues, but Facebook token is working');
                }
            } else {
                console.log('\n⚠️  Facebook token needs attention');
                console.log('📋 Consider getting a new token from Business Manager');
            }
        })
        .catch(error => {
            console.error('❌ Verification error:', error);
        });
}

module.exports = { verifyFacebookTokenStorage };
