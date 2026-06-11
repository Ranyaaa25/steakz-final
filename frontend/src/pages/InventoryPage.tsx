import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { api, type InventoryItem } from "../lib/api";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    api.getInventory().then(setInventory);
  }, []);

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Inventory</h2>
          <p>Monitor ingredients and stock levels.</p>
        </div>
        <button>Add Stock</button>
      </div>
      <DataTable<InventoryItem>
        rows={inventory}
        columns={[
          { key: "name", label: "Item" },
          { key: "branch", label: "Branch" },
          { key: "quantity", label: "Quantity" },
          { key: "unit", label: "Unit" },
          { key: "reorder_level", label: "Reorder Level" }
        ]}
      />
    </section>
  );
}
