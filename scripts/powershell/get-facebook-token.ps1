# Get Facebook Page Access Token with All Permissions
# Mortgage Loans Co - Full Access Setup

Write-Host "`n🔐 FACEBOOK ACCESS TOKEN GENERATOR" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

Write-Host "This script will guide you through getting a Facebook access token with ALL permissions needed" -ForegroundColor Yellow
Write-Host ""

# Step 1: Open Graph API Explorer
Write-Host "📋 STEP 1: Opening Facebook Graph API Explorer..." -ForegroundColor Green
Start-Process "https://developers.facebook.com/tools/explorer/"
Start-Sleep -Seconds 3

Write-Host "   1. Select your app from the dropdown (or use 'Graph API Explorer')" -ForegroundColor White
Write-Host "   2. Click 'Generate Access Token'" -ForegroundColor White
Write-Host ""

# Step 2: Select Permissions
Write-Host "📋 STEP 2: Select ALL these permissions:" -ForegroundColor Green
$permissions = @(
    "pages_read_engagement",
    "pages_manage_metadata", 
    "pages_read_user_content",
    "pages_manage_ads",
    "pages_show_list",
    "pages_messaging",
    "pages_manage_posts",
    "leads_retrieval",
    "ads_management",
    "business_management",
    "pages_manage_cta",
    "pages_manage_instant_articles",
    "pages_manage_engagement",
    "pages_read_engagement",
    "instagram_basic",
    "instagram_content_publish",
    "instagram_manage_insights",
    "instagram_manage_comments"
)

foreach ($perm in $permissions) {
    Write-Host "   ✓ $perm" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Press Enter when you've selected all permissions..." -ForegroundColor Yellow
Read-Host

# Step 3: Get Page Access Token
Write-Host "📋 STEP 3: Get Page Access Token" -ForegroundColor Green
Write-Host "   1. After generating token, click the 'i' info icon next to the token" -ForegroundColor White
Write-Host "   2. Click 'Open in Access Token Tool'" -ForegroundColor White
Write-Host "   3. At the bottom, click 'Extend Access Token' to make it long-lived" -ForegroundColor White
Write-Host ""

# Step 4: Exchange for Page Token
Write-Host "📋 STEP 4: Exchange for Page Token" -ForegroundColor Green
Write-Host "   1. In the Graph API Explorer, run this query:" -ForegroundColor White
Write-Host "      GET /me/accounts" -ForegroundColor Cyan
Write-Host "   2. Find 'Mortgage Loans Co' in the results" -ForegroundColor White
Write-Host "   3. Copy the 'access_token' for that page" -ForegroundColor White
Write-Host ""

Write-Host "Paste your new PAGE access token here:" -ForegroundColor Yellow
$newToken = Read-Host

if ($newToken) {
    # Update .env.local file
    $envPath = ".env.local"
    $envContent = Get-Content $envPath -Raw
    
    # Update FB_ACCESS_TOKEN
    $envContent = $envContent -replace 'FB_ACCESS_TOKEN=.*', "FB_ACCESS_TOKEN=$newToken"
    
    # Also update INSTAGRAM_ACCESS_TOKEN (same token works for both)
    $envContent = $envContent -replace 'INSTAGRAM_ACCESS_TOKEN=.*', "INSTAGRAM_ACCESS_TOKEN=$newToken"
    
    Set-Content -Path $envPath -Value $envContent -NoNewline
    
    Write-Host ""
    Write-Host "✅ Token updated in .env.local!" -ForegroundColor Green
    
    # Test the new token
    Write-Host ""
    Write-Host "🧪 Testing new token..." -ForegroundColor Cyan
    node check-facebook-permissions.js
    
    Write-Host ""
    Write-Host "✅ Token setup complete!" -ForegroundColor Green
    Write-Host "You can now run: node optimize-existing-facebook.js" -ForegroundColor Yellow
} else {
    Write-Host "❌ No token provided. Please try again." -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Alternative Method: Use Facebook Business Manager" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
Write-Host "1. Go to: https://business.facebook.com/settings/system-users" -ForegroundColor White
Write-Host "2. Create a System User (if not exists)" -ForegroundColor White
Write-Host "3. Assign the system user to your Page with full permissions" -ForegroundColor White
Write-Host "4. Generate a system user token (never expires)" -ForegroundColor White
Write-Host "5. This is the most reliable method for production use" -ForegroundColor Yellow
Write-Host ""