import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { api, type MenuItem } from "../lib/api";

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    api.getMenuItems().then(setItems);
  }, []);

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Menu Items</h2>
          <p>Create, update, and review restaurant menu items.</p>
        </div>
        <button>Add Item</button>
      </div>
      <DataTable<MenuItem>
        rows={items}
        columns={[
          { key: "name", label: "Name" },
          { key: "category", label: "Category" },
          { key: "price", label: "Price" },
          { key: "status", label: "Status" }
        ]}
      />
    </section>
  );
}
