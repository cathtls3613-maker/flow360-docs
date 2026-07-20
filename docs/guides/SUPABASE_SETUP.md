# Connect FLOW360 to Supabase (one-time setup)

Supabase provides FLOW360's database, sign-in system, and file storage.
This takes about 10 minutes, needs no programming, and is done once.

## 1. Create the project

1. Go to <https://supabase.com> and click **Start your project** (the
   free plan is fine for development).
2. Sign up (GitHub login is easiest) and create an **organization**
   when asked.
3. Click **New project**:
   - **Name:** `flow360-dev` (this is your development database; a
     separate production project comes later)
   - **Database password:** click **Generate a password** and save it
     somewhere safe (a password manager). You rarely need it, but keep it.
   - **Region:** pick the one closest to you.
4. Click **Create new project** and wait ~2 minutes while it provisions.

## 2. Build the database tables

1. In the left sidebar, open **SQL Editor**.
2. On your computer, open the file
   `supabase/migrations/20260720000001_identity.sql` from this
   repository in any text editor.
3. Copy its **entire contents**, paste into the SQL Editor, and click
   **Run** (or press Ctrl/Cmd + Enter).
4. You should see **"Success. No rows returned"**. That's correct —
   the script builds tables; it doesn't return data.
5. Verify: open **Table Editor** in the sidebar. You should see three
   tables: `companies`, `user_profiles`, `company_members`, each with a
   shield icon (Row Level Security is ON).

## 3. Copy the connection settings

1. In the sidebar: **Project Settings** (gear icon) → **API Keys**.
2. You need two values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / public key** — a long string starting with `eyJ` (or
     `sb_publishable_` on newer projects)
3. In the repository, copy `.env.example` to a new file named
   `.env.local` (if you haven't already) and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```

   Leave `SUPABASE_SERVICE_ROLE_KEY` empty for now — it's a powerful
   admin key we don't need yet.

4. Restart the app (`npm run dev`). Sign-up and sign-in now work.

> These two values are safe to expose to browsers — security comes from
> Row Level Security in the database, not from hiding the key. The
> **service_role** key is the dangerous one: never copy it anywhere
> public.

## 4. Optional: faster testing without email confirmation

New Supabase projects require every new user to click a confirmation
email link. For **development** it's convenient to switch this off:

1. Sidebar: **Authentication** → **Sign In / Providers** → **Email**.
2. Turn **Confirm email** off and save.

Turn it back on before real customers use the system.

## 5. When deploying to Vercel

Add the same two values in the Vercel dashboard: your project →
**Settings** → **Environment Variables**. Use a **separate Supabase
project for production** so testing can never touch real customer data.
