## 🔐 Environment Variables Configuration

This document lists all environment variables needed for deployment.

### 🖥️ Backend Environment Variables

Copy these to Render Dashboard → Web Service → Environment Variables:

```bash
# ==========================================
# SERVER CONFIGURATION
# ==========================================
NODE_ENV=production
PORT=10000

# ==========================================
# DATABASE
# ==========================================
# IMPORTANT: Use NEW credentials, not the exposed ones!
MONGODB_URI=mongodb+srv://NEW_USERNAME:NEW_PASSWORD@cluster0.xxxxx.mongodb.net/rotary-club?retryWrites=true&w=majority&appName=Cluster0

# ==========================================
# JWT SECRETS
# ==========================================
# Generate new secrets using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET=<GENERATE_NEW_64_CHAR_HEX>
JWT_REFRESH_SECRET=<GENERATE_NEW_64_CHAR_HEX>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# ==========================================
# COOKIE SETTINGS
# ==========================================
COOKIE_DOMAIN=.onrender.com
COOKIE_SECURE=true

# ==========================================
# CORS & CLIENT
# ==========================================
CLIENT_URL=https://rotary-club-frontend.onrender.com

# ==========================================
# EMAIL CONFIGURATION
# ==========================================
# Gmail Example (Enable App Passwords in Google Account)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@rotarycalicutsouth.org

# Alternative: SendGrid
# EMAIL_HOST=smtp.sendgrid.net
# EMAIL_PORT=587
# EMAIL_USER=apikey
# EMAIL_PASSWORD=<your-sendgrid-api-key>

# Alternative: Ethereal (Testing only)
# EMAIL_HOST=smtp.ethereal.email
# EMAIL_PORT=587
# EMAIL_USER=<generated-username>
# EMAIL_PASSWORD=<generated-password>

# ==========================================
# PAYMENT GATEWAY (RAZORPAY)
# ==========================================
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# For testing, use test keys:
# RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# ==========================================
# CLOUD STORAGE (Optional)
# ==========================================
# Option 1: Cloudinary (Recommended for Render)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Option 2: AWS S3
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_REGION=ap-south-1
# AWS_S3_BUCKET=rotary-club-uploads

# ==========================================
# RATE LIMITING
# ==========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ==========================================
# FILE UPLOAD
# ==========================================
MAX_FILE_SIZE=5242880

# ==========================================
# FIREBASE (Optional - for push notifications)
# ==========================================
# FCM_SERVER_KEY=your_fcm_server_key
```

---

### 🌐 Frontend Environment Variables

Copy these to Render Dashboard → Static Site → Environment Variables:

```bash
# Backend API URL (update with your actual backend URL)
VITE_API_URL=https://rotary-club-api.onrender.com/api
VITE_SOCKET_URL=https://rotary-club-api.onrender.com

# Razorpay Public Key
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
```

---

## 🔑 How to Generate Secrets

### JWT Secrets (64-character hex strings)

**PowerShell (Windows):**
```powershell
# Generate JWT Access Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate JWT Refresh Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Bash (Linux/Mac):**
```bash
# Generate JWT Access Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate JWT Refresh Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Or use online tool:**
- https://www.random.org/strings/?num=2&len=64&digits=on&loweralpha=on&unique=on&format=html&rnd=new

---

## 📧 Email Service Setup

### Option 1: Gmail (Easiest for Testing)

1. Enable 2-Step Verification on your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate new app password for "Mail"
4. Use this password in `EMAIL_PASSWORD`

**Configuration:**
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<16-character-app-password>
```

### Option 2: SendGrid (Recommended for Production)

1. Sign up at: https://sendgrid.com (free tier: 100 emails/day)
2. Create API Key in Settings → API Keys
3. Verify sender email/domain

**Configuration:**
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=<your-sendgrid-api-key>
```

### Option 3: Ethereal (Testing Only)

1. Go to: https://ethereal.email
2. Create account
3. Use provided credentials

**Configuration:**
```bash
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=<generated-username>
EMAIL_PASSWORD=<generated-password>
```

---

## 💳 Payment Gateway Setup

### Razorpay

1. Sign up at: https://razorpay.com
2. Go to Settings → API Keys
3. Generate Test/Live keys

**Test Mode:**
```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=<test-secret>
```

**Live Mode:**
```bash
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=<live-secret>
```

**Webhook Setup:**
1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-api.onrender.com/api/payments/webhook`
3. Select events: payment.authorized, payment.captured, payment.failed
4. Copy webhook secret

---

## ☁️ Cloud Storage Setup

### Option 1: Cloudinary (Recommended)

1. Sign up at: https://cloudinary.com (free tier: 25GB)
2. Go to Dashboard
3. Copy Cloud Name, API Key, API Secret

**Configuration:**
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### Option 2: AWS S3

1. Create AWS account
2. Create S3 bucket
3. Create IAM user with S3 access
4. Generate access keys

**Configuration:**
```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-south-1
AWS_S3_BUCKET=rotary-club-uploads
```

---

## 🔒 Security Best Practices

### ✅ Do's
- Generate NEW MongoDB credentials (rotate the exposed ones)
- Use environment variables for ALL secrets
- Generate NEW JWT secrets (don't reuse from .env)
- Use strong, random passwords (32+ characters)
- Enable 2FA on all service accounts
- Use HTTPS in production
- Set COOKIE_SECURE=true in production
- Regularly rotate secrets (every 90 days)

### ❌ Don'ts
- Never commit .env files
- Don't use same secrets for dev/prod
- Don't share secrets via email/chat
- Don't use weak passwords
- Don't expose admin credentials
- Don't skip rate limiting
- Don't ignore security warnings

---

## 📋 Environment Variables Checklist

Before deploying, ensure:

- [ ] All variables from this guide are set
- [ ] MongoDB credentials are NEW (not exposed ones)
- [ ] JWT secrets are NEW and random
- [ ] Email service is configured and tested
- [ ] Payment gateway keys are correct (test/live)
- [ ] CLIENT_URL matches your frontend URL
- [ ] VITE_API_URL matches your backend URL
- [ ] Cloud storage is configured (if needed)
- [ ] All secrets are properly secured

---

## 🧪 Testing Environment Variables

After setting up, test each service:

```bash
# Test MongoDB connection
curl https://your-api.onrender.com/api/health

# Test authentication
curl -X POST https://your-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123!"}'

# Test email
# (Register and check email delivery)

# Test file upload
# (Upload profile picture via frontend)

# Test payment
# (Use Razorpay test card: 4111 1111 1111 1111)
```

---

## 🆘 Troubleshooting

### MongoDB Connection Failed
- Check connection string format
- Verify credentials are correct
- Ensure IP whitelist includes 0.0.0.0/0
- Test connection using MongoDB Compass

### Email Not Sending
- Verify EMAIL_HOST and EMAIL_PORT
- Check EMAIL_USER and EMAIL_PASSWORD
- Test with Ethereal first
- Check spam folder

### Payment Gateway Errors
- Verify you're using correct environment (test/live)
- Check API keys are active
- Ensure webhook URL is set
- Test with Razorpay test mode first

### CORS Errors
- Verify CLIENT_URL is correct
- Check VITE_API_URL in frontend
- Ensure both URLs use HTTPS
- Check cors.js configuration

---

**Last Updated:** October 31, 2025
