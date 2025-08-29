# Contest Tracker - Free Tier Automation Setup Guide

Your app is deployed at: **https://contests-tracker.netlify.app/**

Since you're using Netlify, here's how to set up automated contest updates and solution fetching using GitHub Actions (completely free).

## 🚀 Quick Setup (5 minutes)

### Step 1: Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/Prabhat2912/contest-tracker`
2. Click on **Settings** tab
3. Go to **Secrets and variables** → **Actions**
4. Click **New repository secret** and add:
   - **Name**: `CRON_SECRET`
   - **Value**: Generate a secure random string (e.g., use a password generator)
   - Save this same value in your Netlify environment variables too

### Step 2: Verify Workflows

The automation workflows are already created in `.github/workflows/`:

- `update-contests.yml` - Daily contest updates at midnight UTC
- `fetch-solutions.yml` - YouTube solution fetching every 6 hours

### Step 3: Test the Setup

1. Go to your repo's **Actions** tab
2. You should see the workflows listed
3. Click **"Daily Contest Update"** → **"Run workflow"** → **"Run workflow"** (green button)
4. Watch it execute - it should show ✅ success

### Step 4: Add Environment Variable to Netlify

1. Go to your Netlify dashboard
2. Select your contest-tracker project
3. Go to **Site settings** → **Environment variables**
4. Add: `CRON_SECRET` with the same value you used in GitHub

## 📅 Automation Schedule

### Daily Contest Updates

- **When**: Every day at midnight UTC (12:00 AM)
- **What**: Fetches fresh contest data from Codeforces, CodeChef, LeetCode
- **Manual trigger**: Available in GitHub Actions tab

### YouTube Solution Fetching

- **When**: Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
- **What**: Searches for YouTube solutions for contests that ended recently
- **Manual trigger**: Available in GitHub Actions tab

## 🔧 Testing Your Setup

### Test Contest Updates

```bash
curl -X POST https://contests-tracker.netlify.app/api/cron/update-contests \
  -H "Content-Type: application/json"
```

### Test Solution Fetching

```bash
curl -X POST https://contests-tracker.netlify.app/api/cron/fetch-solutions \
  -H "Content-Type: application/json"
```

Replace `YOUR_CRON_SECRET` with the actual secret value.

## 📊 Monitoring

### Check Automation Status

- **GitHub Actions**: Go to Actions tab to see execution history
- **Netlify Logs**: Check function logs in Netlify dashboard
- **API Response**: The endpoints return success/failure status

### Troubleshooting Common Issues

1. **"Unauthorized" Error**

   - Check that `CRON_SECRET` matches in both GitHub and Netlify
   - Ensure the secret is properly formatted (no extra spaces)

2. **Workflow Not Running**

   - Verify workflows are in `.github/workflows/` folder
   - Check if GitHub Actions are enabled in your repo settings

3. **API Timeout**
   - Netlify has function timeout limits for the free tier
   - Large contest updates might take time - this is normal

## 🎯 Expected Results

After setup, you should see:

- ✅ Fresh contest data updated daily
- ✅ YouTube solution links appearing for recent contests
- ✅ Automatic execution logs in GitHub Actions
- ✅ No manual intervention required

## 💡 Pro Tips

1. **Monitor the first few runs** to ensure everything works
2. **Check GitHub Actions logs** if something seems wrong
3. **Use manual triggers** to test changes immediately
4. **Keep your CRON_SECRET secure** - don't share it publicly

Your automation is now ready to keep your contest data fresh 24/7, completely free! 🎉
