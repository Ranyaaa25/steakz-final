# Steakz Restaurant System

Steakz is a steak restaurant management project with customer ordering, reservations, branch dashboards, and role-based access for four London branches.

## Folder Structure

Open the folders separately in VS Code when you want to work on one side only:

```text
steakz.final/
  steakz-backend/
  steakz-frontend/
```

The old `backend` and `frontend` folders are hidden when you open `steakz.final` because `.vscode/settings.json` excludes them from the Explorer and search.

## Backend

```bash
cd steakz-backend
npm install
npx prisma db push
npm run seed
npm run dev
```

Open:

```text
http://localhost:3000/home
```

Build and type-check:

```bash
npx tsc --noEmit
npm run build
```

## Frontend

```bash
cd steakz-frontend
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

Build:

```bash
npm run build
```

## Branch Access Rules

- Head office can see all branches.
- Branch managers can see only their own branch.
- Chefs can see only kitchen/order data for their own branch.
- Waiters can create and view orders for their own branch.
- Customers must login before ordering or reserving a table.
- Customers can see only their own orders and reservations.
- Orders and reservations always belong to one branch.

## London Branches

- Mayfair Prime Steakhouse
- Soho Flame Grill
- Kensington Steak Room
- Canary Wharf Grill House

## Demo Logins

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

## GitHub Clone

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd steakz.final
```
