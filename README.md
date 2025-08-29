# Contest Tracker 🏆

<div align="center">
  <img src="public/logo2.png" alt="Contest Tracker Logo" width="200" height="auto"/>
  
    [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://contests-tracker.netlify.app/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-13+-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-# Manual contest update
curl -X POST https://contests-tracker.netlify.app/api/cron/update-contests \
  -H "Authorization: Bearer your_cron_secret"

# Manual solution fetch

curl -X POST https://contests-tracker.netlify.app/api/cron/fetch-solutions \
 -H "Authorization: Bearer your_cron_secret"

# Check system status

curl -X GET https://contests-tracker.netlify.app/api/cron/scheduler \
 -H "Authorization: Bearer your_cron_secret"ttps://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)](https://www.mongodb.com/)

</div>

## 📖 Overview

Contest Tracker is a comprehensive web application that aggregates and displays programming contests from multiple platforms including **Codeforces**, **CodeChef**, and **LeetCode**. Built with modern web technologies, it provides developers with a centralized hub to track upcoming competitions, bookmark favorites, and access solution resources.

### 🎯 Key Highlights

- **Real-time Contest Aggregation** from multiple platforms
- **Smart Filtering & Bookmarking** system
- **Solution Integration** with YouTube links
- **Responsive Design** with dark/light theme support
- **Modern Tech Stack** with Next.js and TypeScript

## ✨ Features

### 🔍 Contest Management

- **📅 Upcoming Contests**: Real-time fetching and display of contests from Codeforces, CodeChef, and LeetCode
- **⏰ Countdown Timers**: Live countdown showing time remaining until contest start
- **📋 Past Contests**: Archive of completed contests with solution attachments
- **🔖 Bookmark System**: Save contests for quick access and personalized tracking

### 🎛️ User Experience

- **🌐 Platform Filtering**: Multi-select platform filters (Codeforces, CodeChef, LeetCode)
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🌙 Theme Toggle**: Switch between light and dark modes
- **⚡ Fast Loading**: Optimized performance with server-side rendering

### 🔗 Solution Integration

- **📺 YouTube Integration**: Automated solution link fetching from YouTube channels
- **👥 Team Management**: Admin interface for team members to attach solution videos
- **🔄 Auto-sync**: Automatic detection and linking of new solution uploads

### 🤖 Automation Features

- **🕐 Daily Contest Updates**: Automated daily fetching of new contests from all platforms
- **🎯 Smart Solution Detection**: Automatic YouTube solution searching after contests end
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
      "solutionLinks": ["youtube_url"]
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
  solutionLink: string; // YouTube URLs (multiple solutions supported)
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

### Netlify Deployment (Recommended)

1. **Connect Repository**

   - Import project to Netlify
   - Connect GitHub repository
   - Netlify will automatically detect Next.js

2. **Configure Environment Variables**

   - Add all required environment variables in Netlify dashboard
   - Go to Site settings → Environment variables
   - Ensure MongoDB connection is accessible

3. **Deploy**

   - Netlify automatically deploys on push to main branch
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
   - **URL**: `https://contests-tracker.netlify.app/api/cron/update-contests`
   - **Schedule**: `0 0 * * *` (daily at midnight)
   - **Headers**: `Authorization: Bearer your_cron_secret`
3. Add second job for solutions:
   - **URL**: `https://contests-tracker.netlify.app/api/cron/fetch-solutions`
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
curl -X POST https://contests-tracker.netlify.app/api/cron/update-contests \
  -H "Content-Type: application/json"

# Manual solution fetch
curl -X POST https://contests-tracker.netlify.app/api/cron/fetch-solutions \
  -H "Content-Type: application/json"

# Check system status
curl -X GET https://contests-tracker.netlify.app/api/cron/scheduler \
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
- **Demo**: [Live Application](https://contests-tracker.netlify.app/)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Prabhat2912">Prabhat Kumar</a>
  <br />
  <sub>Star ⭐ this repository if you find it helpful!</sub>
</div>
