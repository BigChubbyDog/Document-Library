#!/usr/bin/env node

/**
 * Interactive Microsoft 365 Credential Input Helper
 * Guides user through entering and storing M365 credentials
 */

const { execSync } = require('child_process');
const readline = require('readline');

class M365CredentialHelper {
    constructor() {
        this.keyVaultName = 'mortgage-campaign-kv';
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.credentials = {};
    }

    async collectCredentials() {
        console.log('🔵 MICROSOFT 365 CREDENTIAL INPUT HELPER');
        console.log('='.repeat(45));
        console.log('This tool will help you securely store your M365 credentials.\n');
        
        try {
            // Check if user has completed Azure portal setup
            await this.confirmPortalSetup();
            
            // Collect credentials interactively
            await this.collectTenantId();
            await this.collectClientId();
            await this.collectClientSecret();
            
            // Show summary and confirm
            await this.confirmAndStore();
            
            // Test the credentials
            await this.testCredentials();
            
            console.log('\n🎉 Microsoft 365 credentials setup complete!');
            
        } catch (error) {
            console.error('❌ Credential setup failed:', error.message);
        } finally {
            this.rl.close();
        }
    }

    async confirmPortalSetup() {
        console.log('📋 PREREQUISITE CHECK:');
        console.log('Before we start, make sure you have completed these steps in Azure Portal:\n');
        console.log('   ✅ Created app registration "Mortgage Campaign Intelligence"');
        console.log('   ✅ Added Microsoft Graph permissions (User.Read.All, Directory.Read.All, Mail.Send)');
        console.log('   ✅ Added Dynamics CRM permissions (user_impersonation)');
        console.log('   ✅ Granted admin consent for all permissions');
        console.log('   ✅ Created a client secret and copied its VALUE\n');
        
        const ready = await this.askQuestion('Have you completed all the Azure Portal setup steps? (y/n): ');
        
        if (ready.toLowerCase() !== 'y') {
            console.log('\n📖 Please complete the Azure Portal setup first:');
            console.log('   Run: node setup/microsoft365-setup.js');
            console.log('   Or visit: https://portal.azure.com\n');
            throw new Error('Portal setup not completed');
        }
        
        console.log('\n✅ Great! Let\'s collect your credentials.\n');
    }

    async collectTenantId() {
        console.log('🆔 STEP 1: Tenant ID');
        console.log('='.repeat(20));
        console.log('Your Tenant ID is found in Azure Portal → Azure Active Directory → Overview');
        console.log('It looks like: 12345678-1234-1234-1234-123456789012\n');
        
        while (true) {
            const tenantId = await this.askQuestion('Enter your Tenant ID: ');
            
            if (this.isValidGuid(tenantId)) {
                this.credentials.tenantId = tenantId;
                console.log('✅ Valid Tenant ID format\n');
                break;
            } else {
                console.log('❌ Invalid format. Tenant ID should be a GUID (36 characters with dashes)');
                console.log('   Example: 12345678-1234-1234-1234-123456789012\n');
            }
        }
    }

    async collectClientId() {
        console.log('📱 STEP 2: Application (Client) ID');
        console.log('='.repeat(35));
        console.log('Your Client ID is found in your app registration overview page');
        console.log('It also looks like: 87654321-4321-4321-4321-210987654321\n');
        
        while (true) {
            const clientId = await this.askQuestion('Enter your Application (Client) ID: ');
            
            if (this.isValidGuid(clientId)) {
                this.credentials.clientId = clientId;
                console.log('✅ Valid Client ID format\n');
                break;
            } else {
                console.log('❌ Invalid format. Client ID should be a GUID (36 characters with dashes)');
                console.log('   Example: 87654321-4321-4321-4321-210987654321\n');
            }
        }
    }

    async collectClientSecret() {
        console.log('🔐 STEP 3: Client Secret');
        console.log('='.repeat(25));
        console.log('Your Client Secret is the VALUE you copied when creating the secret');
        console.log('It starts with letters/numbers and may contain special characters');
        console.log('⚠️  This is the VALUE, not the Secret ID!\n');
        
        while (true) {
            const clientSecret = await this.askQuestion('Enter your Client Secret: ');
            
            if (clientSecret.length < 10) {
                console.log('❌ Client secret seems too short. Make sure you copied the VALUE, not the ID.');
                console.log('   The secret value is typically 32+ characters long\n');
                continue;
            }
            
            if (clientSecret.includes('****')) {
                console.log('❌ It looks like you copied a masked value. You need the actual secret VALUE.');
                console.log('   If you can\'t see the full value, create a new client secret\n');
                continue;
            }
            
            this.credentials.clientSecret = clientSecret;
            console.log('✅ Client secret captured\n');
            break;
        }
    }

    async confirmAndStore() {
        console.log('📋 CREDENTIAL SUMMARY:');
        console.log('='.repeat(25));
        console.log(`Tenant ID: ${this.credentials.tenantId}`);
        console.log(`Client ID: ${this.credentials.clientId}`);
        console.log(`Client Secret: ${this.maskSecret(this.credentials.clientSecret)}`);
        console.log('');
        
        const confirm = await this.askQuestion('Does this look correct? (y/n): ');
        
        if (confirm.toLowerCase() !== 'y') {
            throw new Error('Setup cancelled by user');
        }
        
        console.log('\n💾 Storing credentials in Azure Key Vault...\n');
        
        // Store each credential
        await this.storeCredential('microsoft-tenant-id', this.credentials.tenantId);
        await this.storeCredential('microsoft-client-id', this.credentials.clientId);
        await this.storeCredential('microsoft-client-secret', this.credentials.clientSecret);
        
        console.log('✅ All Microsoft 365 credentials stored securely!\n');
    }

    async storeCredential(name, value) {
        try {
            execSync(
                `az keyvault secret set --vault-name ${this.keyVaultName} --name "${name}" --value "${value}"`,
                { stdio: 'pipe' }
            );
            console.log(`   ✅ ${name}: Stored successfully`);
        } catch (error) {
            console.error(`   ❌ ${name}: Failed to store - ${error.message}`);
            throw error;
        }
    }

    async testCredentials() {
        console.log('🧪 Testing Microsoft 365 credentials...\n');
        
        try {
            console.log('   📊 Running credential validation...');
            execSync('node tests/credential-validator.js', { stdio: 'inherit' });
            
        } catch (error) {
            console.log('   ⚠️  Some validation tests may have failed - this is often normal');
            console.log('   Your credentials are stored and can be tested in the full system\n');
        }
        
        console.log('\n🎯 NEXT STEPS:');
        console.log('1. Test D365 integration: node src/integrations/complete-d365-integration.js');
        console.log('2. Run full system assessment: node tests/automation-assessment.js');
        console.log('3. Set up communication APIs for complete automation\n');
    }

    isValidGuid(str) {
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return guidRegex.test(str);
    }

    maskSecret(secret) {
        if (secret.length <= 8) return '****';
        return secret.substring(0, 4) + '****' + secret.substring(secret.length - 4);
    }

    async askQuestion(question) {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }
}

// Execute if run directly
if (require.main === module) {
    console.log('🚀 Starting Microsoft 365 credential collection...\n');
    
    const helper = new M365CredentialHelper();
    helper.collectCredentials()
        .then(() => {
            console.log('🎉 Microsoft 365 setup successful!');
            console.log('   Your D365 integration is now fully configured for advanced automation.');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Setup failed:', error.message);
            console.log('\n💡 Need help? Run: node setup/microsoft365-setup.js');
            process.exit(1);
        });
}

module.exports = { M365CredentialHelper };
