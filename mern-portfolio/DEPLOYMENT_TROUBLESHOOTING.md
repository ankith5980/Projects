# 🚀 Deployed Website Troubleshooting Checklist

## 🔍 **Immediate Checks for Your Deployed Site**

### 1. **Vercel Dashboard Settings**
Go to your Vercel project → Settings → Build & Development Settings:

```
✅ Root Directory: mern-portfolio/client
✅ Framework Preset: Vite  
✅ Build Command: npm run build
✅ Output Directory: build
✅ Install Command: npm install
```

### 2. **Environment Variables in Vercel**
In Vercel Dashboard → Settings → Environment Variables:

```bash
VITE_EMAILJS_SERVICE_ID = service_27jmx62
VITE_EMAILJS_TEMPLATE_ID = template_49nj4oq  
VITE_EMAILJS_PUBLIC_KEY = 3d4ntCXQj5ZNHkKyv
VITE_APP_NAME = Portfolio
VITE_APP_VERSION = 1.0.0
```

⚠️ **Important:** All Vite env vars must start with `VITE_`

### 3. **Common Deployment Issues**

#### **Issue: "Page Not Found" / 404 Errors**
- **Cause:** Wrong root directory
- **Fix:** Set root directory to `mern-portfolio/client`

#### **Issue: "Build Failed" Errors**
- **Cause:** Wrong package.json or missing dependencies
- **Fix:** Ensure root directory points to your React app

#### **Issue: Contact Form Not Working**
- **Cause:** Missing environment variables or CORS issues
- **Fix:** Add all VITE_ env vars in Vercel dashboard

#### **Issue: "Cannot Find Module" Errors**
- **Cause:** Dependencies not installed correctly
- **Fix:** Clear build cache and redeploy

### 4. **Testing Your Live Site**

#### **Test the Contact Form:**
1. Open your deployed site
2. Fill out contact form
3. Open browser DevTools (F12) → Console tab
4. Submit form and check for errors

#### **Check Network Tab:**
1. DevTools → Network tab
2. Submit contact form
3. Look for failed requests (red entries)
4. Check response details

### 5. **Force Redeploy in Vercel**
If settings are correct but site still broken:
1. Go to Vercel Dashboard
2. Click "Deployments" tab
3. Click "..." on latest deployment
4. Select "Redeploy"

### 6. **Check Build Logs**
In Vercel Dashboard:
1. Click on failed deployment
2. Check "Build Logs" for errors
3. Look for missing files or build failures

## 📋 **What to Check Now:**

1. **Share your Vercel URL** - Let me test it directly
2. **Check Vercel settings** - Confirm root directory is correct
3. **Check environment variables** - Ensure all VITE_ vars are set
4. **Share any error messages** - From browser console or Vercel logs

---

## 🔧 **Quick Fixes:**

### If Contact Form Fails:
```javascript
// Check in browser console:
console.log(import.meta.env.VITE_EMAILJS_SERVICE_ID); // Should show service ID
```

### If Site Won't Load:
- Check Vercel build logs
- Verify root directory = `mern-portfolio/client`
- Force redeploy

### If 404 Errors:
- Ensure `vercel.json` rewrites are working
- Check if SPA routing is configured

Let me know your Vercel URL and I'll help diagnose the specific issue!