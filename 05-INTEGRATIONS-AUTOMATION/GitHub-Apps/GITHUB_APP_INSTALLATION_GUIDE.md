# GitHub App Installation Guide
## BigChubbyDog Bot Web - Complete Setup

### ✅ Current Status
- [x] GitHub App created
- [x] Credentials configured  
- [x] Secrets stored locally
- [x] Azure Key Vault deployment script ready
- [x] Authentication tested
- [ ] **Install on BigChubbyDog organization** ← Next step
- [ ] Configure webhook URL
- [ ] Deploy webhook handler

---

## 📦 Step 1: Install GitHub App on Organization

### Option A: Quick Install (Recommended)
1. **Open installation page**: https://github.com/apps/bigchubbydog-bot-web/installations/new
2. **Select organization**: Choose "BigChubbyDog"
3. **Select repositories**:
   - Choose "All repositories" for full coverage
   - OR select specific repos:
     - `bigchubbydog-automation`
     - `mortgageloans-website`
     - `aurasprings-website`
     - `dirtypawssoap`
4. **Click "Install"**

### Option B: Manual Installation
1. Go to: https://github.com/organizations/BigChubbyDog/settings/apps
2. Click "Add GitHub App"
3. Search for "bigchubbydog-bot-web"
4. Click "Install"
5. Configure permissions and repository access

---

## 🔌 Step 2: Configure Webhook URL

### Current Webhook Settings
```
URL: [Not configured yet]
Content Type: application/json
Secret: bigchubbydog-secret-2025-nmls2044646
SSL Verification: Enabled
```

### Update Webhook URL
1. Go to: https://github.com/settings/apps/bigchubbydog-bot-web
2. Click "Webhook" in the left sidebar
3. Set webhook URL to one of:
   - **Azure Function**: `https://bcd-github-webhooks.azurewebsites.net/api/github-webhook`
   - **Local Testing**: Use ngrok: `https://your-ngrok-url.ngrok.io/webhook`
   - **Custom Server**: Your server URL
4. Verify secret is: `bigchubbydog-secret-2025-nmls2044646`
5. Click "Save changes"

---

## ☁️ Step 3: Deploy to Azure (Production)

### Quick Deploy
```powershell
# Run the deployment script
. "C:\Users\dusta\dev\BigChubbyDog\scripts\deploy-github-app-to-azure.ps1"
```

This will:
- Create Azure Resource Group
- Create Key Vault with secrets
- Create Function App for webhooks
- Configure managed identity
- Set up Key Vault references

### Manual Azure Setup
```bash
# 1. Login to Azure
az login

# 2. Create resources
az group create --name bigchubbydog-production --location centralus
az keyvault create --name bcd-enterprise-kv --resource-group bigchubbydog-production

# 3. Store secrets
az keyvault secret set --vault-name bcd-enterprise-kv --name github-app-id --value "1790698"
az keyvault secret set --vault-name bcd-enterprise-kv --name github-client-id --value "Iv23liuwA60K1mnPEhu4"
az keyvault secret set --vault-name bcd-enterprise-kv --name github-client-secret --value "cb289fe7e4ceb7b3d248f82c2a800d0fcc70371a"
az keyvault secret set --vault-name bcd-enterprise-kv --name github-webhook-secret --value "bigchubbydog-secret-2025-nmls2044646"
```

---

## 🧪 Step 4: Test Installation

### Verify Installation
```powershell
# Check if app is installed
curl -H "Accept: application/vnd.github.v3+json" `
     https://api.github.com/orgs/BigChubbyDog/installations
```

### Test Webhook
```powershell
# Send test webhook
curl -X POST https://your-webhook-url/api/github-webhook `
     -H "Content-Type: application/json" `
     -H "X-GitHub-Event: ping" `
     -H "X-Hub-Signature-256: sha256=test" `
     -d '{"zen": "Testing BigChubbyDog Bot"}'
```

---

## 🤖 Step 5: Bot Functionality

### Available Events
Your bot can respond to:
- **Push events**: Code commits
- **Pull requests**: Open, close, merge
- **Issues**: Create, comment, close
- **Releases**: New releases
- **Workflows**: GitHub Actions status

### Example Implementations

#### Auto-assign reviewers
```javascript
// When PR is opened, assign reviewers
app.webhooks.on('pull_request.opened', async ({ octokit, payload }) => {
  await octokit.rest.pulls.requestReviewers({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    pull_number: payload.pull_request.number,
    reviewers: ['dustaBOT', 'reviewer2']
  });
});
```

#### Auto-label issues
```javascript
// Label issues based on content
app.webhooks.on('issues.opened', async ({ octokit, payload }) => {
  const issue = payload.issue;
  const labels = [];
  
  if (issue.title.includes('bug')) labels.push('bug');
  if (issue.title.includes('feature')) labels.push('enhancement');
  
  if (labels.length > 0) {
    await octokit.rest.issues.addLabels({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: issue.number,
      labels: labels
    });
  }
});
```

---

## 📊 Step 6: Monitor & Maintain

### View Logs
```bash
# Azure Function logs
az functionapp logs tail --name bcd-github-webhooks --resource-group bigchubbydog-production

# GitHub webhook deliveries
# Go to: https://github.com/settings/apps/bigchubbydog-bot-web/advanced
# View "Recent Deliveries"
```

### Rotate Secrets (Every 90 days)
```powershell
# Generate new client secret in GitHub
# Then update in Key Vault:
az keyvault secret set --vault-name bcd-enterprise-kv `
                       --name github-client-secret `
                       --value "new-secret-here"
```

---

## 🚨 Troubleshooting

### Common Issues

#### App not receiving webhooks
- Check webhook URL is correct
- Verify webhook secret matches
- Check firewall/network settings
- Review webhook delivery logs in GitHub

#### Authentication failures
- Verify private key is correct
- Check App ID and Client ID
- Ensure secrets are properly stored
- Verify clock sync (JWT time sensitive)

#### Permission errors
- Review app permissions in GitHub
- Check repository access settings
- Verify installation is active
- Check Azure RBAC permissions

---

## 📚 Resources

### Documentation
- [GitHub Apps Documentation](https://docs.github.com/en/apps)
- [Octokit SDK](https://github.com/octokit/app.js)
- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)

### Your App URLs
- **Settings**: https://github.com/settings/apps/bigchubbydog-bot-web
- **Public Page**: https://github.com/apps/bigchubbydog-bot-web
- **Install**: https://github.com/apps/bigchubbydog-bot-web/installations/new

### Support Files
- Config: `C:\Users\dusta\dev\BigChubbyDog\.env.github-app`
- Scripts: `C:\Users\dusta\dev\BigChubbyDog\scripts\`
- Examples: `C:\Users\dusta\dev\BigChubbyDog\examples\`

---

## ✅ Checklist

- [ ] Install app on BigChubbyDog organization
- [ ] Configure webhook URL
- [ ] Deploy to Azure (optional)
- [ ] Test webhook delivery
- [ ] Implement bot logic
- [ ] Set up monitoring
- [ ] Document custom features
- [ ] Schedule secret rotation

---

**Next Action**: Click here to install the app → https://github.com/apps/bigchubbydog-bot-web/installations/new