# 🚀 Netlify Deployment Guide for Contest Tracker

Your app is successfully deployed at: **https://contests-tracker.netlify.app/**

This guide covers the complete setup for automated contest tracking on Netlify.

## 📋 Prerequisites

- ✅ GitHub repository with your code
- ✅ Netlify account (free tier is sufficient)
- ✅ MongoDB database connection
- ✅ Clerk authentication setup
- ✅ YouTube API key

## 🌐 Netlify Deployment Steps

### Step 1: Connect to Netlify

1. **Login to Netlify**: Go to [https://netlify.com](https://netlify.com)
2. **New Site**: Click "New site from Git"
3. **Connect GitHub**: Authorize Netlify to access your repository
4. **Select Repository**: Choose `contest-tracker`

### Step 2: Build Settings

Configure these settings during deployment:

```yaml
Build Command: npm run build
Publish Directory: .next
Node Version: 18.x or higher
```

### Step 3: Environment Variables

Add these in Netlify dashboard (Site Settings → Environment Variables):

```bash
# Required Variables
MONGODB_URI=mongodb+srv://pk993105:Prabhat29$@cluster0.yh5j0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_d2lsbGluZy1zbG90aC0zLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_OQlkcfh1x5wt1Qb22o7ezcq5QIbpDtDH5tB1031L1a
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyBtoWFCrnA7FL58auLDyV4LyR2HMy3sJRg

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Base URL
NEXT_PUBLIC_BASE_URL=https://contests-tracker.netlify.app/
```

### Step 4: Deploy

1. **Deploy Site**: Click "Deploy site"
2. **Wait for Build**: Usually takes 2-3 minutes
3. **Verify**: Check that your site loads at the Netlify URL

## 🤖 Automation Setup

### Option 1: GitHub Actions (Recommended - Free)

The automation is already configured! Just enable it:

1. **Go to GitHub**: Your repository → Actions tab
2. **Enable Actions**: If not already enabled
3. **Workflows Available**:

   - `Daily Contest Update` - Runs daily at midnight UTC
   - `Fetch YouTube Solutions` - Runs every 6 hours

4. **Test Manually**:
   - Click on a workflow
   - Click "Run workflow" button
   - Watch it execute successfully

### Option 2: External Cron Services

If you prefer external services:

#### **cron-job.org Setup:**

1. Create account at [cron-job.org](https://cron-job.org)
2. Add jobs:
   - **Contest Updates**: `https://contests-tracker.netlify.app/api/cron/update-contests`
   - **Solution Fetch**: `https://contests-tracker.netlify.app/api/cron/fetch-solutions`
3. Schedule: Daily for contests, every 6 hours for solutions

## 🧪 Testing Your Deployment

### Test the Website

1. Visit: https://contests-tracker.netlify.app/
2. Verify contests load correctly
3. Test sign-in/sign-up functionality
4. Check responsive design on mobile

### Test Automation APIs

```bash
# Test contest update
curl -X POST https://contests-tracker.netlify.app/api/cron/update-contests \
  -H "Content-Type: application/json"

# Test solution fetching
curl -X POST https://contests-tracker.netlify.app/api/cron/fetch-solutions \
  -H "Content-Type: application/json"
```

Expected response: `{"success": true, "message": "...", "timestamp": "..."}`

## 📊 Monitoring

### Netlify Functions Logs

1. **Netlify Dashboard** → Your site → Functions
2. **View Logs** for each API endpoint
3. **Monitor Execution** times and errors

### GitHub Actions Logs

1. **GitHub Repository** → Actions tab
2. **View Workflow Runs** and their status
3. **Check Logs** for any failures

## 🔧 Troubleshooting

### Common Issues & Solutions

#### **Build Failures**

- Check Node.js version (use 18.x)
- Verify environment variables are set
- Check for TypeScript errors

#### **API Timeouts**

- Netlify functions have a 10-second timeout on free tier
- Large contest updates might take time - this is normal
- Consider upgrading to Pro for longer timeouts

#### **Authentication Issues**

- Verify Clerk keys are correctly set
- Check CORS settings if needed
- Ensure callback URLs match your domain

#### **Database Connection**

- Verify MongoDB URI is correct
- Check network access settings in MongoDB Atlas
- Test connection from a different tool

## 🚀 Performance Optimization

### Netlify-Specific Optimizations

1. **Edge Functions**: Consider upgrading for better performance
2. **CDN**: Automatic with Netlify
3. **Image Optimization**: Use Netlify's built-in optimization
4. **Caching**: Configure appropriate headers

### Next.js Optimizations

1. **Static Generation**: Pages are pre-built when possible
2. **API Routes**: Efficiently handle database queries
3. **Image Component**: Optimized image loading

## 📈 Scaling Considerations

### Free Tier Limits

- **Build Minutes**: 300/month
- **Bandwidth**: 100GB/month
- **Function Invocations**: 125,000/month
- **Function Runtime**: 10 seconds max

### When to Upgrade

- High traffic (>100GB bandwidth)
- Complex functions needing more runtime
- Need for advanced features like split testing

## 🎯 Next Steps

1. ✅ **Monitor First Week**: Watch automation logs
2. ✅ **Setup Alerts**: Configure failure notifications
3. ✅ **User Testing**: Get feedback from users
4. ✅ **Performance Monitoring**: Track load times
5. ✅ **Feature Development**: Add new features as needed

## 📞 Support Resources

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Next.js Guide**: [nextjs.org/docs](https://nextjs.org/docs)
- **GitHub Actions**: [docs.github.com/actions](https://docs.github.com/en/actions)

Your Contest Tracker is now fully deployed and automated on Netlify! 🎉
