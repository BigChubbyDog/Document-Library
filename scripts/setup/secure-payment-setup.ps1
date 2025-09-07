# Secure Payment Information Setup for Azure Key Vault
# This script helps you securely store payment-related configuration

param(
    [Parameter(Mandatory=$true)]
    [string]$KeyVaultName = "mortgage-secrets-kv",
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "mortgage-campaigns"
)

Write-Host "🔐 SECURE PAYMENT SETUP" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Connect to Azure (if not already connected)
try {
    $context = Get-AzContext
    if (-not $context) {
        Write-Host "🔑 Connecting to Azure..." -ForegroundColor Yellow
        Connect-AzAccount
    }
    Write-Host "✅ Connected to Azure as: $($context.Account.Id)" -ForegroundColor Green
} catch {
    Write-Error "❌ Failed to connect to Azure: $($_.Exception.Message)"
    exit 1
}

# Check if Key Vault exists
try {
    $keyVault = Get-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $ResourceGroup -ErrorAction SilentlyContinue
    if (-not $keyVault) {
        Write-Host "⚠️ Key Vault '$KeyVaultName' not found. Creating..." -ForegroundColor Yellow
        $keyVault = New-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $ResourceGroup -Location "East US"
        Write-Host "✅ Key Vault created successfully" -ForegroundColor Green
    } else {
        Write-Host "✅ Key Vault '$KeyVaultName' found" -ForegroundColor Green
    }
} catch {
    Write-Error "❌ Failed to access/create Key Vault: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "🔒 PAYMENT CONFIGURATION SETUP" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

# Function to securely store secrets
function Store-SecureSecret {
    param(
        [string]$SecretName,
        [string]$Description,
        [bool]$Required = $false
    )
    
    $value = ""
    if ($Required) {
        do {
            $value = Read-Host "Enter $Description" -MaskInput
            if ([string]::IsNullOrWhiteSpace($value)) {
                Write-Host "❌ This field is required" -ForegroundColor Red
            }
        } while ([string]::IsNullOrWhiteSpace($value))
    } else {
        $value = Read-Host "Enter $Description (optional, press Enter to skip)" -MaskInput
    }
    
    if (![string]::IsNullOrWhiteSpace($value)) {
        try {
            $secureValue = ConvertTo-SecureString $value -AsPlainText -Force
            Set-AzKeyVaultSecret -VaultName $KeyVaultName -Name $SecretName -SecretValue $secureValue
            Write-Host "✅ Stored: $SecretName" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to store $SecretName`: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Clear the variable for security
    $value = ""
}

Write-Host "📋 FACEBOOK ADS PAYMENT SETUP" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: For Facebook Ads, add payment method directly in Ads Manager:"
Write-Host "https://www.facebook.com/ads/manager/billing_hub/account_overview/?act=1105491061336856"
Write-Host ""

Write-Host "🏦 STRIPE PAYMENT GATEWAY SECRETS" -ForegroundColor Cyan
Store-SecureSecret -SecretName "stripe-publishable-key" -Description "Stripe Publishable Key" -Required $false
Store-SecureSecret -SecretName "stripe-secret-key" -Description "Stripe Secret Key" -Required $false
Store-SecureSecret -SecretName "stripe-webhook-secret" -Description "Stripe Webhook Secret" -Required $false

Write-Host ""
Write-Host "💳 SQUARE PAYMENT SECRETS" -ForegroundColor Cyan
Store-SecureSecret -SecretName "square-application-id" -Description "Square Application ID" -Required $false
Store-SecureSecret -SecretName "square-access-token" -Description "Square Access Token" -Required $false

Write-Host ""
Write-Host "🏢 BUSINESS BANKING CONFIGURATION" -ForegroundColor Cyan
Store-SecureSecret -SecretName "business-bank-routing" -Description "Business Bank Routing Number" -Required $false
Store-SecureSecret -SecretName "business-bank-account" -Description "Business Bank Account (last 4 digits only)" -Required $false

Write-Host ""
Write-Host "📊 PAYMENT PROCESSOR WEBHOOKS" -ForegroundColor Cyan
Store-SecureSecret -SecretName "payment-webhook-url" -Description "Payment Webhook URL" -Required $false
Store-SecureSecret -SecretName "payment-webhook-secret" -Description "Payment Webhook Secret Key" -Required $false

Write-Host ""
Write-Host "✅ SECURE PAYMENT SETUP COMPLETE!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Add payment method to Facebook Ads Manager manually"
Write-Host "2. Test payment processing with small transactions"
Write-Host "3. Set up webhook endpoints for payment notifications"
Write-Host "4. Configure automated billing and invoicing"
Write-Host ""
Write-Host "🔒 All payment information is encrypted in Azure Key Vault"
Write-Host "🔑 Access requires proper Azure authentication"

# Create retrieval script
$retrievalScript = @"
# Payment Secret Retrieval Script
# Use this to safely retrieve payment secrets in your applications

function Get-PaymentSecret {
    param([string]`$SecretName, [string]`$KeyVaultName = "$KeyVaultName")
    
    try {
        `$secret = Get-AzKeyVaultSecret -VaultName `$KeyVaultName -Name `$SecretName
        return `$secret.SecretValue | ConvertFrom-SecureString -AsPlainText
    } catch {
        Write-Error "Failed to retrieve `$SecretName`: `$(`$_.Exception.Message)"
        return `$null
    }
}

# Example usage:
# `$stripeKey = Get-PaymentSecret -SecretName "stripe-secret-key"
# `$squareToken = Get-PaymentSecret -SecretName "square-access-token"
"@

$retrievalScript | Out-File -FilePath ".\retrieve-payment-secrets.ps1" -Encoding UTF8
Write-Host "💾 Created: retrieve-payment-secrets.ps1 (for safe secret retrieval)" -ForegroundColor Cyan