# Steakz Premium Restaurant MIS

This repository's real Steakz application is the root Express/Pug MIS portal:

```text
src/server.ts
src/routes/
src/views/
public/
prisma/
```

Use the root project for local running and production deployment. Do **not** deploy the separate React/Vite folder in `frontend/` as the live Steakz website.

## Production Deployment

The main live website should run on Render from the root project.

Render settings:

```text
Root Directory: .
Build Command: npm install && npm run build
Start Command: npm start
```

Required environment variables on Render:

```text
DATABASE_URL=<your Neon PostgreSQL connection string>
SESSION_SECRET=<a strong random secret>
NODE_ENV=production
```

The Prisma datasource is PostgreSQL and reads `DATABASE_URL`, so Neon is the production database.

After first deploy or after schema changes, run:

```bash
npx prisma db push
npm run seed
```

Open the live Render app, not the Vercel React frontend:

```text
https://steakz-final.onrender.com/home
https://steakz-final.onrender.com/login
```

## Local Run

From the root `steakz.final/` folder:

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

## Build And Checks

From the root folder:

```bash
npx tsc --noEmit
npm run build
```

## About The `frontend/` Folder

The `frontend/` folder is not the production Steakz website. It must not replace the root Express/Pug MIS portal on deployment.

Only use `frontend/` for local experiments or as a helper if it is made identical to the root Pug app. The deployed customer/staff experience should come from Render serving the root project.

## Branch Separation Rules

- Head Office/Admin can see all branches, users, orders, reservations, inventory, and reports.
- Branch managers can see and manage only their own branch.
- Chefs can see only orders for their own branch and can update kitchen statuses.
- Waiters can see only their own branch orders/reservations and can update service statuses.
- Customers can register themselves, choose a branch, order from that branch, and see only their own orders/reservations.
- Orders, reservations, inventory, staff users, reviews, and cart items are stored with branch IDs where applicable.

## Customer Registration

Customers register from:

```text
/register
```

Customers then log in at:

```text
/login
```

Passwords are never displayed on the website.

## Seeded Login Accounts

These accounts are seeded for testing and are documented here only.

### Head Office

```text
admin@steakz.com / admin123
```

### Customer

```text
customer@steakz.com / customer123
```

### Mayfair Prime Steakhouse

```text
manager.mayfair@steakz.com / MayfairManager123
chef1.mayfair@steakz.com / MayfairChef1123
chef2.mayfair@steakz.com / MayfairChef2123
waiter1.mayfair@steakz.com / MayfairWaiter1123
waiter2.mayfair@steakz.com / MayfairWaiter2123
```

### Soho Flame Grill

```text
manager.soho@steakz.com / SohoManager123
chef1.soho@steakz.com / SohoChef1123
chef2.soho@steakz.com / SohoChef2123
waiter1.soho@steakz.com / SohoWaiter1123
waiter2.soho@steakz.com / SohoWaiter2123
```

### Kensington Steak Room

```text
manager.kensington@steakz.com / KensingtonManager123
chef1.kensington@steakz.com / KensingtonChef1123
chef2.kensington@steakz.com / KensingtonChef2123
waiter1.kensington@steakz.com / KensingtonWaiter1123
waiter2.kensington@steakz.com / KensingtonWaiter2123
```

### Canary Wharf Grill House

```text
manager.canary@steakz.com / CanaryManager123
chef1.canary@steakz.com / CanaryChef1123
chef2.canary@steakz.com / CanaryChef2123
waiter1.canary@steakz.com / CanaryWaiter1123
waiter2.canary@steakz.com / CanaryWaiter2123
```

### Covent Garden Steakhouse

```text
manager.covent@steakz.com / CoventManager123
chef1.covent@steakz.com / CoventChef1123
chef2.covent@steakz.com / CoventChef2123
waiter1.covent@steakz.com / CoventWaiter1123
waiter2.covent@steakz.com / CoventWaiter2123
```

## Main Workflows

- Customer order: register/login -> choose branch -> menu -> add to basket -> basket -> submit order -> My Orders.
- Branch order security: orders appear to the correct branch manager/chefs/waiters and Head Office only.
- Reservations: customer creates reservation -> branch staff/admin see it -> manager/admin/waiter assigns table and status.
- Inventory: manager/admin can use stock, add stock, set quantity, and mark items available/unavailable.
- Menu: manager/admin can mark dishes available/unavailable.
