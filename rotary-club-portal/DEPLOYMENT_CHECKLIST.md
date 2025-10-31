# 🚀 Pre-Deployment Checklist

Use this checklist before deploying to Render.

## ✅ Security & Credentials

- [ ] **CRITICAL:** Changed MongoDB password (exposed in .env)
  - Created new database user in MongoDB Atlas
  - Generated strong password (saved securely)
  - Updated IP whitelist to include 0.0.0.0/0
  
- [ ] Generated new JWT secrets
  - JWT_ACCESS_SECRET (64 chars)
  - JWT_REFRESH_SECRET (64 chars)
  - Saved securely (password manager)

- [ ] Removed all sensitive data from repository
  - No .env files committed
  - No hardcoded secrets
  - Verified with: `git log --all -S "password" -p`

- [ ] Email service configured
  - Gmail app password OR
  - SendGrid API key OR
  - Other SMTP service
  
- [ ] Payment gateway configured
  - Razorpay test keys (for staging)
  - Razorpay live keys (for production)
  - Webhook URL ready

## 📝 Code & Configuration

- [ ] All code committed to GitHub
  ```bash
  git add .
  git commit -m "Prepare for Render deployment"
  git push origin main
  ```

- [ ] Reviewed deployment files
  - [x] render.yaml exists
  - [x] RENDER_DEPLOYMENT_GUIDE.md exists
  - [x] ENV_VARIABLES_GUIDE.md exists
  - [x] .gitignore updated

- [ ] Health check endpoint works locally
  ```bash
  # Start server locally
  cd server && npm start
  # Test in browser: http://localhost:5000/health
  ```

- [ ] Build works locally
  ```bash
  cd client && npm install && npm run build
  # Check if dist folder is created
  ```

## 🔧 Backend Configuration

- [ ] MongoDB connection tested
  - Connection string format correct
  - Database name included
  - Test locally first

- [ ] Environment variables prepared
  - All required variables documented
  - Values ready to paste into Render

- [ ] File upload strategy decided
  - [ ] Local storage (temp only - free tier)
  - [ ] Cloudinary (recommended)
  - [ ] AWS S3

- [ ] Rate limiting configured
  - RATE_LIMIT_WINDOW_MS set
  - RATE_LIMIT_MAX_REQUESTS set

## 🌐 Frontend Configuration

- [ ] API URL prepared
  - Will update after backend deployment
  - Format: https://rotary-club-api.onrender.com/api

- [ ] Build command verified
  ```bash
  cd client && npm install && npm run build
  ```

- [ ] Environment variables ready
  - VITE_API_URL
  - VITE_SOCKET_URL
  - VITE_RAZORPAY_KEY_ID

## 📊 Deployment Steps

### Step 1: MongoDB Setup
- [ ] Logged into MongoDB Atlas
- [ ] Created new database user
- [ ] Copied connection string
- [ ] Tested connection

### Step 2: Push to GitHub
- [ ] Code committed
- [ ] Pushed to main branch
- [ ] Repository is public (or Render has access)

### Step 3: Deploy Backend
- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Created Web Service
- [ ] Configured build/start commands
- [ ] Added all environment variables
- [ ] Deployed successfully
- [ ] Health check passing
- [ ] Saved backend URL

### Step 4: Deploy Frontend
- [ ] Created Static Site on Render
- [ ] Configured build command
- [ ] Set publish directory (client/dist)
- [ ] Added environment variables (with backend URL)
- [ ] Configured rewrite rules
- [ ] Deployed successfully
- [ ] Site loads in browser

### Step 5: Connect Backend & Frontend
- [ ] Updated CLIENT_URL in backend
- [ ] Triggered backend redeploy
- [ ] Tested API calls from frontend
- [ ] Verified CORS working

### Step 6: Functional Testing
- [ ] Registration works
- [ ] Login works
- [ ] Email received
- [ ] Profile update works
- [ ] File upload works
- [ ] Payment gateway tested (test mode)
- [ ] Notifications working
- [ ] Socket.io connected

## 🔍 Post-Deployment Verification

### Backend Tests
```bash
# Health check
curl https://rotary-club-api.onrender.com/health

# API info
curl https://rotary-club-api.onrender.com/api

# Test registration
curl -X POST https://rotary-club-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!","phone":"1234567890"}'
```

### Frontend Tests
- [ ] Homepage loads
- [ ] Login page accessible
- [ ] Registration form works
- [ ] Dashboard loads after login
- [ ] No console errors
- [ ] API calls successful

### Integration Tests
- [ ] Create account → receive email
- [ ] Login → stay logged in
- [ ] Upload file → file saved
- [ ] Make payment → webhook received
- [ ] Send notification → appears in UI

## 📈 Performance Check

- [ ] Backend responds < 1s (cold start may be slower)
- [ ] Frontend loads < 3s
- [ ] API calls complete < 500ms
- [ ] No memory leaks
- [ ] Logs show no errors

## 🔒 Security Verification

- [ ] HTTPS enabled on both services
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Helmet security headers present
- [ ] No secrets exposed in logs
- [ ] XSS protection enabled
- [ ] CSRF protection (via tokens)

## 📱 Optional: Custom Domain

- [ ] Domain purchased
- [ ] DNS records added
- [ ] SSL certificate issued
- [ ] Backend on custom domain
- [ ] Frontend on custom domain
- [ ] Updated all environment variables

## 📊 Monitoring Setup

- [ ] Render email notifications enabled
- [ ] Health check monitoring active
- [ ] Error logging configured
- [ ] MongoDB Atlas monitoring enabled
- [ ] Set up alerts for downtime

## 💾 Backup Strategy

- [ ] MongoDB backups enabled (Atlas)
- [ ] Important files backed up (if using local storage)
- [ ] Environment variables documented
- [ ] Recovery plan documented

## 🎉 Launch Checklist

Before announcing to users:

- [ ] All tests passing
- [ ] No critical errors in logs
- [ ] Email delivery working
- [ ] Payments working (if applicable)
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Admin account created
- [ ] Initial data seeded (if needed)

## 📞 Emergency Contacts

- **Render Support:** support@render.com
- **MongoDB Support:** Via Atlas dashboard
- **Payment Gateway:** Via dashboard
- **DNS Provider:** Via your registrar

## 🆘 Rollback Plan

If deployment fails:

1. Check Render logs
2. Verify environment variables
3. Test locally first
4. Use Render's rollback feature
5. Restore from previous deployment

---

## ✨ Ready to Deploy?

If all checkboxes are checked, you're ready!

Follow the **RENDER_DEPLOYMENT_GUIDE.md** for detailed instructions.

---

**Estimated Time:**
- First-time deployment: 1-2 hours
- Subsequent deployments: 5-10 minutes (automatic)

**Questions?**
- Check RENDER_DEPLOYMENT_GUIDE.md
- Check ENV_VARIABLES_GUIDE.md
- Contact Render support
