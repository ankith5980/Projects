# Domain Update Guide

## When You Get Your Custom Domain

If you purchase a custom domain (e.g., `ankithmenon.com` or `ankith.dev`), follow these steps:

### 1. Update Configuration Files

#### `client/src/utils/seoConfig.js`
```javascript
// Line 5
siteUrl: 'https://yourdomain.com', // Replace with your actual domain
```

#### `client/public/robots.txt`
```plaintext
# Line 39
Sitemap: https://yourdomain.com/sitemap.xml
```

#### `client/public/sitemap.xml`
Replace all occurrences of `https://portfolio-ankith.vercel.app` with your domain:
- Line 5: `<loc>https://yourdomain.com/</loc>`
- Line 10: `<image:loc>https://yourdomain.com/images/Ankith.jpg</image:loc>`
- Lines 15, 21, 25, 30, 35, 40: Update all URLs

#### `client/index.html`
Replace `https://portfolio-ankith.vercel.app` in:
- Line 55: Canonical URL
- Line 78: Person @id
- Line 89: Person url
- Line 90: mainEntityOfPage
- Line 107-113: sameAs URLs
- Line 156: WebSite @id
- Line 161: WebSite url
- Line 162-168: mainEntity, author, creator, publisher @id
- Line 172: potentialAction target
- Line 178: primaryImageOfPage url

### 2. Vercel Domain Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

### 3. DNS Configuration (if managing separately)

Add these DNS records:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. Rebuild & Deploy

After updating all files:
```bash
npm run build
git add .
git commit -m "Update domain to custom domain"
git push
```

Vercel will automatically redeploy.

### 5. Update External References

- Update Google Search Console with new domain
- Update Bing Webmaster Tools
- Update social media profile links
- Update LinkedIn profile
- Update GitHub profile
- Resubmit sitemap to search engines

### 6. Set Up Redirects (Optional)

In `vercel.json`, add redirects from old domain:
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "portfolio-ankith.vercel.app"
        }
      ],
      "destination": "https://yourdomain.com/:path*",
      "permanent": true
    }
  ]
}
```

---

## Current URLs to Replace

Search for these URLs across your project:
- `https://portfolio-ankith.vercel.app`
- `portfolio-ankith.vercel.app`

Files containing these URLs:
1. `client/index.html`
2. `client/public/sitemap.xml`
3. `client/public/robots.txt`
4. `client/src/utils/seoConfig.js`
5. Any other configuration files

---

## Quick Find & Replace Commands

### VS Code
1. Press `Ctrl+Shift+H` (Windows) or `Cmd+Shift+H` (Mac)
2. Find: `portfolio-ankith.vercel.app`
3. Replace: `yourdomain.com`
4. Click "Replace All"

### PowerShell
```powershell
# Navigate to client folder
cd client

# Find all occurrences
Get-ChildItem -Recurse -File | Select-String "portfolio-ankith.vercel.app"

# Replace (use carefully!)
# (Get-Content file.txt) -replace 'portfolio-ankith.vercel.app', 'yourdomain.com' | Set-Content file.txt
```

---

## Verification After Domain Update

1. [ ] Test all pages load correctly
2. [ ] Check canonical URLs point to new domain
3. [ ] Verify sitemap accessible at new domain
4. [ ] Test robots.txt at new domain
5. [ ] Verify Schema.org structured data with Rich Results Test
6. [ ] Check Open Graph tags with Facebook Debugger
7. [ ] Test Twitter Card with Twitter Card Validator
8. [ ] Resubmit sitemap to Google Search Console
9. [ ] Request reindexing of all pages

---

## Important Notes

- Keep the Vercel domain as a fallback initially
- Don't delete old domain until new one is fully indexed
- Monitor Google Search Console for any crawl errors
- Update all external links gradually
- SSL certificate will be automatically provisioned by Vercel

---

**Current Domain**: https://portfolio-ankith.vercel.app
**Status**: Using Vercel subdomain
**Action Required**: Update to custom domain for better SEO
