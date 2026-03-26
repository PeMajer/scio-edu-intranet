# ScioEdu Intranet

Internal company intranet for ScioPolis organization built with Remix, Cloudflare Workers, Supabase, and Sanity.io.

## Features

- **Authentication**: Google OAuth with @scioskola.cz domain restriction
- **Portal Hub**: Central dashboard with education and concept sections
- **Education Courses**: Multiple categories with internal and external courses
- **Course Enrollment**: Full enrollment system with term selection
- **Calendar Integration**: Google Calendar embed for events
- **Admin Panel**: Management interface for viewing all enrollments
- **Content Management**: Sanity.io for flexible content management

## Tech Stack

- **Framework**: Remix 2.x with Cloudflare Workers
- **Database**: Supabase (PostgreSQL with RLS)
- **CMS**: Sanity.io
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **Authentication**: Supabase Auth with Google OAuth

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Sanity
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01

# Session
SESSION_SECRET=your_random_32_char_secret
```

### 2. Supabase Setup

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key to `.env`

#### B. Configure Google OAuth
1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. In your application, domain restriction is enforced to `@scioskola.cz`

#### C. Database Migration
The database migration has already been applied with:
- `profiles` table for user information
- `enrollments` table for course registrations
- Row Level Security (RLS) policies

### 3. Sanity.io Setup

#### A. Create Sanity Project
```bash
npm install -g @sanity/cli
sanity init
```

#### B. Deploy Schema
The schema is defined in `sanity/schema.ts` with three document types:
- `course` - Course information with dates, pricing, lecturers
- `lecturer` - Instructor profiles
- `sectionPage` - Section configuration pages

#### C. Add Sample Content
In Sanity Studio, create sample courses:
1. At least 2-3 courses in each section (novacek, rust, tymy)
2. Create lecturer profiles
3. Add section pages for koncepce

### 4. Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

### 5. Cloudflare Pages Deployment

1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `public`
4. Add environment variables in Cloudflare dashboard

## Project Structure

```
app/
├── routes/                    # Remix routes
│   ├── _index.tsx            # Login page
│   ├── auth.callback.tsx     # OAuth callback
│   ├── portal._index.tsx     # Main portal hub
│   ├── vzdelavani._index.tsx # Education landing
│   ├── vzdelavani.novacek.tsx # Beginner courses
│   ├── vzdelavani.rust.tsx   # Personal growth courses
│   ├── vzdelavani.tymy.tsx   # Team courses
│   ├── vzdelavani.kurz.$slug.tsx # Course detail
│   ├── koncepce.tsx          # Concepts section
│   ├── kalendar.tsx          # Calendar
│   ├── moje-kurzy.tsx        # My enrollments
│   └── admin.tsx             # Admin panel
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── supabase.server.ts    # Supabase utilities
│   ├── sanity.server.ts      # Sanity utilities
│   ├── types.ts              # TypeScript types
│   └── cn.ts                 # Class name utility
└── tailwind.css              # Global styles

sanity/
└── schema.ts                 # Sanity content schemas

supabase/
└── migrations/               # Database migrations
```

## Design System

### Colors
- Primary (Turquoise): `#1DA2AC`
- Accent (Mustard Yellow): `#FCB813`
- Muted (Grey-Blue): `#687A7C`
- Light (Light Turquoise): `#BADEDF`
- Background: `#F5F7F8`

### Typography
- Headings: Poppins (bold)
- Body: Montserrat
- Labels: Roboto

## User Roles

- **user** (default): Can browse courses, enroll, view own enrollments
- **admin**: Full access including admin panel to view all enrollments

## Security

- Google OAuth with domain restriction to @scioskola.cz
- Row Level Security (RLS) on all database tables
- Users can only access their own data
- Admins have elevated permissions for management

## Course Types

### Internal Courses
- Full enrollment system with multiple terms
- Capacity tracking
- Lecturer information
- Materials and resources
- Contact information

### External Courses
- Simplified display with highlights
- Direct link to external registration
- Clearly marked with "Externí" badge

## Support

For issues or questions, contact your ScioPolis IT administrator.
