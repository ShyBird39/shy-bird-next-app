# Shy Bird Purchasing Calculator - Next.js Version

A modern, multi-location food purchasing management system built with Next.js and optimized for Vercel deployment.

## Features

- 🏪 **Multi-location support** with custom configurations
- 🔐 **Secure authentication** with JWT tokens
- 📊 **Dynamic calculations** to maintain 28% food cost target
- 📱 **Fully responsive** design
- 🎨 **Beautiful UI** components from v0.dev
- ⚡ **Optimized for Vercel** deployment
- 🗄️ **PostgreSQL database** with Vercel Postgres support

## Quick Start

### 1. Clone and Install
```bash
cd "/Users/elifeldman/Desktop/Shy Bird Next App"
npm install
```

### 2. Set Up Database
- Use Vercel Postgres (easiest) or Supabase
- Run migration scripts from `scripts/` folder

### 3. Configure Environment
Copy `.env.example` to `.env.local` and add your database credentials

### 4. Run Locally
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
vercel
```

## v0.dev Integration

1. Go to [v0.dev](https://v0.dev)
2. Use prompts from `V0_PROMPTS.md`
3. Copy generated components to `components/` folder
4. Import and use in your pages

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages
│   └── login/           # Authentication
├── components/          # React components
│   ├── ui/             # v0.dev UI components
│   └── dashboard/      # Dashboard components
├── lib/                # Utilities and database
├── scripts/            # Database migration scripts
└── public/             # Static assets
```

## Technologies

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Vercel Functions
- **Database**: PostgreSQL (Vercel Postgres)
- **Auth**: JWT with httpOnly cookies
- **Deployment**: Vercel
- **UI Design**: v0.dev components

## Default Users

- **Admin**: `admin` / `password123`
- **Multi-Manager**: `multi_manager` / `password123`
- **Location Manager**: `sbk_manager` / `password123`

⚠️ Change these passwords after deployment!

## Deployment

See `DEPLOYMENT_GUIDE.md` for detailed instructions on:
- Setting up PostgreSQL
- Deploying to Vercel
- Configuring environment variables
- Using custom domains

## Development

### Add New Components
1. Generate in v0.dev
2. Save to `components/ui/`
3. Import in your pages

### Add API Routes
Create files in `app/api/` following Next.js conventions

### Database Changes
1. Update `scripts/schema.sql`
2. Run migrations
3. Update TypeScript types in `lib/db/`

## Support

- **Vercel Issues**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **v0.dev**: [v0.dev/docs](https://v0.dev/docs)