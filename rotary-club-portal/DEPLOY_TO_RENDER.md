# 🚀 Deploy to Render - Quick Start

This is the fastest way to deploy your Rotary Club Portal to Render.

## ⚡ Quick Deploy (5 Steps)

### 1. Prepare MongoDB (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **IMPORTANT:** Create a NEW database user (don't use the exposed credentials)
   - Database Access → Add New User
   - Username: `rotary_prod_user`
   - Password: Generate strong password (SAVE IT!)
3. Network Access → Add IP: `0.0.0.0/0`
4. Copy connection string:
   ```
   mongodb+srv://rotary_prod_user:YOUR_NEW_PASSWORD@cluster0.xxxxx.mongodb.net/rotary-club?retryWrites=true&w=majority
   ```

### 2. Push to GitHub (2 minutes)

```powershell
# In project root directory
cd c:\Users\ankit\Desktop\Projects\rotary-club-portal

# Run deployment helper
.\deploy-to-render.ps1

# Or manually:
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 3. Deploy Backend (10 minutes)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   ```
   Name: rotary-club-api
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```
5. Add environment variables (click "Advanced"):
   - Copy from `ENV_VARIABLES_GUIDE.md`
   - **MUST SET:** MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
6. Click **Create Web Service**
7. Wait for deployment (5-10 min)
8. **Save your backend URL:** `https://rotary-club-api.onrender.com`

### 4. Deploy Frontend (10 minutes)

1. Click **New +** → **Static Site**
2. Connect same repository
3. Configure:
   ```
   Name: rotary-club-frontend
   Build Command: cd client && npm install && npm run build
   Publish Directory: client/dist
   ```
4. Add Rewrite Rule:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
5. Add environment variables:
   ```
   VITE_API_URL=https://rotary-club-api.onrender.com/api
   VITE_SOCKET_URL=https://rotary-club-api.onrender.com
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   ```
6. Click **Create Static Site**
7. **Save your frontend URL:** `https://rotary-club-frontend.onrender.com`

### 5. Connect Services (2 minutes)

1. Go back to **Backend Service** → Environment
2. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://rotary-club-frontend.onrender.com
   ```
3. Click **Save Changes** (auto-redeploys)

## ✅ Verify Deployment

1. **Test Backend:**
   ```
   https://rotary-club-api.onrender.com/health
   ```
   Should return: `{"status":"OK",...}`

2. **Test Frontend:**
   ```
   https://rotary-club-frontend.onrender.com
   ```
   Should show login page

3. **Test Registration:**
   - Create account
   - Check if it works

## 🎉 You're Live!

Your app is now deployed on:
- **Frontend:** https://rotary-club-frontend.onrender.com
- **Backend:** https://rotary-club-api.onrender.com/api

## 📚 Detailed Guides

- **Complete Guide:** [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md)
- **Environment Variables:** [ENV_VARIABLES_GUIDE.md](ENV_VARIABLES_GUIDE.md)
- **Checklist:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## 🔧 Common Issues

### Backend won't start
- Check MongoDB connection string
- Verify all required env variables are set
- Check logs in Render dashboard

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings
- Ensure `CLIENT_URL` is set in backend

### Slow response (first request)
- Free tier sleeps after 15 min inactivity
- First request takes 30-60 seconds (cold start)
- Upgrade to Starter plan ($7/mo) for always-on

## 💡 Pro Tips

1. **Save Your URLs:** Bookmark both service URLs
2. **Watch Logs:** Monitor during first deployment
3. **Test Incrementally:** Test backend before frontend
4. **Use Test Mode:** Start with Razorpay test keys
5. **Set Up Monitoring:** Enable Render notifications

## 🆘 Need Help?

- Check detailed guides in the project
- Render Docs: https://render.com/docs
- MongoDB Docs: https://www.mongodb.com/docs/atlas/

## 🔄 Future Deployments

After initial setup, deployments are automatic!

Just push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will auto-deploy both services. 🎉

---

**Deployment Time:** ~30 minutes first time, then automatic
**Cost:** Free tier (with cold starts) or $7/month (always-on)
