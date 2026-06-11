# Simple Test Checklist

After running the backend setup, test these features at `http://localhost:3000/home`.

## Login

1. Login as Head Office: `admin@steakz.com` / `admin123`.
2. Login as Mayfair Manager: `manager.mayfair-prime@steakz.com` / `MayfairManager123`.
3. Login as Mayfair Chef: `chef1.mayfair-prime@steakz.com` / `MayfairChefOne123`.
4. Login as Mayfair Waiter: `waiter1.mayfair-prime@steakz.com` / `MayfairWaiterOne123`.
5. Login as Customer: `customer.mayfair-prime@example.com` / `MayfairCustomer123`.

## Head Office

1. Open the head office dashboard.
2. Confirm all four London branches are visible.
3. Open menu, orders, inventory, users, reservations, and reports.
4. Confirm head office can see all branches.

## Branch Manager

1. Open a branch manager dashboard.
2. Confirm only that manager's branch data appears.
3. Check branch orders and reservations.
4. Confirm other branches are not visible.

## Chef

1. Open the chef dashboard.
2. Confirm kitchen/order data is limited to the chef's branch.
3. Confirm chef cannot manage all users or all branches.

## Waiter

1. Open the waiter dashboard.
2. Create or view an order for the waiter branch.
3. Confirm other branches' orders are not visible.

## Customer

1. Register or login before ordering.
2. Choose a London branch.
3. Add steakhouse menu items to basket.
4. Submit the order.
5. Confirm the order belongs only to the selected branch.
6. Make a reservation and confirm it belongs to one branch.

## Screenshot Pages

- Home page
- Login page
- Register page
- Customer menu page
- Basket/cart page
- My orders page
- Reservations page
- Branch manager dashboard
- Chef dashboard
- Waiter dashboard
- Head office dashboard
