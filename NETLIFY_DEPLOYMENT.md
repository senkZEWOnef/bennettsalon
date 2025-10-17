# Netlify Deployment Configuration

## Environment Variables

To deploy this app on Netlify, you need to configure the following environment variable:

### Required Environment Variable

1. Go to your Netlify dashboard
2. Navigate to your site settings
3. Go to "Environment Variables" 
4. Add the following variable:

```
VITE_DATABASE_URL = postgresql://neondb_owner:npg_EVid9XpOZ3bM@ep-lingering-base-ad4kn9fz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Note**: The `VITE_` prefix is required for Vite to expose environment variables to the client-side code in production builds.

## Deployment Issues Fixed

### 1. ATH Móvil Script Loading
- **Issue**: External script from `athmovil.com` was failing to load (404 error)
- **Fix**: Added error handling to gracefully handle script loading failures
- **Impact**: Payment functionality may be limited but app won't crash

### 2. AdminProvider Context Error
- **Issue**: Components were trying to use admin context when database connection failed
- **Fix**: Added fallback data and offline mode support
- **Impact**: App runs in offline mode when database is unavailable

### 3. Environment Variable Configuration
- **Issue**: `DATABASE_URL` not accessible in Netlify builds
- **Fix**: Added support for `VITE_DATABASE_URL` with fallback to offline mode
- **Impact**: App gracefully handles missing database configuration

## Offline Mode Features

When the database is unavailable, the app will:
- Display default gallery images
- Allow browsing of public pages
- Show a warning in console about offline mode
- Disable booking functionality (gracefully)

## Database Connection

The app uses Neon PostgreSQL database. If the database connection fails:
1. App continues to work in read-only mode
2. Default content is displayed
3. Admin features are disabled
4. No crashes or blank screens

## Testing Your Deployment

After setting the environment variable and deploying:

1. **Check Console**: Look for any remaining errors in browser console
2. **Test Public Pages**: Verify home, about, gallery pages load
3. **Test Booking**: Try making a booking (may work in offline mode)
4. **Test Admin**: Check if admin login works with database connection

## Troubleshooting

If you still see errors:

1. **Clear Netlify Cache**: In Netlify dashboard, clear cache and redeploy
2. **Check Environment Variable**: Ensure `VITE_DATABASE_URL` is set correctly
3. **Review Build Logs**: Check Netlify build logs for any errors
4. **Test Database URL**: Verify the Neon database URL is still valid

## Next Steps

1. Set the `VITE_DATABASE_URL` environment variable in Netlify
2. Deploy the updated code
3. Test the deployment
4. Monitor for any remaining issues