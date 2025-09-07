#!/usr/bin/env node

/**
 * Facebook Token Update Helper
 * Quick way to update your Facebook token in Azure Key Vault
 */

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔑 FACEBOOK TOKEN UPDATE HELPER');
console.log('=' .repeat(40));

console.log('\n📋 INSTRUCTIONS:');
console.log('1. Facebook Business Manager should be open in your browser');
console.log('2. Follow the Business Manager guide to generate your system user token');
console.log('3. Copy the token (should start with "EAA..." and be 200+ chars)');
console.log('4. Paste it below to update Azure Key Vault');

console.log('\n⚠️  IMPORTANT: Make sure you have:');
console.log('• Created a System User in Business Manager');
console.log('• Assigned "Mortgage Loans Co" page with Manage permissions');
console.log('• Assigned ad account (1170970241206263) with Manage permissions');
console.log('• Generated token with all required permissions');
console.log('• Set token expiration to "Never"');

rl.question('\n🔑 Paste your Business Manager system user token here: ', (token) => {
    
    // Validate token format
    if (!token || token.length < 100) {
        console.log('❌ Token appears too short. Expected 200+ characters.');
        console.log('💡 Make sure you copied the full token from Business Manager.');
        rl.close();
        return;
    }
    
    if (!token.startsWith('EAA')) {
        console.log('❌ Token should start with "EAA"');
        console.log('💡 Make sure you got the System User token from Business Manager.');
        rl.close();
        return;
    }
    
    console.log(`\n✅ Token format looks good (${token.length} characters)`);
    console.log('📤 Updating Azure Key Vault...');
    
    try {
        // Update Key Vault
        execSync(`az keyvault secret set --vault-name mortgage-leads-kv-2025 --name facebook-access-token --value "${token}"`, 
            { stdio: 'inherit' });
        
        console.log('\n✅ Token successfully updated in Azure Key Vault!');
        console.log('\n🔍 Running validation...');
        
        // Run validation
        const { validateFacebookToken } = require('./facebook-token-validator.js');
        validateFacebookToken()
            .then(success => {
                if (success) {
                    console.log('\n🎉 SUCCESS! Facebook Marketing is now operational!');
                    console.log('📈 Running full system validation...');
                    
                    // Run full system validation
                    execSync('node tests/system-validation.js', { stdio: 'inherit' });
                    
                } else {
                    console.log('\n⚠️  Token updated but validation found issues');
                    console.log('📋 You may need to add more permissions in Facebook');
                }
                rl.close();
            })
            .catch(error => {
                console.log('❌ Validation error:', error.message);
                rl.close();
            });
            
    } catch (error) {
        console.log('❌ Failed to update Key Vault:', error.message);
        rl.close();
    }
});

// Handle Ctrl+C
rl.on('SIGINT', () => {
    console.log('\n❌ Update cancelled');
    rl.close();
});
