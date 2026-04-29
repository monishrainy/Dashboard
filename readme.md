# BudgetIQ

A personal finance dashboard to track expenses, savings, and investments — with analytics, budget advice, and multi-currency support.

**Live demo:** https://dashboard-xi-sepia-13.vercel.app

---

## Features

- **Authentication** — register, email verification, login/logout via Supabase Auth
- **Add Entries** — log expenses (12 categories, 50+ subcategories), savings, and investments
- **Dashboard** — monthly overview with pie chart and 6-month bar chart
- **Analytics** — spending trends, category breakdown, day-of-week patterns, top subcategories
- **History** — browse all months, edit or delete entries
- **Budget Advice** — 50/30/20 rule analysis with per-category guidance
- **Multi-currency** — GBP, USD, EUR, INR, AED, PKR, CAD, AUD, JPY, SGD, CHF, SAR
- **Cloud storage** — all data saved to Supabase PostgreSQL, isolated per user

---

## Tech Stack

- [React 18](https://react.dev) + [Vite 6](https://vitejs.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com) — Auth + PostgreSQL database
- [Recharts](https://recharts.org) — charts and graphs
- [Lucide React](https://lucide.dev) — icons
- Deployed on [Vercel](https://vercel.com)

---

## Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/monishrainy/Dashboard.git
cd Dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and run the following:

```sql
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,
  subcategory text not null,
  category_group text,
  amount numeric not null,
  date date not null,
  description text default '',
  month text not null,
  created_at timestamptz default now()
);

create table public.income_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  month text not null,
  amount numeric not null,
  unique(user_id, month)
);

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  currency text not null default 'GBP'
);

alter table public.entries enable row level security;
alter table public.income_data enable row level security;
alter table public.user_settings enable row level security;

create policy "entries_policy" on public.entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "income_policy" on public.income_data
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "settings_policy" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

4. Go to **Project Settings → API** and copy your **Project URL** and **anon public** key

### 4. Add environment variables

Create a `.env` file in the root of the project:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. In **Settings → Environment**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Tick **Production**, **Preview**, and **Development**
4. In your Supabase project → **Authentication → URL Configuration**, set the **Site URL** to your Vercel domain
5. Deploy — every push to `main` auto-deploys
