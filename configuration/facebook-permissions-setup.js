#!/usr/bin/env node

/**
 * Facebook Marketing Permissions Setup & Validation
 * Interactive tool to configure and test Facebook API permissions
 */

const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

class FacebookPermissionsManager {
    constructor() {
        this.credential = new DefaultAzureCredential();
        this.secretClient = new SecretClient('https://mortgage-leads-kv-2025.vault.azure.net/', this.credential);
        this.requiredPermissions = [
            'pages_read_engagement',
            'pages_manage_metadata',
            'pages_read_user_content', 
            'pages_manage_ads',
            'pages_show_list',
            'pages_messaging'
        ];
        this.pageId = '102409121765907'; // Mortgage Loans Co page
    }

    async setupPermissions() {
        console.log('🔧 FACEBOOK MARKETING PERMISSIONS SETUP');
        console.log('=' .repeat(60));
        
        // Step 1: Check current token
        console.log('\n📋 Step 1: Checking current Facebook token...');
        const currentStatus = await this.checkCurrentPermissions();
        
        if (currentStatus.allPermissionsGranted) {
            console.log('✅ All permissions already configured!');
            return await this.validateFullFunctionality();
        }
        
        // Step 2: Guide user through permissions setup
        console.log('\n🛠️  Step 2: Setting up required permissions...');
        await this.guidePermissionsSetup(currentStatus);
        
        // Step 3: Get new token from user
        console.log('\n🔑 Step 3: Generate new access token...');
        await this.getNewAccessToken();
        
        // Step 4: Validate new permissions
        console.log('\n✅ Step 4: Validating new permissions...');
        const finalStatus = await this.validateFullFunctionality();
        
        return finalStatus;
    }

    async checkCurrentPermissions() {
        try {
            const tokenSecret = await this.secretClient.getSecret('facebook-access-token');
            const token = tokenSecret.value;
            
            console.log('   📞 Testing current token permissions...');
            
            // Check what permissions the current token has
            const permissionsResponse = await fetch(`https://graph.facebook.com/v21.0/me/permissions?access_token=${token}`);
            const permissionsData = await permissionsResponse.json();
            
            if (permissionsData.error) {
                console.log(`   ❌ Error checking permissions: ${permissionsData.error.message}`);
                return { allPermissionsGranted: false, grantedPermissions: [], error: permissionsData.error.message };
            }
            
            const grantedPermissions = permissionsData.data
                .filter(p => p.status === 'granted')
                .map(p => p.permission);
            
            console.log(`   📊 Currently granted permissions: ${grantedPermissions.length}`);
            
            const missingPermissions = this.requiredPermissions.filter(
                perm => !grantedPermissions.includes(perm)
            );
            
            if (missingPermissions.length === 0) {
                console.log('   ✅ All required permissions are granted!');
                return { allPermissionsGranted: true, grantedPermissions, missingPermissions: [] };
            } else {
                console.log(`   ⚠️  Missing permissions: ${missingPermissions.join(', ')}`);
                return { allPermissionsGranted: false, grantedPermissions, missingPermissions };
            }
            
        } catch (error) {
            console.log(`   ❌ Failed to check permissions: ${error.message}`);
            return { allPermissionsGranted: false, grantedPermissions: [], error: error.message };
        }
    }

    async guidePermissionsSetup(currentStatus) {
        console.log('\n🎯 FACEBOOK PERMISSIONS SETUP GUIDE');
        console.log('-'.repeat(50));
        
        console.log('\n📋 REQUIRED PERMISSIONS for automated campaigns:');
        this.requiredPermissions.forEach((perm, index) => {
            const grantedPerms = currentStatus.grantedPermissions || [];
            const status = grantedPerms.includes(perm) ? '✅' : '❌';
            console.log(`   ${index + 1}. ${status} ${perm}`);
        });
        
        const missingPerms = currentStatus.missingPermissions || this.requiredPermissions;
        if (missingPerms.length > 0) {
            console.log('\n🛠️  SETUP INSTRUCTIONS:');
            console.log('1. Open Facebook Graph API Explorer:');
            console.log('   🔗 https://developers.facebook.com/tools/explorer');
            
            console.log('\n2. Configure the following settings:');
            console.log('   • Select your application from dropdown');
            console.log('   • Choose "Get Page Access Token" option');
            console.log('   • Select page: "Mortgage Loans Co"');
            
            console.log('\n3. Add these permissions (click "Add a Permission"):');
            missingPerms.forEach(perm => {
                console.log(`   ✔️  ${perm}`);
            });
            
            console.log('\n4. Generate the token:');
            console.log('   • Click "Generate Access Token"');
            console.log('   • Review and approve all permissions');
            console.log('   • Copy the generated token');
            
            console.log('\n🚨 IMPORTANT NOTES:');
            console.log('• Some permissions may require app review by Facebook');
            console.log('• For immediate testing, request "Standard Access" for development');
            console.log('• Page admin privileges required for all permissions');
            console.log('• Token should start with "EAA..." and be ~200+ characters');
        }
    }

    async getNewAccessToken() {
        console.log('\n🔑 NEW ACCESS TOKEN SETUP');
        console.log('-'.repeat(40));
        
        console.log('\n📝 After generating your new token with all permissions:');
        console.log('\n💾 Update your token in Azure Key Vault with this command:');
        console.log('   az keyvault secret set --vault-name mortgage-leads-kv-2025 \\');
        console.log('     --name facebook-access-token \\');
        console.log('     --value "YOUR_NEW_TOKEN_HERE"');
        
        console.log('\n⚡ Or update your .env file and we\'ll sync it to Key Vault:');
        console.log('   FB_ACCESS_TOKEN=YOUR_NEW_TOKEN_HERE');
        
        console.log('\n📋 NEW TOKEN REQUIREMENTS:');
        console.log('• Must be a Page Access Token (not User Access Token)');
        console.log('• Include all 6 required permissions');
        console.log('• Generated for "Mortgage Loans Co" page');
        console.log('• Should be 200+ characters long');
        console.log('• Must start with "EAA..."');
        
        console.log('\n⏳ Waiting for token update...');
        console.log('   Run this script again after updating the token to validate!');
    }

    async validateFullFunctionality() {
        console.log('\n🔍 VALIDATING FACEBOOK MARKETING FUNCTIONALITY');
        console.log('-'.repeat(50));
        
        try {
            const tokenSecret = await this.secretClient.getSecret('facebook-access-token');
            const token = tokenSecret.value;
            
            const tests = [
                { name: 'Basic API Access', test: () => this.testBasicAccess(token) },
                { name: 'Page Access', test: () => this.testPageAccess(token) },
                { name: 'Ad Account Access', test: () => this.testAdAccountAccess(token) },
                { name: 'Campaign Creation Capability', test: () => this.testCampaignCapability(token) },
                { name: 'Audience Insights', test: () => this.testAudienceInsights(token) },
                { name: 'Page Messaging', test: () => this.testPageMessaging(token) }
            ];
            
            let passedTests = 0;
            const results = [];
            
            for (const test of tests) {
                console.log(`\n   🧪 Testing: ${test.name}...`);
                try {
                    const result = await test.test();
                    if (result.success) {
                        console.log(`   ✅ ${test.name}: PASSED`);
                        passedTests++;
                        results.push({ test: test.name, status: 'passed', details: result.details });
                    } else {
                        console.log(`   ❌ ${test.name}: FAILED - ${result.error}`);
                        results.push({ test: test.name, status: 'failed', error: result.error });
                    }
                } catch (error) {
                    console.log(`   ❌ ${test.name}: ERROR - ${error.message}`);
                    results.push({ test: test.name, status: 'error', error: error.message });
                }
            }
            
            const successRate = Math.round((passedTests / tests.length) * 100);
            
            console.log('\n📊 FACEBOOK VALIDATION RESULTS:');
            console.log(`   🎯 Success Rate: ${successRate}% (${passedTests}/${tests.length})`);
            
            if (successRate >= 90) {
                console.log('   🟢 Status: FULLY OPERATIONAL');
                console.log('   🚀 Ready for automated campaign deployment!');
            } else if (successRate >= 70) {
                console.log('   🟡 Status: MOSTLY FUNCTIONAL');
                console.log('   ⚠️  Some advanced features may require additional setup');
            } else {
                console.log('   🔴 Status: NEEDS ATTENTION');
                console.log('   🛠️  Additional configuration required');
            }
            
            return { successRate, passedTests, totalTests: tests.length, results };
            
        } catch (error) {
            console.log(`   ❌ Validation failed: ${error.message}`);
            return { successRate: 0, passedTests: 0, totalTests: 6, error: error.message };
        }
    }

    async testBasicAccess(token) {
        const response = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${token}`);
        const data = await response.json();
        
        if (data.error) {
            return { success: false, error: data.error.message };
        }
        
        return { success: true, details: `Connected as: ${data.name}` };
    }

    async testPageAccess(token) {
        const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}?fields=name,access_token&access_token=${token}`);
        const data = await response.json();
        
        if (data.error) {
            return { success: false, error: data.error.message };
        }
        
        return { success: true, details: `Page access: ${data.name}` };
    }

    async testAdAccountAccess(token) {
        const response = await fetch(`https://graph.facebook.com/v21.0/me/adaccounts?access_token=${token}`);
        const data = await response.json();
        
        if (data.error) {
            return { success: false, error: data.error.message };
        }
        
        const adAccountCount = data.data ? data.data.length : 0;
        return { success: true, details: `${adAccountCount} ad accounts accessible` };
    }

    async testCampaignCapability(token) {
        // Test if we can access campaign creation endpoints
        const response = await fetch(`https://graph.facebook.com/v21.0/act_1170970241206263/campaigns?limit=1&access_token=${token}`);
        const data = await response.json();
        
        if (data.error) {
            return { success: false, error: data.error.message };
        }
        
        return { success: true, details: 'Campaign management access confirmed' };
    }

    async testAudienceInsights(token) {
        const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/insights?metric=page_impressions&access_token=${token}`);
        const data = await response.json();
        
        if (data.error) {
            return { success: false, error: data.error.message };
        }
        
        return { success: true, details: 'Page insights accessible' };
    }

    async testPageMessaging(token) {
        const response = await fetch(`https://graph.facebook.com/v21.0/${this.pageId}/conversations?access_token=${token}`);
        const data = await response.json();
        
        if (data.error) {
            return { success: false, error: data.error.message };
        }
        
        return { success: true, details: 'Messaging capabilities confirmed' };
    }
}

// Execute if run directly
if (require.main === module) {
    const manager = new FacebookPermissionsManager();
    manager.setupPermissions()
        .then(result => {
            if (result && result.successRate >= 90) {
                console.log('\n🎉 Facebook Marketing is now FULLY OPERATIONAL!');
                console.log('✅ Ready to proceed with automated campaign deployment');
            } else {
                console.log('\n⚠️  Additional setup may be required');
                console.log('📋 Follow the instructions above and run this script again');
            }
        })
        .catch(error => {
            console.error('❌ Setup failed:', error);
            process.exit(1);
        });
}

module.exports = { FacebookPermissionsManager };
