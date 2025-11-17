# Deployment Guide for Vercel

## Overview
Both the public website and admin dashboard are in the same Next.js project. You only need ONE repository.

## Steps to Deploy

### 1. Make sure your code is in Git
```bash
cd law-firm
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Set the **Root Directory** to `law-firm` (important!)
5. Vercel will auto-detect Next.js

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
cd law-firm
vercel
```

### 3. Set Environment Variables in Vercel

Go to your project settings → Environment Variables and add:

**Required for Email (Contact Form):**
- `SMTP_HOST` - Your SMTP server (e.g., smtp.gmail.com)
- `SMTP_PORT` - Usually 587 or 465
- `SMTP_USER` - Your email address
- `SMTP_PASS` - Your email password or app password
- `MAIL_FROM` - Sender email (e.g., noreply@yourdomain.com)
- `MAIL_TO` - Where to send contact form emails

**Required for Admin Dashboard:**
- `ADMIN_SECRET` - Your secure admin password
- `NEXT_PUBLIC_ADMIN_SECRET` - Same password (for client-side)
- `NEXT_PUBLIC_BASE_URL` - Your Vercel URL (auto-set, but you can override)

**Optional:**
- `NEXT_PUBLIC_BASE_URL` - Will be auto-set by Vercel, but you can set it manually

### 4. After Deployment

- **Public Website**: `https://your-project.vercel.app/en` or `/ar`
- **Admin Dashboard**: `https://your-project.vercel.app/admin`

## Important Notes

1. **Root Directory**: Make sure Vercel knows the root is `law-firm` folder, not the parent directory
2. **Environment Variables**: Set them in Vercel dashboard for production
3. **File Storage**: Currently using JSON files. For production, consider moving to a database
4. **Admin Access**: Use the password you set in `ADMIN_SECRET` to access `/admin`

## Troubleshooting

- If build fails, check that `vercel.json` is in the `law-firm` directory
- Make sure all environment variables are set
- Check Vercel build logs for any errors

