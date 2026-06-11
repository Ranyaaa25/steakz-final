import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { branchFilter, canManageUsers, canSeeAllBranches } from "../lib/access.js";
import { defaultBranch, londonBranches } from "../lib/branches.js";
import { requireLogin, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/menu", requireLogin, async (req, res) => {
  if (req.session.user!.role === "customer") {
    return res.redirect("/customer-menu");
  }
  const items = await prisma.menuItem.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
  const menuMedia: Record<string, { image: string; description: string; tag: string }> = {
    "Dry-Aged Ribeye Steak": {
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
      description: "300g dry-aged ribeye with garlic rosemary butter, triple-cooked chips, tomatoes, salad, and peppercorn sauce.",
      tag: "Signature",
    },
    "Prime Fillet Mignon": {
      image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80",
      description: "Tender centre-cut fillet with dauphinoise potatoes, broccoli, shallots, and red wine jus.",
      tag: "Premium Cut",
    },
    "Chargrilled Sirloin": {
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=80",
      description: "280g sirloin with skin-on fries, charred mushrooms, asparagus, steak glaze, and rocket salad.",
      tag: "Grill Classic",
    },
    "Steakz House Burger": {
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
      description: "Double beef patty, smoked cheddar, brioche bun, salad, pickles, house sauce, fries, and coleslaw.",
      tag: "House Favorite",
    },
    "Garlic Butter Prawns": {
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80",
      description: "King prawns with garlic parsley butter, lemon, sourdough, chilli flakes, and leaf garnish.",
      tag: "Starter",
    },
    "New York Cheesecake": {
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
      description: "Vanilla cheesecake, biscuit base, berry compote, strawberries, whipped cream, and mint garnish.",
      tag: "Dessert",
    },
  };
  const displayItems = items.filter((item) => menuMedia[item.name]);

  res.render("menu", { title: "Menu Items", items, displayItems: displayItems.length ? displayItems : items, menuMedia });
});

router.post("/menu", requireRole(["head_office", "manager"]), async (req, res) => {
  await prisma.menuItem.create({
    data: {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      available: req.body.available === "on",
    },
  });
  req.flash("success", "Menu item added.");
  res.redirect("/menu");
});

router.post("/menu/:id/delete", requireRole(["head_office", "manager"]), async (req, res) => {
  await prisma.menuItem.delete({ where: { id: Number(req.params.id) } });
  req.flash("success", "Menu item deleted.");
  res.redirect("/menu");
});

router.get("/orders", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const where = user.role === "customer" ? { userId: user.id } : branchFilter(user);
  const [orders, menuItems] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, include: { items: true } }),
    prisma.menuItem.findMany({ where: { available: true }, orderBy: { name: "asc" } }),
  ]);
  res.render("orders", { title: "Orders / Sales", orders, menuItems, branches: londonBranches });
});

router.post("/orders", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const menuItem = await prisma.menuItem.findUnique({ where: { id: Number(req.body.menuItemId) } });

  if (!menuItem) {
    req.flash("error", "Menu item not found.");
    return res.redirect("/orders");
  }

  const quantity = Number(req.body.quantity);
  const branch = canSeeAllBranches(user) || user.role === "customer" ? req.body.branch : user.branch || defaultBranch;
  await prisma.order.create({
    data: {
      customer: user.role === "customer" ? user.name : req.body.customer,
      branch,
      status: req.body.status,
      total: menuItem.price * quantity,
      userId: user.id,
      items: {
        create: [{ menuItemId: menuItem.id, quantity, price: menuItem.price }],
      },
    },
  });

  req.flash("success", "Order added.");
  res.redirect("/orders");
});

router.get("/inventory", requireLogin, async (req, res) => {
  const user = req.session.user!;
  if (user.role === "customer") {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "Customers cannot view inventory.",
    });
  }
  const where = branchFilter(user);
  const items = await prisma.inventory.findMany({ where, orderBy: { itemName: "asc" } });
  res.render("inventory", { title: "Inventory", items, branches: londonBranches });
});

router.post("/inventory", requireRole(["head_office", "manager"]), async (req, res) => {
  const user = req.session.user!;
  await prisma.inventory.create({
    data: {
      itemName: req.body.itemName,
      branch: canSeeAllBranches(user) ? req.body.branch : user.branch || defaultBranch,
      quantity: Number(req.body.quantity),
      reorderLevel: Number(req.body.reorderLevel),
      supplier: req.body.supplier,
    },
  });
  req.flash("success", "Inventory item added.");
  res.redirect("/inventory");
});

router.post("/inventory/:id/use", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const item = await prisma.inventory.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) return res.redirect("/inventory");
  if (!canSeeAllBranches(user) && item.branch !== user.branch) {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "You cannot update stock from another branch.",
    });
  }

  await prisma.inventory.update({
    where: { id: item.id },
    data: { quantity: Math.max(0, item.quantity - Number(req.body.used)) },
  });

  req.flash("success", "Stock usage recorded.");
  res.redirect("/inventory");
});

router.get("/users", requireLogin, async (req, res) => {
  const user = req.session.user!;
  if (!canManageUsers(user)) {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "You do not have permission to manage users.",
    });
  }
  const users = await prisma.user.findMany({
    where: canSeeAllBranches(user) ? {} : { branch: user.branch || "" },
    orderBy: { name: "asc" },
  });
  res.render("users", { title: "Staff / Users", users, branches: londonBranches });
});

router.post("/users", requireLogin, async (req, res) => {
  const user = req.session.user!;
  if (!canManageUsers(user)) {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "You do not have permission to add users.",
    });
  }
  const allowedRoles = canSeeAllBranches(user) ? ["head_office", "manager", "chef", "waiter", "customer"] : ["chef", "waiter", "customer"];
  const role = allowedRoles.includes(req.body.role) ? req.body.role : allowedRoles[0];
  const branch = canSeeAllBranches(user) ? req.body.branch || null : user.branch || null;
  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      role,
      branch,
    },
  });
  req.flash("success", "User added.");
  res.redirect("/users");
});

router.post("/users/:id/delete", requireLogin, async (req, res) => {
  const user = req.session.user!;
  if (!canManageUsers(user)) {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "You do not have permission to delete users.",
    });
  }
  const target = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!target || (!canSeeAllBranches(user) && target.branch !== user.branch)) {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "You cannot delete users from another branch.",
    });
  }
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  req.flash("success", "User deleted.");
  res.redirect("/users");
});

router.get("/reports", requireRole(["head_office", "manager"]), async (req, res) => {
  const user = req.session.user!;
  const where = branchFilter(user);
  const orders = await prisma.order.findMany({ where });
  const inventory = await prisma.inventory.findMany({ where });
  const menuItems = await prisma.menuItem.findMany();
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = inventory.filter((item) => item.quantity <= item.reorderLevel);
  const visibleBranches = canSeeAllBranches(user) ? londonBranches : [user.branch || defaultBranch];
  const branches = visibleBranches.map((branch) => ({
    branch,
    orders: orders.filter((order) => order.branch === branch).length,
    sales: orders.filter((order) => order.branch === branch).reduce((sum, order) => sum + order.total, 0),
  }));

  res.render("reports", {
    title: "Reports",
    totalSales,
    orderCount: orders.length,
    lowStock,
    branches,
    menuItems,
  });
});

router.get("/reservations", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const where = user.role === "customer" ? { userId: user.id } : branchFilter(user);
  const reservations = await prisma.reservation.findMany({ where, orderBy: { createdAt: "desc" } });
  res.render("reservations", { title: "Reservations", reservations, branches: londonBranches });
});

router.post("/reservations", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const branch = user.role === "customer" || canSeeAllBranches(user) ? req.body.branch : user.branch || defaultBranch;
  await prisma.reservation.create({
    data: {
      customer: user.role === "customer" ? user.name : req.body.customer,
      email: user.role === "customer" ? user.email : req.body.email,
      phone: req.body.phone,
      branch,
      guests: Number(req.body.guests),
      date: req.body.date,
      time: req.body.time,
      status: req.body.status || "Requested",
      userId: user.id,
    },
  });
  req.flash("success", "Reservation saved.");
  res.redirect("/reservations");
});

export default router;
