# Mini Bug Tracker

A full-stack, real-time bug tracking application built with modern web technologies. Features comprehensive issue management, multi-user collaboration, and instant synchronization across clients.

**Live Demo:** [https://mini-bug-tracker.vercel.app/](https://mini-bug-tracker.vercel.app/)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Overview

Mini Bug Tracker is a production-ready issue tracking system designed for development teams. It provides real-time synchronization, advanced filtering capabilities, and a comprehensive set of features for managing software bugs and feature requests. The application leverages Firebase Firestore for data persistence and real-time updates, enabling seamless collaboration across distributed teams.

## Features

### Core Functionality

**Issue Management**
- Create, read, update, and delete (CRUD) operations for issues
- Rich text descriptions with Markdown support
- Automatic timestamp tracking (created and updated dates)
- Customizable assignee field for issue ownership

**Workflow Management**
- Four-stage status flow: Open, In-Progress, Review, Closed
- Quick status transitions via card-level controls
- Visual status indicators with color-coded badges
- Status-based filtering

**Search and Filtering**
- Full-text search across issue titles and descriptions
- Case-insensitive search implementation
- Multi-criteria filtering (status, priority, text search)
- Real-time filter results with count display
- Active filter visualization and individual filter removal

### Advanced Features

**Priority System**
- Four-level priority hierarchy: Critical, High, Medium, Low
- Visual priority indicators with distinct color schemes
- Priority-based filtering and sorting capabilities

**Labeling System**
- Dynamic label creation and management
- Multi-label support per issue
- Label-based categorization and organization
- Visual label display with overflow handling

**Collaboration Tools**
- Comment system with threaded discussions
- User identification and timestamp tracking
- Real-time comment synchronization
- Comment counter on issue cards

**Real-Time Synchronization**
- Instant updates across all connected clients
- Firestore onSnapshot listeners for live data
- Optimistic UI updates with error handling
- Conflict-free replicated data structure

### User Experience

**Interface Design**
- Responsive, mobile-first design
- Adaptive layouts for desktop, tablet, and mobile devices
- Smooth animations and transitions
- Toast notification system for user feedback
- Loading states and skeleton screens
- Empty state handling with actionable guidance

**Accessibility**
- Keyboard navigation support (ESC to close modals)
- ARIA labels and semantic HTML
- High contrast color schemes
- Focus management for modal interactions

**Performance Optimizations**
- Memoized filter computations
- Efficient re-render strategies
- Lazy loading for components
- Optimized Firestore query patterns

## Technology Stack

### Frontend

- **React 18.3.1** - Component-based UI library with hooks
- **Vite 5.4.2** - Next-generation frontend build tool
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **react-markdown 9.0.1** - Markdown rendering component

### Backend & Infrastructure

- **Firebase Firestore** - NoSQL cloud database with real-time capabilities
- **Firebase Authentication** - Anonymous authentication for user management
- **Vercel** - Serverless deployment platform with edge caching

### Development Tools

- **PostCSS** - CSS transformation tool
- **Autoprefixer** - CSS vendor prefix automation
- **ESLint** - Code quality and consistency

## Architecture

### Component Hierarchy

```
App
├── FilterBar
├── IssueList
│   └── IssueCard (multiple instances)
├── IssueModal
│   └── CommentSection
└── Toast
```

### Data Flow

```
User Action → Event Handler → Firebase Operation → Firestore → onSnapshot Listener → State Update → UI Re-render
```

### State Management

The application uses React's built-in state management with hooks:

- **useState** - Local component state
- **useEffect** - Side effects and lifecycle management
- **useMemo** - Memoized computations for filtering
- **Custom Hook (useIssues)** - Encapsulated Firestore operations

### Firebase Integration

**Authentication Flow:**
```
App Mount → initializeAuth() → signInAnonymously() → User State Update
```

**Data Operations:**
```
Component → useIssues Hook → Firestore SDK → Cloud Firestore → Real-time Updates
```

## Getting Started

### Prerequisites

- Node.js version 16.x or higher
- npm version 7.x or higher (or yarn 1.22.x)
- Firebase account (free tier supported)
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mini-bug-tracker.git
cd mini-bug-tracker
```

2. Install dependencies:
```bash
npm install
```

### Configuration

#### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable Firestore Database:
   - Navigate to Firestore Database in the sidebar
   - Click "Create Database"
   - Select "Start in test mode" for development
   - Choose your preferred region

3. Enable Anonymous Authentication:
   - Navigate to Authentication section
   - Go to "Sign-in method" tab
   - Enable "Anonymous" provider

4. Obtain Firebase configuration:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Register a web app if not already done
   - Copy the `firebaseConfig` object

#### Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit `.env.local` to version control. This file is automatically ignored by `.gitignore`.

### Running Locally

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage Guide

### Creating Issues

1. Click the "New Issue" button in the main interface
2. Fill in the required fields:
   - **Title**: Brief summary of the issue (required)
   - **Description**: Detailed explanation with Markdown support (required)
   - **Status**: Select from available workflow stages
   - **Priority**: Choose urgency level
   - **Assignee**: Specify responsible user
   - **Labels**: Add categorization tags
3. Submit the form to create the issue

### Editing Issues

1. Click the edit icon on any issue card
2. Modify desired fields in the modal
3. Add comments in the dedicated section
4. Save changes to update the issue

### Filtering and Search

Use the filter bar to narrow down issues:
- **Text Search**: Enter keywords to search titles and descriptions
- **Status Filter**: Select specific workflow stage
- **Priority Filter**: Filter by urgency level

Multiple filters can be applied simultaneously. Active filters are displayed as removable tags.

### Status Management

Update issue status using either method:
- **Quick Toggle**: Click the arrow button on issue cards to advance through workflow stages
- **Manual Selection**: Edit the issue and select desired status from dropdown

### Adding Comments

1. Open an issue in edit mode
2. Navigate to the comments section
3. Enter comment text in the input field
4. Submit to add the comment with timestamp

## Project Structure

```
mini-bug-tracker/
├── public/                      # Static assets
├── src/
│   ├── components/              # React components
│   │   ├── CommentSection.jsx   # Comment display and input
│   │   ├── FilterBar.jsx        # Search and filter controls
│   │   ├── IssueCard.jsx        # Individual issue display
│   │   ├── IssueList.jsx        # Issue grid container
│   │   ├── IssueModal.jsx       # Create/Edit modal dialog
│   │   └── Toast.jsx            # Notification component
│   ├── firebase/
│   │   └── config.js            # Firebase initialization
│   ├── hooks/
│   │   └── useIssues.js         # Custom Firestore hook
│   ├── App.jsx                  # Root application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind configuration
└── vite.config.js               # Vite build configuration
```

### Key Files

**src/App.jsx**
- Main application logic
- State management
- Firebase authentication
- Event handlers

**src/hooks/useIssues.js**
- Firestore CRUD operations
- Real-time listeners
- Error handling
- Loading states

**src/firebase/config.js**
- Firebase initialization
- Authentication setup
- Environment variable loading

## Development

### Code Style

The project follows these conventions:
- Functional components with React Hooks
- Descriptive variable and function names
- JSDoc comments for complex functions
- Component-level error boundaries
- Consistent file and folder naming

### Adding New Features

1. Create feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Implement changes following existing patterns
3. Test thoroughly in development environment
4. Submit pull request with detailed description

### Testing

Manual testing checklist:
- Create issue with all fields
- Edit existing issue
- Delete issue
- Test all filter combinations
- Verify status transitions
- Add comments
- Test on mobile viewport
- Verify real-time sync (multiple browser tabs)

## Building for Production

Generate optimized production build:
```bash
npm run build
```

Build output will be in the `dist/` directory.

Preview production build locally:
```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub repository

2. Import project in Vercel dashboard

3. Configure environment variables:
   - Add all `VITE_FIREBASE_*` variables from `.env.local`

4. Deploy application

Vercel automatically handles:
- Continuous deployment from Git
- HTTPS certificates
- Global CDN distribution
- Automatic scaling

### Alternative Platforms

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Firebase Hosting:**
```bash
firebase init hosting
npm run build
firebase deploy --only hosting
```

## Security

### Firestore Security Rules

For production deployment, implement these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /issues/{issueId} {
      // Allow read access to authenticated users
      allow read: if request.auth != null;

      // Allow create for authenticated users
      allow create: if request.auth != null
                    && request.resource.data.keys().hasAll(['title', 'description', 'status', 'priority']);

      // Allow update for authenticated users
      allow update: if request.auth != null;

      // Allow delete for authenticated users
      allow delete: if request.auth != null;
    }
  }
}
```

### Best Practices

- Never commit `.env.local` to version control
- Rotate Firebase API keys periodically
- Use Firebase App Check in production
- Implement rate limiting for Firestore operations
- Monitor usage via Firebase console

## API Reference

### Custom Hooks

#### useIssues(userId)

Primary hook for Firestore operations.

**Parameters:**
- `userId` (string): Current authenticated user ID

**Returns:**
```typescript
{
  issues: Array<Issue>,           // Array of issue objects
  loading: boolean,               // Loading state
  error: string | null,           // Error message
  createIssue: (data) => Promise<string>,
  updateIssue: (id, data) => Promise<void>,
  deleteIssue: (id) => Promise<void>,
  addComment: (id, text) => Promise<void>,
  updateStatus: (id, status) => Promise<void>
}
```

**Example:**
```javascript
const { issues, loading, createIssue } = useIssues(user?.uid);

await createIssue({
  title: 'Bug in login flow',
  description: 'Users cannot log in with email',
  status: 'Open',
  priority: 'High',
  assignee: user.uid,
  labels: ['authentication', 'urgent']
});
```

### Data Models

#### Issue Object

```typescript
interface Issue {
  id: string;                    // Firestore document ID
  title: string;                 // Issue title (required)
  description: string;           // Detailed description (required)
  status: 'Open' | 'In-Progress' | 'Review' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;              // User ID
  labels: string[];              // Array of label strings
  comments: Comment[];           // Array of comment objects
  createdAt: Timestamp;          // Firestore timestamp
  updatedAt: Timestamp;          // Firestore timestamp
}
```

#### Comment Object

```typescript
interface Comment {
  userId: string;                // Comment author ID
  text: string;                  // Comment content
  timestamp: number;             // Unix timestamp
}
```

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Pull Request Process

- Ensure code follows existing style conventions
- Update documentation for new features
- Test changes thoroughly
- Provide detailed PR description

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Built with React, Tailwind CSS, and Firebase**

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/yourusername/mini-bug-tracker/issues).
