# Admin Dashboard

## Setup

1. Create a `.env.local` file in the `law-firm` directory with:
   ```
   ADMIN_SECRET=your-secure-password-here
   NEXT_PUBLIC_ADMIN_SECRET=your-secure-password-here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
   > During local development on another port (e.g. `3001`) update `NEXT_PUBLIC_BASE_URL` accordingly.

2. For production, set these environment variables in Vercel:
   - `ADMIN_SECRET`: Your secure admin password
   - `NEXT_PUBLIC_ADMIN_SECRET`: Same password (for client-side auth)
   - `NEXT_PUBLIC_BASE_URL`: Your production URL (e.g., `https://yourdomain.com`)

## Access

1. Navigate to `/admin` on your website.
2. Enter the admin password you set in `ADMIN_SECRET`.
3. After logging in you can manage blog posts or review consultation requests.

## Features

- **Consultation inbox**: `/admin/consultations` lists incoming enquiries from the public contact form, lets you update status, add internal notes, or delete entries.
- **Create Blog Posts**: `/admin/blog/new` captures bilingual titles, summaries, rich HTML content, hero images, related links, default locale, publish state, and timestamp.
- **Manage Blog Posts**: `/admin/blog` provides a sortable table to publish/unpublish, edit, or delete any entry.
- **Edit Blog Posts**: `/admin/blog/[id]` pre-loads the bilingual content for updates and supports link management and image changes.
- **Public contact form**: `/[locale]/contact` now submits directly to the consultation API and shows success/error feedback in both languages.

## Data Storage

- Blog posts are stored in `src/data/blogs.json`.
- Consultation requests are stored in `src/data/consultations.json`.
Both files are automatically managed by the admin APIs. Avoid manual edits unless necessary.

## Security Notes

For production use, consider:
- Upgrading to a proper authentication/authorization flow (e.g., NextAuth.js, middleware + sessions).
- Moving data to a database instead of JSON files.
- Enabling rate limiting on the API routes.
- Keeping secrets unique per environment and rotating regularly.
*** End Patch
