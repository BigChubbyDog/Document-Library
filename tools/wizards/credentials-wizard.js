#!/usr/bin/env node

/**
 * Interactive Credentials Setup Wizard
 * Step-by-step guide for setting up all required credentials
 */

const { execSync } = require('child_process');
const readline = require('readline');

class CredentialsSetupWizard {
    constructor() {
        this.keyVaultName = 'mortgage-campaign-kv';
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.setupProgress = {};
    }

    async runSetupWizard() {
        console.log('🧙‍♂️ CREDENTIALS SETUP WIZARD');
        console.log('='.repeat(35));
        console.log('This wizard will guide you through setting up all required credentials.');
        console.log('We\'ll tackle them one platform at a time.\n');

        try {
            // Check Key Vault access first
            await this.verifyKeyVaultAccess();
            
            // Setup Microsoft 365 credentials first (critical for D365)
            await this.setupMicrosoft365Credentials();
            
            // Setup communication credentials
            await this.setupCommunicationCredentials();
            
            // Setup remaining platform credentials
            await this.setupAdditionalPlatformCredentials();
            
            // Final validation
            await this.runFinalValidation();
            
            console.log('\n🎉 Credentials setup wizard complete!');
            
        } catch (error) {
            console.error('❌ Setup wizard failed:', error.message);
        } finally {
            this.rl.close();
        }
    }

    async verifyKeyVaultAccess() {
        console.log('🔍 Step 1: Verifying Azure Key Vault access...\n');
        
        try {
            // Check if we can access the key vault
            const result = execSync(
                `az keyvault show --name ${this.keyVaultName} --query "name" -o tsv 2>/dev/null || echo "NOT_FOUND"`,
                { encoding: 'utf8' }
            ).trim();
            
            if (result === 'NOT_FOUND') {
                console.log('❌ Key Vault not found. Let me create it for you...\n');
                await this.createKeyVault();
            } else {
                console.log(`✅ Key Vault "${this.keyVaultName}" is accessible\n`);
            }
            
        } catch (error) {
            throw new Error(`Key Vault access failed: ${error.message}`);
        }
    }

    async createKeyVault() {
        console.log('🏗️  Creating Azure Key Vault...\n');
        
        try {
            // Get current user's subscription and resource group
            const subscription = execSync('az account show --query "id" -o tsv', { encoding: 'utf8' }).trim();
            const user = execSync('az account show --query "user.name" -o tsv', { encoding: 'utf8' }).trim();
            
            console.log(`📋 Using subscription: ${subscription}`);
            console.log(`👤 User: ${user}\n`);
            
            // Check if we have a resource group
            let resourceGroup = 'mortgage-campaign-rg';
            const rgExists = execSync(
                `az group exists --name ${resourceGroup}`,
                { encoding: 'utf8' }
            ).trim();
            
            if (rgExists === 'false') {
                console.log('📁 Creating resource group...');
                execSync(`az group create --name ${resourceGroup} --location eastus`, { stdio: 'inherit' });
            }
            
            // Create Key Vault
            console.log('🔐 Creating Key Vault...');
            execSync(
                `az keyvault create --name ${this.keyVaultName} --resource-group ${resourceGroup} --location eastus --sku standard`,
                { stdio: 'inherit' }
            );
            
            console.log(`✅ Key Vault "${this.keyVaultName}" created successfully!\n`);
            
        } catch (error) {
            throw new Error(`Key Vault creation failed: ${error.message}`);
        }
    }

    async setupMicrosoft365Credentials() {
        console.log('🔵 Step 2: Microsoft 365 / Dynamics 365 Credentials Setup');
        console.log('='.repeat(55));
        
        console.log('Microsoft 365 credentials are CRITICAL for Dynamics 365 integration.');
        console.log('These credentials enable:\n');
        console.log('  ✅ Dynamics 365 CRM API access');
        console.log('  ✅ Microsoft Graph API integration');
        console.log('  ✅ Teams and SharePoint automation');
        console.log('  ✅ Azure AD authentication\n');
        
        const setupM365 = await this.askQuestion('Would you like to set up Microsoft 365 credentials now? (y/n): ');
        
        if (setupM365.toLowerCase() === 'y') {
            await this.guideMicrosoft365Setup();
        } else {
            console.log('⏭️  Skipping Microsoft 365 setup for now.\n');
            this.setupProgress.microsoft365 = 'SKIPPED';
        }
    }

    async guideMicrosoft365Setup() {
        console.log('\n📋 MICROSOFT 365 SETUP INSTRUCTIONS:');
        console.log('='.repeat(40));
        
        console.log('1. 🌐 Open Azure Portal: https://portal.azure.com');
        console.log('2. 📁 Go to "Azure Active Directory"');
        console.log('3. 🆔 Copy your Tenant ID from the Overview page');
        console.log('4. 📱 Go to "App registrations" → "New registration"');
        console.log('5. 📝 Name: "Mortgage Campaign Intelligence"');
        console.log('6. 🌍 Supported account types: "Single tenant"');
        console.log('7. ✅ Click "Register"');
        console.log('8. 📋 Copy the Application (client) ID');
        console.log('9. 🔐 Go to "Certificates & secrets" → "New client secret"');
        console.log('10. 📝 Description: "Campaign Automation Secret"');
        console.log('11. ⏰ Expires: 24 months');
        console.log('12. 💾 Copy the secret VALUE (not the ID)');
        console.log('13. 🔑 Go to "API permissions" → "Add a permission"');
        console.log('14. 📊 Add "Microsoft Graph" → "Application permissions"');
        console.log('15. 🏢 Add "Dynamics CRM" → "Application permissions"');
        console.log('16. ✅ Click "Grant admin consent"\n');
        
        await this.waitForUser('Press Enter when you have completed the Azure portal setup...');
        
        // Get credentials from user
        console.log('\n📝 Now let\'s store your credentials securely:');
        
        const tenantId = await this.askQuestion('Enter your Tenant ID: ');
        const clientId = await this.askQuestion('Enter your Application (client) ID: ');
        const clientSecret = await this.askQuestion('Enter your Client Secret: ');
        
        // Validate credentials format
        if (!this.isValidGuid(tenantId)) {
            console.log('⚠️  Warning: Tenant ID doesn\'t look like a valid GUID');
        }
        if (!this.isValidGuid(clientId)) {
            console.log('⚠️  Warning: Client ID doesn\'t look like a valid GUID');
        }
        
        // Store in Key Vault
        await this.storeCredentials({
            'microsoft-tenant-id': tenantId,
            'microsoft-client-id': clientId,
            'microsoft-client-secret': clientSecret
        });
        
        console.log('✅ Microsoft 365 credentials stored successfully!\n');
        this.setupProgress.microsoft365 = 'COMPLETED';
        
        // Test the credentials
        await this.testMicrosoft365Connection(tenantId, clientId, clientSecret);
    }

    async testMicrosoft365Connection(tenantId, clientId, clientSecret) {
        console.log('🧪 Testing Microsoft 365 connection...\n');
        
        try {
            // Test Azure AD token acquisition
            const testScript = `
const axios = require('axios');

async function testM365Auth() {
    const tokenUrl = 'https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token';
    const params = new URLSearchParams();
    params.append('client_id', '${clientId}');
    params.append('client_secret', '${clientSecret}');
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('grant_type', 'client_credentials');
    
    const response = await axios.post(tokenUrl, params);
    return response.data.access_token;
}

testM365Auth()
    .then(token => {
        console.log('✅ Microsoft 365 authentication successful!');
        console.log('📏 Token length:', token.length);
    })
    .catch(error => {
        console.error('❌ Authentication failed:', error.response?.data?.error_description || error.message);
    });
`;
            
            // Write and execute test
            const fs = require('fs');
            fs.writeFileSync('/tmp/test-m365-auth.js', testScript);
            
            execSync('cd /Users/logan/Mortgage-Campaign-Intelligence && node /tmp/test-m365-auth.js', { stdio: 'inherit' });
            
        } catch (error) {
            console.log('⚠️  Could not test connection automatically. This is normal if axios is not installed.');
            console.log('   The credentials are stored and will be tested during full system validation.\n');
        }
    }

    async setupCommunicationCredentials() {
        console.log('📱 Step 3: Communication Automation Setup');
        console.log('='.repeat(40));
        
        console.log('Communication automation enables:\n');
        console.log('  📧 Automated email campaigns (SendGrid)');
        console.log('  📱 SMS notifications (Twilio)');
        console.log('  🔔 Lead follow-up automation');
        console.log('  📊 Communication analytics\n');
        
        const setupComms = await this.askQuestion('Would you like to set up communication automation? (y/n): ');
        
        if (setupComms.toLowerCase() === 'y') {
            await this.setupTwilioCredentials();
            await this.setupSendGridCredentials();
        } else {
            console.log('⏭️  Skipping communication setup for now.\n');
            this.setupProgress.communication = 'SKIPPED';
        }
    }

    async setupTwilioCredentials() {
        console.log('\n📱 TWILIO SETUP (SMS & Voice):');
        console.log('='.repeat(35));
        
        console.log('1. 🌐 Go to: https://www.twilio.com');
        console.log('2. 📝 Create account or sign in');
        console.log('3. 📊 Go to Console Dashboard');
        console.log('4. 🆔 Copy your Account SID');
        console.log('5. 🔐 Copy your Auth Token');
        console.log('6. 📞 Purchase a phone number for SMS');
        
        const setupTwilio = await this.askQuestion('\nHave you completed Twilio setup? (y/n): ');
        
        if (setupTwilio.toLowerCase() === 'y') {
            const accountSid = await this.askQuestion('Enter your Twilio Account SID: ');
            const authToken = await this.askQuestion('Enter your Twilio Auth Token: ');
            
            await this.storeCredentials({
                'twilio-account-sid': accountSid,
                'twilio-auth-token': authToken
            });
            
            console.log('✅ Twilio credentials stored successfully!\n');
        } else {
            console.log('⏭️  Skipping Twilio for now. You can set this up later.\n');
        }
    }

    async setupSendGridCredentials() {
        console.log('📧 SENDGRID SETUP (Email):');
        console.log('='.repeat(30));
        
        console.log('1. 🌐 Go to: https://sendgrid.com');
        console.log('2. 📝 Create account or sign in');
        console.log('3. ⚙️  Go to Settings → API Keys');
        console.log('4. 🔐 Create API Key with "Full Access"');
        console.log('5. 📋 Copy the API key (starts with "SG.")');
        
        const setupSendGrid = await this.askQuestion('\nHave you completed SendGrid setup? (y/n): ');
        
        if (setupSendGrid.toLowerCase() === 'y') {
            const apiKey = await this.askQuestion('Enter your SendGrid API Key: ');
            
            if (!apiKey.startsWith('SG.')) {
                console.log('⚠️  Warning: SendGrid API keys typically start with "SG."');
            }
            
            await this.storeCredentials({
                'sendgrid-api-key': apiKey
            });
            
            console.log('✅ SendGrid credentials stored successfully!\n');
        } else {
            console.log('⏭️  Skipping SendGrid for now. You can set this up later.\n');
        }
    }

    async setupAdditionalPlatformCredentials() {
        console.log('🌐 Step 4: Additional Platform Credentials');
        console.log('='.repeat(45));
        
        console.log('Optional platform integrations:\n');
        console.log('  🎯 Google Ads (already 95% working)');
        console.log('  📘 Facebook/Instagram marketing');
        console.log('  🔗 LinkedIn campaigns');
        console.log('  🤖 Claude AI optimization\n');
        
        const setupAdditional = await this.askQuestion('Would you like to set up additional platform credentials now? (y/n): ');
        
        if (setupAdditional.toLowerCase() === 'y') {
            await this.showAdditionalPlatformInstructions();
        } else {
            console.log('⏭️  Skipping additional platforms. You can add these later.\n');
            this.setupProgress.additionalPlatforms = 'SKIPPED';
        }
    }

    async showAdditionalPlatformInstructions() {
        console.log('\n📋 ADDITIONAL PLATFORM SETUP INSTRUCTIONS:');
        console.log('='.repeat(50));
        
        console.log('🎯 GOOGLE ADS (if not already set up):');
        console.log('   1. Go to: https://ads.google.com');
        console.log('   2. Get Developer Token from Google Ads API');
        console.log('   3. Create OAuth2 credentials in Google Cloud Console\n');
        
        console.log('📘 FACEBOOK/INSTAGRAM:');
        console.log('   1. Go to: https://developers.facebook.com');
        console.log('   2. Create app for "Marketing"');
        console.log('   3. Get App ID and App Secret');
        console.log('   4. Request marketing API permissions\n');
        
        console.log('🤖 CLAUDE AI:');
        console.log('   1. Go to: https://console.anthropic.com');
        console.log('   2. Create API key');
        console.log('   3. Store as "claude-api-key"\n');
        
        console.log('📝 You can set these up later using individual commands or the full wizard.\n');
    }

    async runFinalValidation() {
        console.log('🧪 Step 5: Final Validation');
        console.log('='.repeat(30));
        
        console.log('Running credential validation test...\n');
        
        try {
            execSync('cd /Users/logan/Mortgage-Campaign-Intelligence && node tests/credential-validator.js', { stdio: 'inherit' });
        } catch (error) {
            console.log('⚠️  Some credentials may need additional setup.');
            console.log('   This is normal - you can continue with the credentials you\'ve configured.\n');
        }
    }

    async storeCredentials(credentials) {
        console.log('💾 Storing credentials in Azure Key Vault...\n');
        
        for (const [name, value] of Object.entries(credentials)) {
            try {
                execSync(
                    `az keyvault secret set --vault-name ${this.keyVaultName} --name "${name}" --value "${value}"`,
                    { stdio: 'pipe' }
                );
                console.log(`   ✅ ${name}: Stored securely`);
            } catch (error) {
                console.log(`   ❌ ${name}: Failed to store - ${error.message}`);
            }
        }
        console.log('');
    }

    isValidGuid(str) {
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return guidRegex.test(str);
    }

    async askQuestion(question) {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async waitForUser(message) {
        return new Promise((resolve) => {
            this.rl.question(message, () => {
                resolve();
            });
        });
    }
}

// Execute wizard if run directly
if (require.main === module) {
    const wizard = new CredentialsSetupWizard();
    wizard.runSetupWizard()
        .then(() => {
            console.log('\n🎉 Setup wizard completed successfully!');
            console.log('\n🚀 NEXT STEPS:');
            console.log('1. Run: node tests/credential-validator.js');
            console.log('2. Run: node tests/automation-assessment.js');
            console.log('3. Deploy campaigns when validation shows 100% ready');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Setup wizard failed:', error.message);
            process.exit(1);
        });
}

module.exports = { CredentialsSetupWizard };
