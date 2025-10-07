# EmailJS Setup Guide for Contact Form

This guide will help you set up EmailJS to receive contact form submissions directly in your email.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy the Service ID** - you'll need this later

### For Gmail:
- Choose "Gmail" 
- Click "Connect Account" and authenticate with Google
- Your Gmail will be connected automatically

## Step 3: Create Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template content:

### Template Subject:
```
New Contact Form Message: {{subject}}
```

### Template Body:
```
You have received a new message from your portfolio contact form.

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio website contact form.
Reply directly to this email to respond to {{from_name}}.
```

4. **Copy the Template ID** - you'll need this later
5. Save the template

## Step 4: Get Public Key

1. Go to **Account** settings in your EmailJS dashboard
2. Find the **Public Key** (also called User ID)
3. **Copy this key** - you'll need it for configuration

## Step 5: Update Environment Variables

Open your `.env` file in the client folder and replace the placeholder values:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id  
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

## Step 6: Test the Setup

1. Restart your development server
2. Go to your Contact page
3. Fill out and submit the contact form
4. Check your email for the message

## Template Variables Available

The contact form sends these variables to your email template:

- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email address  
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{to_name}}` - Your name (Ankith Pratheesh Menon)
- `{{reply_to}}` - Sender's email for easy replies

## Troubleshooting

### Common Issues:

1. **"EmailJS configuration is missing" error**
   - Check that all environment variables are set correctly
   - Restart your development server after updating .env

2. **Emails not being received**
   - Check your spam folder
   - Verify the email service is properly connected
   - Test the template in EmailJS dashboard

3. **"Failed to send email" error**
   - Check browser console for detailed error messages
   - Verify your EmailJS service is active
   - Check if you've exceeded the free tier limits (200 emails/month)

### Free Tier Limits:
- 200 emails per month
- EmailJS branding in emails
- Basic support

### Upgrade Benefits:
- More emails per month
- Remove EmailJS branding  
- Priority support

## Security Notes

- Your EmailJS keys are public-facing (client-side)
- This is normal and expected for EmailJS
- Rate limiting and spam protection are handled by EmailJS
- Never put private API keys in client-side code

## Need Help?

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/

Once set up, visitors can send messages through your contact form and they'll be delivered directly to your email inbox!