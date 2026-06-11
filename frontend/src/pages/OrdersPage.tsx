import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { api, type Order } from "../lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Orders & Sales</h2>
          <p>Track customer orders and sales status.</p>
        </div>
        <button>New Order</button>
      </div>
      <DataTable<Order>
        rows={orders}
        columns={[
          { key: "customer", label: "Customer" },
          { key: "branch", label: "Branch" },
          { key: "total", label: "Total" },
          { key: "status", label: "Status" },
          { key: "created_at", label: "Date" }
        ]}
      />
    </section>
  );
}
