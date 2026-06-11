# Steakz Project Order And Deployment

## Canonical Project

The root project is the real Steakz application:

```text
steakz.final/
  src/server.ts
  src/routes/
  src/views/
  public/
  prisma/
  package.json
```

It is an Express + Prisma + Pug restaurant MIS portal. The root project is what should run locally and what should deploy to Render.

The separate `frontend/` folder is not the production website and should not replace the Render app.

## Local Run

From `steakz.final/`:

```bash
npm install
npx prisma db push
npm run seed
npm run start:dev
```

Open:

```text
http://localhost:3000/home
```

Login:

```text
http://localhost:3000/login
```

## Production Deployment

Deploy the root project to Render.

Render settings:

```text
Root Directory: .
Build Command: npm install && npm run build
Start Command: npm start
```

Environment variables:

```text
DATABASE_URL=<Neon PostgreSQL connection string>
SESSION_SECRET=<strong random secret>
NODE_ENV=production
```

After schema updates:

```bash
npx prisma db push
npm run seed
```

Live site:

```text
https://steakz-final.onrender.com/home
https://steakz-final.onrender.com/login
```

## Required Checks

From the root folder:

```bash
npx tsc --noEmit
npm run build
```

## Branch Access Rules

- Head Office/Admin can see every branch.
- Managers can see only their own branch.
- Chefs can see only orders for their own branch.
- Waiters can see only orders and reservations for their own branch.
- Customers can see only their own orders and reservations.
- Orders and reservations include branch data so one branch cannot see another branch's data.

## Deployment Rule

Do not deploy `frontend/` as the live Steakz site. If Vercel is connected to `frontend/`, disable it or ignore it. The real customer/staff website is Render serving the root Express/Pug project.
