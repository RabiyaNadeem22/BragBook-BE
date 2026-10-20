# BragBook Server

The server is BragBook's REST API. It uses Express, PostgreSQL, and Prisma to provide authentication and data management for achievements, projects, skills, and goals.

## Tech stack

- Node.js and JavaScript ES modules
- Express 4
- PostgreSQL with Prisma 6
- Zod request and environment validation
- JWT authentication stored in HTTP-only cookies
- Helmet, CORS, and rate limiting

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer (local or hosted)

## Install and configure

From this directory, install dependencies:

```bash
npm install
```

Create a `.env` file in `server/`. Start from `.env.example` and configure the database connection and a private JWT secret:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bragbook?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
COOKIE_NAME="bragbook_token"
```

`DATABASE_URL` is required. Use a database and credentials that exist in your environment. Do not use the example JWT secret in production.

## Database setup

With PostgreSQL running and `DATABASE_URL` configured, generate Prisma Client and apply the development migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

To load the included seed data:

```bash
npm run prisma:seed
```

> **Warning:** The seed script deletes existing records from the application tables before inserting demo data. Run it only against a disposable or intentionally reset database.

To inspect the database with Prisma Studio:

```bash
npm run prisma:studio
```

## Run the API

```bash
npm run dev      # Start with nodemon
npm start        # Start without nodemon
```

The API listens on the configured `PORT` (5000 by default). Check that it is responding at [http://localhost:5000/api/health](http://localhost:5000/api/health).

## API overview

All routes are mounted under `/api`. The server validates request data with Zod and returns JSON responses.

| Resource | Base path | Notes |
| --- | --- | --- |
| Health | `/api/health` | Public health status |
| Authentication | `/api/auth` | Register, login, logout, current user, profile update, and password change |
| Achievements | `/api/achievements` | Authenticated create, list, read, update, and delete |
| Projects | `/api/projects` | Authenticated create, list, read, update, and delete |
| Skills | `/api/skills` | Authenticated create, list, read, update, and delete |
| Goals | `/api/goals` | Authenticated create, list, read, update, and delete |
| Feedback | `/api/feedback` | Placeholder response; full resource API is not implemented |
| Analytics | `/api/analytics` | Placeholder response; full resource API is not implemented |

Authentication uses an HTTP-only cookie. Protected resource routes require a valid signed-in session.

## Project structure

```text
prisma/
├── migrations/       # Database migrations
├── schema.prisma     # PostgreSQL data model
└── seed.js           # Seed script
src/
├── config/           # Environment parsing and Prisma client
├── controllers/      # HTTP request handlers
├── middleware/       # Authentication, validation, and error handling
├── repositories/     # Database access
├── routes/           # API route definitions
├── services/         # Business logic
├── utils/            # API response, errors, logging, and token helpers
├── app.js            # Express setup and middleware
└── server.js         # HTTP listener and graceful shutdown
```

## Available npm scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Run the API with nodemon |
| `npm start` | Run the API with Node.js |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Create/apply a development migration |
| `npm run prisma:seed` | Run the seed script |
| `npm run prisma:studio` | Open Prisma Studio |
