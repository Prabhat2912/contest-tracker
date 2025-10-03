# Contest Tracker 🏆

<div align="center">
  <img src="public/logo2.png" alt="Contest Tracker Logo" width="200" height="auto"/>
  
   <!-- Live demo badge removed (deployment now self-hosted) -->
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-15+-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)](https://www.mongodb.com/)
   <!-- Deployment badge intentionally generic after migration from Vercel -->
   [![Deployment](https://img.shields.io/badge/Deploy-DigitalOcean-blue)](https://www.digitalocean.com/)

</div>

## 📖 Overview

**Contest Tracker** is a comprehensive web application that aggregates and displays programming contests from multiple platforms including **Codeforces**, **CodeChef**, and **LeetCode**. Built with modern web technologies and featuring flexible self‑hosted automation (DigitalOcean friendly), it provides developers with a centralized hub to track competitions, bookmark favorites, and access solution resources.

### 🎯 Key Features

- **🔄 Automated Contest Updates**: Daily synchronization (self‑hosted cron via Linux crontab)
- **🎯 Smart Solution Fetching**: Scheduled YouTube solution discovery for completed contests
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

### ⚙️ Automation System

- **Daily Updates**: Contest synchronization every 24 hours (configurable)
- **Solution Discovery**: YouTube solution fetching for contests ended 2+ hours ago
- **Lightweight Scripts**: Standalone Node scripts runnable via cron (`scripts/update-contests.ts`, `scripts/fetch-solutions.ts`)
- **Resource Friendly**: Batches + timeouts to stay within small Droplet limits

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

- **DigitalOcean Droplet**: Node + PM2 + Nginx reverse proxy
- **Cron Jobs**: Native Linux crontab for scheduling
- **PM2**: Process manager with log rotation & restarts

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
  platform: string; // "Codeforces" | "CodeChef" | "LeetCode"
  name: string; // Contest name
  startTimeUnix: number; // Start time (Unix timestamp)
  startTime: string; // ISO 8601 date string
  endTime?: string; // ISO 8601 end time
  durationSeconds?: number; // Contest duration
  duration: string; // Human readable duration
  url: string; // Contest URL
  bookmarkedBy?: string[]; // User IDs who bookmarked
  solutionLink: string; // YouTube URL for contest solution
  solutionFetched: boolean; // Track if solution fetch was attempted
  lastSolutionCheck?: Date; // Last solution check timestamp
}
```

### API Endpoints

#### Contest Management

- `GET /api/contests` - Fetch all contests with filtering
- `POST /api/bookmark` - Toggle contest bookmark

#### Automation (Internal)

- `POST /api/cron/update-contests-lite` - Daily contest updates
- `POST /api/cron/fetch-solutions` - Solution discovery

## 🤖 Automation System (Self‑Hosted)

| Task           | Script                         | Recommended Schedule      | Purpose                       |
| -------------- | ------------------------------ | ------------------------- | ----------------------------- |
| Contest Update | `npm run cron:update-contests` | Daily (e.g. 00:10)        | Pull fresh contests & persist |
| Solution Fetch | `npm run cron:fetch-solutions` | Every 15 mins (or hourly) | Attach YouTube solution links |

### How It Works

1. Cron invokes a Node script (no HTTP cold starts)
2. Script connects to MongoDB, fetches + upserts
3. Solution script searches YouTube only for contests that ended ≥2h ago and have no `solutionLink`
4. Safe batching prevents quota exhaustion / CPU spikes

### Add Cron Jobs (Linux)

Edit crontab:

```bash
crontab -e
```

Example (UTC):

```cron
# m h dom mon dow command
10 0 * * * cd /var/www/contest-tracker && /usr/bin/npm run cron:update-contests >> logs/cron.log 2>&1
*/15 * * * * cd /var/www/contest-tracker && /usr/bin/npm run cron:fetch-solutions >> logs/cron.log 2>&1
```

Create log dir:

```bash
mkdir -p /var/www/contest-tracker/logs
```

Adjust frequency if YouTube quota approaches limits (each run is very light).

## 📊 Performance & Limits

### Resource Guidance (1–2 GB Droplet)

- Contest update script typical runtime: < 5s
- Solution fetch script: ~1–3s (per batch of ≤5)
- Memory footprint: < 200MB during spikes
- Add swap (1–2 GB) for 1 GB droplets to avoid OOM:

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
```

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

### DigitalOcean Deployment (Droplet)

#### 1. Provision Droplet

Choose Ubuntu 22.04 LTS (Basic / Regular / 1–2 GB RAM).

#### 2. Secure & Update

```bash
adduser deploy
usermod -aG sudo deploy
ssh-copy-id deploy@your_server_ip
sudo apt update && sudo apt upgrade -y
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

#### 3. Install Stack

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm i -g pm2
```

#### 4. Clone & Install

```bash
cd /var/www
sudo git clone https://github.com/Prabhat2912/contest-tracker.git
sudo chown -R deploy:deploy contest-tracker
cd contest-tracker
npm install
```

#### 5. Environment Variables

Create `.env.local`:

```bash
nano .env.local
```

(Paste required keys – see Environment Section above)

#### 6. Build & Start

```bash
npm run build
pm2 start "npm run start" --name contest-tracker
pm2 save
pm2 startup systemd
```

#### 7. Reverse Proxy (Nginx)

```bash
sudo tee /etc/nginx/sites-available/contest-tracker <<'EOF'
server {
   server_name your_domain.com;
   listen 80;
   location / {
      proxy_pass http://127.0.0.1:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
   }
}
EOF
sudo ln -s /etc/nginx/sites-available/contest-tracker /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

#### 8. SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

#### 9. Add Cron Jobs

(See Automation System section)

#### 10. Logs & Monitoring

```bash
pm2 logs contest-tracker
pm2 list
tail -f logs/cron.log
```

### DigitalOcean App Platform (Alternative)

- Push repo → DO App Platform → Build command: `npm run build` → Run command: `npm run start`
- Configure environment variables in dashboard
- Use DO "Jobs" or external cron for script execution

## 📈 Monitoring

- **PM2**: Process uptime & restart tracking
- **Nginx Logs**: Access & error logs
- **MongoDB Atlas**: Database performance monitoring
- **Custom Cron Logs**: Output appended to `logs/cron.log`
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

<!-- Former Vercel demo retired after migration; section removed for clarity -->

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

<!-- Removed Vercel hosting reference after migration to self-hosted DigitalOcean deployment -->

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

<!-- Removed deprecated /api/cron/scheduler endpoint (legacy in-app scheduler replaced by external cron scripts) -->

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

<!-- Removed legacy Vercel/GitHub Actions/External cron service documentation after migration -->

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
