# Hamster — Telegram Mini App Game

A Telegram Mini App starter for a tap-to-earn game with a server-first economy.

## Included
- Telegram Mini App shell
- Tap-to-earn + energy
- Upgrade system
- Daily reward
- Missions
- Referral foundation
- Leaderboard foundation
- Wallet/withdrawal foundation
- Rewarded-ad integration hook
- Supabase schema + RLS
- Admin API foundation
- Bot webhook starter
- Vercel-ready Next.js app

## Stack
Next.js 15, TypeScript, Tailwind CSS, Supabase, Telegram Web Apps API.

## Local setup
1. Copy `.env.example` to `.env.local`.
2. Add Supabase URL and anon key.
3. Run `npm install`.
4. Run `npm run dev`.
5. Deploy the app to HTTPS.
6. In BotFather configure the Mini App URL and menu button.
7. Apply `supabase/schema.sql` to your Supabase project.

## Important
Never put Telegram bot tokens or Supabase service-role keys in client code. Real-money withdrawals and ad rewards must be verified server-side and configured with the provider's rules before production.
