# Contact Form Setup Guide

## 🚨 **IMMEDIATE FIX NEEDED**

The contact form is failing because the environment variables are not properly configured. Here are the solutions:

## **Option 1: EmailJS Setup (Recommended - Client-side only)**

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Create a free account
3. Set up a service (Gmail, Outlook, etc.)
4. Create an email template
5. Get your Service ID, Template ID, and Public Key

### Step 2: Update Environment Variables
Your `.env` file in `/client` already has the correct format. Just verify the values:

```env
# Current values in your .env file:
VITE_EMAILJS_SERVICE_ID=service_27jmx62
VITE_EMAILJS_TEMPLATE_ID=template_49nj4oq
VITE_EMAILJS_PUBLIC_KEY=3d4ntCXQj5ZNHkKyv
```

### Step 3: EmailJS Template Setup
Create a template with these variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Email subject
- `{{message}}` - Email message
- `{{to_name}}` - Your name (Ankith Pratheesh Menon)

Example template:
```
Subject: Portfolio Contact: {{subject}}

Hello {{to_name}},

You have received a new message from {{from_name}} ({{from_email}}).

Subject: {{subject}}

Message:
{{message}}

---
Sent from your portfolio contact form
```

## **Option 2: Server API Setup (Fallback)**

### Step 1: Configure Server Email
Update `/server/.env` with your email credentials:

```env
# Gmail Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ankithpratheesh147@gmail.com
EMAIL_PASS=your_gmail_app_password

# Or other email providers:
# Outlook: smtp-mail.outlook.com, port 587
# Yahoo: smtp.mail.yahoo.com, port 587
```

### Step 2: Gmail App Password Setup
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate an App Password for "Mail"
4. Use that app password in EMAIL_PASS

### Step 3: Start the Server
```bash
cd server
npm install
npm start
```

## **Option 3: Alternative Contact Methods**

If both fail, the contact form now includes:
- Direct email link: ankithpratheesh147@gmail.com
- Phone: +91 9495540233
- Social media links

## **Testing the Contact Form**

### Test EmailJS:
1. Fill out the contact form
2. Check browser console for errors
3. Check your email for the message

### Test Server API:
1. Ensure server is running on port 5001
2. Check server logs for errors
3. Check database for saved messages

## **Debug Information**

The updated contact form now shows detailed error messages and will:
1. First try EmailJS
2. If EmailJS fails, try server API
3. Show specific error messages
4. Provide alternative contact methods

## **Current Status**

✅ Environment variables fixed (removed quotes)
✅ Dual contact method implementation
✅ Better error handling and user feedback
✅ Debugging information in console
✅ Alternative contact methods displayed

## **Next Steps**

1. **Deploy and test** - The form should now work with your current EmailJS setup
2. **Verify EmailJS configuration** - Make sure your EmailJS account is properly configured
3. **Set up server email** (optional) - For additional reliability
4. **Monitor form submissions** - Check if messages are being received

## **Troubleshooting**

### If EmailJS still fails:
- Check EmailJS dashboard for service status
- Verify template variables match exactly
- Check browser console for specific errors
- Ensure your EmailJS account has sufficient quota

### If Server API fails:
- Check if server is running on port 5001
- Verify email credentials in server/.env
- Check server logs for errors
- Ensure MongoDB is running for message storage

The contact form now has comprehensive error handling and should work with your current setup!