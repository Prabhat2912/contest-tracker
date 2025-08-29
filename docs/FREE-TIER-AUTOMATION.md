# External Cron Service Configuration

This document provides configuration details for setting up automation using external cron services since Vercel Pro is not available.

## 🔄 GitHub Actions (Recommended - Free)

### Setup Steps:

1. **Repository Secrets Setup**
   Go to your GitHub repository → Settings → Secrets and variables → Actions

   Add these secrets:

   - `VERCEL_URL`: Your deployed app URL (e.g., `https://contests-tracker.vercel.app`)
   - `CRON_SECRET`: A secure random string for authentication

2. **Workflow File**
   The `.github/workflows/automation.yml` file is already configured with:

   - Daily contest updates at midnight UTC
   - Solution fetching every 6 hours
   - Manual trigger option

3. **Enable Actions**
   - Go to Actions tab in your GitHub repository
   - Enable GitHub Actions if not already enabled
   - The workflow will start running automatically

### Manual Triggers:

- Go to Actions → Contest Tracker Automation → Run workflow

## 🌐 Alternative Free Cron Services

### 1. Cron-job.org (Free tier: 2 jobs)

**Daily Contest Update:**

```
URL: https://your-app.vercel.app/api/cron/update-contests
Method: POST
Headers: Authorization: Bearer your_cron_secret
Schedule: 0 0 * * * (daily at midnight)
```

**Solution Fetching:**

```
URL: https://your-app.vercel.app/api/cron/fetch-solutions
Method: POST
Headers: Authorization: Bearer your_cron_secret
Schedule: 0 */6 * * * (every 6 hours)
```

### 2. EasyCron.com (Free tier: 1 job)

Since you only get 1 free job, prioritize the daily contest update:

```
URL: https://your-app.vercel.app/api/cron/update-contests
Method: POST
Headers: Authorization: Bearer your_cron_secret
Schedule: Daily at 00:00 UTC
```

### 3. UptimeRobot (Free tier with workaround)

Create a monitor for each endpoint:

- Monitor Type: HTTP(s)
- URL: Your cron endpoint with auth header
- Monitoring Interval: Choose based on your needs

### 4. Zapier (Free tier: 100 tasks/month)

Create two Zaps:

1. **Schedule → Webhook** for daily contest updates
2. **Schedule → Webhook** for solution fetching

## 🛠️ DIY Server Solution

If you have access to any server (VPS, home server, etc.):

### Crontab Configuration:

```bash
# Edit crontab
crontab -e

# Add these lines:
# Daily contest update at midnight UTC
0 0 * * * curl -X POST https://your-app.vercel.app/api/cron/update-contests -H "Authorization: Bearer your_cron_secret"

# Solution fetch every 6 hours
0 */6 * * * curl -X POST https://your-app.vercel.app/api/cron/fetch-solutions -H "Authorization: Bearer your_cron_secret"
```

## 📱 Manual Management

### Web Interface Commands

Create bookmarks in your browser for quick manual triggers:

**Update Contests:**

```javascript
javascript: (function () {
  fetch("https://your-app.vercel.app/api/cron/update-contests", {
    method: "POST",
    headers: { Authorization: "Bearer your_cron_secret" },
  }).then((r) => alert(r.ok ? "✅ Contests Updated" : "❌ Update Failed"));
})();
```

**Fetch Solutions:**

```javascript
javascript: (function () {
  fetch("https://your-app.vercel.app/api/cron/fetch-solutions", {
    method: "POST",
    headers: { Authorization: "Bearer your_cron_secret" },
  }).then((r) => alert(r.ok ? "✅ Solutions Fetched" : "❌ Fetch Failed"));
})();
```

### Terminal Commands

**Daily Contest Update:**

```bash
curl -X POST https://your-app.vercel.app/api/cron/update-contests \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json"
```

**Solution Fetching:**

```bash
curl -X POST https://your-app.vercel.app/api/cron/fetch-solutions \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json"
```

## 🔧 Environment Variables for Free Tier

Add these to your Vercel environment variables:

```env
CRON_SECRET=your_secure_random_string_here
ENABLE_SCHEDULERS=false  # Disable internal scheduling
```

## 📊 Monitoring

### Check Status:

```bash
curl -X GET https://your-app.vercel.app/api/cron/scheduler \
  -H "Authorization: Bearer your_cron_secret"
```

### View Logs:

- Check Vercel Function Logs in your dashboard
- GitHub Actions logs in the Actions tab
- External service dashboards for their respective logs

## 🎯 Recommendations for Free Tier

1. **Primary: GitHub Actions** - Most reliable, free, integrated
2. **Backup: External cron service** - For redundancy
3. **Manual triggers** - For immediate updates when needed

The GitHub Actions approach is recommended as it's:

- ✅ Completely free
- ✅ Reliable and maintained by GitHub
- ✅ Integrated with your repository
- ✅ Has built-in logging and monitoring
- ✅ Allows manual triggers
