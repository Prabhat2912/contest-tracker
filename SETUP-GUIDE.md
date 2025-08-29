# Quick Setup Guide for Free Tier Automation

Since you don't have Vercel Pro, here's the **easiest way** to set up automation using GitHub Actions (completely free):

## 🚀 Step 1: Setup Repository Secrets

1. Go to your GitHub repository: `https://github.com/Prabhat2912/contest-tracker`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these two secrets:

   **Secret 1:**

   - Name: `VERCEL_URL`
   - Value: `https://contests-tracker.vercel.app` (your deployed app URL)

   **Secret 2:**

   - Name: `CRON_SECRET`
   - Value: Generate a random string (e.g., `sk_live_abc123xyz789_secure_random_string`)

## 🔧 Step 2: Add Environment Variable to Vercel

1. Go to your Vercel dashboard
2. Open your `contest-tracker` project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - Name: `CRON_SECRET`
   - Value: (same value you used in GitHub secrets)
   - Environment: **Production**

## ✅ Step 3: Deploy and Enable

1. **Commit and push** your code to GitHub (the `.github/workflows/automation.yml` file is already created)
2. Go to your repository → **Actions** tab
3. You should see the "Contest Tracker Automation" workflow
4. If prompted, enable GitHub Actions

## 🎯 Step 4: Test the Setup

### Manual Test (Optional):

1. Go to **Actions** → **Contest Tracker Automation**
2. Click **Run workflow** → **Run workflow** button
3. Check the logs to see if it works

### Automatic Schedule:

- **Contest Updates**: Daily at midnight UTC
- **Solution Fetching**: Every 6 hours

## 📊 Monitoring

- **View logs**: GitHub Actions → Contest Tracker Automation → Click on any run
- **Check status**: Look for ✅ or ❌ in the Actions tab
- **Manual trigger**: Use "Run workflow" button anytime

## 🔧 If You Need Help

**Quick test command** (replace with your actual values):

```bash
curl -X POST https://contests-tracker.vercel.app/api/cron/update-contests \
  -H "Authorization: Bearer your_cron_secret"
```

**Expected response:**

```json
{
  "success": true,
  "message": "Contests updated successfully",
  "timestamp": "2025-08-30T..."
}
```

## 🎉 That's It!

Your automation is now set up completely **FREE** using GitHub Actions! The system will:

- ✅ Update contests daily at midnight UTC
- ✅ Search for YouTube solutions every 6 hours
- ✅ Log all activities for monitoring
- ✅ Allow manual triggers anytime

No Vercel Pro subscription needed! 🚀
