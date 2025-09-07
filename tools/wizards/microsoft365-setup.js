#!/usr/bin/env node

/**
 * Microsoft 365 Setup Assistant
 * Step-by-step guide specifically for Microsoft 365 credentials
 */

class Microsoft365SetupAssistant {
    constructor() {
        this.keyVaultName = 'mortgage-campaign-kv';
    }

    async showSetupGuide() {
        console.log('🔵 MICROSOFT 365 SETUP ASSISTANT');
        console.log('='.repeat(40));
        console.log('This guide will help you get Microsoft 365 credentials for D365 integration.\n');
        
        this.showStepByStepInstructions();
        this.showSetupCommands();
        this.showValidationSteps();
        this.showTroubleshootingTips();
    }

    showStepByStepInstructions() {
        console.log('📋 STEP-BY-STEP INSTRUCTIONS:');
        console.log('='.repeat(35));
        
        console.log('🌐 STEP 1: Go to Azure Portal');
        console.log('   URL: https://portal.azure.com');
        console.log('   Sign in with your Azure account\n');
        
        console.log('🆔 STEP 2: Get Tenant ID');
        console.log('   1. Click "Azure Active Directory" in the left menu');
        console.log('   2. Click "Overview" in the left sidebar');
        console.log('   3. Copy the "Tenant ID" (it looks like: 12345678-1234-1234-1234-123456789012)');
        console.log('   4. Keep this value - you\'ll need it for the command below\n');
        
        console.log('📱 STEP 3: Create App Registration');
        console.log('   1. Still in Azure Active Directory, click "App registrations"');
        console.log('   2. Click "New registration"');
        console.log('   3. Name: "Mortgage Campaign Intelligence"');
        console.log('   4. Supported account types: "Accounts in this organizational directory only"');
        console.log('   5. Redirect URI: Leave blank for now');
        console.log('   6. Click "Register"\n');
        
        console.log('🆔 STEP 4: Get Application ID');
        console.log('   1. After registration, you\'ll see the app overview');
        console.log('   2. Copy the "Application (client) ID"');
        console.log('   3. Keep this value - you\'ll need it for the command below\n');
        
        console.log('🔐 STEP 5: Create Client Secret');
        console.log('   1. In your app registration, click "Certificates & secrets"');
        console.log('   2. Click "New client secret"');
        console.log('   3. Description: "Campaign Automation Secret"');
        console.log('   4. Expires: "24 months"');
        console.log('   5. Click "Add"');
        console.log('   6. IMMEDIATELY copy the secret VALUE (not the ID!)');
        console.log('   ⚠️  You can only see this value once!\n');
        
        console.log('🔑 STEP 6: Set API Permissions');
        console.log('   1. Click "API permissions"');
        console.log('   2. Click "Add a permission"');
        console.log('   3. Click "Microsoft Graph"');
        console.log('   4. Click "Application permissions"');
        console.log('   5. Search for and select these permissions:');
        console.log('      • User.Read.All');
        console.log('      • Directory.Read.All');
        console.log('      • Mail.Send');
        console.log('   6. Click "Add permissions"');
        console.log('   7. Click "Add a permission" again');
        console.log('   8. Click "Dynamics CRM"');
        console.log('   9. Click "Application permissions"');
        console.log('   10. Select "user_impersonation"');
        console.log('   11. Click "Add permissions"');
        console.log('   12. Click "Grant admin consent" (you must be an admin)');
        console.log('   13. Click "Yes" to confirm\n');
    }

    showSetupCommands() {
        console.log('💾 STEP 7: Store Credentials in Key Vault');
        console.log('='.repeat(45));
        
        console.log('Once you have all three values, run these commands:');
        console.log('(Replace YOUR_TENANT_ID, YOUR_CLIENT_ID, and YOUR_CLIENT_SECRET with your actual values)\n');
        
        console.log('# Set Microsoft 365 Tenant ID');
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "microsoft-tenant-id" --value "YOUR_TENANT_ID"`);
        console.log('');
        
        console.log('# Set Microsoft 365 Client ID');
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "microsoft-client-id" --value "YOUR_CLIENT_ID"`);
        console.log('');
        
        console.log('# Set Microsoft 365 Client Secret');
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "microsoft-client-secret" --value "YOUR_CLIENT_SECRET"`);
        console.log('\n');
        
        console.log('📋 EXAMPLE (with fake values):');
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "microsoft-tenant-id" --value "12345678-1234-1234-1234-123456789012"`);
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "microsoft-client-id" --value "87654321-4321-4321-4321-210987654321"`);
        console.log(`az keyvault secret set --vault-name ${this.keyVaultName} --name "microsoft-client-secret" --value "abcDEF123456~GHI.JKL_mnoPQR789"`);
        console.log('');
    }

    showValidationSteps() {
        console.log('✅ STEP 8: Validate Setup');
        console.log('='.repeat(25));
        
        console.log('After storing credentials, test them:');
        console.log('');
        console.log('# Test credential storage');
        console.log('node tests/credential-validator.js');
        console.log('');
        console.log('# Test D365 integration');
        console.log('node src/integrations/complete-d365-integration.js');
        console.log('');
        console.log('# Full automation assessment');
        console.log('node tests/automation-assessment.js');
        console.log('');
    }

    showTroubleshootingTips() {
        console.log('🛠️  TROUBLESHOOTING TIPS:');
        console.log('='.repeat(25));
        
        console.log('❌ "Access denied" errors:');
        console.log('   • Make sure you clicked "Grant admin consent"');
        console.log('   • Verify you have admin permissions in Azure AD');
        console.log('   • Check that the app registration is in the correct tenant\n');
        
        console.log('❌ "Secret not found" errors:');
        console.log('   • Make sure you copied the secret VALUE, not the ID');
        console.log('   • Check for extra spaces in the secret value');
        console.log('   • Ensure the Key Vault name is correct\n');
        
        console.log('❌ "Invalid tenant" errors:');
        console.log('   • Double-check the tenant ID format (should be a GUID)');
        console.log('   • Verify you\'re in the correct Azure directory\n');
        
        console.log('❌ "Authentication failed" errors:');
        console.log('   • Wait 5-10 minutes after creating the app registration');
        console.log('   • Azure AD changes can take time to propagate');
        console.log('   • Try running the test again after waiting\n');
        
        console.log('📞 Need help?');
        console.log('   • Check Azure portal notifications for any setup issues');
        console.log('   • Review the Azure AD app registration overview page');
        console.log('   • Ensure all permissions show as "Granted"\n');
    }
}

// Show setup guide if run directly
if (require.main === module) {
    console.log('🚀 Starting Microsoft 365 setup guide...\n');
    
    const assistant = new Microsoft365SetupAssistant();
    assistant.showSetupGuide();
    
    console.log('🎯 READY TO START:');
    console.log('1. Open Azure Portal: https://portal.azure.com');
    console.log('2. Follow the step-by-step instructions above');
    console.log('3. Run the az keyvault commands with your values');
    console.log('4. Test with: node tests/credential-validator.js');
    console.log('\n💡 For guided interactive setup: node setup/credentials-wizard.js\n');
}

module.exports = { Microsoft365SetupAssistant };
