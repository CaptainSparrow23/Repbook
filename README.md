# Repbook
#### Video Demo:  https://youtu.be/NIzPJolw0Rk
#### Description:

Repbook is a simple workout tracker. After creating an account and logging in, a user can save workouts (for example "Barbell squat", with optional notes on sets and reps) and group them into routines (for example "Leg day"). One workout can be part of several routines. Workouts and routines can be edited and deleted, and each user only ever sees their own.

The project has two parts: a backend API written in Python with FastAPI, which stores everything in a SQLite database, and a frontend written in TypeScript with Next.js and React. The browser only talks to Next.js, and Next.js talks to the API on the user's behalf.

#### How it works

When a user logs in, FastAPI checks their password against a stored bcrypt hash and returns a JSON Web Token (JWT), a signed token that proves who they are. Next.js keeps this token in an HttpOnly cookie, which JavaScript in the browser can't read, and sends it to FastAPI with every request. The token expires after 20 minutes.

Forms use Next.js Server Actions, which are functions that run on the server when a form is submitted. They send the data to FastAPI, show any error message on the form, and refresh the page so the new data appears straight away. On the backend, every request checks that the workout or routine being read or changed belongs to the logged-in user.

#### Files

**Backend (`fastapi/`)**

- `api/main.py` creates the FastAPI app, creates the database tables on first start and connects the routers.
- `api/database.py` sets up the connection to the SQLite database (`fastapi_project.db`) using SQLAlchemy.
- `api/models.py` defines the `User`, `Workout` and `Routine` tables, plus a linking table so one workout can belong to many routines.
- `api/deps.py` holds shared helpers: one opens a database session for each request, and one reads the logged-in user from the token.
- `api/routers/auth.py` handles registering, logging in and returning the current user.
- `api/routers/workouts.py` and `api/routers/routines.py` handle listing, creating, updating and deleting workouts and routines, only for the user who owns them.
- `requirements.txt` lists the Python packages the backend needs.

**Next.js server code (`nextjs/app/actions/` and `nextjs/app/lib/`)**

- `actions/auth.ts` contains the login, register and logout actions, and sets or deletes the login cookie.
- `actions/workouts.ts` and `actions/routines.ts` contain the create, update and delete actions. If the session has expired, they send the user back to the login page.
- `lib/api.ts` is a helper that calls FastAPI with the user's token attached.
- `lib/auth.ts` returns the logged-in user, or `null` if nobody is logged in.
- `lib/types.ts` defines the TypeScript types for workouts and routines.

**Pages and components (`nextjs/app/`)**

- `layout.tsx` is the root layout. It loads the styles and sets the page titles.
- `page.tsx` is the home page. It sends visitors to `/workouts` if they are logged in, or to `/login` if they aren't.
- `login/` and `register/` contain the login and sign-up pages and their forms.
- `(dashboard)/layout.tsx` is shared by the workouts and routines pages. It checks that the user is logged in and shows the navigation bar. The brackets in the folder name keep it out of the URL.
- `(dashboard)/workouts/page.tsx` and `(dashboard)/routines/page.tsx` load the user's data and show a form for adding a new item next to the list of saved ones.
- The `loading.tsx` and `error.tsx` files in those folders show a placeholder while a page loads, and an error screen with a "Try again" button if loading fails. The root `error.tsx` catches errors from the rest of the app, for example when the API isn't running.
- `components/WorkoutForm.tsx` and `components/RoutineForm.tsx` are the forms for adding workouts and routines. The routine form shows a checkbox for each workout.
- `components/WorkoutEditor.tsx` and `components/RoutineEditor.tsx` show each saved item as a card that expands into an edit form with a delete button.
- `components/DashboardNav.tsx` is the header, with the navigation links, the username and a logout button.
- `components/NavLink.tsx` is a navigation link that scrolls back to the top of the page when switching between workouts and routines.
- `components/SubmitButton.tsx` is a button that shows "Deleting..." while a delete is in progress.
- `globals.css` contains all of the app's styling.

`next.config.ts` tells Next.js which folder is the project root. The other config files in `nextjs/` are the defaults created by `create-next-app`.
