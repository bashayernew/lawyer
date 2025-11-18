# Vercel Deployment Setup Guide

## Required Environment Variables

To fix the "Unauthorized" error and enable blog storage, you need to set up the following environment variables in Vercel:

### 1. Set ADMIN_SECRET

1. Go to your Vercel project dashboard: https://vercel.com/elhodhods-projects/law-firm
2. Click on **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `ADMIN_SECRET`
   - **Value**: (Choose a strong random string, e.g., `your-secret-key-here-12345`)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### 2. Set NEXT_PUBLIC_ADMIN_SECRET (for client-side)

1. In the same Environment Variables section, add:
   - **Name**: `NEXT_PUBLIC_ADMIN_SECRET`
   - **Value**: (Use the SAME value as ADMIN_SECRET)
   - **Environment**: Select all (Production, Preview, Development)
2. Click **Save**

### 3. Set up Vercel KV (for blog storage)

Vercel's serverless functions have a read-only file system, so we need Vercel KV (Redis) for persistent storage:

1. Go to your Vercel project dashboard
2. Click on **Storage** tab (or go to https://vercel.com/storage)
3. Click **Create Database** → Select **KV**
4. Choose a name (e.g., `law-firm-kv`)
5. Select your project: `law-firm`
6. Click **Create**
7. Vercel will automatically add these environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 4. Set Email Configuration (for contact form notifications)

To receive email notifications when someone submits the contact form:

1. In the Environment Variables section, add:
   - **Name**: `SMTP_HOST`
   - **Value**: Your SMTP server (e.g., `smtp.gmail.com` for Gmail)
   - **Environment**: Select all
2. Add:
   - **Name**: `SMTP_PORT`
   - **Value**: `587` (or `465` for SSL)
   - **Environment**: Select all
3. Add:
   - **Name**: `SMTP_USER`
   - **Value**: Your email address
   - **Environment**: Select all
4. Add:
   - **Name**: `SMTP_PASS`
   - **Value**: Your email password or app password (for Gmail, use an App Password)
   - **Environment**: Select all
5. Add:
   - **Name**: `MAIL_FROM`
   - **Value**: Sender email (e.g., `noreply@yourdomain.com`)
   - **Environment**: Select all
6. Add:
   - **Name**: `MAIL_TO`
   - **Value**: Your email address where you want to receive contact form submissions
   - **Environment**: Select all

**Note**: If email is not configured, contact form submissions will still be saved in the admin dashboard, but you won't receive email notifications.

### 5. Redeploy

After setting up the environment variables:

1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## Testing

1. **Admin Dashboard**: Visit `https://law-firm-f1lmip6i3-elhodhods-projects.vercel.app/admin`
2. **Login**: Use your admin credentials
3. **Create Blog**: Try creating a new blog post
4. **View Blog**: Check `https://law-firm-f1lmip6i3-elhodhods-projects.vercel.app/en/blog`

## Troubleshooting

### Still getting "Unauthorized"?
- Make sure `ADMIN_SECRET` and `NEXT_PUBLIC_ADMIN_SECRET` are set to the same value
- Redeploy after adding environment variables
- Check the deployment logs for errors

### Blogs not saving?
- Make sure Vercel KV is set up and environment variables are added
- Check the Vercel function logs for KV connection errors
- The first blog creation will initialize the KV storage

### Need to migrate existing blogs?
If you have blogs in `src/data/blogs.json`, they will be automatically synced to KV on first read. New blogs will be stored in KV.

