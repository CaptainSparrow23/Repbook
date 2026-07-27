# Repbook

Repbook is a small full-stack workout tracker built as a learning project with
Next.js and FastAPI. Users can create an account, log in, save workouts, and
group workouts into routines.

The project demonstrates authenticated server-rendered pages, Server Actions,
JWT authentication, SQLAlchemy relationships, and ownership-based
authorization.

## Stack

- Next.js 16 and React 19
- TypeScript
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- JWT and bcrypt authentication

## Architecture

```text
Browser
  → Next.js Server Components and Server Actions
  → FastAPI
  → SQLAlchemy
  → SQLite
```

FastAPI creates and validates JWTs. Next.js stores the JWT in an HttpOnly
cookie and forwards it to FastAPI as a bearer token. FastAPI remains
responsible for checking authentication and record ownership.

## Features

- Account registration and login
- HttpOnly authentication cookie
- Protected workout and routine pages
- Create, view, edit, and delete workouts
- Create, view, edit, and delete routines
- Many-to-many workout/routine relationship
- User ownership checks on protected records
- Request validation and typed API responses

## Project structure

```text
.
├── fastapi/
│   ├── api/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── routines.py
│   │   │   └── workouts.py
│   │   ├── database.py
│   │   ├── deps.py
│   │   ├── main.py
│   │   └── models.py
│   └── requirements.txt
└── nextjs/
    ├── app/
    │   ├── actions/
    │   ├── components/
    │   ├── lib/
    │   ├── login/
    │   ├── register/
    │   ├── routines/
    │   └── workouts/
    └── package.json
```

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/CaptainSparrow23/Repbook.git
cd Repbook
```

### 2. Set up FastAPI

Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the Python dependencies:

```bash
pip install -r fastapi/requirements.txt
```

Create `fastapi/.env`:

```env
AUTH_SECRET_KEY=replace-with-a-long-random-secret
AUTH_ALGORITHM=HS256
```

You can generate a secret with:

```bash
openssl rand -hex 32
```

Start the API:

```bash
cd fastapi
../.venv/bin/python -m uvicorn api.main:app --reload
```

FastAPI will run at `http://localhost:8000`. Interactive API documentation is
available at `http://localhost:8000/docs`.

### 3. Set up Next.js

In another terminal:

```bash
cd nextjs
npm install
```

Create `nextjs/.env.local`:

```env
FASTAPI_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## API routes

### Authentication

```text
POST /auth/         Register a user
POST /auth/token    Log in and receive a JWT
GET  /auth/me       Get the authenticated user
```

### Workouts

```text
GET    /workouts/               List the user's workouts
POST   /workouts/               Create a workout
GET    /workouts/{workout_id}   Get a workout
PUT    /workouts/{workout_id}   Update a workout
DELETE /workouts/{workout_id}   Delete a workout
```

### Routines

```text
GET    /routines/               List the user's routines
POST   /routines/               Create a routine
GET    /routines/{routine_id}   Get a routine
PUT    /routines/{routine_id}   Update a routine
DELETE /routines/{routine_id}   Delete a routine
```

## Checks

Run the frontend checks from `nextjs/`:

```bash
npm run lint
npm run build
```

## Notes

This is a learning project rather than a production-ready authentication
system. A production deployment would typically add PostgreSQL, Alembic
migrations, HTTPS, rate limiting, refresh/session management, and automated
test coverage.
