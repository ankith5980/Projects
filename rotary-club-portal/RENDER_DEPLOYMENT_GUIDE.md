# 🚀 Render Deployment Guide - Rotary Club Portal

This guide will walk you through deploying your Rotary Club Portal to Render.com.

## 📋 Prerequisites

- [x] GitHub account with your repository
- [x] Render account (sign up at https://render.com)
- [x] MongoDB Atlas account (free tier available)
- [x] All sensitive data removed from repository

## 🎯 Deployment Overview

We'll deploy:
1. **Backend API** - Node.js/Express server (Web Service)
2. **Frontend** - React/Vite app (Static Site)

## 📝 Step-by-Step Deployment

### Phase 1: Prepare MongoDB Database

1. **Go to MongoDB Atlas** (https://www.mongodb.com/cloud/atlas)
   - Log in or create account
   
2. **Create/Update Database User**
   - Go to Database Access → Add New Database User
   - Create a **NEW** user (don't use the exposed one)
   - Username: `rotary_prod_user`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: Atlas admin or Read/Write to any database

3. **Whitelist Render's IP Addresses**
   - Go to Network Access → Add IP Address
   - Add: `0.0.0.0/0` (Allow access from anywhere)
   - ⚠️ For production, use Render's specific IPs
   
4. **Get Connection String**
   - Go to Database → Connect → Connect your application
   - Copy connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<username>` and `<password>` with your new credentials
   - Add database name: `/rotary-club` before the `?`
   - Final format:
   ```
   mongodb+srv://rotary_prod_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rotary-club?retryWrites=true&w=majority&appName=Cluster0
   ```

### Phase 2: Push Code to GitHub

```bash
# Make sure you're in the project directory
cd c:\Users\ankit\Desktop\Projects\rotary-club-portal

# Stage all changes
git add .

# Commit changes
git commit -m "Prepare for Render deployment"

# Push to GitHub
git push origin main
```

### Phase 3: Deploy Backend API on Render

1. **Go to Render Dashboard** (https://dashboard.render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `rotary-club-portal` repository

3. **Configure Web Service**
   ```
   Name:              rotary-club-api
   Region:            Singapore (or closest to your users)
   Branch:            main
   Root Directory:    (leave empty)
   Runtime:           Node
   Build Command:     cd server && npm install
   Start Command:     cd server && npm start
   Instance Type:     Free (or Starter for better performance)
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:

   ```bash
   # Server Configuration
   NODE_ENV=production
   PORT=10000
   
   # Database (use your NEW MongoDB connection string)
   MONGODB_URI=mongodb+srv://rotary_prod_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rotary-club?retryWrites=true&w=majority&appName=Cluster0
   
   # JWT Secrets (generate new ones!)
   JWT_ACCESS_SECRET=<generate-64-char-random-string>
   JWT_REFRESH_SECRET=<generate-64-char-random-string>
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   
   # Cookie Settings
   COOKIE_DOMAIN=.onrender.com
   COOKIE_SECURE=true
   
   # Client URL (will update after frontend deployment)
   CLIENT_URL=https://rotary-club-frontend.onrender.com
   
   # Email Configuration (if using Gmail, enable App Passwords)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@rotarycalicutsouth.org
   
   # Razorpay (use your production keys)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # File Upload
   MAX_FILE_SIZE=5242880
   ```

5. **Generate JWT Secrets**
   Run in PowerShell:
   ```powershell
   # Generate JWT Access Secret
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
   
   # Generate JWT Refresh Secret (run again)
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
   ```

6. **Create Web Service**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your API URL: `https://rotary-club-api.onrender.com`

7. **Test Backend**
   - Visit: `https://rotary-club-api.onrender.com/api/health`
   - Should return: `{ "status": "ok", "timestamp": "..." }`

### Phase 4: Deploy Frontend on Render

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Select same repository: `rotary-club-portal`

2. **Configure Static Site**
   ```
   Name:              rotary-club-frontend
   Branch:            main
   Root Directory:    (leave empty)
   Build Command:     cd client && npm install && npm run build
   Publish Directory: client/dist
   ```

3. **Add Environment Variables**
   ```bash
   # Backend URLs (use your actual backend URL from Phase 3)
   VITE_API_URL=https://rotary-club-api.onrender.com/api
   VITE_SOCKET_URL=https://rotary-club-api.onrender.com
   
   # Razorpay Key (public key)
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Add Rewrite Rules**
   Under "Redirects/Rewrites":
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

5. **Create Static Site**
   - Click "Create Static Site"
   - Wait for build and deployment (5-10 minutes)
   - Your site URL: `https://rotary-club-frontend.onrender.com`

### Phase 5: Update Backend with Frontend URL

1. **Go back to Backend Service**
   - Dashboard → rotary-club-api → Environment

2. **Update CLIENT_URL**
   - Find `CLIENT_URL` variable
   - Update to: `https://rotary-club-frontend.onrender.com`
   - Click "Save Changes"
   - Service will automatically redeploy

### Phase 6: Configure Custom Domain (Optional)

#### For Backend API

1. Go to your backend service → Settings → Custom Domains
2. Add your domain: `api.yourdomain.com`
3. Add DNS records at your domain registrar:
   ```
   Type: CNAME
   Name: api
   Value: rotary-club-api.onrender.com
   ```

#### For Frontend

1. Go to your static site → Settings → Custom Domains
2. Add your domain: `yourdomain.com` and `www.yourdomain.com`
3. Add DNS records:
   ```
   Type: CNAME
   Name: www
   Value: rotary-club-frontend.onrender.com
   
   Type: A
   Name: @
   Value: (Render will provide IP addresses)
   ```

### Phase 7: Test Your Deployment

1. **Visit Frontend URL**
   - Open: `https://rotary-club-frontend.onrender.com`
   - You should see the login page

2. **Test Registration/Login**
   - Try creating an account
   - Check if emails are working

3. **Test File Uploads**
   - Upload a profile picture
   - Check if uploads work

4. **Check Backend Logs**
   - Go to backend service → Logs
   - Monitor for any errors

## 🔧 Post-Deployment Configuration

### Enable Persistent Storage for Uploads

Render's free tier has ephemeral storage. For production:

**Option 1: Use Cloudinary (Recommended)**
1. Sign up at https://cloudinary.com
2. Get API credentials
3. Add to backend environment variables:
   ```bash
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

**Option 2: Use AWS S3**
1. Create S3 bucket
2. Create IAM user with S3 access
3. Add credentials to environment variables

### Set Up Monitoring

1. **Render Health Checks**
   - Already configured via `/api/health` endpoint
   - Render automatically monitors this

2. **Set Up Alerts**
   - Go to service → Settings → Notifications
   - Add email for deployment notifications

### Configure Backups (MongoDB Atlas)

1. Go to MongoDB Atlas → Backup
2. Enable continuous backups
3. Set retention period

## 🔒 Security Checklist

- [x] Environment variables set (not hardcoded)
- [x] MongoDB connection string updated with new credentials
- [x] JWT secrets generated (new, random)
- [x] COOKIE_SECURE set to `true`
- [x] CORS configured with specific domains
- [x] Rate limiting enabled
- [x] File upload size limits set
- [ ] Set up MongoDB IP whitelist (instead of 0.0.0.0/0)
- [ ] Enable 2FA on Render account
- [ ] Set up custom domain with SSL
- [ ] Configure email service (not test credentials)
- [ ] Add production Razorpay keys

## 💰 Cost Estimate

**Free Tier:**
- Backend: $0 (Free tier, sleeps after inactivity)
- Frontend: $0 (Free tier)
- MongoDB Atlas: $0 (Free tier, 512MB)
- **Total: $0/month**

**Recommended Production Setup:**
- Backend: $7/month (Starter plan, always on)
- Frontend: $0 (Free tier sufficient)
- MongoDB Atlas: $0 or $9/month (Shared M2)
- Cloudinary: $0 (Free tier, 25GB)
- **Total: $7-16/month**

## 🐛 Troubleshooting

### Backend Won't Start
- Check logs in Render dashboard
- Verify MongoDB connection string
- Ensure all required environment variables are set

### Frontend Shows 404 on Refresh
- Check Rewrite Rules are configured
- Ensure `/*` redirects to `/index.html`

### API Calls Failing
- Check CORS configuration
- Verify `CLIENT_URL` in backend matches frontend URL
- Check `VITE_API_URL` in frontend environment variables

### Uploads Not Persisting
- Render free tier has ephemeral storage
- Implement Cloudinary or S3 integration
- Check upload service configuration

### Performance Issues (Free Tier)
- Backend sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds (cold start)
- Solution: Upgrade to Starter plan ($7/mo) for always-on service

### MongoDB Connection Errors
- Check IP whitelist (Network Access in Atlas)
- Verify connection string format
- Ensure database user has proper permissions

## 🔄 Updates and Redeployment

### Automatic Deployments
- Push to GitHub `main` branch
- Render automatically detects and deploys

### Manual Deployments
- Go to service → Manual Deploy
- Click "Deploy latest commit"

### Rollback
- Go to service → Events
- Click "Rollback" on previous deployment

## 📊 Monitoring

### Check Service Health
```bash
# Backend health
curl https://rotary-club-api.onrender.com/api/health

# Check response time
curl -w "@-" -o /dev/null -s https://rotary-club-api.onrender.com/api/health <<'EOF'
\nTime: %{time_total}s\n
EOF
```

### View Logs
- Dashboard → Service → Logs
- Filter by date/time
- Download logs if needed

## 🎉 Success!

Your Rotary Club Portal is now live on Render!

**URLs:**
- Frontend: `https://rotary-club-frontend.onrender.com`
- Backend API: `https://rotary-club-api.onrender.com/api`
- Health Check: `https://rotary-club-api.onrender.com/api/health`

## 📞 Support

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/
- Project Issues: Create issue on GitHub

---

**Next Steps:**
1. Set up custom domain
2. Configure email service
3. Add production payment gateway keys
4. Set up monitoring and alerts
5. Create admin user via script
