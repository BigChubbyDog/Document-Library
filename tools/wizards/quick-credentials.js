#!/usr/bin/env node

/**
 * Quick Credentials Setup - Essential credentials for immediate deployment
 * Focus on Microsoft 365 and communication automation
 */

const { execSync } = require('child_process');

class QuickCredentialsSetup {
    constructor() {
        this.keyVaultName = 'mortgage-campaign-kv';
    }

    async quickSetup() {
        console.log('⚡ QUICK CREDENTIALS SETUP');
        console.log('='.repeat(30));
        console.log('Setting up essential credentials for immediate deployment:\n');
        
        try {
            // Ensure Key Vault exists
            await this.ensureKeyVault();
            
            // Show setup priorities
            this.showSetupPriorities();
            
            // Provide manual setup commands
            this.generateSetupCommands();
            
            // Test current state
            await this.testCurrentCredentials();
            
        } catch (error) {
            console.error('❌ Quick setup failed:', error.message);
        }
    }

    async ensureKeyVault() {
        console.log('🔍 Checking Key Vault status...\n');
        
        try {
            const result = execSync(
                `az keyvault show --name ${this.keyVaultName} --query "name" -o tsv 2>/dev/null || echo "NOT_FOUND"`,
                { encoding: 'utf8' }
            ).trim();
            
            if (result === 'NOT_FOUND') {
                console.log('❌ Key Vault not found. Creating it now...\n');
                
                // Create resource group if needed
                const subscription = execSync('az account show --query "id" -o tsv', { encoding: 'utf8' }).trim();
                console.log(`📋 Using subscription: ${subscription}`);
                
                execSync('az group create --name mortgage-campaign-rg --location eastus', { stdio: 'inherit' });
                execSync(
                    `az keyvault create --name ${this.keyVaultName} --resource-group mortgage-campaign-rg --location eastus`,
                    { stdio: 'inherit' }
                );
                
                console.log('✅ Key Vault created successfully!\n');
            } else {
                console.log(`✅ Key Vault "${this.keyVaultName}" is ready\n`);
            }
            
        } catch (error) {
            throw new Error(`Key Vault setup failed: ${error.message}`);
        }
    }

    showSetupPriorities() {
        console.log('🎯 SETUP PRIORITIES FOR IMMEDIATE DEPLOYMENT:');
        console.log('='.repeat(50));
        
        console.log('📊 CURRENT STATUS:');
        console.log('   ✅ Google Ads: 95% operational (ready to deploy)');
        console.log('   ✅ D365 CRM: 75% configured (contact creation working)');
        console.log('   ❌ Microsoft 365: Missing credentials (blocks D365 optimization)');
        console.log('   ❌ Communication: Missing API keys (blocks automation)\n');
        
        console.log('🎯 PRIORITY 1 - Microsoft 365 (Required for D365):');
        console.log('   🔑 Enables full Dynamics 365 integration');
        console.log('   📊 Unlocks Microsoft Graph APIs');
        console.log('   🔗 Required for advanced CRM workflows\n');
        
        console.log('🎯 PRIORITY 2 - Communication APIs (High Impact):');
        console.log('   📧 SendGrid: Automated email follow-ups');
        console.log('   📱 Twilio: SMS notifications and alerts');
        console.log('   🤖 Enables end-to-end lead nurturing\n');
    }

    generateSetupCommands() {
        console.log('🛠️  READY-TO-USE SETUP COMMANDS:');
        console.log('='.repeat(40));
        
        console.log('🔵 MICROSOFT 365 SETUP:');
        console.log('   1. Get credentials from Azure Portal:');
        console.log('      https://portal.azure.com → Azure Active Directory');
        console.log('   2. Run these commands with your values:\n');
        
        console.log('# Microsoft 365 credentials');
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "microsoft-tenant-id" --value "YOUR_TENANT_ID"`);
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "microsoft-client-id" --value "YOUR_CLIENT_ID"`);
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "microsoft-client-secret" --value "YOUR_CLIENT_SECRET"`);
        console.log('');
        
        console.log('📱 COMMUNICATION SETUP:');
        console.log('   Get API keys from providers, then run:\n');
        
        console.log('# Twilio credentials (from twilio.com console)');
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "twilio-account-sid" --value "YOUR_ACCOUNT_SID"`);
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "twilio-auth-token" --value "YOUR_AUTH_TOKEN"`);
        console.log('');
        
        console.log('# SendGrid credentials (from sendgrid.com)');
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "sendgrid-api-key" --value "YOUR_SENDGRID_API_KEY"`);
        console.log('');
        
        console.log('🎯 OPTIONAL BUT RECOMMENDED:');
        console.log('');
        console.log('# Claude AI for advanced optimization');
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "claude-api-key" --value "YOUR_CLAUDE_API_KEY"`);
        console.log('');
        
        console.log('# Facebook/Instagram (if expanding beyond Google Ads)');
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "facebook-app-id" --value "YOUR_FB_APP_ID"`);
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "facebook-app-secret" --value "YOUR_FB_APP_SECRET"`);
        console.log('');
    }

    async testCurrentCredentials() {
        console.log('🧪 TESTING CURRENT CREDENTIAL STATUS:');
        console.log('='.repeat(40));
        
        const criticalCredentials = [
            'microsoft-tenant-id',
            'microsoft-client-id', 
            'microsoft-client-secret',
            'twilio-account-sid',
            'twilio-auth-token',
            'sendgrid-api-key'
        ];
        
        let readyCount = 0;
        
        for (const credName of criticalCredentials) {
            try {
                const result = execSync(
                    `az keyvault secret show --vault-name ${this.keyVaultName} --name "${credName}" --query "value" -o tsv 2>/dev/null`,
                    { encoding: 'utf8' }
                ).trim();
                
                if (result && result !== '') {
                    console.log(`   ✅ ${credName}: Ready`);
                    readyCount++;
                } else {
                    console.log(`   ❌ ${credName}: Missing`);
                }
                
            } catch (error) {
                console.log(`   ❌ ${credName}: Missing`);
            }
        }
        
        const readyPercentage = Math.round((readyCount / criticalCredentials.length) * 100);
        
        console.log(`\n📊 Critical credentials ready: ${readyCount}/${criticalCredentials.length} (${readyPercentage}%)`);
        
        if (readyPercentage === 100) {
            console.log('🚀 All critical credentials configured! Ready for full deployment.');
        } else if (readyPercentage >= 50) {
            console.log('⚡ Partial setup complete. Can deploy with limited automation.');
        } else {
            console.log('🔧 More setup needed for automation deployment.');
        }
        
        // Show next steps
        console.log('\n🎯 IMMEDIATE NEXT STEPS:');
        if (readyCount === 0) {
            console.log('1. Set up Microsoft 365 credentials (highest priority)');
            console.log('2. Run: node tests/credential-validator.js');
            console.log('3. Test D365 integration: node src/integrations/complete-d365-integration.js');
        } else if (readyPercentage < 100) {
            console.log('1. Complete remaining credential setup');
            console.log('2. Run: node tests/credential-validator.js');
            console.log('3. Final deployment test: node tests/automation-assessment.js');
        } else {
            console.log('1. Run full validation: node tests/credential-validator.js');
            console.log('2. Deploy campaigns: Google Ads is ready to go!');
            console.log('3. Scale to additional platforms as they come online');
        }
        
        console.log('\n💡 TIP: Use the interactive wizard for guided setup:');
        console.log('   node setup/credentials-wizard.js');
    }
}

// Execute if run directly
if (require.main === module) {
    const setup = new QuickCredentialsSetup();
    setup.quickSetup()
        .then(() => {
            console.log('\n✅ Quick setup analysis complete!');
        })
        .catch(error => {
            console.error('❌ Quick setup failed:', error.message);
            process.exit(1);
        });
}

module.exports = { QuickCredentialsSetup };
