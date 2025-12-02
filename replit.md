# MinesMinis - English Learning Platform for Kids

## Project Overview
MinesMinis is a premium English learning platform designed for children (ages 5-8) that combines interactive games, educational videos, worksheets, and an AI-powered mascot named "Mimi" the bear. The application features a social media-like interface (Instagram-style) to make learning engaging and fun.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js proxy server for OpenAI API
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4o-mini (via backend proxy)
- **Styling**: Custom CSS with pastel navy color theme and glassmorphism effects

## Project Structure
```
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components (Home, Games, etc.)
│   ├── services/          # API services and utilities
│   ├── contexts/          # React contexts (Auth, etc.)
│   └── config/            # Configuration files
├── server/                # Backend Express proxy server
│   ├── server.js          # Main server file
│   └── package.json       # Server dependencies
└── supabase/             # Database migrations and functions
```

## Environment Setup (Replit)

### Required Environment Variables
The following environment variables are configured in Replit:

**Supabase Configuration:**
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**Backend Configuration:**
- `VITE_BACKEND_URL`: URL for the backend proxy server (auto-configured for Replit)
- `OPENAI_API_KEY`: OpenAI API key (stored as secret)

### Replit-Specific Configuration
1. **Frontend**: Runs on port 5000 with host 0.0.0.0 (required for Replit proxy)
2. **Backend**: Runs on port 3001 with dynamic port support
3. **Workflow**: Both frontend and backend run concurrently via `npm run dev`

## Key Features
1. **AI Mascot (Mimi)**: Interactive bear character that roams the website and chats with students
2. **Games Section**: Educational games for language learning
3. **Words Library**: Vocabulary learning with visuals
4. **Videos**: Curated educational YouTube videos
5. **Worksheets**: Downloadable learning materials
6. **Social Features**: Posts, comments, likes, following (Instagram-style)
7. **Teacher Dashboard**: Analytics and student management
8. **Student Dashboard**: Progress tracking and gamification

## Design System (Updated December 2025)

### Color Palette - Pastel Navy Theme
- **Primary Navy**: #2C3E6F (dark navy text)
- **Primary Navy Dark**: #1E2A4A (hover states)
- **Primary Navy Pale**: #4A5B8C (borders, accents)
- **Background Soft**: #F8F9FC (light backgrounds)
- **Background Navy Soft**: #E8EBF2 (soft borders)
- **Accent Coral**: #E8A87C (warm accents)
- **Accent Mint**: #7EB8A8 (success states)
- **Accent Lavender**: #B8A8D9 (purple accents)
- **Text Dark**: #2C3E6F
- **Text Medium**: #5A6B8C
- **Text Light**: #8A95B0

### Design Principles
- Child-friendly with soft, rounded corners (8-24px radius)
- Glassmorphism effects with subtle shadows
- Minimal animations appropriate for children
- Clean typography with good readability
- Mobile-responsive layouts

## Recent Changes (December 2025)

### Complete Pastel Navy Redesign
- Replaced all neon/bright gradients with soft pastel navy color scheme
- Updated all page CSS files: Landing, Home, Games, Words, Profile, Messages, Notifications, Search, Reels
- Updated global styles in index.css and App.css
- Implemented glassmorphism effects with soft shadows
- Added consistent border radius and spacing throughout

### Mimi Mascot Improvements
- Softened Mimi's appearance with pastel colors (peach #FFD4B8, cream #FFF5E8, soft pink cheeks)
- Fixed left/right profile direction logic in mascotRoaming.ts
- Removed "running" animation - Mimi only walks slowly now
- Increased animation durations for smoother, child-appropriate movement
- Walking animation: 2.2s cycle, position transitions: 6s with easing
- Roaming delays: 6-14s between actions

### UX/UI Modernization
- Redesigned all components with pastel navy theme
- Added mobile responsive breakpoints (480px, 768px, 1200px)
- Added safe-area-inset support for notch devices
- Updated cursor to simple arrow design
- Improved contrast and readability for children

## Running Locally
The application automatically starts both frontend and backend:
```bash
npm run dev
```

This runs:
- Frontend (Vite): http://localhost:5000
- Backend (Express): http://localhost:3001

## Architecture Notes
- **Authentication**: Handled by Supabase Auth with user profiles stored in database
- **AI Chat**: Frontend → Backend Proxy → OpenAI API (keeps API key secure)
- **File Storage**: Supabase Storage for user avatars, posts, worksheets
- **Real-time**: Supabase real-time subscriptions for social features

## User Preferences
- Language: Mixed Turkish/English for the educational content
- Target Audience: Children ages 5-8 learning English
- Design Style: Soft pastel navy with glassmorphism effects, child-friendly animations
