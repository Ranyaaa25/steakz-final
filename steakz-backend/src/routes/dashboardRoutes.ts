import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { branchFilter, canSeeAllBranches, roleLabel } from "../lib/access.js";
import { requireLogin } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const where = user.role === "customer" ? { userId: user.id } : branchFilter(user);

  const [menuCount, orderCount, inventoryCount, userCount, reservationCount, orders, lowStock] = await Promise.all([
    prisma.menuItem.count(),
    prisma.order.count({ where }),
    user.role === "customer" ? 0 : prisma.inventory.count({ where: branchFilter(user) }),
    canSeeAllBranches(user)
      ? prisma.user.count()
      : prisma.user.count({ where: { branch: user.branch || "" } }),
    prisma.reservation.count({ where }),
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.inventory.findMany({
      where: user.role === "customer" ? { branch: "__customer_no_inventory__" } : branchFilter(user),
      orderBy: { quantity: "asc" },
      take: 5,
    }),
  ]);

  const sales = await prisma.order.aggregate({
    where,
    _sum: { total: true },
  });

  res.render("dashboard", {
    title: `${roleLabel(user.role)} Dashboard`,
    menuCount,
    orderCount,
    inventoryCount,
    userCount,
    reservationCount,
    salesTotal: sales._sum.total || 0,
    orders,
    lowStock,
  });
});

export default router;
