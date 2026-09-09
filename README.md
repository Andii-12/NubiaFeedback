# NUBIA Airline Staff Feedback Platform

Internal operations platform for check-in staff and gate agents at **New Ulaanbaatar International Airport (NUBIA)**.

Staff complete a 30–60 second feedback form from a QR code. AIS / Admin users review responses, analytics, engineers, airlines, locations, and printable QR posters.

## Stack

Next.js App Router · TypeScript · Tailwind CSS · shadcn/ui · MongoDB / Mongoose · Auth.js · Recharts · Framer Motion

## Quick start

1. Start MongoDB (Docker is included):

```bash
docker compose up -d
```

2. Install and run:

```bash
npm install
npm run dev
```

The first API request automatically seeds airlines, locations, engineers, admin users, and sample feedback.

## URLs

- Public landing: `/`
- Feedback form: `/feedback` or `/feedback?location=A12&type=checkin`
- Success: `/feedback/success`
- Admin login: `/admin/login`
- Dashboard: `/admin`

## Default accounts

| Role | Email | Password |
| --- | --- | --- |
| ADMIN | `admin@nubia.airport` | `NubiaAdmin2026!` |
| ENGINEER | `engineer@nubia.airport` | `NubiaEng2026!` |
| VIEWER | `viewer@nubia.airport` | `NubiaView2026!` |

Airline staff do **not** log in. The public form is QR-accessible.

## Environment

Copy `.env.example` to `.env.local` and set:

- `MONGODB_URI` - MongoDB connection string
- `AUTH_SECRET` - Random secret for Auth.js (generate with `openssl rand -base64 32`)
- `AUTH_URL` - Application URL (e.g., `http://localhost:3000`)
- `NEXT_PUBLIC_APP_URL` - Public URL used for QR code links
- `ADMIN_PASSWORD` - (Optional) Default admin password for seeding
- `ENGINEER_PASSWORD` - (Optional) Default engineer password for seeding
- `VIEWER_PASSWORD` - (Optional) Default viewer password for seeding

**Security Note**: The password environment variables allow you to set custom credentials during database seeding. If not set, the default passwords from the table above will be used. Always change these credentials in production environments.

## Seed

```bash
npm run seed
```
