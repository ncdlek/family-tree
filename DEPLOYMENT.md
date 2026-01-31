# Deploying to Vercel with Free Database

## Method 1: Vercel Postgres (Recommended - Simplest)

### 1. Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/family-tree.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. **Add Environment Variables** in the deploy screen:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (leave empty, we'll add this in step 5) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Generate one at `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | (optional - from Google Cloud Console) |
| `GOOGLE_CLIENT_SECRET` | (optional) |

5. Click **Deploy**

### 3. Add Vercel Postgres Database

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database**
3. Select **Postgres** → **Continue**
4. Click **Create** (Free tier)
5. Click **.env.local** tab and copy the `DATABASE_URL`
6. Go to **Settings** → **Environment Variables**
7. Add `DATABASE_URL` with the copied value
8. Redeploy your app

### 4. Initialize Database

1. Go to your project's **Storage** tab → **Postgres**
2. Click **Query** button
3. Run this to push your schema (or connect locally and run `npx prisma db push`):

```sql
-- Or use Vercel CLI locally:
vercel link
vercel env pull .env.local
npx prisma db push
```

### 5. Redeploy

After setting the `DATABASE_URL`, Vercel will automatically redeploy.

---

## Method 2: Neon (Alternative)

### 1. Create Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up
2. Click **Create a project**
3. Choose a name and region
4. Copy the **Connection string** (looks like `postgres://...`)

### 2. Deploy on Vercel

1. Import your GitHub repo to Vercel
2. Add these environment variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `your-neon-connection-string` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | `your-random-secret` |

3. Deploy!

### 3. Push Database Schema

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull env vars locally
vercel env pull .env.local

# Push Prisma schema
npx prisma db push
```

---

## Method 3: Supabase (Alternative with Extras)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Set password and region
4. Copy **Project URL** and **anon public** key

### 2. Get Database URL

In Supabase dashboard → Settings → Database:
- The connection string format is:
```
postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 3. Deploy to Vercel

Same as Method 2, use Supabase connection string for `DATABASE_URL`.

---

## Important Notes

### Generating NEXTAUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Or visit: https://generate-secret.vercel.app/32

### Google OAuth (Optional)

If you want Google sign-in:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `https://your-app.vercel.app/api/auth/callback/google` as authorized redirect URI
6. Copy Client ID and Secret to Vercel env vars

### Deploy Commands (Vercel CLI)

```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Troubleshooting

### "Database connection failed"

- Make sure `DATABASE_URL` is correct
- Check your database allows external connections (Neon/Supabase do by default)

### "NextAuth error"

- Verify `NEXTAUTH_URL` matches your Vercel domain exactly
- Check `NEXTAUTH_SECRET` is set

### Build errors

- Run `npm run build` locally first to check for errors
- Make sure all dependencies are in `package.json`

---

## Costs (Free Tier Limits)

| Service | Free Tier |
|---------|-----------|
| Vercel Hosting | 100GB bandwidth/month |
| Vercel Postgres | 512MB storage, 60hrs compute |
| Neon | 0.5GB storage, 3 projects |
| Supabase | 500MB storage, 2 projects |

For a family tree app, these limits are more than enough to start!
