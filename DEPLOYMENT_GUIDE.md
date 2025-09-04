# Complete Deployment Guide for Shy Bird Purchasing App

## Overview
This guide covers:
1. Setting up PostgreSQL database
2. Deploying to Vercel
3. Using v0.dev for UI components
4. Migrating data from the old system

## Step 1: Database Setup

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to the "Storage" tab
3. Click "Create Database" → Select "Postgres"
4. Choose a region close to your users
5. Copy the environment variables provided

### Option B: Supabase (Free Alternative)
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string

### Run Database Migration
```bash
# Connect to your database and run the schema
psql "your-connection-string" -f scripts/schema.sql

# Run the seed data
psql "your-connection-string" -f scripts/seed.sql
```

## Step 2: Prepare for Deployment

### Install Dependencies
```bash
cd "/Users/elifeldman/Desktop/Shy Bird Next App"
npm install
```

### Set Up Environment Variables
Create `.env.local` file:
```env
# Get these from Vercel Postgres or Supabase
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Generate a secure secret
JWT_SECRET="your-super-secret-key-here"
NEXTAUTH_SECRET="another-secret-key"
```

### Test Locally
```bash
npm run dev
# Visit http://localhost:3000
```

## Step 3: Deploy to Vercel

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project name? shy-bird-purchasing
# - Which directory? ./
# - Override settings? No
```

### Method 2: GitHub Integration
1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo
git push -u origin main
```

2. In Vercel Dashboard:
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Add environment variables
   - Deploy

### Add Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy to apply changes

## Step 4: Using v0.dev for UI

### Generate Components
1. Go to [v0.dev](https://v0.dev)
2. Use the prompts from `V0_PROMPTS.md`
3. For each component:
   - Copy the generated code
   - Save to `components/ui/` folder
   - Import into your pages

### Example Integration
```tsx
// app/dashboard/page.tsx
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import { WeeklyTable } from '@/components/ui/weekly-table'
import { SummaryCards } from '@/components/ui/summary-cards'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <SummaryCards />
      <WeeklyTable />
    </DashboardLayout>
  )
}
```

## Step 5: Create Essential API Routes

### Create Login API
```typescript
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/db';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  
  const user = await authenticateUser(username, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Create JWT
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({ id: user.id, username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
  
  // Set cookie
  const response = NextResponse.json({ user });
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 24 hours
  });
  
  return response;
}
```

## Step 6: Data Migration

### Export Data from SQLite
```bash
# From the old app directory
cd "/Users/elifeldman/Desktop/SBK Food Purchasing App"

# Export data as SQL
sqlite3 database/shybird.db .dump > data_export.sql
```

### Transform for PostgreSQL
The main differences:
- Change `INTEGER PRIMARY KEY AUTOINCREMENT` to `SERIAL PRIMARY KEY`
- Change `DATETIME` to `TIMESTAMP`
- Update boolean values from 0/1 to false/true

## Step 7: Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your domain (e.g., `purchasing.shybird.com`)
3. Follow DNS configuration instructions

## Troubleshooting

### Database Connection Issues
- Ensure all Postgres environment variables are set
- Check if IP is whitelisted (Supabase)
- Verify connection string format

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Authentication Issues
- Verify JWT_SECRET is set in production
- Check middleware.ts is properly configured
- Ensure cookies are enabled

## Production Checklist

- [ ] Database migrated and seeded
- [ ] Environment variables set in Vercel
- [ ] Authentication working
- [ ] All locations loading correctly
- [ ] Daily data entry functioning
- [ ] Calculations accurate
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Monitoring set up

## Default Logins

After deployment, use these credentials:
- **Admin**: `admin` / `password123`
- **Manager**: `multi_manager` / `password123`
- **Location Manager**: `sbk_manager` / `password123`

⚠️ **Important**: Change these passwords immediately after first login!

## Next Steps

1. **Set up monitoring**: Vercel Analytics or Sentry
2. **Configure backups**: Set up automated PostgreSQL backups
3. **Team training**: Share the new URL with your team
4. **Customize**: Modify components from v0.dev as needed

## Support

For Vercel issues: [vercel.com/support](https://vercel.com/support)
For database issues: Check Vercel Postgres or Supabase docs
For app issues: Review error logs in Vercel dashboard