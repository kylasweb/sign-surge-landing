# Vercel Deployment Configuration Plan

## Problem
The admin routes (`/admin` and `/admin/dashboard`) are returning 404 errors when accessed directly via URL on the Vercel deployment.

## Root Cause
This is happening because the application uses client-side routing (React Router), but Vercel's default configuration doesn't know to serve the `index.html` file for these routes.

## Solution
Create a `vercel.json` configuration file with the following settings:

```json
{
  "routes": [
    {
      "src": "^/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "^/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "^/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": ".*",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/admin/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Configuration Breakdown

1. **Routes Configuration**:
   - Preserves direct access to static files and assets
   - Routes favicon.ico requests directly
   - All other routes redirect to index.html for client-side routing

2. **Security Headers**:
   - Added security headers specifically for admin routes
   - Prevents clickjacking
   - Prevents MIME type sniffing
   - Enables XSS protection

## Implementation Steps

1. Switch to Code mode to create the vercel.json file
2. Deploy the changes to Vercel
3. Verify admin routes are accessible via direct URL
4. Test security headers on admin routes

## Expected Outcome
- Direct URL access to `/admin` and `/admin/dashboard` will work correctly
- Client-side routing will function as expected
- Admin section will have additional security headers
- Static assets will continue to be served correctly

## Verification Steps
1. Test direct access to `/admin`
2. Test direct access to `/admin/dashboard`
3. Test navigation between routes
4. Verify security headers using browser dev tools

Would you like me to switch to Code mode to implement this solution?