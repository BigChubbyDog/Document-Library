#!/usr/bin/env node

/**
 * Google Ads API Authentication Setup
 * Configures OAuth2 flow and stores credentials in Azure Key Vault
 */

const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

class GoogleAdsAuthSetup {
    constructor() {
        this.vaultName = 'mortgage-leads-kv-2025';
        this.projectId = 'mortgage-loans-company';
        
        // Google Ads API configuration
        this.config = {
            oauth2_client_id: null,
            oauth2_client_secret: null,
            refresh_token: null,
            developer_token: null,
            customer_id: null,
            login_customer_id: null
        };
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async setupAuthentication() {
        console.log('🔐 GOOGLE ADS API AUTHENTICATION SETUP');
        console.log('=' .repeat(50));
        
        try {
            // Step 1: Check if we have existing credentials
            await this.checkExistingCredentials();
            
            // Step 2: Guide user through Google Cloud setup
            await this.guideGoogleCloudSetup();
            
            // Step 3: Collect OAuth2 credentials
            await this.collectOAuthCredentials();
            
            // Step 4: Generate refresh token
            await this.generateRefreshToken();
            
            // Step 5: Collect additional required credentials
            await this.collectAdditionalCredentials();
            
            // Step 6: Store in Azure Key Vault
            await this.storeCredentialsInKeyVault();
            
            // Step 7: Test API connectivity
            await this.testAPIConnectivity();
            
            console.log('\n🎉 Google Ads API authentication setup complete!');
            
        } catch (error) {
            console.error('\n❌ Setup failed:', error.message);
            throw error;
        } finally {
            this.rl.close();
        }
    }

    async checkExistingCredentials() {
        console.log('\n📋 Step 1: Checking existing credentials...');
        
        try {
            const existingCustomerId = execSync(`az keyvault secret show --vault-name ${this.vaultName} --name google-ads-customer-id --query "value" -o tsv`, 
                { encoding: 'utf8' }).trim();
            
            if (existingCustomerId && existingCustomerId.length > 5) {
                console.log('✅ Found existing Google Ads customer ID');
                this.config.customer_id = existingCustomerId;
                
                const useExisting = await this.askQuestion('Use existing credentials? (y/n): ');
                if (useExisting.toLowerCase() === 'y') {
                    await this.loadExistingCredentials();
                    return true;
                }
            }
        } catch (error) {
            console.log('⚠️  No existing credentials found');
        }
        
        return false;
    }

    async loadExistingCredentials() {
        console.log('📥 Loading existing credentials...');
        
        try {
            this.config.oauth2_client_id = execSync(`az keyvault secret show --vault-name ${this.vaultName} --name google-ads-client-id --query "value" -o tsv`, 
                { encoding: 'utf8' }).trim();
            this.config.oauth2_client_secret = execSync(`az keyvault secret show --vault-name ${this.vaultName} --name google-ads-client-secret --query "value" -o tsv`, 
                { encoding: 'utf8' }).trim();
            this.config.refresh_token = execSync(`az keyvault secret show --vault-name ${this.vaultName} --name google-ads-refresh-token --query "value" -o tsv`, 
                { encoding: 'utf8' }).trim();
            this.config.developer_token = execSync(`az keyvault secret show --vault-name ${this.vaultName} --name google-ads-developer-token --query "value" -o tsv`, 
                { encoding: 'utf8' }).trim();
            
            console.log('✅ All credentials loaded successfully');
        } catch (error) {
            console.log('⚠️  Some credentials missing, will need to reconfigure');
        }
    }

    async guideGoogleCloudSetup() {
        console.log('\n📋 Step 2: Google Cloud Project Setup');
        console.log('🌐 Setting up Google Cloud project and APIs...');
        
        console.log('\n📝 REQUIRED SETUP STEPS:');
        console.log('1. Go to: https://console.cloud.google.com/');
        console.log(`2. Select project: ${this.projectId}`);
        console.log('3. Enable Google Ads API:');
        console.log('   → APIs & Services → Library → Search "Google Ads API" → Enable');
        console.log('4. Create OAuth 2.0 credentials:');
        console.log('   → APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs');
        console.log('   → Application type: Desktop application');
        console.log('   → Name: "Mortgage Campaign Intelligence"');
        
        await this.askQuestion('Press Enter when you have completed the Google Cloud setup...');
    }

    async collectOAuthCredentials() {
        console.log('\n📋 Step 3: OAuth2 Credentials Collection');
        
        console.log('\n📝 From your Google Cloud Console → Credentials:');
        this.config.oauth2_client_id = await this.askQuestion('Enter OAuth 2.0 Client ID: ');
        this.config.oauth2_client_secret = await this.askQuestion('Enter OAuth 2.0 Client Secret: ');
        
        console.log('✅ OAuth2 credentials collected');
    }

    async generateRefreshToken() {
        console.log('\n📋 Step 4: Generating Refresh Token');
        
        console.log('\n🔄 OAuth2 Flow Setup:');
        console.log('1. Visit the following URL in your browser:');
        
        const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
            `client_id=${this.config.oauth2_client_id}&` +
            `redirect_uri=urn:ietf:wg:oauth:2.0:oob&` +
            `scope=https://www.googleapis.com/auth/adwords&` +
            `response_type=code&` +
            `access_type=offline`;
        
        console.log(`\n🌐 ${authUrl}`);
        
        console.log('\n2. Authorize the application');
        console.log('3. Copy the authorization code');
        
        const authCode = await this.askQuestion('\nEnter the authorization code: ');
        
        // Exchange auth code for refresh token
        console.log('🔄 Exchanging authorization code for refresh token...');
        
        try {
            const tokenResponse = await this.exchangeCodeForTokens(authCode);
            this.config.refresh_token = tokenResponse.refresh_token;
            console.log('✅ Refresh token generated successfully');
        } catch (error) {
            throw new Error(`Failed to generate refresh token: ${error.message}`);
        }
    }

    async exchangeCodeForTokens(authCode) {
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const params = new URLSearchParams({
            client_id: this.config.oauth2_client_id,
            client_secret: this.config.oauth2_client_secret,
            code: authCode,
            grant_type: 'authorization_code',
            redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
        });

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(`OAuth error: ${data.error_description || data.error}`);
        }
        
        return data;
    }

    async collectAdditionalCredentials() {
        console.log('\n📋 Step 5: Additional Required Credentials');
        
        console.log('\n📝 DEVELOPER TOKEN SETUP:');
        console.log('1. Go to: https://ads.google.com/aw/apicenter');
        console.log('2. Apply for API access (if not already approved)');
        console.log('3. Copy your developer token');
        
        this.config.developer_token = await this.askQuestion('Enter Developer Token: ');
        
        console.log('\n📝 CUSTOMER ID SETUP:');
        console.log('1. Go to: https://ads.google.com/');
        console.log('2. Copy your Google Ads Customer ID (format: 123-456-7890)');
        
        this.config.customer_id = await this.askQuestion('Enter Customer ID (with dashes): ');
        
        // Set login customer ID (usually same as customer ID)
        this.config.login_customer_id = this.config.customer_id;
        
        console.log('✅ All credentials collected');
    }

    async storeCredentialsInKeyVault() {
        console.log('\n📋 Step 6: Storing credentials in Azure Key Vault...');
        
        const credentials = [
            { name: 'google-ads-client-id', value: this.config.oauth2_client_id },
            { name: 'google-ads-client-secret', value: this.config.oauth2_client_secret },
            { name: 'google-ads-refresh-token', value: this.config.refresh_token },
            { name: 'google-ads-developer-token', value: this.config.developer_token },
            { name: 'google-ads-customer-id', value: this.config.customer_id },
            { name: 'google-ads-login-customer-id', value: this.config.login_customer_id }
        ];
        
        for (const cred of credentials) {
            try {
                execSync(`az keyvault secret set --vault-name ${this.vaultName} --name ${cred.name} --value "${cred.value}"`, 
                    { encoding: 'utf8' });
                console.log(`✅ Stored: ${cred.name}`);
            } catch (error) {
                console.error(`❌ Failed to store ${cred.name}: ${error.message}`);
                throw error;
            }
        }
        
        console.log('✅ All credentials stored in Azure Key Vault');
    }

    async testAPIConnectivity() {
        console.log('\n📋 Step 7: Testing API connectivity...');
        
        try {
            // Create a simple test configuration file
            const testConfig = {
                client_id: this.config.oauth2_client_id,
                client_secret: this.config.oauth2_client_secret,
                refresh_token: this.config.refresh_token,
                developer_token: this.config.developer_token,
                customer_id: this.config.customer_id.replace(/-/g, ''), // Remove dashes for API
                login_customer_id: this.config.login_customer_id.replace(/-/g, '')
            };
            
            // Save test config (temporarily)
            const configPath = path.join(__dirname, '../test/google-ads-test-config.json');
            await fs.writeJson(configPath, testConfig, { spaces: 2 });
            
            console.log('✅ Test configuration created');
            console.log('⚠️  Ready for API connectivity test');
            console.log(`📁 Config saved to: ${configPath}`);
            
        } catch (error) {
            console.error(`❌ Test setup failed: ${error.message}`);
        }
    }

    askQuestion(question) {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async generateConfigSummary() {
        console.log('\n📊 GOOGLE ADS API CONFIGURATION SUMMARY');
        console.log('=' .repeat(50));
        console.log(`📱 Project ID: ${this.projectId}`);
        console.log(`🔑 Client ID: ${this.config.oauth2_client_id?.substring(0, 20)}...`);
        console.log(`🔐 Client Secret: ${this.config.oauth2_client_secret ? '***Configured***' : 'Not set'}`);
        console.log(`🔄 Refresh Token: ${this.config.refresh_token ? '***Configured***' : 'Not set'}`);
        console.log(`🛠️  Developer Token: ${this.config.developer_token ? '***Configured***' : 'Not set'}`);
        console.log(`👤 Customer ID: ${this.config.customer_id}`);
        console.log(`🔐 Login Customer ID: ${this.config.login_customer_id}`);
        console.log('=' .repeat(50));
    }
}

// Run setup if called directly
if (require.main === module) {
    const setup = new GoogleAdsAuthSetup();
    
    setup.setupAuthentication()
        .then(async () => {
            await setup.generateConfigSummary();
            console.log('\n🎉 Google Ads API authentication setup complete!');
            console.log('\n🚀 Next steps:');
            console.log('1. Run: node test/google-ads-connectivity-test.js');
            console.log('2. Run: node src/platforms/google/GoogleAdsAutomation.js');
            console.log('3. Deploy campaigns with: node deploy/google-ads-campaign-deploy.js');
        })
        .catch(error => {
            console.error('\n💥 Setup failed:', error.message);
            process.exit(1);
        });
}

module.exports = GoogleAdsAuthSetup;
