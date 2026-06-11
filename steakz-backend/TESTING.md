# Simple Test Checklist

After running `npm run setup` and `npm run dev`, test these features at `http://localhost:3000/home`.

## Login

1. Head Office: `admin@steakz.com` / `admin123`
2. Mayfair Manager: `manager.mayfair-prime@steakz.com` / `MayfairManager123`
3. Mayfair Chef: `chef1.mayfair-prime@steakz.com` / `MayfairChefOne123`
4. Mayfair Waiter: `waiter1.mayfair-prime@steakz.com` / `MayfairWaiterOne123`
5. Customer: `customer.mayfair-prime@example.com` / `MayfairCustomer123`

## Access Checks

- Head office sees all branches.
- Manager sees only one branch.
- Chef sees only kitchen/order data for one branch.
- Waiter creates/views orders for one branch.
- Customer sees only their own orders and reservations.
