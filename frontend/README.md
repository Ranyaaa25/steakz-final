# Steakz Frontend Launcher

This folder is the normal way to run the project in VS Code.

## Run From This Folder

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

If port `5173` is already in use, run:

```bash
npm run dev:clean
```

That safely kills the old Vite process on port `5173`, then starts Steakz again. The config uses a strict port so it does not silently switch to `5174`.

What happens:

- The script starts the real Steakz Express/Prisma app on `http://localhost:3000` if it is not already running.
- Vite starts on `http://localhost:5173`.
- Vite proxies Steakz pages, CSS, images, forms, and routes to the real app.
- The browser stays on `localhost:5173`, so you should not see `ERR_CONNECTION_REFUSED` from a dead redirect.

## If You Only Want Vite

```bash
npm run dev:vite
```

Use this only for debugging the launcher shell. The full Steakz app needs the backend.

## Build

```bash
npm run build
```

## Login Accounts

Seeded staff accounts are documented in the root `README.md`. Passwords are not displayed on the website.
