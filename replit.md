# MinesMinis - English Learning Platform for Kids

## Project Overview
MinesMinis is a premium English learning platform designed for children (ages 5-8) that combines interactive games, educational videos, worksheets, and an AI-powered mascot named "Mimi" the bear. The application features a social media-like interface (Instagram-style) to make learning engaging and fun.

**Developer**: Onur Hüseyin Koçak

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js proxy server for OpenAI API
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4o-mini (via backend proxy)
- **Styling**: Custom CSS with vibrant colorful premium theme
- **Icons**: Lucide React (vector icons)
- **Animations**: Lottie React (lottie-react, @lottiefiles/react-lottie-player)

## Project Structure
```
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── SplashScreen.tsx/css  # Branded splash screen
│   │   ├── ProfessorPaws.tsx     # Mimi mascot component
│   │   └── Navbar.tsx            # Navigation with icons
│   ├── pages/             # Page components (Home, Games, etc.)
│   ├── services/          # API services and utilities
│   ├── contexts/          # React contexts (Auth, etc.)
│   └── config/            # Configuration files
├── server/                # Backend Express proxy server
│   ├── server.js          # Main server file
│   └── package.json       # Server dependencies
├── attached_assets/       # Logo and brand assets
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
1. **Splash Screen**: Branded loading screen with logo and developer credit
2. **Dragon Mascot**: Interactive cute green dragon (Lottie animated) that roams the website and chats with students
3. **Games Section**: Educational games for language learning
4. **Words Library**: Vocabulary learning with visuals
5. **Videos**: Curated educational YouTube videos
6. **Worksheets**: Downloadable learning materials
7. **Social Features**: Posts, comments, likes, following (Instagram-style)
8. **Teacher Dashboard**: Analytics and student management
9. **Student Dashboard**: Progress tracking and gamification

## Design System (Updated December 2025)

### Color Palette - Vibrant Premium Theme
- **Primary Purple**: #6366f1 (indigo purple)
- **Primary Dark**: #4f46e5 (darker purple for hover)
- **Accent Coral**: #FF6B6B (vibrant coral red)
- **Accent Mint**: #4ECDC4 (fresh mint/teal)
- **Accent Lavender**: #a78bfa (soft purple)
- **Accent Peach**: #FFB347 (warm orange-peach)
- **Accent Sky**: #74b9ff (bright sky blue)
- **Accent Rose**: #fd79a8 (playful pink)
- **Text Dark**: #1a1a2e (deep dark blue)
- **Text Medium**: #4a4a6a (medium gray-purple)
- **Background Light**: #f8f9ff (very light blue-white)

### Gradient Backgrounds
- **Splash Screen**: `linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #f97316)` with animation
- **Hero Sections**: Purple to pink gradients
- **Cards**: White with colored shadows and borders

### Dragon Mascot Colors (Lottie Animation)
- **Body**: Green (#4DB866 - vibrant green)
- **Belly**: Light green (#99E6A6)
- **Horns**: Golden yellow (#FFD966)
- **Eyes**: White with black pupils
- **Cheeks**: Pink blush (#FF99B3)

### Design Principles
- Child-friendly with soft, rounded corners (12-24px radius)
- Vibrant gradients and colorful accents
- Vector icons from Lucide React
- Lottie animations for engaging interactions
- Mobile-responsive layouts with safe-area support
- Premium glassmorphism effects with colorful shadows

## Recent Changes (December 2025)

### Vibrant Premium Redesign
- Replaced pastel navy with vibrant colorful theme
- Updated all CSS files with bright, engaging colors
- Added gradient backgrounds and colorful shadows
- Implemented premium-colorful-theme.css

### Splash Screen Added
- Custom branded splash screen with uploaded logo
- Developer credit: "Onur Hüseyin Koçak"
- Animated gradient background (purple-pink-orange)
- Shows once per session (sessionStorage)
- 1.5s display + 0.4s fade animation

### Dragon Mascot - Mimi
- Replaced Mimi bear with cute green dragon using custom SVG animation
- Dragon has big eyes, pink cheeks, and golden horns
- Fully animated with bounce and movement effects
- Child-friendly design with playful expressions
- **Eye Tracking Feature**: Dragon's eyes follow the user's mouse cursor for engaging eye contact
- **Random Looking**: Every 3-7 seconds there's a 30% chance dragon looks in a random direction
- **State-aware**: Eyes reset during sleeping and thinking states
- **Speech Bubbles**: Shows capability messages explaining what Mimi can do (games, learning, etc.)
- **Interactive Home**: Clicking on dragon's cave home opens the AI chat interface

### Videos Page (December 2025)
- Complete redesign with grade-based categories (2nd, 3rd, 4th Grade)
- 24 curated educational YouTube videos for English learning
- Content types: Songs, Lessons, Stories
- Interactive grade filtering with animated buttons
- Popular videos horizontal scroll section
- Video modal player with autoplay
- Responsive grid layout

### Atatürk Tribute Section (December 2025)
- **Atatürk Corner**: Prominent dark-themed banner on homepage with Turkish flag icon
- **Dedicated /ataturk page** with comprehensive content:
  - Hero section with dramatic gradient background
  - "Who Was Atatürk?" introduction
  - Famous quotes in English and Turkish
  - Timeline of his life (1881-1938) with 6 key events
  - Revolutionary reforms grid (6 major reforms)
  - Legacy section
  - Footer banner with "Ne Mutlu Türküm Diyene"
- Dark theme (#1a1a2e, #16213e) with red accents (#dc2626)

### Technical Improvements
- Disabled service worker (was causing console errors)
- Integrated lucide-react for vector icons
- Installed Lottie animation libraries
- Optimized splash screen timing

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
- Design Style: Vibrant colorful premium with gradients, NOT pastel/muted tones
- Future Plans: TWA (Trusted Web Activity) conversion for mobile app
