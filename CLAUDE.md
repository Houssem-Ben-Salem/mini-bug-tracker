# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Mini Bug Tracker application built with React (functional components/hooks), Tailwind CSS, and Google Firestore for real-time persistence. The application is designed as a single-file React app that connects to Firebase/Firestore for data storage.

## Architecture

### Data Model

Issues are stored in Firestore at the path: `/artifacts/{__app_id}/public/data/issues`

Each issue document contains:
- `id`: Auto-generated document ID
- `title` and `description`: Core issue details (description supports Markdown)
- `status`: One of "Open", "In-Progress", "Review", "Closed"
- `assignee`: Current userId
- `priority`: One of "Critical", "High", "Medium", "Low"
- `labels`: Array of strings (e.g., ["UI", "Backend", "Critical Bug"])
- `comments`: Array of objects with structure `{userId: string, text: string, timestamp: number}`
- `createdAt` and `updatedAt`: Firestore timestamps

### Component Structure

The application follows a component-based architecture with:

- **App**: Main container handling Firebase initialization, authentication, and global state management. Sets up `onSnapshot` listener for real-time data sync. Contains CRUD functions: `createIssue`, `updateIssue`, `deleteIssue`.

- **IssueList**: Renders filtered issues as cards based on current filter criteria.

- **IssueCard**: Displays individual issue with title, status badge, priority indicator, and quick action buttons. Includes status toggling functionality (Open → In-Progress → Review → Closed).

- **FilterBar**: Provides filtering UI with text search (searches title and description), status dropdown, and priority dropdown. Multiple filters can be applied simultaneously.

- **IssueModal**: Reusable modal for both Add and Edit operations. Contains controlled form with all issue fields.

- **CommentSection**: Sub-component within IssueModal for viewing and adding comments (sorted by timestamp).

### Firebase Integration

Authentication and initialization use global variables provided by the hosting environment:
- `__app_id`: Application identifier
- `__firebase_config`: Firebase configuration object
- `__initial_auth_token`: Token for authentication

Authentication is handled via `signInWithCustomToken` or `signInAnonymously`. The app uses Firestore's `onSnapshot` for real-time updates to the issues collection.

## Development Guidelines

### Firebase/Firestore Operations

All database operations should include error handling with try...catch blocks. UI elements performing database writes should show loading indicators and disabled states during operations.

### Filtering Logic

Filters operate on the local `issues` state array and support:
- Text search across `title` and `description` fields
- Exact match on `status` field
- Exact match on `priority` field

All filters can be applied simultaneously.

### Priority Visualization

Use dynamic Tailwind CSS classes to visually differentiate priorities:
- Critical: Red badges/indicators
- High: Orange indicators
- Medium: Yellow indicators
- Low: Green indicators

### Mobile-First Design

The application uses Tailwind CSS with a mobile-first, responsive approach. The main layout is a two-column design (Filters/List) that adapts to mobile screens.

### Current User Context

The application must prominently display the current `userId` as this is a multi-user application requirement.
