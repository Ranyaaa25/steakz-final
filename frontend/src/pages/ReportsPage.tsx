import { useEffect, useState } from "react";
import { api, type Report } from "../lib/api";

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    api.getReports().then(setReport);
  }, []);

  if (!report) return <p>Loading reports...</p>;

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Reports</h2>
          <p>Simple restaurant performance summary.</p>
        </div>
      </div>

      <div className="stats-grid">
        <article>
          <span>Total Sales</span>
          <strong>£{report.totalSales}</strong>
        </article>
        <article>
          <span>Total Orders</span>
          <strong>{report.totalOrders}</strong>
        </article>
        <article>
          <span>Low Stock Items</span>
          <strong>{report.lowStock}</strong>
        </article>
        <article>
          <span>Top Item</span>
          <strong>{report.topItem}</strong>
        </article>
      </div>
    </section>
  );
}
