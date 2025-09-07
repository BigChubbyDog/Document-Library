#!/usr/bin/env node

/**
 * Facebook Business Manager Interactive Setup Guide
 * Real-time assistance for setting up Facebook permissions
 */

console.log('🏢 FACEBOOK BUSINESS MANAGER - INTERACTIVE SETUP');
console.log('=' .repeat(55));

console.log('\n✅ EXCELLENT CHOICE! Business Manager is the best approach.');
console.log('📈 This will give you enterprise-grade Facebook automation capabilities.');

console.log('\n🎯 CURRENT STATUS:');
console.log('• Business Manager is open in your browser');
console.log('• We need to set up proper permissions for automated campaigns');
console.log('• Target: Get Facebook from 0% to 95%+ operational');

console.log('\n📋 STEP-BY-STEP WALKTHROUGH:');

console.log('\n🔸 STEP 1: VERIFY BUSINESS MANAGER ACCESS');
console.log('   👀 In your browser, you should see:');
console.log('   • Facebook Business Manager dashboard');
console.log('   • URL: https://business.facebook.com');
console.log('   • Blue "Business Settings" button or gear icon');
console.log('   ✅ If you see this, proceed to Step 2');
console.log('   ❌ If not logged in, sign in with your Facebook account');

console.log('\n🔸 STEP 2: ACCESS BUSINESS SETTINGS');
console.log('   📍 Look for and click:');
console.log('   • "Business Settings" (usually top-right corner)');
console.log('   • OR the gear/settings icon');
console.log('   • This opens the Business Settings panel');

console.log('\n🔸 STEP 3: ADD YOUR PAGE');
console.log('   📍 In the left sidebar, find:');
console.log('   • "Accounts" section');
console.log('   • Click "Pages"');
console.log('   • Click "Add" button');
console.log('   • Select "Add a Page"');
console.log('   • Search for: "Mortgage Loans Co"');
console.log('   • OR enter Page ID: 102409121765907');
console.log('   • Click "Add Page"');

console.log('\n🔸 STEP 4: ADD YOUR AD ACCOUNT');
console.log('   📍 Still in "Accounts" section:');
console.log('   • Click "Ad Accounts"');
console.log('   • Click "Add" button');
console.log('   • Select "Add an Ad Account"');
console.log('   • Enter Ad Account ID: 1170970241206263');
console.log('   • Click "Add Ad Account"');

console.log('\n🔸 STEP 5: CREATE SYSTEM USER');
console.log('   📍 In the left sidebar:');
console.log('   • Go to "Users" section');
console.log('   • Click "System Users"');
console.log('   • Click "Add" button');
console.log('   • Enter Name: "Mortgage Campaign Bot"');
console.log('   • Select Role: "Admin"');
console.log('   • Click "Create System User"');

console.log('\n🔸 STEP 6: ASSIGN ASSETS');
console.log('   📍 Click on your new system user:');
console.log('   • Click "Add Assets" button');
console.log('   • Pages tab:');
console.log('     - Find "Mortgage Loans Co"');
console.log('     - Check "Manage" permission');
console.log('   • Ad Accounts tab:');
console.log('     - Find your ad account (1170970241206263)');
console.log('     - Check "Manage" permission');
console.log('   • Click "Save Changes"');

console.log('\n🔸 STEP 7: GENERATE TOKEN');
console.log('   📍 With your system user selected:');
console.log('   • Click "Generate New Token"');
console.log('   • App dropdown: Select any app (or create new one)');
console.log('   • Permissions: Check these boxes:');
console.log('     ✔️  ads_management');
console.log('     ✔️  ads_read');
console.log('     ✔️  pages_manage_ads');
console.log('     ✔️  pages_read_engagement');
console.log('     ✔️  business_management');
console.log('   • Token Expiration: "Never" (for production)');
console.log('   • Click "Generate Token"');
console.log('   • 📋 COPY THE TOKEN (200+ characters)');

console.log('\n⚡ ONCE YOU HAVE THE TOKEN:');
console.log('1. Copy the full token from Business Manager');
console.log('2. Run this command to update it:');
console.log('   \x1b[33m%s\x1b[0m', 'node config/update-facebook-token.js');
console.log('3. The script will automatically validate and test the token');

console.log('\n🆘 IF YOU GET STUCK:');
console.log('• Missing "Business Settings"? Look for gear icon or settings menu');
console.log('• Can\'t find pages/ad accounts? Make sure you\'re an admin');
console.log('• No "System Users" option? Your account might need Business Manager access');
console.log('• Permissions grayed out? Try creating a new Facebook app first');

console.log('\n💡 ALTERNATIVE IF BUSINESS MANAGER DOESN\'T WORK:');
console.log('If you encounter issues, we can:');
console.log('1. Deploy without Facebook (85% system confidence)');
console.log('2. Start with Google Ads, LinkedIn, Microsoft campaigns');
console.log('3. Add Facebook manually or later via different method');

console.log('\n📞 STATUS CHECK:');
console.log('Are you able to see Business Settings in your browser?');
console.log('If yes: Continue with the steps above');
console.log('If no: Let me know what you see and I\'ll provide alternative guidance');

console.log('\n' + '='.repeat(55));
console.log('🎯 GOAL: Get Facebook token → Update Key Vault → 95%+ confidence');
console.log('⏱️  Expected time: 5-10 minutes');
console.log('🎉 Reward: Full automated campaign deployment ready!');
console.log('=' .repeat(55));
