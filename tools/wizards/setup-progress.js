#!/usr/bin/env node

/**
 * Setup Progress Tracker
 * Tracks completion of credential setup and provides next steps
 */

const { execSync } = require('child_process');

class SetupProgressTracker {
    constructor() {
        this.keyVaultName = 'mortgage-campaign-kv';
        this.setupSteps = {
            'm365_portal': { name: 'Azure Portal Setup', required: true, completed: false },
            'm365_credentials': { name: 'M365 Credentials Stored', required: true, completed: false },
            'twilio_setup': { name: 'Twilio Account Setup', required: false, completed: false },
            'sendgrid_setup': { name: 'SendGrid Account Setup', required: false, completed: false },
            'communication_stored': { name: 'Communication Credentials Stored', required: false, completed: false },
            'validation_passed': { name: 'Full Validation Passed', required: true, completed: false }
        };
    }

    async trackProgress() {
        console.log('📊 SETUP PROGRESS TRACKER');
        console.log('='.repeat(30));
        console.log('Tracking automation setup progress...\n');
        
        try {
            await this.checkProgressStatus();
            await this.showProgressReport();
            await this.provideNextSteps();
            
        } catch (error) {
            console.error('❌ Progress tracking failed:', error.message);
        }
    }

    async checkProgressStatus() {
        console.log('🔍 Checking setup progress...\n');
        
        // Check M365 credentials
        const m365Complete = await this.checkM365Credentials();
        this.setupSteps.m365_credentials.completed = m365Complete;
        
        // Check communication credentials
        const commComplete = await this.checkCommunicationCredentials();
        this.setupSteps.communication_stored.completed = commComplete;
        
        // If we have M365, consider portal setup done
        if (m365Complete) {
            this.setupSteps.m365_portal.completed = true;
        }
        
        // Check if validation would pass
        try {
            if (m365Complete) {
                // Run a quick validation test
                execSync('node tests/credential-validator.js 2>/dev/null', { stdio: 'pipe' });
                this.setupSteps.validation_passed.completed = true;
            }
        } catch (error) {
            // Validation not passing yet
        }
    }

    async checkM365Credentials() {
        const m365Creds = ['microsoft-tenant-id', 'microsoft-client-id', 'microsoft-client-secret'];
        
        for (const cred of m365Creds) {
            try {
                const result = execSync(
                    `az keyvault secret show --vault-name ${this.keyVaultName} --name "${cred}" --query "value" -o tsv 2>/dev/null`,
                    { encoding: 'utf8' }
                ).trim();
                
                if (!result || result === '') {
                    return false;
                }
            } catch (error) {
                return false;
            }
        }
        
        return true;
    }

    async checkCommunicationCredentials() {
        const commCreds = ['twilio-account-sid', 'sendgrid-api-key'];
        let foundCount = 0;
        
        for (const cred of commCreds) {
            try {
                const result = execSync(
                    `az keyvault secret show --vault-name ${this.keyVaultName} --name "${cred}" --query "value" -o tsv 2>/dev/null`,
                    { encoding: 'utf8' }
                ).trim();
                
                if (result && result !== '') {
                    foundCount++;
                }
            } catch (error) {
                // Expected if not set
            }
        }
        
        return foundCount >= 1; // At least one communication method
    }

    async showProgressReport() {
        console.log('📋 SETUP PROGRESS REPORT:');
        console.log('='.repeat(30));
        
        let completedRequired = 0;
        let totalRequired = 0;
        let completedOptional = 0;
        let totalOptional = 0;
        
        for (const [key, step] of Object.entries(this.setupSteps)) {
            const status = step.completed ? '✅' : '❌';
            const priority = step.required ? '🔴 REQUIRED' : '🟡 OPTIONAL';
            
            console.log(`${status} ${step.name} (${priority})`);
            
            if (step.required) {
                totalRequired++;
                if (step.completed) completedRequired++;
            } else {
                totalOptional++;
                if (step.completed) completedOptional++;
            }
        }
        
        const requiredPercentage = Math.round((completedRequired / totalRequired) * 100);
        const optionalPercentage = totalOptional > 0 ? Math.round((completedOptional / totalOptional) * 100) : 0;
        
        console.log(`\n📊 Required steps: ${completedRequired}/${totalRequired} (${requiredPercentage}%)`);
        console.log(`📊 Optional steps: ${completedOptional}/${totalOptional} (${optionalPercentage}%)`);
        
        // Overall status
        if (requiredPercentage === 100) {
            console.log('\n🚀 READY FOR DEPLOYMENT! All required steps completed.');
        } else if (requiredPercentage >= 50) {
            console.log('\n⚡ PARTIAL SETUP: Core functionality available, more setup needed.');
        } else {
            console.log('\n🔧 INITIAL SETUP: More configuration needed for deployment.');
        }
    }

    async provideNextSteps() {
        console.log('\n🎯 IMMEDIATE NEXT STEPS:');
        console.log('='.repeat(25));
        
        if (!this.setupSteps.m365_credentials.completed) {
            console.log('🔵 STEP 1: Complete Microsoft 365 Setup');
            console.log('   📋 If you haven\'t finished Azure Portal setup:');
            console.log('      • Go to: https://portal.azure.com');
            console.log('      • Follow: node setup/microsoft365-setup.js');
            console.log('   🤝 If you have the credentials ready:');
            console.log('      • Run: node setup/m365-credential-input.js');
            console.log('');
        }
        
        if (!this.setupSteps.communication_stored.completed) {
            console.log('📱 STEP 2: Set up Communication APIs');
            console.log('   📧 SendGrid (Email automation):');
            console.log('      • Sign up: https://sendgrid.com');
            console.log('      • Get API key (Full Access)');
            console.log('      • Store: az keyvault secret set --vault-name mortgage-campaign-kv --name "sendgrid-api-key" --value "YOUR_API_KEY"');
            console.log('   📲 Twilio (SMS automation):');
            console.log('      • Sign up: https://twilio.com');
            console.log('      • Get Account SID + Auth Token');
            console.log('      • Store: az keyvault secret set --vault-name mortgage-campaign-kv --name "twilio-account-sid" --value "YOUR_SID"');
            console.log('');
        }
        
        if (this.setupSteps.m365_credentials.completed && !this.setupSteps.validation_passed.completed) {
            console.log('✅ STEP 3: Validate Complete Setup');
            console.log('   🧪 Test credentials: node tests/credential-validator.js');
            console.log('   🎯 Test D365: node src/integrations/complete-d365-integration.js');
            console.log('   📊 Full assessment: node tests/automation-assessment.js');
            console.log('');
        }
        
        if (this.setupSteps.validation_passed.completed) {
            console.log('🚀 READY FOR DEPLOYMENT!');
            console.log('   🎯 Deploy Google Ads campaigns');
            console.log('   📊 Start lead generation and capture');
            console.log('   🔄 Monitor automation performance');
            console.log('');
        }
        
        console.log('💡 HELPFUL COMMANDS:');
        console.log('   🔍 Check progress: node setup/setup-progress.js');
        console.log('   📊 Check credentials: node setup/credential-status.js');
        console.log('   🎯 Full wizard: node setup/credentials-wizard.js');
    }
}

// Execute if run directly
if (require.main === module) {
    const tracker = new SetupProgressTracker();
    tracker.trackProgress()
        .then(() => {
            console.log('\n📈 Progress tracking complete!');
        })
        .catch(error => {
            console.error('❌ Progress tracking failed:', error.message);
            process.exit(1);
        });
}

module.exports = { SetupProgressTracker };
