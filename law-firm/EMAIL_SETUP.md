# Email Setup Guide

## How Contact Form Emails Work

When someone submits the contact form on your website:

1. ✅ **Saved to Admin Dashboard** - The submission is always saved and visible in `/admin/consultations`
2. ✅ **Email Notification** - If SMTP is configured, you'll receive an email notification

## Setting Up Email Notifications

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Law Firm Website"
   - Copy the generated 16-character password

3. **Set Environment Variables in Vercel**:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   MAIL_FROM=your-email@gmail.com
   MAIL_TO=your-email@gmail.com
   ```

### Option 2: Other Email Providers

**Outlook/Office 365:**
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Custom SMTP Server:**
```
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
```

## Testing

1. Submit a test message through the contact form
2. Check your email inbox (and spam folder)
3. Check `/admin/consultations` to verify it was saved

## Troubleshooting

**Not receiving emails?**
- Check spam/junk folder
- Verify all SMTP environment variables are set correctly
- Check Vercel function logs for email errors
- Make sure `MAIL_TO` is set to your email address

**Gmail not working?**
- Make sure you're using an App Password, not your regular password
- Enable "Less secure app access" if App Passwords aren't available
- Check that 2FA is enabled

**Emails still work without SMTP?**
- Yes! Submissions are always saved in the admin dashboard
- Email is optional - you can view all submissions at `/admin/consultations`

