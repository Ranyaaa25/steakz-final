import type { Role } from "../lib/api";

type Props = {
  role: Role;
};

const textByRole = {
  head_office: "Full access to all London branches, users, reports, inventory, menu, and sales.",
  manager: "Manage only your branch operations, inventory, reports, menu, and orders.",
  chef: "View kitchen and order information only for your own branch.",
  waiter: "Create and view orders only for your own branch.",
  customer: "View your own orders and reservations."
};

export default function Dashboard({ role }: Props) {
  return (
    <section>
      <div className="page-header">
        <div>
          <h2>{role.replace("_", " ").toUpperCase()} Dashboard</h2>
          <p>{textByRole[role]}</p>
        </div>
      </div>

      <div className="stats-grid">
        <article>
          <span>Today Sales</span>
          <strong>£1,840</strong>
        </article>
        <article>
          <span>Orders</span>
          <strong>86</strong>
        </article>
        <article>
          <span>Menu Items</span>
          <strong>24</strong>
        </article>
        <article>
          <span>Low Stock</span>
          <strong>1</strong>
        </article>
      </div>
    </section>
  );
}
