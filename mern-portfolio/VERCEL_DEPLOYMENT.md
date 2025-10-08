# 🚀 Vercel Deployment Guide

## ✅ **Issues Fixed:**

### **1. "vite: command not found" Error**
- **Problem**: Vite was in devDependencies, Vercel couldn't find it during build
- **Solution**: Moved Vite and build tools to dependencies in package.json
- **Status**: ✅ FIXED

### **2. SSR/Build Time Issues** 
- **Problem**: `window.location.origin` was causing build failures
- **Solution**: Created `src/utils/url.js` with safe URL utilities
- **Fixed Files**: SEO.jsx, Home.jsx, About.jsx, Projects.jsx, Contact.jsx
- **Status**: ✅ FIXED

### **3. Environment Variables**
- **Created**: `.env.example` with `VITE_BASE_URL`
- **Usage**: Replace `https://your-portfolio-domain.vercel.app` with your actual Vercel URL
- **Status**: ✅ CONFIGURED

### **4. Vercel Configuration**
- **Created**: `vercel.json` with proper routing and caching headers
- **Framework**: Configured for Vite build process
- **Root Directory**: Set to client folder
- **Status**: ✅ OPTIMIZED

## 📋 **Deployment Steps:**

### **Step 1: Update Environment Variables**
1. Copy `.env.example` to `.env` in the client folder
2. Update `VITE_BASE_URL` with your actual domain:
   ```env
   VITE_BASE_URL=https://your-portfolio.vercel.app
   ```

### **Step 2: Update Static Files**
Replace `https://your-domain.com` in these files:
- `public/sitemap.xml`
- `public/robots.txt`
- `index.html`

### **Step 3: Deploy to Vercel**

#### **Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### **Option B: GitHub Integration**
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### **Step 4: Environment Variables in Vercel**
Add these in Vercel dashboard:
```
VITE_BASE_URL=https://your-portfolio.vercel.app
```

## 🔧 **Build Configuration:**

### **Vercel Settings:**
- **Framework**: Vite
- **Root Directory**: `client` 
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x (recommended)

### **Node.js Version:**
Ensure Vercel uses Node.js 18+ in settings.

## 🐛 **Common Issues & Solutions:**

### **Issue 1: "vite: command not found" (MOST COMMON)**
- **Cause**: Vite in devDependencies instead of dependencies
- **Solution**: ✅ Fixed - Moved Vite to dependencies
- **Error Code**: Command "npm run build" exited with 127

### **Issue 2: "window is not defined"**
- **Cause**: Using browser APIs during build
- **Solution**: ✅ Fixed with safe URL utilities

### **Issue 3: "Cannot find module"**
- **Cause**: Missing dependencies
- **Solution**: Check package.json, run `npm install`

### **Issue 4: "Build failed"**
- **Cause**: Environment variables or build config issues
- **Solution**: Check Vercel logs, verify build settings

### **Issue 5: "404 on refresh"**
- **Cause**: SPA routing issues
- **Solution**: ✅ Fixed with vercel.json rewrites

## 📊 **Performance Optimizations Applied:**

### **Build Optimizations:**
- ✅ Code splitting with manual chunks
- ✅ Terser minification
- ✅ Source maps for debugging
- ✅ Asset caching headers

### **SEO Optimizations:**
- ✅ Meta tags for all pages
- ✅ Open Graph & Twitter cards
- ✅ Structured data (Schema.org)
- ✅ Sitemap & robots.txt

## 🔍 **Verification:**

After deployment, test:
1. **Page Load**: All routes work
2. **SEO**: View source shows meta tags
3. **Social Sharing**: Test on Facebook/Twitter
4. **Performance**: Run Lighthouse audit
5. **Mobile**: Test responsive design

## 📝 **Post-Deployment:**

1. **Update URLs**: Replace all placeholder domains
2. **Submit Sitemap**: Add to Google Search Console
3. **Monitor**: Check Vercel Analytics
4. **SSL**: Verify HTTPS is working

Your portfolio should now deploy successfully to Vercel! 🎉