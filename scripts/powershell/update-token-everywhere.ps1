# Update Facebook Token in Azure Key Vault and GitHub Secrets
# Mortgage Loans Co - Smart Orchestrator Integration

param(
    [string]$NewToken = "EAAJWVKZAz39kBPCA04P7aG1m5q8EFMiT2ZCPrDxNnuU7rGnRZCd4tNO2QRqcxheHFLLsZAn6bgrOR5wZCFRma4IzxgUHG9RGisVwxwLnE5cTWLH6PIdr1hqEaUuZCXQBGmiYHZBZAIez0xuUsd730ZBVm8BrHqPO4ZBGF3BUmVzbbHiWUtZCh2wM9jfnRHutGKNDQZDZD"
)

Write-Host "`n🔐 UPDATING FACEBOOK TOKEN ACROSS ALL SYSTEMS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

# 1. UPDATE AZURE KEY VAULT
Write-Host "☁️  UPDATING AZURE KEY VAULT..." -ForegroundColor Green

# Login to Azure if needed
$context = Get-AzContext
if (-not $context) {
    Write-Host "   Logging into Azure..." -ForegroundColor Yellow
    Connect-AzAccount
}

# Set the correct subscription
Set-AzContext -SubscriptionId "993c0726-3416-41c5-a963-027d0ae895c7"

# Key Vault name (from your MortgageLoans-Website repo)
$vaultName = "communications-hub-kv"

try {
    # Update Facebook Access Token
    Write-Host "   Updating FB-ACCESS-TOKEN..." -ForegroundColor White
    $secretValue = ConvertTo-SecureString $NewToken -AsPlainText -Force
    Set-AzKeyVaultSecret -VaultName $vaultName -Name "FB-ACCESS-TOKEN" -SecretValue $secretValue -Tag @{
        platform = "azure-enterprise"
        business = "mortgage-loans"
        service = "facebook-api"
        priority = "high"
        updated = (Get-Date).ToString("yyyy-MM-dd")
    } | Out-Null
    Write-Host "   ✅ FB-ACCESS-TOKEN updated" -ForegroundColor Green

    # Also update Instagram token (same token)
    Write-Host "   Updating INSTAGRAM-ACCESS-TOKEN..." -ForegroundColor White
    Set-AzKeyVaultSecret -VaultName $vaultName -Name "INSTAGRAM-ACCESS-TOKEN" -SecretValue $secretValue -Tag @{
        platform = "azure-enterprise"
        business = "mortgage-loans"
        service = "instagram-api"
        priority = "high"
        updated = (Get-Date).ToString("yyyy-MM-dd")
    } | Out-Null
    Write-Host "   ✅ INSTAGRAM-ACCESS-TOKEN updated" -ForegroundColor Green

    Write-Host "`n   ✅ Azure Key Vault updated successfully!" -ForegroundColor Green

} catch {
    Write-Host "   ❌ Error updating Azure Key Vault: $_" -ForegroundColor Red
}

Write-Host ""

# 2. UPDATE GITHUB SECRETS
Write-Host "🐙 UPDATING GITHUB SECRETS..." -ForegroundColor Green

# Update for mortgage-campaign-intelligence repo
Write-Host "   Updating mortgage-campaign-intelligence repo..." -ForegroundColor White
gh secret set FB_ACCESS_TOKEN --body="$NewToken" --repo BigChubbyDog/mortgage-campaign-intelligence
gh secret set INSTAGRAM_ACCESS_TOKEN --body="$NewToken" --repo BigChubbyDog/mortgage-campaign-intelligence
Write-Host "   ✅ Secrets updated for mortgage-campaign-intelligence" -ForegroundColor Green

# Update for MortgageLoans-Website repo
Write-Host "   Updating MortgageLoans-Website repo..." -ForegroundColor White
gh secret set FB_ACCESS_TOKEN --body="$NewToken" --repo BigChubbyDog/MortgageLoans-Website
gh secret set INSTAGRAM_ACCESS_TOKEN --body="$NewToken" --repo BigChubbyDog/MortgageLoans-Website
Write-Host "   ✅ Secrets updated for MortgageLoans-Website" -ForegroundColor Green

# Update organization secrets if you have access
Write-Host "`n   Updating organization-level secrets..." -ForegroundColor White
try {
    gh secret set FB_ACCESS_TOKEN --body="$NewToken" --org BigChubbyDog
    gh secret set INSTAGRAM_ACCESS_TOKEN --body="$NewToken" --org BigChubbyDog
    Write-Host "   ✅ Organization secrets updated" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not update org-level secrets (may need owner permissions)" -ForegroundColor Yellow
}

Write-Host ""

# 3. UPDATE LOCAL ENV FILES
Write-Host "📁 UPDATING LOCAL ENVIRONMENT FILES..." -ForegroundColor Green

# Update mortgage-campaign-intelligence .env
$envPath1 = "C:\Users\dusta\repos\mortgage-campaign-intelligence\.env"
if (Test-Path $envPath1) {
    $content = Get-Content $envPath1 -Raw
    $content = $content -replace 'FB_ACCESS_TOKEN=.*', "FB_ACCESS_TOKEN=$NewToken"
    $content = $content -replace 'INSTAGRAM_ACCESS_TOKEN=.*', "INSTAGRAM_ACCESS_TOKEN=$NewToken"
    Set-Content -Path $envPath1 -Value $content -NoNewline
    Write-Host "   ✅ Updated $envPath1" -ForegroundColor Green
}

# Update MortgageLoans-Website .env if exists
$envPath2 = "C:\Users\dusta\repos\MortgageLoans-Website\.env"
if (Test-Path $envPath2) {
    $content = Get-Content $envPath2 -Raw
    $content = $content -replace 'FB_ACCESS_TOKEN=.*', "FB_ACCESS_TOKEN=$NewToken"
    $content = $content -replace 'INSTAGRAM_ACCESS_TOKEN=.*', "INSTAGRAM_ACCESS_TOKEN=$NewToken"
    Set-Content -Path $envPath2 -Value $content -NoNewline
    Write-Host "   ✅ Updated $envPath2" -ForegroundColor Green
}

Write-Host ""

# 4. VERIFY UPDATES
Write-Host "🔍 VERIFYING UPDATES..." -ForegroundColor Green

# Check Azure Key Vault
Write-Host "   Checking Azure Key Vault..." -ForegroundColor White
$secret = Get-AzKeyVaultSecret -VaultName $vaultName -Name "FB-ACCESS-TOKEN" -AsPlainText
if ($secret -eq $NewToken) {
    Write-Host "   ✅ Azure Key Vault verified" -ForegroundColor Green
} else {
    Write-Host "   ❌ Azure Key Vault verification failed" -ForegroundColor Red
}

# Check GitHub Secrets (list only, can't read values)
Write-Host "   Checking GitHub Secrets..." -ForegroundColor White
$secrets = gh secret list --repo BigChubbyDog/mortgage-campaign-intelligence | Select-String "FB_ACCESS_TOKEN"
if ($secrets) {
    Write-Host "   ✅ GitHub Secrets exist (values hidden)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Could not verify GitHub Secrets" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ TOKEN UPDATE COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   • Azure Key Vault: Updated" -ForegroundColor White
Write-Host "   • GitHub Secrets: Updated" -ForegroundColor White
Write-Host "   • Local .env files: Updated" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Restart any running services to pick up new token" -ForegroundColor White
Write-Host "   2. Trigger GitHub Actions to use updated secrets" -ForegroundColor White
Write-Host "   3. Test Facebook API calls with new token" -ForegroundColor White
Write-Host ""