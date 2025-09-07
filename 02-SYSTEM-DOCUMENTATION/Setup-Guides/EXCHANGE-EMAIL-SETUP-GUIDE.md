# 📧 QUICK EMAIL SETUP - 5 MINUTES

## Step 1: Open PowerShell as Admin
```powershell
# Right-click PowerShell → Run as Administrator
```

## Step 2: Connect to Exchange Online
```powershell
Install-Module -Name ExchangeOnlineManagement -Force
Connect-ExchangeOnline -UserPrincipalName DustinAllan@bigchubbydog.com
```

## Step 3: Copy & Paste This Entire Block
```powershell
# Create all 4 business mailboxes
New-Mailbox -Shared -Name "MortgageLoansDesk" -DisplayName "Mortgage Loans Co" -PrimarySmtpAddress "loans@mortgagelc.com"
New-Mailbox -Shared -Name "AuraSpringDesk" -DisplayName "Aura Spring Cleaning" -PrimarySmtpAddress "service@auraspringcleaning.com"  
New-Mailbox -Shared -Name "AllanHomeDesk" -DisplayName "Allan Home Group" -PrimarySmtpAddress "homes@theallanhomegroup.com"
New-Mailbox -Shared -Name "DirtyPawsDesk" -DisplayName "Dirty Paws Soap" -PrimarySmtpAddress "orders@dirtypawspets.com"

# Add dustin@ aliases to each
Set-Mailbox -Identity "loans@mortgagelc.com" -EmailAddresses @{add="dustin@mortgagelc.com"}
Set-Mailbox -Identity "service@auraspringcleaning.com" -EmailAddresses @{add="dustin@auraspringcleaning.com"}
Set-Mailbox -Identity "homes@theallanhomegroup.com" -EmailAddresses @{add="dustin@theallanhomegroup.com"}
Set-Mailbox -Identity "orders@dirtypawspets.com" -EmailAddresses @{add="dustin@dirtypawspets.com"}

# Grant yourself Full Access
Add-MailboxPermission -Identity "loans@mortgagelc.com" -User "DustinAllan@bigchubbydog.com" -AccessRights FullAccess -AutoMapping $true
Add-MailboxPermission -Identity "service@auraspringcleaning.com" -User "DustinAllan@bigchubbydog.com" -AccessRights FullAccess -AutoMapping $true
Add-MailboxPermission -Identity "homes@theallanhomegroup.com" -User "DustinAllan@bigchubbydog.com" -AccessRights FullAccess -AutoMapping $true
Add-MailboxPermission -Identity "orders@dirtypawspets.com" -User "DustinAllan@bigchubbydog.com" -AccessRights FullAccess -AutoMapping $true

# Grant Send As permissions
Add-RecipientPermission -Identity "loans@mortgagelc.com" -Trustee "DustinAllan@bigchubbydog.com" -AccessRights SendAs -Confirm:$false
Add-RecipientPermission -Identity "service@auraspringcleaning.com" -Trustee "DustinAllan@bigchubbydog.com" -AccessRights SendAs -Confirm:$false
Add-RecipientPermission -Identity "homes@theallanhomegroup.com" -Trustee "DustinAllan@bigchubbydog.com" -AccessRights SendAs -Confirm:$false
Add-RecipientPermission -Identity "orders@dirtypawspets.com" -Trustee "DustinAllan@bigchubbydog.com" -AccessRights SendAs -Confirm:$false

Write-Host "✅ ALL 4 BUSINESS EMAILS CONFIGURED!" -ForegroundColor Green
```

## Step 4: Wait 5-10 Minutes
Exchange needs time to provision the mailboxes

## Step 5: Test in Outlook
1. **Restart Outlook** - mailboxes will auto-appear
2. **Send test email** to loans@mortgagelc.com
3. **Click Reply** - FROM field should show dustin@mortgagelc.com

---

## 🎯 HOW IT WORKS

| Customer Emails To | You Reply From |
|-------------------|---------------|
| loans@mortgagelc.com | dustin@mortgagelc.com |
| service@auraspringcleaning.com | dustin@auraspringcleaning.com |
| homes@theallanhomegroup.com | dustin@theallanhomegroup.com |
| orders@dirtypawspets.com | dustin@dirtypawspets.com |

## 📱 Mobile Setup (Outlook App)
1. Open Outlook mobile app
2. Settings → Add Account
3. Add each shared mailbox
4. When replying, tap FROM field to select correct address

## 💡 Pro Tip
Create email signatures for each business:
- **Mortgage**: "NMLS #2044646"
- **Cleaning**: "Licensed & Insured"
- **Real Estate**: "Realtor®"
- **Soap**: "Natural & Organic"

---

## Need Help?
- Exchange Admin Center: https://admin.exchange.microsoft.com
- Test emails: https://outlook.office.com
- Dynamics 365: https://bcdinc.crm.dynamics.com