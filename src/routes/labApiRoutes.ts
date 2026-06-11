import { Router, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { branchFilter, canManageUsers, canSeeAllBranches } from "../lib/access.js";

type LabUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  branch: string | null;
  branchId: number | null;
};

type LabRequest = Request & { labUser?: LabUser };

const router = Router();

function decodeToken(token?: string): LabUser | null {
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as LabUser;
  } catch {
    return null;
  }
}

function requireLabLogin(req: LabRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
  const user = decodeToken(bearerToken || String(req.headers["x-lab-token"] || ""));
  if (!user) return res.status(401).json({ error: "Missing or invalid lab token." });
  req.labUser = user;
  next();
}

function requireLabRole(roles: string[]) {
  return (req: LabRequest, res: Response, next: NextFunction) => {
    if (!req.labUser || !roles.includes(req.labUser.role)) {
      return res.status(403).json({ error: "This role cannot perform this action." });
    }
    next();
  };
}

async function scopedBranch(req: LabRequest, requestedBranchId?: number) {
  const user = req.labUser!;
  if (canSeeAllBranches(user)) {
    return requestedBranchId
      ? prisma.branch.findUnique({ where: { id: requestedBranchId } })
      : null;
  }
  return prisma.branch.findUnique({ where: { id: user.branchId || -1 } });
}

router.use("/api/lab", requireLabLogin);

router.get("/api/lab/branches", async (req: LabRequest, res) => {
  const user = req.labUser!;
  const branches = await prisma.branch.findMany({
    where: canSeeAllBranches(user) ? {} : { id: user.branchId || -1 },
    orderBy: { name: "asc" },
  });
  res.json({ branches });
});

router.post("/api/lab/branches", requireLabRole(["head_office"]), async (req, res) => {
  const branch = await prisma.branch.create({
    data: {
      name: req.body.name,
      slug: req.body.slug,
      area: req.body.area,
      address: req.body.address,
      phone: req.body.phone,
      hours: req.body.hours || "Mon-Sun 12:00-23:00",
      imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
      gallery: req.body.gallery || "",
      description: req.body.description || "Steakz London branch.",
    },
  });
  res.status(201).json({ branch });
});

router.put("/api/lab/branches/:id", requireLabRole(["head_office"]), async (req, res) => {
  const branch = await prisma.branch.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json({ branch });
});

router.delete("/api/lab/branches/:id", requireLabRole(["head_office"]), async (req, res) => {
  await prisma.branch.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

router.get("/api/lab/users", async (req: LabRequest, res) => {
  const user = req.labUser!;
  if (!canManageUsers(user)) return res.status(403).json({ error: "This role cannot list users." });
  const users = await prisma.user.findMany({
    where: canSeeAllBranches(user) ? {} : { branchId: user.branchId || -1 },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, branch: true, branchId: true },
  });
  res.json({ users });
});

router.post("/api/lab/users", async (req: LabRequest, res) => {
  const user = req.labUser!;
  if (!canManageUsers(user)) return res.status(403).json({ error: "This role cannot create users." });
  const branch = await scopedBranch(req, Number(req.body.branchId));
  const created = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password || "Password123", 10),
      role: req.body.role,
      branch: branch?.name || null,
      branchId: branch?.id || null,
    },
    select: { id: true, name: true, email: true, role: true, branch: true, branchId: true },
  });
  res.status(201).json({ user: created });
});

router.put("/api/lab/users/:id", async (req: LabRequest, res) => {
  const user = req.labUser!;
  if (!canManageUsers(user)) return res.status(403).json({ error: "This role cannot update users." });
  const target = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!target || (!canSeeAllBranches(user) && target.branchId !== user.branchId)) return res.status(403).json({ error: "Cannot update another branch user." });
  const updated = await prisma.user.update({
    where: { id: target.id },
    data: { name: req.body.name, role: req.body.role },
    select: { id: true, name: true, email: true, role: true, branch: true, branchId: true },
  });
  res.json({ user: updated });
});

router.delete("/api/lab/users/:id", async (req: LabRequest, res) => {
  const user = req.labUser!;
  if (!canManageUsers(user)) return res.status(403).json({ error: "This role cannot delete users." });
  const target = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!target || (!canSeeAllBranches(user) && target.branchId !== user.branchId)) return res.status(403).json({ error: "Cannot delete another branch user." });
  await prisma.user.delete({ where: { id: target.id } });
  res.status(204).send();
});

router.get("/api/lab/inventory", async (req: LabRequest, res) => {
  const user = req.labUser!;
  if (user.role === "customer") return res.status(403).json({ error: "Customers cannot view inventory." });
  const inventory = await prisma.inventory.findMany({ where: branchFilter(user), orderBy: [{ branch: "asc" }, { itemName: "asc" }] });
  res.json({ inventory });
});

router.post("/api/lab/inventory", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const branch = await scopedBranch(req, Number(req.body.branchId));
  if (!branch) return res.status(400).json({ error: "Valid branchId is required." });
  const item = await prisma.inventory.create({
    data: {
      itemName: req.body.itemName,
      branch: branch.name,
      branchId: branch.id,
      quantity: Math.max(0, Number(req.body.quantity) || 0),
      reorderLevel: Math.max(0, Number(req.body.reorderLevel) || 0),
      supplier: req.body.supplier,
      available: Number(req.body.quantity) > 0,
    },
  });
  res.status(201).json({ item });
});

router.put("/api/lab/inventory/:id", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const user = req.labUser!;
  const existing = await prisma.inventory.findUnique({ where: { id: Number(req.params.id) } });
  if (!existing || (!canSeeAllBranches(user) && existing.branchId !== user.branchId)) return res.status(403).json({ error: "Cannot update another branch inventory item." });
  const quantity = Math.max(0, Number(req.body.quantity ?? existing.quantity) || 0);
  const item = await prisma.inventory.update({
    where: { id: existing.id },
    data: {
      itemName: req.body.itemName ?? existing.itemName,
      quantity,
      reorderLevel: Math.max(0, Number(req.body.reorderLevel ?? existing.reorderLevel) || 0),
      supplier: req.body.supplier ?? existing.supplier,
      available: quantity > 0 && (req.body.available ?? existing.available),
    },
  });
  res.json({ item });
});

router.put("/api/lab/inventory/:id/use", async (req: LabRequest, res) => {
  const user = req.labUser!;
  if (user.role === "customer") return res.status(403).json({ error: "Customers cannot use stock." });
  const existing = await prisma.inventory.findUnique({ where: { id: Number(req.params.id) } });
  if (!existing || (!canSeeAllBranches(user) && existing.branchId !== user.branchId)) return res.status(403).json({ error: "Cannot use another branch stock." });
  const quantity = Math.max(0, existing.quantity - Math.max(0, Number(req.body.quantity) || 0));
  const item = await prisma.inventory.update({ where: { id: existing.id }, data: { quantity, available: quantity > 0 } });
  res.json({ item });
});

router.put("/api/lab/inventory/:id/add-stock", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const user = req.labUser!;
  const existing = await prisma.inventory.findUnique({ where: { id: Number(req.params.id) } });
  if (!existing || (!canSeeAllBranches(user) && existing.branchId !== user.branchId)) return res.status(403).json({ error: "Cannot add stock to another branch." });
  const item = await prisma.inventory.update({
    where: { id: existing.id },
    data: { quantity: Math.max(0, existing.quantity) + Math.max(0, Number(req.body.quantity) || 0), available: true },
  });
  res.json({ item });
});

router.delete("/api/lab/inventory/:id", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const user = req.labUser!;
  const existing = await prisma.inventory.findUnique({ where: { id: Number(req.params.id) } });
  if (!existing || (!canSeeAllBranches(user) && existing.branchId !== user.branchId)) return res.status(403).json({ error: "Cannot delete another branch inventory item." });
  await prisma.inventory.delete({ where: { id: existing.id } });
  res.status(204).send();
});

router.get("/api/lab/orders", async (req: LabRequest, res) => {
  const user = req.labUser!;
  const where = user.role === "customer" ? { userId: user.id } : branchFilter(user);
  const orders = await prisma.order.findMany({ where, include: { items: { include: { menuItem: true } } }, orderBy: { createdAt: "desc" } });
  res.json({ orders });
});

router.get("/api/lab/orders/:id", async (req: LabRequest, res) => {
  const user = req.labUser!;
  const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) }, include: { items: { include: { menuItem: true } } } });
  if (!order || (user.role === "customer" ? order.userId !== user.id : !canSeeAllBranches(user) && order.branchId !== user.branchId)) return res.status(403).json({ error: "Cannot view this order." });
  res.json({ order });
});

router.post("/api/lab/orders", async (req: LabRequest, res) => {
  const user = req.labUser!;
  const branch = await scopedBranch(req, Number(req.body.branchId));
  if (!branch) return res.status(400).json({ error: "Valid branchId is required." });
  const firstItem = req.body.items?.[0];
  const menuItem = await prisma.menuItem.findUnique({ where: { id: Number(firstItem?.menuItemId) } });
  if (!menuItem) return res.status(400).json({ error: "Valid menuItemId is required." });
  const quantity = Math.max(1, Number(firstItem.quantity) || 1);
  const subtotal = menuItem.price * quantity;
  const order = await prisma.order.create({
    data: {
      customer: user.role === "customer" ? user.name : req.body.customerName || "Walk-in Customer",
      branch: branch.name,
      branchId: branch.id,
      status: req.body.status || "Pending",
      subtotal,
      serviceCharge: subtotal * 0.125,
      vat: subtotal * 0.2,
      total: subtotal * 1.325,
      userId: user.id,
      items: { create: [{ menuItemId: menuItem.id, quantity, price: menuItem.price }] },
    },
    include: { items: true },
  });
  res.status(201).json({ order });
});

router.put("/api/lab/orders/:id/status", async (req: LabRequest, res) => {
  const user = req.labUser!;
  const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
  if (!order || (!canSeeAllBranches(user) && order.branchId !== user.branchId)) return res.status(403).json({ error: "Cannot update another branch order." });
  const updated = await prisma.order.update({ where: { id: order.id }, data: { status: req.body.status } });
  res.json({ order: updated });
});

router.delete("/api/lab/orders/:id", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const user = req.labUser!;
  const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
  if (!order || (!canSeeAllBranches(user) && order.branchId !== user.branchId)) return res.status(403).json({ error: "Cannot delete another branch order." });
  await prisma.order.delete({ where: { id: order.id } });
  res.status(204).send();
});

router.get("/api/lab/sales", async (req: LabRequest, res) => {
  const user = req.labUser!;
  if (user.role === "customer") return res.status(403).json({ error: "Customers cannot view sales." });
  const orders = await prisma.order.findMany({ where: branchFilter(user), orderBy: { createdAt: "desc" } });
  res.json({ sales: orders.map((order) => ({ orderId: order.id, branch: order.branch, total: order.total, createdAt: order.createdAt })) });
});

router.get("/api/lab/reports/dashboard", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const where = branchFilter(req.labUser!);
  const [orders, reservations, inventory, total] = await Promise.all([
    prisma.order.count({ where }),
    prisma.reservation.count({ where }),
    prisma.inventory.count({ where }),
    prisma.order.aggregate({ where, _sum: { total: true } }),
  ]);
  res.json({ report: { orders, reservations, inventory, totalSales: total._sum.total || 0 } });
});

router.get("/api/lab/reports/branch/:id", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const user = req.labUser!;
  const branchId = Number(req.params.id);
  if (!canSeeAllBranches(user) && user.branchId !== branchId) return res.status(403).json({ error: "Cannot view another branch report." });
  const where = { branchId };
  const [orders, reservations, total] = await Promise.all([
    prisma.order.count({ where }),
    prisma.reservation.count({ where }),
    prisma.order.aggregate({ where, _sum: { total: true } }),
  ]);
  res.json({ report: { branchId, orders, reservations, totalSales: total._sum.total || 0 } });
});

router.get("/api/lab/reports/sales", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const orders = await prisma.order.findMany({ where: branchFilter(req.labUser!), orderBy: { createdAt: "desc" } });
  res.json({ report: orders });
});

router.get("/api/lab/reports/inventory", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const inventory = await prisma.inventory.findMany({ where: branchFilter(req.labUser!), orderBy: { itemName: "asc" } });
  res.json({ report: inventory });
});

router.get("/api/lab/reports/low-stock", requireLabRole(["head_office", "manager"]), async (req: LabRequest, res) => {
  const inventory = await prisma.inventory.findMany({ where: branchFilter(req.labUser!), orderBy: { quantity: "asc" } });
  res.json({ report: inventory.filter((item) => item.quantity <= item.reorderLevel || !item.available) });
});

export default router;
