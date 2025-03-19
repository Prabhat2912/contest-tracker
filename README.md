# Contest Tracker

## Development Stack

- **MERN** (MongoDB, Express.js, React, Node.js)

## Project Overview

The Contest Tracker is a web application designed to fetch and display upcoming and past contests from popular competitive programming platforms such as Codeforces, CodeChef, and Leetcode. The application provides various features to enhance user experience and streamline contest tracking.

## Features

- **Upcoming Contests**: Fetches and displays all upcoming contests from Codeforces, CodeChef, and Leetcode.
- **Contest Details**: Shows the date of the contest and the time remaining before it starts.
- **Past Contests**: Displays past contests with an option to attach solution links from our YouTube channel.
- **Platform Filter**: Allows users to filter contests by selecting one or more platforms (e.g., only Codeforces, or Codeforces + Leetcode).
- **Bookmark Contests**: Users can bookmark contests for easy access.
- **Solution Links**: Provides a separate URL with a form for team members to attach solution links from our YouTube channel to past contests.
- **Automatic Link Fetching**: Automatically fetches solution links from YouTube and adds them once the solution is uploaded.
- **Responsive UI**: The UI is mobile and tablet responsive.
- **Light and Dark Mode**: Includes a toggle option for light and dark modes.
- **Well-Documented Code**: The code is well documented for ease of understanding and maintenance.

## Documentation

### APIs

- **GET /api/getContests**: Fetches all contests from the database.
- **POST /api/bookmark**: Bookmarks a contest for a user.
- **POST /api/getSolutions**: Fetches solution links for contests from YouTube.
- **GET /api/contests**: Fetches contests from external APIs and saves them to the database.

### Interfaces

- **Home Page**: Displays upcoming contests with filters and bookmark options.
- **Past Contests Page**: Lists past contests with options to view and attach solution links.
- **Admin Form Page**: A form for team members to attach solution links to past contests.

## Implementation Details

### Code Structure

- **Backend**: The backend is built using Node.js and Express.js, with MongoDB as the database. It handles fetching contests from Codeforces, CodeChef, and Leetcode, and provides APIs for the frontend.
- **Frontend**: The frontend is built using React and Next.js. It displays the contests, allows filtering, bookmarking, and attaching solution links.

### Key Components

- **ContestCard**: A React component that displays individual contest details, including name, platform, start time, and bookmark status.
- **Filter**: A component that allows users to filter contests by platform and time (upcoming or past).
- **AdminForm**: A form for team members to attach solution links to past contests.

### APIs

- **GET /api/getContests**: Fetches all contests from the database.
- **POST /api/bookmark**: Bookmarks a contest for a user.
- **POST /api/getSolutions**: Fetches solution links for contests from YouTube.
- **GET /api/contests**: Fetches contests from external APIs and saves them to the database.

### Database

- **MongoDB**: Stores contest details, including platform, name, start time, end time, duration, URL, bookmarked users, and solution links.

### Additional Features

- **Automatic Link Fetching**: Uses YouTube API to automatically fetch and attach solution links to contests.
- **Responsive Design**: The UI is designed to be responsive for mobile and tablet devices.
- **Dark Mode**: Includes a toggle option for light and dark modes.

### Documentation

- **Code Documentation**: The code is well-documented with comments explaining the functionality of different parts.
- **README**: Provides an overview of the project, features, APIs, interfaces, and submission details.

### Demo

- **Video Demonstration**: [https://drive.google.com/file/d/1QLEPPhfM3vRSk1cLtzPWCkkcGb7TtllO/view?usp=sharing]
- **Hosted Link**: [https://contests-tracker.vercel.app/]
