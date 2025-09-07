# Azure Service Principal Setup Guide

## Overview
This guide documents the secure setup and usage of the Azure Service Principal for BCD Inc operations.

## Service Principal Details

| Property | Value |
|----------|-------|
| **Application Name** | BCD-Inc-ServicePrincipal |
| **Application ID** | `8b01f8e9-18d3-40d4-90c1-9777f6288bce` |
| **Tenant ID** | `753965c2-2a85-437e-a9c9-9f824df99584` |
| **Key Vault** | BCDIncKeyVault |
| **Resource Group** | BCD-Inc-Resources |

## Environment Variables

The following environment variables must be set for authentication:

```bash
AZURE_CLIENT_ID=8b01f8e9-18d3-40d4-90c1-9777f6288bce
AZURE_CLIENT_SECRET=[Retrieved from Azure Key Vault]
AZURE_TENANT_ID=753965c2-2a85-437e-a9c9-9f824df99584
AZURE_KEY_VAULT_NAME=BCDIncKeyVault
```

## Setup Instructions

### 1. Quick Setup (PowerShell)
Run the verification script to check and set up the service principal:
```powershell
.\verify-and-setup-sp.ps1
```

### 2. Full Setup with Azure Key Vault
For complete setup including Key Vault integration:
```powershell
.\setup-azure-service-principal.ps1
```

### 3. Manual Setup

#### Set Environment Variables (Windows)
```powershell
# For current session
$env:AZURE_CLIENT_ID = "8b01f8e9-18d3-40d4-90c1-9777f6288bce"
$env:AZURE_CLIENT_SECRET = "your-secret-here"
$env:AZURE_TENANT_ID = "753965c2-2a85-437e-a9c9-9f824df99584"

# For permanent (user-level)
[System.Environment]::SetEnvironmentVariable("AZURE_CLIENT_ID", "8b01f8e9-18d3-40d4-90c1-9777f6288bce", [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("AZURE_CLIENT_SECRET", "your-secret-here", [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("AZURE_TENANT_ID", "753965c2-2a85-437e-a9c9-9f824df99584", [System.EnvironmentVariableTarget]::User)
```

#### Set Environment Variables (Linux/Mac)
```bash
export AZURE_CLIENT_ID="8b01f8e9-18d3-40d4-90c1-9777f6288bce"
export AZURE_CLIENT_SECRET="your-secret-here"
export AZURE_TENANT_ID="753965c2-2a85-437e-a9c9-9f824df99584"

# Add to ~/.bashrc or ~/.zshrc for persistence
echo 'export AZURE_CLIENT_ID="8b01f8e9-18d3-40d4-90c1-9777f6288bce"' >> ~/.bashrc
echo 'export AZURE_CLIENT_SECRET="your-secret-here"' >> ~/.bashrc
echo 'export AZURE_TENANT_ID="753965c2-2a85-437e-a9c9-9f824df99584"' >> ~/.bashrc
```

## Retrieving Secrets from Azure Key Vault

### Using Azure CLI
```bash
# Login with service principal
az login --service-principal \
  -u $AZURE_CLIENT_ID \
  -p $AZURE_CLIENT_SECRET \
  --tenant $AZURE_TENANT_ID

# Get secret
az keyvault secret show \
  --vault-name BCDIncKeyVault \
  --name ServicePrincipal-ClientSecret \
  --query value -o tsv
```

### Using PowerShell
```powershell
# Connect with service principal
$credential = New-Object System.Management.Automation.PSCredential($env:AZURE_CLIENT_ID, (ConvertTo-SecureString $env:AZURE_CLIENT_SECRET -AsPlainText -Force))
Connect-AzAccount -ServicePrincipal -Credential $credential -TenantId $env:AZURE_TENANT_ID

# Get secret
$secret = Get-AzKeyVaultSecret -VaultName "BCDIncKeyVault" -Name "ServicePrincipal-ClientSecret"
$secretValue = $secret.SecretValue | ConvertFrom-SecureString -AsPlainText
```

### Using REST API
```powershell
# Get access token
$body = @{
    grant_type = "client_credentials"
    client_id = $env:AZURE_CLIENT_ID
    client_secret = $env:AZURE_CLIENT_SECRET
    resource = "https://vault.azure.net"
}

$tokenResponse = Invoke-RestMethod -Method Post `
    -Uri "https://login.microsoftonline.com/$env:AZURE_TENANT_ID/oauth2/token" `
    -Body $body `
    -ContentType "application/x-www-form-urlencoded"

$token = $tokenResponse.access_token

# Get secret from Key Vault
$headers = @{ "Authorization" = "Bearer $token" }
$uri = "https://BCDIncKeyVault.vault.azure.net/secrets/ServicePrincipal-ClientSecret?api-version=7.3"

$secretResponse = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
$secretValue = $secretResponse.value
```

## Usage Examples

### 1. Dynamics 365 Authentication
```powershell
# Using PAC CLI
pac auth create \
  --applicationId $env:AZURE_CLIENT_ID \
  --clientSecret $env:AZURE_CLIENT_SECRET \
  --tenant $env:AZURE_TENANT_ID \
  --url https://bcdinc.crm.dynamics.com \
  --name BCD-Inc
```

### 2. Azure Management API
```powershell
# Get access token for Azure Management
$body = @{
    grant_type = "client_credentials"
    client_id = $env:AZURE_CLIENT_ID
    client_secret = $env:AZURE_CLIENT_SECRET
    scope = "https://management.azure.com/.default"
}

$token = (Invoke-RestMethod -Uri "https://login.microsoftonline.com/$env:AZURE_TENANT_ID/oauth2/v2.0/token" `
    -Method Post -Body $body -ContentType "application/x-www-form-urlencoded").access_token

# Use token in API calls
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "https://management.azure.com/subscriptions?api-version=2020-01-01" -Headers $headers
```

### 3. GitHub Actions Integration
```yaml
# .github/workflows/deploy.yml
env:
  AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
  AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
  AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
```

## Testing Authentication

### Quick Test Script
```powershell
# Test authentication
$testBody = @{
    client_id = $env:AZURE_CLIENT_ID
    client_secret = $env:AZURE_CLIENT_SECRET
    scope = "https://management.azure.com/.default"
    grant_type = "client_credentials"
}

try {
    $response = Invoke-RestMethod `
        -Uri "https://login.microsoftonline.com/$env:AZURE_TENANT_ID/oauth2/v2.0/token" `
        -Method Post `
        -Body $testBody `
        -ContentType "application/x-www-form-urlencoded"
    
    if ($response.access_token) {
        Write-Host "✓ Authentication successful!" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Authentication failed: $_" -ForegroundColor Red
}
```

## Security Best Practices

1. **Never commit secrets to source control**
   - Always use environment variables or Key Vault
   - Use `.gitignore` to exclude `.env` files

2. **Rotate secrets regularly**
   - Service principal secrets should be rotated every 90 days
   - Use Azure Key Vault secret versioning

3. **Minimum required permissions**
   - Grant only necessary permissions to the service principal
   - Use Azure RBAC for fine-grained access control

4. **Secure storage**
   - Production: Use Azure Key Vault
   - Development: Use environment variables or `.env` files (never commit)
   - CI/CD: Use secure secret management (GitHub Secrets, Azure DevOps Variables)

## Troubleshooting

### Common Issues

1. **AADSTS7000215 Error**
   - Client secret has expired
   - Solution: Generate new secret in Azure Portal

2. **AADSTS700016 Error**
   - Application not found
   - Solution: Verify Application ID is correct

3. **AADSTS50126 Error**
   - Invalid credentials
   - Solution: Check client secret is correctly copied

4. **Access Denied to Key Vault**
   - Service principal lacks Key Vault permissions
   - Solution: Grant "Get" and "List" permissions in Key Vault access policies

## Support Resources

- [Azure AD Service Principal Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals)
- [Azure Key Vault Documentation](https://docs.microsoft.com/en-us/azure/key-vault/)
- [PAC CLI Documentation](https://docs.microsoft.com/en-us/power-platform/developer/cli/introduction)

## Contact

For issues or questions about the service principal setup:
- Team: BCD Inc DevOps Team
- Email: devops@bcdinc.com