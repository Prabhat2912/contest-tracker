# Contest Tracker 🏆

<div align="center">
  <img src="public/logo2.png" alt="Contest Tracker Logo" width="200" height="auto"/>
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://contest-tracker-gamma-rust.vercel.app/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-15+-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)](https://www.mongodb.com/)
  [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)

</div>

## 📖 Overview

**Contest Tracker** is a comprehensive web application that aggregates and displays programming contests from multiple platforms including **Codeforces**, **CodeChef**, and **LeetCode**. Built with modern web technologies and featuring full automation, it provides developers with a centralized hub to track competitions, bookmark favorites, and access solution resources.

### 🎯 Key Features

- **🔄 Automated Contest Updates**: Daily synchronization with Codeforces, CodeChef, and LeetCode APIs
- **🎯 Smart Solution Fetching**: Automatic YouTube solution discovery for completed contests
- **📊 Real-time Data**: Live contest countdowns and status updates
- **🔖 Personal Bookmarks**: Save and manage your favorite contests
- **🌓 Modern UI/UX**: Responsive design with dark/light theme support
- **🚀 High Performance**: Optimized with Next.js 15 and server-side rendering

## ✨ Core Features

### � Contest Management
- **Multi-platform Aggregation**: Unified view of contests from Codeforces, CodeChef, and LeetCode
- **Live Countdown Timers**: Real-time tracking until contest start
- **Smart Filtering**: Filter by platform, date, and status
- **Historical Data**: Archive of past contests with solutions

### � Automation System
- **Daily Updates**: Automated contest data synchronization every 24 hours
- **Solution Discovery**: Automatic YouTube solution fetching for contests that ended 2+ hours ago
- **GitHub Actions**: Free-tier automation using GitHub workflows
- **Smart Processing**: Efficient batch processing to avoid timeouts

### 👤 User Experience
- **Responsive Design**: Optimized for all device sizes
- **Bookmark System**: Personal contest management
- **Theme Toggle**: Light/dark mode support
- **Fast Navigation**: Optimized performance and loading times

### 🎥 Solution Integration
- **YouTube API**: Automated solution video discovery
- **Smart Matching**: Contest name-based solution searching
- **Persistent Retry**: Continuous attempts until solutions are found
- **Quality Filtering**: Relevant solution video identification

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library
- **Clerk**: Authentication and user management

### Backend
- **Next.js API Routes**: Server-side functionality
- **MongoDB Atlas**: Cloud database
- **Mongoose**: ODM for MongoDB
- **YouTube Data API**: Solution video discovery

### Automation & Deployment
- **GitHub Actions**: Free automation workflows
- **Vercel**: Serverless deployment
- **Cron Jobs**: Scheduled task execution

## 🚀 Quick Start

### Prerequisites
- Node.js 20.8.0 or higher
- MongoDB Atlas account
- Clerk account for authentication
- YouTube Data API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prabhat2912/contest-tracker.git
   cd contest-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` file:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # YouTube API
   YOUTUBE_API_KEY=your_youtube_api_key
   
   # Cron Security (optional)
   CRON_SECRET=your_secret_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Visit** `http://localhost:3000`

## 🔧 Configuration

### Database Schema
```typescript
interface Contest {
  platform: string;           // "Codeforces" | "CodeChef" | "LeetCode"
  name: string;               // Contest name
  startTimeUnix: number;      // Start time (Unix timestamp)
  startTime: string;          // ISO 8601 date string
  endTime?: string;           // ISO 8601 end time
  durationSeconds?: number;   // Contest duration
  duration: string;           // Human readable duration
  url: string;                // Contest URL
  bookmarkedBy?: string[];    // User IDs who bookmarked
  solutionLink: string;       // YouTube URL for contest solution
  solutionFetched: boolean;   // Track if solution fetch was attempted
  lastSolutionCheck?: Date;   // Last solution check timestamp
}
```

### API Endpoints

#### Contest Management
- `GET /api/contests` - Fetch all contests with filtering
- `POST /api/bookmark` - Toggle contest bookmark

#### Automation (Internal)
- `POST /api/cron/update-contests-lite` - Daily contest updates
- `POST /api/cron/fetch-solutions` - Solution discovery

## 🤖 Automation System

### GitHub Actions Workflows

#### Daily Contest Updates
- **Schedule**: Every 24 hours at midnight UTC
- **Function**: Fetches latest contests from all platforms
- **Processing**: Up to 10 contests per run
- **Timeout**: 30 seconds maximum

#### Solution Fetching  
- **Schedule**: Every minute
- **Function**: Finds YouTube solutions for contests ended 2+ hours ago
- **Processing**: 2 contests per run
- **Smart Logic**: Only processes contests with `solutionFetched: false`

### Manual Triggers

**Via GitHub Actions:**
1. Go to your repository's Actions tab
2. Select the desired workflow
3. Click "Run workflow"

**Via API:**
```bash
# Update contests
curl -X POST https://contest-tracker-gamma-rust.vercel.app/api/cron/update-contests-lite

# Fetch solutions  
curl -X POST https://contest-tracker-gamma-rust.vercel.app/api/cron/fetch-solutions
```

## 📊 Performance & Limits

### Vercel Hobby Plan Optimizations
- **Function Timeout**: 30 seconds maximum
- **No Vercel Cron**: Uses GitHub Actions instead
- **Batch Processing**: Limited operations per request
- **Smart Retries**: Efficient error handling

### Rate Limiting
- **YouTube API**: 10,000 requests/day quota
- **Contest APIs**: Cached responses, minimal calls
- **Database**: Optimized queries with indexing

## � Security

- **API Authentication**: Optional CRON_SECRET for automation endpoints
- **User Authentication**: Clerk-based secure login
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Server-side data validation

## 🚀 Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Environment Variables Setup
Add these to your Vercel project:
- `MONGODB_URI`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `YOUTUBE_API_KEY`
- `CRON_SECRET` (optional)

## 📈 Monitoring

- **GitHub Actions**: Monitor automation workflows
- **Vercel Analytics**: Performance and usage metrics
- **MongoDB Atlas**: Database performance monitoring
- **Error Logging**: Console-based error tracking

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [contest-tracker-gamma-rust.vercel.app](https://contest-tracker-gamma-rust.vercel.app/)
- **Repository**: [GitHub](https://github.com/Prabhat2912/contest-tracker)
- **Issues**: [Report Issues](https://github.com/Prabhat2912/contest-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Prabhat2912/contest-tracker/discussions)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Prabhat2912">Prabhat Kumar</a>
  <br />
  <sub>⭐ Star this repository if you find it helpful!</sub>
</div>
- **📊 Intelligent Scheduling**: Configurable cron jobs for optimal data freshness
- **🔍 Multi-Strategy Search**: Advanced algorithms for finding relevant solution videos
- **⚡ Background Processing**: Non-blocking automated tasks with comprehensive logging

## 🛠️ Tech Stack

### Frontend

- **[Next.js 14+](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Modern UI components
- **[Clerk](https://clerk.com/)** - Authentication and user management

### Backend & Database

- **[MongoDB](https://www.mongodb.com/)** - NoSQL database for contest data
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **Node.js** - Runtime environment
- **RESTful APIs** - Clean API architecture

### External Integrations

- **Codeforces API** - Contest data fetching
- **CodeChef API** - Contest information
- **LeetCode API** - Competition details
- **YouTube Data API** - Solution video integration

### Deployment & Tools

- **[Vercel](https://vercel.com/)** - Frontend deployment and hosting
- **ESLint & Prettier** - Code formatting and linting
- **TypeScript Strict Mode** - Enhanced type checking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Clerk account for authentication
- API keys for external services

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Prabhat2912/contest-tracker.git
   cd contest-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # API Keys (if required)
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

### Building for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
contest-tracker/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   ├── (pages)/                 # Main application pages
│   ├── api/                     # API routes
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                      # Shadcn/ui components
│   ├── ContestCard.tsx          # Contest display component
│   ├── Header.tsx               # Navigation header
│   └── Footer.tsx               # Site footer
├── db/                          # Database configuration
│   ├── db.ts                    # MongoDB connection
│   └── model/                   # Mongoose models
├── lib/                         # Utility functions
│   ├── contestController.ts     # Contest business logic
│   ├── fetchSolution.ts         # YouTube integration
│   └── utils.ts                 # Helper functions
├── types/                       # TypeScript type definitions
├── public/                      # Static assets
└── middleware.ts                # Clerk authentication middleware
```

## 📚 API Documentation

### Contest Endpoints

#### `GET /api/getContests`

Retrieves all contests from the database with filtering options.

**Response:**

```json
{
  "success": true,
  "contests": [
    {
      "id": "string",
      "name": "string",
      "platform": "codeforces|codechef|leetcode",
      "startTime": "ISO 8601 date",
      "endTime": "ISO 8601 date",
      "duration": "number (seconds)",
      "url": "string",
      "bookmarkedBy": ["userId"],
      "solutionLink": "youtube_url"
    }
  ]
}
```

#### `POST /api/bookmark`

Toggles bookmark status for a contest.

**Request Body:**

```json
{
  "contestId": "string",
  "userId": "string"
}
```

#### `GET /api/contests`

Fetches fresh contest data from external APIs and updates the database.

**Query Parameters:**

- `platform` (optional): Filter by specific platform
- `upcoming` (optional): Boolean to fetch only upcoming contests

#### `POST /api/getSolutions`

Fetches and links YouTube solution videos to contests.

**Request Body:**

```json
{
  "contestId": "string",
  "youtubeChannelId": "string"
}
```

### Automation Endpoints

#### `GET/POST /api/cron/update-contests`

**🔒 Requires Authorization**: `Bearer {CRON_SECRET}`

Automated endpoint for daily contest updates.

**Response:**

```json
{
  "success": true,
  "message": "Contests updated successfully",
  "timestamp": "ISO 8601 date"
}
```

#### `GET/POST /api/cron/fetch-solutions`

**🔒 Requires Authorization**: `Bearer {CRON_SECRET}`

Automated endpoint for post-contest YouTube solution fetching.

**Response:**

```json
{
  "success": true,
  "message": "YouTube solution fetch completed",
  "processed": 5,
  "solutionsFound": 3,
  "timestamp": "ISO 8601 date"
}
```

#### `GET/POST /api/cron/scheduler`

**🔒 Requires Authorization**: `Bearer {CRON_SECRET}`

Control and monitor automated schedulers.

**POST Request Body:**

```json
{
  "action": "start|stop|status|restart",
  "contestUpdateHour": 0,
  "contestUpdateMinute": 0
}
```

### Data Models

#### Contest Schema

```typescript
interface Contest {
  _id: ObjectId;
  name: string;
  platform: "codeforces" | "codechef" | "leetcode";
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  url: string;
  bookmarkedBy: ObjectId[]; // User IDs
  solutionLink: string; // YouTube URL for contest solution
  solutionFetched: boolean; // Track if solution fetch was attempted
  lastSolutionCheck: Date; // Track when solution was last checked
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 UI Components

### Core Components

#### `ContestCard`

Displays individual contest information with interactive elements.

**Props:**

```typescript
interface ContestCardProps {
  contest: Contest;
  isBookmarked: boolean;
  onBookmark: (contestId: string) => void;
  showSolutions?: boolean;
}
```

#### `ContestFilters`

Provides filtering options for contests by platform and time.

**Features:**

- Multi-select platform filtering
- Upcoming/Past contest toggle
- Real-time filter application

#### `ThemeToggle`

Implements dark/light mode switching with system preference detection.

### Layout Components

- **Header**: Navigation with authentication and theme controls
- **Footer**: Site information and links
- **Layout**: Main application wrapper with responsive design

## 🔧 Configuration

### Environment Variables

| Variable                            | Description                          | Required |
| ----------------------------------- | ------------------------------------ | -------- |
| `MONGODB_URI`                       | MongoDB connection string            | ✅       |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key                     | ✅       |
| `CLERK_SECRET_KEY`                  | Clerk private key                    | ✅       |
| `CRON_SECRET`                       | Secure secret for cron job auth      | ✅       |
| `YOUTUBE_API_KEY`                   | YouTube Data API key                 | ⚠️       |
| `YOUTUBE_CHANNEL_ID`                | Default YouTube channel for search   | ⚠️       |
| `CONTEST_UPDATE_HOUR`               | Hour for daily updates (0-23, UTC)   | ⚠️       |
| `CONTEST_UPDATE_MINUTE`             | Minute for daily updates (0-59)      | ⚠️       |
| `NODE_ENV`                          | Environment (development/production) | ⚠️       |

### API Configuration

Contest data is fetched from:

- **Codeforces**: `https://codeforces.com/api/contest.list`
- **CodeChef**: Custom API endpoints
- **LeetCode**: GraphQL API integration

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**

   - Import project to Vercel
   - Connect GitHub repository
   - Vercel automatically detects Next.js

2. **Configure Environment Variables**

   - Add all required environment variables in Vercel dashboard
   - Go to Project Settings → Environment Variables
   - Ensure MongoDB connection is accessible

3. **Deploy**

   - Vercel automatically deploys on push to main branch
   - Custom domains can be configured
   - Next.js builds are handled automatically

4. **Setup Automation** (Choose your option)
   - **Recommended**: GitHub Actions (Free tier compatible)
   - Vercel Pro: Cron jobs configured in `vercel.json` run automatically
   - External services: cron-job.org, EasyCron, UptimeRobot
   - Manual control: Use `/api/cron/scheduler` endpoints

### Automation Setup Options

#### Option 1: GitHub Actions (Recommended - Free)

- ✅ **Free**: Works with any GitHub repository
- ✅ **Reliable**: GitHub infrastructure
- ✅ **Easy Setup**: Pre-configured workflow included
- ✅ **Manual Control**: Can trigger manually anytime

**Setup Steps:**

1. Go to your GitHub repository settings → Secrets and Variables → Actions
2. Add these repository secrets:
   - `CRON_SECRET`: Your secure random string (same as in Vercel env vars)
3. The automation workflows are already configured in `.github/workflows/`
4. Push the workflows to GitHub - automation runs automatically!

**Manual Triggers:**

- Go to Actions tab in your GitHub repo
- Select "Daily Contest Update" or "Fetch YouTube Solutions"
- Click "Run workflow" button for manual execution

#### Option 2: Vercel Cron Jobs (Pro Plan Only)

- ✅ **Automatic**: Configured in `vercel.json`
- ✅ **Reliable**: Managed by Vercel infrastructure
- ❌ **Paid**: Requires Vercel Pro subscription

#### Option 3: External Cron Services (Free Tier Alternatives)

**cron-job.org Setup:**

1. Create account at [cron-job.org](https://cron-job.org)
2. Add new cron job:
   - **URL**: `https://contest-tracker-gamma-rust.vercel.app/api/cron/update-contests`
   - **Schedule**: `0 0 * * *` (daily at midnight)
   - **Headers**: `Authorization: Bearer your_cron_secret`
3. Add second job for solutions:
   - **URL**: `https://contest-tracker-gamma-rust.vercel.app/api/cron/fetch-solutions`
   - **Schedule**: `0 */6 * * *` (every 6 hours)

**Other Services:**

- **EasyCron.com** - Free tier: 1 job
- **UptimeRobot** - Monitor endpoints with HTTP checks

**Example Setup** (cron-job.org):

```
Daily Contest Update:
URL: https://your-app.vercel.app/api/cron/update-contests
Method: POST
Headers: Authorization: Bearer your_cron_secret
Schedule: 0 0 * * * (daily at midnight)

Solution Fetching:
URL: https://your-app.vercel.app/api/cron/fetch-solutions
Method: POST
Headers: Authorization: Bearer your_cron_secret
Schedule: 0 */6 * * * (every 6 hours)
```

**External Services**: Use cron-job.org, Uptime Robot, or similar services

#### Option 4: Manual Control

Use the API endpoints for manual triggers and monitoring:

```bash
# Manual contest update
curl -X POST https://contest-tracker-gamma-rust.vercel.app/api/cron/update-contests \
  -H "Content-Type: application/json"

# Manual solution fetch
curl -X POST https://contest-tracker-gamma-rust.vercel.app/api/cron/fetch-solutions \
  -H "Content-Type: application/json"

# Check system status
curl -X GET https://contest-tracker-gamma-rust.vercel.app/api/cron/scheduler \
  -H "Content-Type: application/json"
```

**📚 Complete Guide**: See `docs/FREE-TIER-AUTOMATION.md` for detailed free tier setup instructions.

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

We welcome contributions to Contest Tracker! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**

   - Follow TypeScript best practices
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow the configured rules
- **Prettier**: Automatic code formatting
- **Commit Messages**: Use conventional commit format

### Areas for Contribution

- 🐛 Bug fixes and improvements
- 🆕 New platform integrations
- 🎨 UI/UX enhancements
- 📚 Documentation improvements
- ⚡ Performance optimizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Contest Platforms**: Codeforces, CodeChef, LeetCode for providing APIs
- **Community**: Contributors and users who make this project better
- **Open Source**: Built with amazing open-source technologies

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Prabhat2912/contest-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Prabhat2912/contest-tracker/discussions)
- **Demo**: [Live Application](https://contest-tracker-gamma-rust.vercel.app/)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Prabhat2912">Prabhat Kumar</a>
  <br />
  <sub>Star ⭐ this repository if you find it helpful!</sub>
</div>
