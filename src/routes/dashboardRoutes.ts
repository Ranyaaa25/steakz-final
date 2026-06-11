import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { branchFilter, canSeeAllBranches, roleLabel } from "../lib/access.js";
import { requireLogin } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const where = user.role === "customer" ? { userId: user.id } : branchFilter(user);
  const inventoryWhere = user.role === "customer" ? { branchId: -1 } : branchFilter(user);

  const [menuCount, orderCount, inventory, userCount, reservationCount, orders, reservations, sales, users, branchRecords, allOrders] = await Promise.all([
    prisma.menuItem.count(),
    prisma.order.count({ where }),
    prisma.inventory.findMany({ where: inventoryWhere, orderBy: { quantity: "asc" } }),
    canSeeAllBranches(user) ? prisma.user.count() : prisma.user.count({ where: { branchId: user.branchId || -1 } }),
    prisma.reservation.count({ where }),
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 6, include: { items: { include: { menuItem: true } } } }),
    prisma.reservation.findMany({ where, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.order.aggregate({ where, _sum: { total: true } }),
    prisma.user.findMany({
      where: canSeeAllBranches(user) ? { role: { in: ["manager", "chef", "waiter"] } } : { branchId: user.branchId || -1 },
      orderBy: [{ role: "asc" }, { name: "asc" }],
      take: canSeeAllBranches(user) ? 12 : 20,
    }),
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.order.findMany({ where, include: { items: { include: { menuItem: true } } } }),
  ]);

  const lowStock = inventory.filter((item) => item.quantity <= item.reorderLevel || !item.available);
  const branchSales = branchRecords
    .filter((branch) => canSeeAllBranches(user) || branch.id === user.branchId)
    .map((branch) => {
      const branchOrders = allOrders.filter((order) => order.branchId === branch.id);
      return {
        branch: branch.name,
        orders: branchOrders.length,
        sales: branchOrders.reduce((sum, order) => sum + order.total, 0),
      };
    });

  const dishTotals = new Map<string, { quantity: number; sales: number; imageUrl: string }>();
  for (const order of allOrders) {
    for (const item of order.items) {
      const current = dishTotals.get(item.menuItem.name) || { quantity: 0, sales: 0, imageUrl: item.menuItem.imageUrl };
      current.quantity += item.quantity;
      current.sales += item.quantity * item.price;
      dishTotals.set(item.menuItem.name, current);
    }
  }

  const topDishes = [...dishTotals.entries()]
    .map(([name, totals]) => ({ name, ...totals }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  res.render("dashboard", {
    title: `${roleLabel(user.role)} Dashboard`,
    menuCount,
    orderCount,
    inventoryCount: inventory.length,
    lowStockCount: lowStock.length,
    userCount,
    reservationCount,
    salesTotal: sales._sum.total || 0,
    orders,
    reservations,
    lowStock,
    branchSales,
    topDishes,
    staffList: users,
  });
});

export default router;
