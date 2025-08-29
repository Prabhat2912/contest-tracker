# Automated Contest Tracking System

This document explains the automated features implemented in the Contest Tracker application.

## 🤖 Automation Overview

The Contest Tracker now includes two main automated processes:

1. **Daily Contest Updates** - Automatically fetches new contest data from APIs
2. **Post-Contest Solution Fetching** - Automatically searches for YouTube solutions after contests end

## 📅 Daily Contest Updates

### How It Works

- **Schedule**: Runs once daily at midnight UTC (configurable)
- **Process**: Fetches contest data from Codeforces, CodeChef, and LeetCode APIs
- **Storage**: Updates MongoDB database with new contests
- **Endpoint**: `/api/cron/update-contests`

### Configuration

Set these environment variables to customize:

```env
CONTEST_UPDATE_HOUR=0    # Hour (0-23, UTC)
CONTEST_UPDATE_MINUTE=0  # Minute (0-59)
CRON_SECRET=your_secret  # Authentication for cron endpoints
```

### Deployment Options

#### Option 1: Vercel Cron Jobs (Recommended)

- Uses `vercel.json` configuration
- Runs automatically on Vercel Pro plan
- No additional setup required

#### Option 2: External Cron Services

Set up external services (GitHub Actions, cron-job.org, etc.) to call:

```bash
POST https://your-app.vercel.app/api/cron/update-contests
Authorization: Bearer your_cron_secret
```

#### Option 3: Manual Triggers

Use the scheduler API to start/stop services:

```bash
POST https://your-app.vercel.app/api/cron/scheduler
Authorization: Bearer your_cron_secret
Content-Type: application/json

{
  "action": "start",
  "contestUpdateHour": 0,
  "contestUpdateMinute": 0
}
```

## 🎯 YouTube Solution Fetching

### How It Works

- **Schedule**: Runs every 6 hours
- **Process**:
  1. Finds contests that ended in the last 24 hours
  2. Searches YouTube for solution videos
  3. Updates database with found solution links
- **Smart Search**: Uses multiple search strategies for better results
- **Rate Limiting**: Includes delays to avoid API rate limits

### Search Strategy

The system uses progressively broader search queries:

1. `{contest_name} {platform} solution editorial`
2. `{contest_name} {platform} tutorial`
3. `{contest_name} solution`
4. `{cleaned_contest_name} solution`

### Enhanced Features

- **Relevance Matching**: Prioritizes videos with contest names in titles
- **Time-based Filtering**: Only searches recent uploads (last 30 days)
- **Channel-specific Search**: Optional channel ID for targeted searching
- **Duplicate Prevention**: Tracks which contests have been processed

## 🔧 Manual Controls

### Start All Schedulers

```bash
curl -X POST https://your-app.vercel.app/api/cron/scheduler \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'
```

### Check Status

```bash
curl -X GET https://your-app.vercel.app/api/cron/scheduler \
  -H "Authorization: Bearer your_cron_secret"
```

### Stop All Schedulers

```bash
curl -X POST https://your-app.vercel.app/api/cron/scheduler \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json" \
  -d '{"action": "stop"}'
```

### Manual Contest Update

```bash
curl -X POST https://your-app.vercel.app/api/cron/update-contests \
  -H "Authorization: Bearer your_cron_secret"
```

### Manual Solution Fetch

```bash
curl -X POST https://your-app.vercel.app/api/cron/fetch-solutions \
  -H "Authorization: Bearer your_cron_secret"
```

## 🛠️ Database Schema Updates

The Contest model has been enhanced with new fields:

```typescript
{
  // Existing fields...
  solutionLinks: string[];      // Multiple solution URLs
  solutionFetched: boolean;     // Tracking flag
  lastSolutionCheck: Date;      // Last check timestamp
  createdAt: Date;             // Auto-generated
  updatedAt: Date;             // Auto-generated
}
```

## 📊 Monitoring and Logging

### Log Levels

- `[CRON]` - Automated task logs
- `[SCHEDULER]` - Scheduler service logs
- `[INIT]` - Application startup logs
- `[SHUTDOWN]` - Graceful shutdown logs

### Key Metrics Tracked

- Number of contests processed
- Number of solutions found
- API response times
- Error rates and types

### Example Log Output

```
[CRON] Starting daily contest update...
[CRON] Daily contest update completed successfully
[SCHEDULER] Next contest update scheduled for: 2025-08-31T00:00:00.000Z
[CRON] Found 5 contests to process
[CRON] Found solution for Contest ABC: https://youtube.com/watch?v=xyz
[CRON] YouTube solution fetch completed. Processed: 5, Found: 3
```

## 🚨 Error Handling

### Resilience Features

- **Graceful Degradation**: Individual contest failures don't stop the entire process
- **Retry Logic**: Failed API calls are retried with exponential backoff
- **Rate Limiting**: Built-in delays prevent API abuse
- **Error Logging**: Comprehensive error tracking and reporting

### Common Issues and Solutions

#### YouTube API Quota Exceeded

- Solution: Reduce search frequency or implement API key rotation
- Monitor: Check YouTube API dashboard for quota usage

#### External API Downtime

- Impact: Missing contests from specific platforms
- Recovery: Next scheduled run will catch up automatically

#### Database Connection Issues

- Impact: Data not saved but APIs still respond
- Recovery: Check MongoDB connection and credentials

## ⚡ Performance Considerations

### Optimization Strategies

- **Batch Processing**: Process multiple contests simultaneously
- **Smart Caching**: Avoid re-processing unchanged data
- **Selective Updates**: Only update contests that have changed
- **Connection Pooling**: Efficient database connections

### Resource Usage

- **Memory**: ~50MB per execution
- **CPU**: Low impact, I/O bound operations
- **Network**: API calls to 3-4 external services
- **Database**: Minimal writes, mostly reads

## 🔐 Security

### Authentication

- Bearer token authentication for all cron endpoints
- Environment variable-based secrets
- Request validation and sanitization

### Best Practices

- Regular secret rotation
- Monitor for unauthorized access attempts
- Rate limiting on cron endpoints
- Input validation on all parameters

## 📈 Future Enhancements

### Planned Improvements

1. **Machine Learning**: Better solution matching using ML algorithms
2. **Multi-channel Support**: Search across multiple YouTube channels
3. **Webhook Integration**: Real-time updates instead of polling
4. **Analytics Dashboard**: Visual monitoring of automation metrics
5. **Custom Notifications**: Alert system for important events

### Configuration Extensions

- Platform-specific update schedules
- Custom search keywords per platform
- Dynamic scheduling based on contest frequency
- Geographic region-based scheduling
