# Notion Blog Integration Setup Guide

This guide explains how to integrate Notion as a CMS for your portfolio blog, with multiple deployment options.

## Prerequisites

1. **Notion Integration Token**
   - Go to https://www.notion.so/my-integrations
   - Create a new integration
   - Copy the "Internal Integration Token"

2. **Notion Database Setup**
   - Create a database in Notion with these properties:
     - `Title` (title) - Blog post title
     - `Slug` (text) - URL-friendly slug
     - `Status` (select) - Published/Draft
     - `Published Date` (date) - Publication date
     - `Tags` (multi-select) - Post categories
     - `Excerpt` (text) - Short description
     - `Cover Image` (files) - Featured image
   - Share the database with your integration
   - Copy the database ID from the URL

## Deployment Options

### Option 1: Vercel (Recommended - FREE)

**Pros:**
- Free tier includes serverless functions
- Automatic deployments from GitHub
- Built-in environment variable management
- No additional backend server needed

**Setup:**
1. Push your code to GitHub
2. Import project to Vercel: https://vercel.com/new
3. Add environment variables in Vercel dashboard:
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID`
4. Deploy!

**Cost:** FREE for personal use (100GB bandwidth/month)

### Option 2: Netlify + Netlify Functions

**Setup:**
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```
3. Add environment variables in Netlify dashboard
4. Deploy: `netlify deploy`

**Cost:** FREE tier includes 125,000 function requests/month

### Option 3: Express Server + Any Static Host

**Frontend Hosting Options:**
- GitHub Pages (FREE)
- Cloudflare Pages (FREE)
- Surge.sh (FREE)
- AWS S3 + CloudFront

**Backend Hosting Options:**
- Railway (FREE tier available)
- Render (FREE tier available)
- Fly.io (FREE tier available)
- Heroku (Paid only now)
- DigitalOcean App Platform ($5/month)

**Setup:**
1. Deploy Express server to chosen platform
2. Update `VITE_API_URL` in frontend to point to your API
3. Deploy frontend to static host

### Option 4: Cloudflare Workers

Create `worker.js`:
```javascript
export default {
  async fetch(request, env) {
    // Add CORS headers
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Your Notion API logic here
    // Use env.NOTION_TOKEN and env.NOTION_DATABASE_ID
  },
};
```

**Cost:** FREE for 100,000 requests/day

## Environment Variables

Create `.env` for local development:
```env
# For Vercel/Netlify serverless functions
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_database_id

# For frontend (if using separate backend)
VITE_API_URL=http://localhost:3001/api/notion
```

## Testing Locally

### With Vercel:
```bash
npm install -g vercel
vercel dev
```

### With Express Server:
```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### With Netlify:
```bash
netlify dev
```

## Notion Database Schema

Your Notion database should have:
- **Title** (required): Post title
- **Slug** (required): URL slug (e.g., "my-first-post")
- **Status** (required): Select with "Published" option
- **Published Date**: For sorting posts
- **Tags**: Multi-select for categorization
- **Excerpt**: Short description
- **Cover Image**: Upload or external URL

## Troubleshooting

1. **CORS Errors**: Make sure your API endpoint includes proper CORS headers
2. **404 Errors**: Verify your database ID and that it's shared with your integration
3. **Empty Posts**: Check that posts have "Published" status
4. **No Content**: Ensure your Notion pages have content blocks

## Security Notes

- Never expose your Notion token in frontend code
- Use environment variables for sensitive data
- Consider rate limiting for production use
- Add domain restrictions in production

## Next Steps

1. Customize the blog design in your components
2. Add pagination for many posts
3. Implement search functionality
4. Add RSS feed generation
5. Set up webhook for automatic rebuilds when Notion content changes 