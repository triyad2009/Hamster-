create extension if not exists pgcrypto;

create table if not exists public.users(
 id bigint primary key,
 username text,
 first_name text,
 last_name text,
 photo_url text,
 referred_by bigint references public.users(id),
 level int not null default 1,
 created_at timestamptz not null default now(),
 last_seen_at timestamptz not null default now()
);

create table if not exists public.wallets(
 user_id bigint primary key references public.users(id) on delete cascade,
 coins bigint not null default 0 check(coins>=0),
 lifetime_earned bigint not null default 0 check(lifetime_earned>=0),
 updated_at timestamptz not null default now()
);

create table if not exists public.transactions(
 id uuid primary key default gen_random_uuid(),
 user_id bigint not null references public.users(id) on delete cascade,
 type text not null,
 amount bigint not null,
 metadata jsonb not null default '{}',
 created_at timestamptz not null default now()
);

create table if not exists public.upgrades(
 id bigint generated always as identity primary key,
 slug text unique not null,
 name text not null,
 base_cost bigint not null,
 tap_power int not null default 1,
 passive_per_hour bigint not null default 0,
 max_level int not null default 100
);

create table if not exists public.user_upgrades(
 user_id bigint references public.users(id) on delete cascade,
 upgrade_id bigint references public.upgrades(id) on delete cascade,
 level int not null default 0,
 primary key(user_id,upgrade_id)
);

create table if not exists public.missions(
 id bigint generated always as identity primary key,
 slug text unique not null,
 title text not null,
 description text,
 reward bigint not null,
 target bigint not null,
 active boolean not null default true
);

create table if not exists public.user_missions(
 user_id bigint references public.users(id) on delete cascade,
 mission_id bigint references public.missions(id) on delete cascade,
 progress bigint not null default 0,
 claimed_at timestamptz,
 primary key(user_id,mission_id)
);

create table if not exists public.referrals(
 referrer_id bigint references public.users(id) on delete cascade,
 referred_id bigint unique references public.users(id) on delete cascade,
 reward_paid boolean not null default false,
 created_at timestamptz not null default now(),
 primary key(referrer_id,referred_id)
);

create table if not exists public.ad_rewards(
 id uuid primary key default gen_random_uuid(),
 user_id bigint not null references public.users(id) on delete cascade,
 provider text not null,
 external_reward_id text unique not null,
 amount bigint not null,
 created_at timestamptz not null default now()
);

create table if not exists public.withdrawals(
 id uuid primary key default gen_random_uuid(),
 user_id bigint not null references public.users(id) on delete cascade,
 method text not null,
 destination text not null,
 amount bigint not null check(amount>0),
 status text not null default 'pending',
 created_at timestamptz not null default now(),
 reviewed_at timestamptz
);

create index if not exists transactions_user_created_idx on public.transactions(user_id,created_at desc);
create index if not exists users_level_idx on public.users(level desc);

alter table public.users enable row level security;
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;
alter table public.upgrades enable row level security;
alter table public.user_upgrades enable row level security;
alter table public.missions enable row level security;
alter table public.user_missions enable row level security;
alter table public.referrals enable row level security;
alter table public.ad_rewards enable row level security;
alter table public.withdrawals enable row level security;

-- Production note: do not expose write policies that allow clients to mint coins.
-- Server-side functions/API routes should perform economic mutations.
