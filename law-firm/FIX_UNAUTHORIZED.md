# Fix "Unauthorized" Error in Admin Dashboard

## Problem
When trying to create/edit blogs or upload images, you get "Unauthorized" errors because the admin secret environment variables are not set in Vercel.

## Solution: Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/elhodhods-projects/law-firm
2. Click **Settings** → **Environment Variables**

### Step 2: Add ADMIN_SECRET
1. Click **Add New**
2. **Name**: `ADMIN_SECRET`
3. **Value**: Choose a strong random string (e.g., `your-secret-key-12345-abcde`)
4. **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 3: Add NEXT_PUBLIC_ADMIN_SECRET
1. Click **Add New** again
2. **Name**: `NEXT_PUBLIC_ADMIN_SECRET`
3. **Value**: Use the **EXACT SAME VALUE** as ADMIN_SECRET
4. **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 4: Redeploy
After adding the environment variables:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Wait for deployment to complete

### Step 5: Test
1. Go to https://law-firm-peach-tau.vercel.app/admin
2. Log in
3. Try creating a new blog post
4. Try uploading an image

## Important Notes

- **Both variables must have the SAME value**
- **NEXT_PUBLIC_ADMIN_SECRET** is exposed to the browser (that's why it's PUBLIC)
- **ADMIN_SECRET** is used server-side for security
- After redeploying, clear your browser cache or do a hard refresh (Ctrl+Shift+R)

## Quick Test

After setting the variables and redeploying, check the browser console (F12):
- You should NOT see "Unauthorized" errors
- Image uploads should work
- Blog creation should work

