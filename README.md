# Steakz Premium Restaurant MIS

Steakz is a premium London steakhouse website and restaurant management system. It includes customer registration, branch selection, database-backed basket/order persistence, reservations with table assignment, inventory, menu availability, reviews, and strict branch-based staff access.

## Recommended Run From A Fresh VS Code Window

Open the `frontend/` folder, then run:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

This starts the real Express/Prisma Steakz app automatically on `localhost:3000`, then serves it through Vite on `localhost:5173`. The frontend no longer redirects to a dead `localhost:3000` port.

If `5173` is already in use, run:

```bash
npm run dev:clean
```

That safely kills the old process on port `5173`, then starts Steakz again on the same URL. The frontend is configured with a strict port so it will not silently move to `5174`.

## Backend-Only Run

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

## Project Structure

```text
steakz.final/
  frontend/
  src/
  prisma/
  public/
  README.md
```

The root `src/`, `prisma/`, and `public/` folders are the real backend/MIS app. The `frontend/` folder is a Vite launcher/proxy for your usual workflow.

Build and type-check:

```bash
npx tsc --noEmit
npm run build
```

## Branch Separation Rules

- Head Office/Admin can see all branches, users, orders, reservations, inventory, and reports.
- Branch managers can see and manage only their own branch.
- Chefs can see only orders for their own branch and can update kitchen statuses.
- Waiters can see only their own branch orders/reservations and can update service statuses.
- Customers can register themselves, choose a branch, order from that branch, and see only their own orders/reservations.
- Orders, reservations, inventory, staff users, reviews, and cart items are stored with branch IDs where applicable.

## Customer Registration

Customers are unlimited and self-register from:

```text
http://localhost:3000/register
```

Customer passwords are not displayed on the website. After registration, customers log in with their own email/password, choose a branch, add items to basket, submit orders, create reservations, and leave reviews after completed orders/reservations.

## Seeded Staff Login Accounts

These accounts are seeded for testing and are documented here only, not displayed on the website.

### Head Office

```text
admin@steakz.com / admin123
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

## Branches

- Mayfair Prime Steakhouse
- Soho Flame Grill
- Kensington Steak Room
- Canary Wharf Grill House
- Covent Garden Steakhouse

## Key Workflows

- Customer order: register/login -> choose branch -> menu -> add to basket -> basket -> submit order -> My Orders.
- Branch order security: Mayfair orders appear to Mayfair manager/chefs/waiters and Head Office only.
- Reservations: customer creates reservation -> branch staff/admin see it -> manager/admin/waiter assigns table and status.
- Inventory: manager/admin can use stock, add stock, set quantity, and mark items available/unavailable. Quantity never goes below zero.
- Menu: manager/admin can mark dishes available/unavailable. Unavailable items cannot be added to customer basket.
