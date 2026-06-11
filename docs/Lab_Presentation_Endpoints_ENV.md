# Steakz MIS Lab Demonstration Endpoints

## Postman Workspace And Collection

- Workspace name: `Steakz MIS Lab Demonstration`
- Collection name: `Steakz MIS API Endpoints`
- Collection file: `docs/Steakz_MIS_API_Endpoints.postman_collection.json`
- Environment file: `docs/Steakz_MIS_API_Endpoints.postman_environment.json`

## Environment Variables

| Variable | Example value | Purpose |
|---|---:|---|
| `baseUrl` | `http://localhost:4000` | Root URL for the local lab server |
| `token` | `paste_login_token_here` | General token variable |
| `adminToken` | `paste_admin_token_here` | Saved from admin login |
| `managerToken` | `paste_manager_token_here` | Saved from branch manager login |
| `chefToken` | `paste_chef_token_here` | Saved from chef login |
| `cashierToken` | `paste_cashier_token_here` | Saved from waiter/cashier login |
| `customerToken` | `paste_customer_token_here` | Saved from customer login |
| `branchId` | `1` | Existing Mayfair branch ID for demos |
| `otherBranchId` | `2` | Another branch ID for denied access tests |
| `menuItemId` | `1` | Existing menu item ID |
| `orderId` | `1` | Existing order ID |
| `inventoryItemId` | `1` | Existing inventory item ID |
| `userId` | `1` | Existing user ID for update/delete demos |

If you run the app on the default Express port, either change `baseUrl` to `http://localhost:3000` or start the app with:

```bash
PORT=4000 npm run start:dev
```

## Role Mapping

The current Steakz MIS uses these real roles:

| Lab wording | Real Steakz role |
|---|---|
| Admin | `head_office` |
| Headquarter Manager | `head_office` |
| Branch Manager | `manager` |
| Chef | `chef` |
| Cashier | `waiter` |
| Customer | `customer` |

## Minimum Endpoint Demonstration List

| Folder | Method | Endpoint | Body example | Required role | Expected result |
|---|---|---|---|---|---|
| Auth | POST | `/api/auth/login` | `{ "email": "admin@steakz.com", "password": "admin123" }` | Public | Returns user and token; saves `adminToken` |
| Auth | POST | `/api/auth/login` | `{ "email": "manager.mayfair@steakz.com", "password": "MayfairManager123" }` | Public | Returns manager token |
| Auth | POST | `/api/auth/login` | `{ "email": "chef1.mayfair@steakz.com", "password": "MayfairChef1123" }` | Public | Returns chef token |
| Auth | POST | `/api/auth/login` | `{ "email": "waiter1.mayfair@steakz.com", "password": "MayfairWaiter1123" }` | Public | Returns cashier/waiter token |
| Auth | POST | `/api/auth/register` | `{ "name": "Test Customer", "email": "test.customer@steakz.test", "password": "Password123" }` | Public | Creates customer and returns token |
| Branches | GET | `/api/lab/branches` | None | Admin/head office/manager | Returns branches visible to role |
| Branches | POST | `/api/lab/branches` | `{ "name": "Lab Demo Steakhouse", "slug": "lab-demo-steakhouse" }` | Admin/head office | Creates branch |
| Branches | PUT | `/api/lab/branches/{{branchId}}` | `{ "phone": "020 7000 1111" }` | Admin/head office | Updates branch |
| Branches | DELETE | `/api/lab/branches/{{branchId}}` | None | Admin/head office | Deletes branch |
| Users | GET | `/api/lab/users` | None | Admin/head office/manager | Lists permitted users |
| Users | POST | `/api/lab/users` | `{ "name": "Lab Demo Waiter", "email": "lab.waiter@steakz.test", "role": "waiter", "branchId": 1 }` | Admin/head office/manager | Creates staff user |
| Users | PUT | `/api/lab/users/{{userId}}` | `{ "name": "Updated Lab Demo Waiter" }` | Admin/head office/manager | Updates user |
| Users | DELETE | `/api/lab/users/{{userId}}` | None | Admin/head office/manager | Deletes user |
| Inventory | GET | `/api/lab/inventory` | None | Admin/head office/manager/chef/waiter | Lists role-scoped inventory |
| Inventory | POST | `/api/lab/inventory` | `{ "branchId": 1, "itemName": "Ribeye Steak Stock", "quantity": 25, "reorderLevel": 10, "supplier": "London Prime Butchers" }` | Admin/head office/manager | Creates stock item |
| Inventory | PUT | `/api/lab/inventory/{{inventoryItemId}}` | `{ "quantity": 30, "reorderLevel": 12 }` | Admin/head office/manager | Updates stock item |
| Inventory | PUT | `/api/lab/inventory/{{inventoryItemId}}/use` | `{ "quantity": 2 }` | Admin/head office/manager/chef/waiter | Decreases stock, never below zero |
| Inventory | PUT | `/api/lab/inventory/{{inventoryItemId}}/add-stock` | `{ "quantity": 5 }` | Admin/head office/manager | Adds stock |
| Inventory | DELETE | `/api/lab/inventory/{{inventoryItemId}}` | None | Admin/head office/manager | Deletes stock item |
| Orders | GET | `/api/lab/orders` | None | All roles | Returns scoped orders |
| Orders | POST | `/api/lab/orders` | `{ "branchId": 1, "customerName": "Walk-in Customer", "items": [{ "menuItemId": 1, "quantity": 2 }], "status": "Pending" }` | Admin/head office/manager/waiter/customer | Creates order |
| Orders | GET | `/api/lab/orders/{{orderId}}` | None | Owner branch/customer/admin | Returns single order |
| Orders | PUT | `/api/lab/orders/{{orderId}}/status` | `{ "status": "Preparing" }` | Admin/head office/manager/chef/waiter | Updates order status |
| Orders | DELETE | `/api/lab/orders/{{orderId}}` | None | Admin/head office/manager | Deletes order |
| Sales | GET | `/api/lab/sales` | None | Admin/head office/manager/waiter | Returns branch-scoped sales |
| Reports | GET | `/api/lab/reports/dashboard` | None | Admin/head office/manager | Returns dashboard totals |
| Reports | GET | `/api/lab/reports/branch/{{branchId}}` | None | Admin/head office/own manager | Returns branch report |
| Reports | GET | `/api/lab/reports/sales` | None | Admin/head office/manager | Returns sales report |
| Reports | GET | `/api/lab/reports/inventory` | None | Admin/head office/manager | Returns inventory report |
| Reports | GET | `/api/lab/reports/low-stock` | None | Admin/head office/manager | Returns low stock report |

## Required Role Access Tests

| Test | Token | Endpoint | Expected result |
|---|---|---|---|
| Admin can access all orders | `adminToken` | `GET /api/lab/orders` | `200 OK` |
| Mayfair manager can access own branch orders | `managerToken` | `GET /api/lab/orders` | `200 OK` |
| Mayfair chef can access own branch inventory | `chefToken` | `GET /api/lab/inventory` | `200 OK` |
| Mayfair cashier can access own branch sales | `cashierToken` | `GET /api/lab/sales` | `200 OK` |
| Customer can access own orders | `customerToken` | `GET /api/lab/orders` | `200 OK` |
| Manager cannot access another branch report | `managerToken` | `GET /api/lab/reports/branch/{{otherBranchId}}` | `403 Forbidden` |
| Chef cannot mutate another branch stock | `chefToken` | `PUT /api/lab/inventory/{{inventoryItemId}}/use` with another branch item | `403 Forbidden` |
| Customer cannot access users list | `customerToken` | `GET /api/lab/users` | `403 Forbidden` |

## Screenshot Checklist

Take screenshots for the lab demonstration:

1. Imported workspace/environment showing all variables.
2. Admin login response showing `user.role` and `token`.
3. Branch manager login response showing branch data.
4. Customer registration response.
5. GET branches as admin.
6. POST create inventory item.
7. PUT use stock showing quantity decreases.
8. PUT add stock showing quantity increases.
9. POST create walk-in order.
10. PUT order status to `Preparing`.
11. GET orders as Mayfair manager.
12. GET orders as customer.
13. GET dashboard report.
14. Role access denial: customer cannot access users.
15. Role access denial: manager cannot access another branch report.

## Final Testing Notes

Run the Auth folder first so tokens are saved. Then run each folder in order.

Expected outcomes:

- Login works for all seeded roles.
- Tokens save into the environment variables.
- POST requests create real Prisma database records.
- PUT requests update real Prisma database records.
- DELETE requests remove records.
- GET requests return role-specific data.
- Branch isolation returns only the correct branch data.
- Unauthorised access returns `401` or `403`.
