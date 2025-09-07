#!/usr/bin/env node

/**
 * Quick Credential Status Checker
 * Shows current credential status and what's needed for deployment
 */

const { execSync } = require('child_process');

class CredentialStatusChecker {
    constructor() {
        this.keyVaultName = 'mortgage-campaign-kv';
        this.credentials = {};
    }

    async checkStatus() {
        console.log('🔍 CREDENTIAL STATUS CHECKER');
        console.log('='.repeat(30));
        console.log('Checking current credential availability...\n');
        
        try {
            await this.checkKeyVaultAccess();
            await this.checkAllCredentials();
            await this.generateStatusReport();
            await this.showNextSteps();
            
        } catch (error) {
            console.error('❌ Status check failed:', error.message);
        }
    }

    async checkKeyVaultAccess() {
        try {
            const result = execSync(
                `az keyvault show --name ${this.keyVaultName} --query "name" -o tsv`,
                { encoding: 'utf8' }
            ).trim();
            
            if (result === this.keyVaultName) {
                console.log('✅ Azure Key Vault accessible\n');
            } else {
                throw new Error('Key Vault not accessible');
            }
            
        } catch (error) {
            throw new Error(`Key Vault access failed: ${error.message}`);
        }
    }

    async checkAllCredentials() {
        console.log('📊 CHECKING CREDENTIAL AVAILABILITY:');
        console.log('='.repeat(40));
        
        const credentialCategories = {
            'Microsoft 365 (Critical for D365)': [
                'microsoft-tenant-id',
                'microsoft-client-id', 
                'microsoft-client-secret'
            ],
            'Communication APIs (High Impact)': [
                'twilio-account-sid',
                'twilio-auth-token',
                'sendgrid-api-key'
            ],
            'Platform Integration (Expansion)': [
                'google-ads-client-id',
                'google-ads-client-secret',
                'google-ads-developer-token',
                'facebook-app-id',
                'facebook-app-secret'
            ],
            'AI Optimization (Advanced)': [
                'claude-api-key'
            ]
        };
        
        for (const [category, creds] of Object.entries(credentialCategories)) {
            console.log(`\n🔍 ${category}:`);
            
            let availableCount = 0;
            for (const credName of creds) {
                const isAvailable = await this.checkCredential(credName);
                this.credentials[credName] = isAvailable;
                
                const status = isAvailable ? '✅' : '❌';
                console.log(`   ${status} ${credName}`);
                
                if (isAvailable) availableCount++;
            }
            
            const percentage = Math.round((availableCount / creds.length) * 100);
            console.log(`   📊 Category Status: ${availableCount}/${creds.length} (${percentage}%)`);
        }
    }

    async checkCredential(credName) {
        try {
            const result = execSync(
                `az keyvault secret show --vault-name ${this.keyVaultName} --name "${credName}" --query "value" -o tsv 2>/dev/null`,
                { encoding: 'utf8' }
            ).trim();
            
            return result && result !== '' && !result.includes('ERROR');
            
        } catch (error) {
            return false;
        }
    }

    async generateStatusReport() {
        console.log('\n📋 OVERALL STATUS REPORT:');
        console.log('='.repeat(30));
        
        const totalCredentials = Object.keys(this.credentials).length;
        const availableCredentials = Object.values(this.credentials).filter(Boolean).length;
        const overallPercentage = Math.round((availableCredentials / totalCredentials) * 100);
        
        console.log(`📊 Credentials configured: ${availableCredentials}/${totalCredentials} (${overallPercentage}%)`);
        
        // Critical path analysis
        const criticalCredentials = [
            'microsoft-tenant-id',
            'microsoft-client-id',
            'microsoft-client-secret'
        ];
        
        const criticalAvailable = criticalCredentials.filter(cred => this.credentials[cred]).length;
        const criticalPercentage = Math.round((criticalAvailable / criticalCredentials.length) * 100);
        
        console.log(`🎯 Critical path (M365): ${criticalAvailable}/${criticalCredentials.length} (${criticalPercentage}%)`);
        
        // Deployment readiness
        if (criticalPercentage === 100) {
            console.log('🚀 DEPLOYMENT STATUS: Ready for advanced D365 automation!');
        } else if (criticalPercentage > 0) {
            console.log('⚡ DEPLOYMENT STATUS: Partial M365 setup, needs completion');
        } else {
            console.log('🔧 DEPLOYMENT STATUS: M365 credentials needed for full automation');
        }
        
        // System impact analysis
        console.log('\n💡 IMPACT ANALYSIS:');
        if (this.credentials['microsoft-tenant-id'] && this.credentials['microsoft-client-id'] && this.credentials['microsoft-client-secret']) {
            console.log('   ✅ D365 Integration: Full automation enabled');
            console.log('   ✅ Microsoft Graph: API access available');
            console.log('   ✅ Advanced CRM: Workflows unlocked');
        } else {
            console.log('   ⚠️  D365 Integration: Limited to basic contact creation');
            console.log('   ❌ Microsoft Graph: No API access');
            console.log('   ❌ Advanced CRM: Workflows unavailable');
        }
        
        if (this.credentials['twilio-account-sid'] && this.credentials['sendgrid-api-key']) {
            console.log('   ✅ Communication: SMS + Email automation ready');
        } else {
            console.log('   ❌ Communication: No automated follow-up available');
        }
    }

    async showNextSteps() {
        console.log('\n🎯 RECOMMENDED NEXT STEPS:');
        console.log('='.repeat(30));
        
        const missingM365 = !this.credentials['microsoft-tenant-id'] || 
                          !this.credentials['microsoft-client-id'] || 
                          !this.credentials['microsoft-client-secret'];
        
        const missingComms = !this.credentials['twilio-account-sid'] || 
                            !this.credentials['sendgrid-api-key'];
        
        if (missingM365) {
            console.log('🔵 PRIORITY 1: Set up Microsoft 365 credentials');
            console.log('   📋 Detailed guide: node setup/microsoft365-setup.js');
            console.log('   🤝 Interactive helper: node setup/m365-credential-input.js');
            console.log('   🌐 Azure Portal: https://portal.azure.com');
            console.log('');
        }
        
        if (missingComms) {
            console.log('📱 PRIORITY 2: Set up communication APIs');
            console.log('   📧 SendGrid: https://sendgrid.com (get API key)');
            console.log('   📲 Twilio: https://twilio.com (get Account SID + Auth Token)');
            console.log('   💾 Store with: az keyvault secret set commands');
            console.log('');
        }
        
        if (!missingM365 && !missingComms) {
            console.log('🎉 All critical credentials configured!');
            console.log('   🧪 Test integration: node src/integrations/complete-d365-integration.js');
            console.log('   📊 Full assessment: node tests/automation-assessment.js');
            console.log('   🚀 Deploy campaigns: Ready for production!');
            console.log('');
        }
        
        console.log('💡 QUICK COMMANDS:');
        console.log('   🔍 Check status: node setup/credential-status.js');
        console.log('   ✅ Validate all: node tests/credential-validator.js');
        console.log('   🎯 Full wizard: node setup/credentials-wizard.js');
    }
}

// Execute if run directly
if (require.main === module) {
    const checker = new CredentialStatusChecker();
    checker.checkStatus()
        .then(() => {
            console.log('\n✅ Status check complete!');
        })
        .catch(error => {
            console.error('❌ Status check failed:', error.message);
            process.exit(1);
        });
}

module.exports = { CredentialStatusChecker };
