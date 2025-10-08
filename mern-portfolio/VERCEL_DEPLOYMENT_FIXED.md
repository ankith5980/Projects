# 🚀 Vercel Deployment Configuration

## ✅ **Correct Vercel Settings**

### **Root Directory:**
```
mern-portfolio/client
```

### **Build Settings:**
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### **Why This Structure:**

#### Your Repository Structure:
```
GitHub: Projects/
├── .git/
└── mern-portfolio/           ← Monorepo folder
    ├── client/              ← Frontend (Deploy this!)
    │   ├── package.json     ← Vite React app
    │   ├── vite.config.js
    │   ├── src/
    │   └── build/
    ├── server/              ← Backend (Don't deploy)
    │   ├── package.json     ← Node.js API
    │   └── server.js
    └── vercel.json          ← Config file
```

#### Vercel Needs to Point to Client:
- **Root Directory:** `mern-portfolio/client` 
- This makes Vercel see only the React frontend
- Ignores the backend server files
- Uses the correct `package.json` with Vite dependencies

### **Environment Variables in Vercel:**
```bash
VITE_EMAILJS_SERVICE_ID=service_27jmx62
VITE_EMAILJS_TEMPLATE_ID=template_49nj4oq
VITE_EMAILJS_PUBLIC_KEY=3d4ntCXQj5ZNHkKyv
VITE_APP_NAME=Portfolio
VITE_APP_VERSION=1.0.0
```

### **vercel.json Location:**
- Keep `vercel.json` in `mern-portfolio/` (current location is correct)
- Vercel will find it relative to the root directory setting

---

## 🔧 **How to Fix in Vercel Dashboard:**

1. Go to your Vercel project settings
2. **Build & Development Settings**
3. **Root Directory:** Change from `/` to `mern-portfolio/client`
4. **Framework Preset:** Vite
5. **Build Command:** `npm run build`
6. **Output Directory:** `build`
7. Save and redeploy

This will fix your deployment issues!