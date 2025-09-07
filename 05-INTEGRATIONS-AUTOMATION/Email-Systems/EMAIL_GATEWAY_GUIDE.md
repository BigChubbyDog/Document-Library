# Pushover Email Gateway Guide

## Your Email Gateway Address
**nnszao3pxz@pomail.net**

Any email sent to this address will automatically become a push notification on all your Pushover-enabled devices.

## How It Works

1. **Subject Line** → Becomes the notification title
2. **Email Body** → Becomes the notification message
3. **Instant Delivery** → Pushes to all your devices immediately
4. **No Configuration** → Works with any system that can send email

## Use Cases for BigChubbyDog

### 1. Server Monitoring
Configure your servers to email alerts:
```bash
# Linux cron job example
0 * * * * /check_disk.sh || echo "Disk space critical on $(hostname)" | mail -s "⚠️ Server Alert" nnszao3pxz@pomail.net
```

### 2. CRM Integration
Most CRMs can send email notifications. Set up rules to forward to your gateway:
- New lead assigned → Email to nnszao3pxz@pomail.net
- Deal closed → Email celebration to gateway
- Task overdue → Email reminder to gateway

### 3. Azure Monitor Alerts
In Azure Portal:
1. Go to Monitor → Alerts
2. Create action group
3. Add action type: Email
4. Email address: nnszao3pxz@pomail.net

### 4. GitHub Actions
```yaml
- name: Notify Deployment
  if: always()
  run: |
    echo "Deployment ${{ job.status }} for ${{ github.repository }}" | \
    mail -s "🚀 Deployment: ${{ job.status }}" nnszao3pxz@pomail.net
```

### 5. PowerShell Quick Alerts
```powershell
# Quick notification function
function Quick-Push {
    param([string]$Subject, [string]$Body)
    Send-MailMessage -To "nnszao3pxz@pomail.net" `
                     -From "alerts@bigchubbydog.com" `
                     -Subject $Subject `
                     -Body $Body `
                     -SmtpServer "smtp.gmail.com" `
                     -Port 587 `
                     -UseSsl `
                     -Credential (Get-Credential)
}

# Usage
Quick-Push -Subject "🏠 New Lead!" -Body "John Doe just submitted inquiry for 123 Main St"
```

### 6. Zapier Email Integration
1. Trigger: Any Zapier trigger (form, CRM, etc.)
2. Action: Send Email
3. To: nnszao3pxz@pomail.net
4. Subject: {{trigger.title}}
5. Body: {{trigger.details}}

### 7. SQL Server Alerts
```sql
-- SQL Server Database Mail
EXEC msdb.dbo.sp_send_dbmail
    @recipients = 'nnszao3pxz@pomail.net',
    @subject = 'Database Alert: Backup Failed',
    @body = 'The nightly backup for MortgageDB failed at 2:00 AM';
```

### 8. Windows Task Scheduler
Create a scheduled task that emails on success/failure:
```batch
powershell -Command "Send-MailMessage -To 'nnszao3pxz@pomail.net' -Subject 'Backup Complete' -Body 'Nightly backup finished successfully' -SmtpServer 'smtp.gmail.com' -Port 587 -UseSsl"
```

## Email Formatting Tips

### Priority Indicators (in subject)
- Start with ⚠️ for urgent
- Start with ❌ for errors
- Start with ✅ for success
- Start with 📊 for reports

### Example Formats

#### Lead Notification
```
Subject: 🏠 New Lead: John Doe
Body:
Source: Zillow
Property: 123 Main St
Phone: 555-1234
Email: john@email.com
```

#### System Alert
```
Subject: ⚠️ CRITICAL: Database Connection Failed
Body:
Server: PROD-SQL-01
Time: 2:45 AM
Error: Connection timeout after 30 seconds
Action: Check network connectivity
```

#### Daily Report
```
Subject: 📊 Daily Summary - Jan 15
Body:
New Leads: 15
Applications: 5
Closings: 2
Revenue: $65,000

Top performer: Sarah Johnson (3 closings)
```

## Setting Up Email Forwarding

### Gmail Forward to Gateway
1. Settings → Forwarding and POP/IMAP
2. Add forwarding address: nnszao3pxz@pomail.net
3. Create filter for specific emails
4. Action: Forward to nnszao3pxz@pomail.net

### Outlook Rules
1. Settings → Rules
2. Add new rule
3. Condition: Subject contains "[ALERT]"
4. Action: Forward to nnszao3pxz@pomail.net

### Office 365 Power Automate
1. Create flow
2. Trigger: When new email arrives
3. Condition: Subject contains "urgent"
4. Action: Forward to nnszao3pxz@pomail.net

## Security Considerations

⚠️ **Important**: This email address is PUBLIC and unique to your account
- Don't share it publicly
- Don't use for sensitive data (SSN, passwords)
- Consider it as secure as your user key
- Can be regenerated if compromised

## Testing Your Gateway

### Quick Test
Send any email to `nnszao3pxz@pomail.net` with:
- Subject: "Test Notification"
- Body: "This is a test from my email gateway"

You should receive the push notification within seconds.

### PowerShell Test
```powershell
# Requires SMTP configuration
Send-MailMessage -To "nnszao3pxz@pomail.net" `
                 -From "test@bigchubbydog.com" `
                 -Subject "🎉 Gateway Test Success!" `
                 -Body "Your email gateway is working perfectly. Time: $(Get-Date)" `
                 -SmtpServer "localhost" # or your SMTP server
```

### Curl Test (using SMTP)
```bash
curl --url 'smtp://localhost:25' \
     --mail-from 'test@bigchubbydog.com' \
     --mail-rcpt 'nnszao3pxz@pomail.net' \
     --upload-file email.txt
```

## Rate Limits
- No specific rate limit for email gateway
- Emails are processed as regular API calls
- Your monthly message limit applies
- Bulk emails may be delayed slightly

## Troubleshooting

### Not Receiving Notifications?
1. Check Pushover app is installed and logged in
2. Verify email was sent successfully
3. Check spam folder (gateway might send confirmation)
4. Ensure quiet hours aren't active
5. Test with direct API call to confirm setup

### Delayed Notifications?
- Email processing can take 1-10 seconds
- For instant notifications, use API directly
- Check your email server's send queue

## Integration Priority

### Immediate Setup (Week 1)
1. Server monitoring emails
2. CRM lead notifications
3. Error alerts from production

### Secondary Setup (Week 2)
1. Daily summaries
2. Deployment notifications
3. Team performance reports

### Advanced Setup (Month 2)
1. Customer feedback alerts
2. Competitive intelligence
3. Market condition updates

---

Your email gateway (nnszao3pxz@pomail.net) is ready to use immediately. No configuration needed - just send emails!