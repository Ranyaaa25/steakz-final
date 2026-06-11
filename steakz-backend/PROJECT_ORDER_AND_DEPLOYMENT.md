# Steakz Project Order And Deployment

## Open The Project

Use this folder order:

1. `steakz-backend`
   - Open this folder alone in VS Code for the Express + Prisma backend.
   - Routes are in `src/routes`.
   - Role and branch rules are in `src/lib/access.ts`.
   - Seed users, branches, menu, orders, and reservations are in `src/lib/seed.ts`.

2. `steakz-frontend`
   - Open this folder alone in VS Code for the React + Vite frontend.
   - Public customer pages and dashboard pages are in `src/pages`.
   - API helpers are in `src/lib/api.ts`.

3. `steakz.final`
   - Open this only when you want the whole submission.
   - Old `backend` and `frontend` folders are hidden by `.vscode/settings.json`.

## Local Run Order

Backend:

```bash
cd steakz-backend
npm install
npx prisma db push
npm run seed
npm run dev
```

Frontend:

```bash
cd steakz-frontend
npm install
npm run dev
```

## Required Checks

From `steakz-backend`:

```bash
npx prisma db push
npm run seed
npx tsc --noEmit
npm run build
```

From `steakz-frontend`:

```bash
npm run build
```

## Branch Access Rules

- Customer orders and reservations are saved to exactly one branch.
- Other branches cannot see that branch's orders or reservations.
- A branch manager can see only his branch information.
- Chefs can see only kitchen/order information for their branch.
- Waiters can create and view orders only for their branch.
- Customers can see only their own orders and reservations.
- Head office can see all four London branches.

## Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| Head Office | admin@steakz.com | admin123 |
| Mayfair Manager | manager.mayfair-prime@steakz.com | MayfairManager123 |
| Mayfair Chef 1 | chef1.mayfair-prime@steakz.com | MayfairChefOne123 |
| Mayfair Chef 2 | chef2.mayfair-prime@steakz.com | MayfairChefTwo123 |
| Mayfair Waiter 1 | waiter1.mayfair-prime@steakz.com | MayfairWaiterOne123 |
| Mayfair Waiter 2 | waiter2.mayfair-prime@steakz.com | MayfairWaiterTwo123 |
| Soho Manager | manager.soho-flame@steakz.com | SohoManager123 |
| Soho Chef 1 | chef1.soho-flame@steakz.com | SohoChefOne123 |
| Soho Chef 2 | chef2.soho-flame@steakz.com | SohoChefTwo123 |
| Soho Waiter 1 | waiter1.soho-flame@steakz.com | SohoWaiterOne123 |
| Soho Waiter 2 | waiter2.soho-flame@steakz.com | SohoWaiterTwo123 |
| Kensington Manager | manager.kensington-steak-room@steakz.com | KensingtonManager123 |
| Kensington Chef 1 | chef1.kensington-steak-room@steakz.com | KensingtonChefOne123 |
| Kensington Chef 2 | chef2.kensington-steak-room@steakz.com | KensingtonChefTwo123 |
| Kensington Waiter 1 | waiter1.kensington-steak-room@steakz.com | KensingtonWaiterOne123 |
| Kensington Waiter 2 | waiter2.kensington-steak-room@steakz.com | KensingtonWaiterTwo123 |
| Canary Wharf Manager | manager.canary-wharf-grill@steakz.com | CanaryManager123 |
| Canary Wharf Chef 1 | chef1.canary-wharf-grill@steakz.com | CanaryChefOne123 |
| Canary Wharf Chef 2 | chef2.canary-wharf-grill@steakz.com | CanaryChefTwo123 |
| Canary Wharf Waiter 1 | waiter1.canary-wharf-grill@steakz.com | CanaryWaiterOne123 |
| Canary Wharf Waiter 2 | waiter2.canary-wharf-grill@steakz.com | CanaryWaiterTwo123 |
| Mayfair Customer | customer.mayfair-prime@example.com | MayfairCustomer123 |
| Soho Customer | customer.soho-flame@example.com | SohoCustomer123 |
| Kensington Customer | customer.kensington-steak-room@example.com | KensingtonCustomer123 |
| Canary Wharf Customer | customer.canary-wharf-grill@example.com | CanaryCustomer123 |

## GitHub Clone Command

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd steakz.final
```

## Deployment Notes

The professor's Gemini example is for Vercel, Render, and Neon. For this submission, keep the same order:

1. Push the final code to GitHub.
2. Deploy the backend from `steakz-backend`.
3. Deploy the frontend from `steakz-frontend`.
4. Set the frontend environment variable `VITE_API_URL` to the deployed backend API URL.

If the backend is migrated from SQLite to Neon PostgreSQL, update `prisma/schema.prisma`, set `DATABASE_URL`, run Prisma migration/push, then seed the database.
