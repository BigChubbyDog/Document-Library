# Setup GitHub Secrets from Azure Key Vault
# Transfers API keys from Azure Key Vault to GitHub repository secrets

Write-Host "🔑 Setting up GitHub Secrets from Azure Key Vault..." -ForegroundColor Green

$vault = "BCD-Central-KV"
$repo = "BigChubbyDog/mortgage-campaign-intelligence"

# Mapping Azure Key Vault secrets to GitHub secret names
$secretMappings = @{
    "anthropic-claude-api-key" = "ANTHROPIC_API_KEY"
    "mlc-meta-access-token" = "FB_ACCESS_TOKEN"
    "mlc-meta-app-id" = "FB_APP_ID"
    "mlc-meta-business-id" = "FB_AD_ACCOUNT_ID"
    "mlc-meta-page-id" = "FB_PAGE_ID"
    "mlc-instagram-access-token" = "INSTAGRAM_ACCESS_TOKEN"
    "mlc-instagram-business-id" = "INSTAGRAM_BUSINESS_ACCOUNT_ID"
    "mlc-linkedin-app-id" = "LINKEDIN_CLIENT_ID"
    "mlc-linkedin-app-secret" = "LINKEDIN_CLIENT_SECRET"
}

Write-Host "📊 Processing $($secretMappings.Count) API credentials..." -ForegroundColor Yellow

foreach ($kvSecret in $secretMappings.Keys) {
    $ghSecret = $secretMappings[$kvSecret]
    
    try {
        Write-Host "  🔄 Processing $kvSecret → $ghSecret..." -ForegroundColor Cyan
        
        # Get secret from Azure Key Vault
        $secretValue = az keyvault secret show --vault-name $vault --name $kvSecret --query "value" -o tsv
        
        if ($secretValue -and $secretValue -ne "null") {
            # Set GitHub secret
            $secretValue | gh secret set $ghSecret --repo $repo
            Write-Host "  ✅ $ghSecret configured successfully" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  $kvSecret not found or empty in Key Vault" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "  ❌ Failed to process $kvSecret`: $_" -ForegroundColor Red
    }
}

# Check if Teams webhook exists and set it up
Write-Host "`n📞 Setting up Teams webhook..." -ForegroundColor Yellow
try {
    # You'll need to provide your Teams webhook URL
    Write-Host "⚠️  Teams webhook needs to be configured manually." -ForegroundColor Yellow
    Write-Host "   Go to your Teams channel → Connectors → Incoming Webhook" -ForegroundColor Gray
    Write-Host "   Then run: echo 'YOUR_WEBHOOK_URL' | gh secret set TEAMS_WEBHOOK --repo $repo" -ForegroundColor Gray
} catch {
    Write-Host "❌ Teams webhook setup failed: $_" -ForegroundColor Red
}

# Additional Reddit credentials (if needed)
Write-Host "`n🔍 Reddit credentials..." -ForegroundColor Yellow
Write-Host "⚠️  Reddit may need additional setup:" -ForegroundColor Yellow
Write-Host "   - REDDIT_CLIENT_ID" -ForegroundColor Gray
Write-Host "   - REDDIT_CLIENT_SECRET" -ForegroundColor Gray
Write-Host "   - REDDIT_USERNAME" -ForegroundColor Gray
Write-Host "   - REDDIT_PASSWORD" -ForegroundColor Gray

Write-Host "`n🎉 GitHub Secrets setup complete!" -ForegroundColor Green
Write-Host "📊 Run the connectivity test to verify: node test-api-connectivity.js" -ForegroundColor Cyan