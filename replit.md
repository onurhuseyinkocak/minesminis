# MinesMinis - English Learning Platform for Kids

## Project Overview
MinesMinis is a premium English learning platform designed for children (ages 5-8) that combines interactive games, educational videos, worksheets, and an AI-powered mascot named "Mimi" the bear. The application features a social media-like interface (Instagram-style) to make learning engaging and fun.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js proxy server for OpenAI API
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4o-mini (via backend proxy)
- **Styling**: Custom CSS with claymorphism design

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

## Recent Changes (GitHub Import Setup)
- Configured Vite to work with Replit environment (port 5000, host 0.0.0.0)
- Updated backend server for dynamic port assignment and CORS configuration
- Modified AI service to auto-detect Replit domains for backend communication
- Installed backend dependencies
- Set up environment variables for Supabase and OpenAI
- Configured deployment settings for VM deployment

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
- Design Style: Colorful, playful, with claymorphism effects
