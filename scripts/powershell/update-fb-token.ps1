# Update Facebook Token in Azure Key Vault and GitHub
param(
    [string]$NewToken = "EAAJWVKZAz39kBPCA04P7aG1m5q8EFMiT2ZCPrDxNnuU7rGnRZCd4tNO2QRqcxheHFLLsZAn6bgrOR5wZCFRma4IzxgUHG9RGisVwxwLnE5cTWLH6PIdr1hqEaUuZCXQBGmiYHZBZAIez0xuUsd730ZBVm8BrHqPO4ZBGF3BUmVzbbHiWUtZCh2wM9jfnRHutGKNDQZDZD"
)

Write-Host ""
Write-Host "UPDATING FACEBOOK TOKEN ACROSS ALL SYSTEMS" -ForegroundColor Cyan
Write-Host ""

# UPDATE AZURE KEY VAULT
Write-Host "UPDATING AZURE KEY VAULT..." -ForegroundColor Green

# Login to Azure if needed
$context = Get-AzContext
if (-not $context) {
    Write-Host "Logging into Azure..." -ForegroundColor Yellow
    Connect-AzAccount
}

# Set subscription
Set-AzContext -SubscriptionId "993c0726-3416-41c5-a963-027d0ae895c7" | Out-Null

$vaultName = "communications-hub-kv"

try {
    # Update Facebook Token
    Write-Host "Updating FB-ACCESS-TOKEN..." -ForegroundColor White
    $secretValue = ConvertTo-SecureString $NewToken -AsPlainText -Force
    $tags = @{
        platform = "azure-enterprise"
        business = "mortgage-loans"
        service = "facebook-api"
        priority = "high"
        updated = (Get-Date).ToString("yyyy-MM-dd")
    }
    Set-AzKeyVaultSecret -VaultName $vaultName -Name "FB-ACCESS-TOKEN" -SecretValue $secretValue -Tag $tags | Out-Null
    Write-Host "FB-ACCESS-TOKEN updated" -ForegroundColor Green

    # Update Instagram Token
    Write-Host "Updating INSTAGRAM-ACCESS-TOKEN..." -ForegroundColor White
    $tags.service = "instagram-api"
    Set-AzKeyVaultSecret -VaultName $vaultName -Name "INSTAGRAM-ACCESS-TOKEN" -SecretValue $secretValue -Tag $tags | Out-Null
    Write-Host "INSTAGRAM-ACCESS-TOKEN updated" -ForegroundColor Green

    Write-Host "Azure Key Vault updated successfully!" -ForegroundColor Green

} catch {
    Write-Host "Error updating Azure Key Vault: $_" -ForegroundColor Red
}

Write-Host ""

# UPDATE GITHUB SECRETS
Write-Host "UPDATING GITHUB SECRETS..." -ForegroundColor Green

# Update mortgage-campaign-intelligence
Write-Host "Updating mortgage-campaign-intelligence repo..." -ForegroundColor White
gh secret set FB_ACCESS_TOKEN --body="$NewToken" --repo BigChubbyDog/mortgage-campaign-intelligence 2>$null
gh secret set INSTAGRAM_ACCESS_TOKEN --body="$NewToken" --repo BigChubbyDog/mortgage-campaign-intelligence 2>$null
Write-Host "Secrets updated for mortgage-campaign-intelligence" -ForegroundColor Green

# Update MortgageLoans-Website
Write-Host "Updating MortgageLoans-Website repo..." -ForegroundColor White
gh secret set FB_ACCESS_TOKEN --body="$NewToken" --repo BigChubbyDog/MortgageLoans-Website 2>$null
gh secret set INSTAGRAM_ACCESS_TOKEN --body="$NewToken" --repo BigChubbyDog/MortgageLoans-Website 2>$null
Write-Host "Secrets updated for MortgageLoans-Website" -ForegroundColor Green

Write-Host ""

# UPDATE LOCAL ENV FILES
Write-Host "UPDATING LOCAL ENVIRONMENT FILES..." -ForegroundColor Green

# Update mortgage-campaign-intelligence .env
$envPath1 = ".env"
if (Test-Path $envPath1) {
    $content = Get-Content $envPath1 -Raw
    $content = $content -replace 'FB_ACCESS_TOKEN=.*', "FB_ACCESS_TOKEN=$NewToken"
    $content = $content -replace 'INSTAGRAM_ACCESS_TOKEN=.*', "INSTAGRAM_ACCESS_TOKEN=$NewToken"
    Set-Content -Path $envPath1 -Value $content -NoNewline
    Write-Host "Updated $envPath1" -ForegroundColor Green
}

Write-Host ""
Write-Host "TOKEN UPDATE COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- Azure Key Vault: Updated" -ForegroundColor White
Write-Host "- GitHub Secrets: Updated" -ForegroundColor White
Write-Host "- Local env files: Updated" -ForegroundColor White
Write-Host ""