import { Router, type Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { branchFilter, canManageUsers, canSeeAllBranches } from "../lib/access.js";
import { requireLogin, requireRole } from "../middleware/auth.js";

const router = Router();

async function getBasketView(req: Request) {
  const user = req.session.user;
  const cartItems = user?.role === "customer"
    ? await prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { menuItem: true },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  const items = cartItems.map((cartItem) => {
    const subtotal = cartItem.menuItem.price * cartItem.quantity;
    return { menuItemId: cartItem.menuItemId, quantity: cartItem.quantity, menuItem: cartItem.menuItem, subtotal };
  });

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const serviceCharge = total * 0.125;
  const vat = total * 0.2;
  const finalTotal = total + serviceCharge + vat;
  return { items, subtotal: total, serviceCharge, vat, finalTotal, total: finalTotal };
}

router.get("/menu", requireLogin, async (req, res) => {
  if (req.session.user!.role === "customer") {
    return res.redirect("/customer-menu");
  }
  const items = await prisma.menuItem.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
  const displayItems = items;

  res.render("menu", { title: "Menu Items", items, displayItems });
});

router.post("/menu", requireRole(["head_office", "manager"]), async (req, res) => {
  await prisma.menuItem.create({
    data: {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
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

router.post("/menu/:id/availability", requireRole(["head_office", "manager"]), async (req, res) => {
  await prisma.menuItem.update({
    where: { id: Number(req.params.id) },
    data: { available: req.body.available === "true" },
  });
  req.flash("success", "Menu availability updated.");
  res.redirect("/menu");
});

router.get("/orders", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const where = user.role === "customer" ? { userId: user.id } : branchFilter(user);
  const [orders, menuItems] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, include: { items: { include: { menuItem: true } } } }),
    prisma.menuItem.findMany({ where: { available: true }, orderBy: { name: "asc" } }),
  ]);
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
  res.render("orders", { title: user.role === "customer" ? "My Orders" : "Orders / Sales", orders, menuItems, branches });
});

router.post("/orders", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const menuItem = await prisma.menuItem.findUnique({ where: { id: Number(req.body.menuItemId) } });

  if (!menuItem) {
    req.flash("error", "Menu item not found.");
    return res.redirect("/orders");
  }

  const quantity = Number(req.body.quantity);
  if (user.role === "customer" && !req.session.selectedBranchId) {
    req.flash("error", "Please choose a branch before ordering.");
    return res.redirect("/branches");
  }

  const branchRecord = user.role === "customer"
    ? await prisma.branch.findUnique({ where: { id: req.session.selectedBranchId || -1 } })
    : canSeeAllBranches(user)
      ? await prisma.branch.findUnique({ where: { id: Number(req.body.branchId) } })
      : await prisma.branch.findUnique({ where: { id: user.branchId || -1 } });
  if (!branchRecord) {
    req.flash("error", "Please choose a valid branch.");
    return res.redirect("/orders");
  }
  const subtotal = menuItem.price * quantity;
  const serviceCharge = subtotal * 0.125;
  const vat = subtotal * 0.2;
  await prisma.order.create({
    data: {
      customer: user.role === "customer" ? user.name : req.body.customer,
      branch: branchRecord.name,
      branchId: branchRecord.id,
      status: user.role === "customer" ? "Pending" : req.body.status,
      subtotal,
      serviceCharge,
      vat,
      total: subtotal + serviceCharge + vat,
      userId: user.id,
      items: {
        create: [{ menuItemId: menuItem.id, quantity, price: menuItem.price }],
      },
    },
  });

  req.flash("success", "Order added.");
  res.redirect("/orders");
});

router.post("/orders/:id/status", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
  if (!order || (!canSeeAllBranches(user) && order.branchId !== user.branchId)) {
    return res.status(403).render("404", { title: "Access Denied", message: "You cannot update another branch order." });
  }

  const requestedStatus = String(req.body.status);
  const allowed = user.role === "chef"
    ? ["Pending", "Preparing", "Ready"]
    : user.role === "waiter"
      ? ["Pending", "Preparing", "Ready", "Served"]
      : ["Pending", "Preparing", "Ready", "Served", "Completed", "Cancelled"];

  if (!allowed.includes(requestedStatus)) {
    req.flash("error", "That status is not available for your role.");
    return res.redirect("/orders");
  }

  await prisma.order.update({ where: { id: order.id }, data: { status: requestedStatus } });
  req.flash("success", "Order status updated.");
  res.redirect("/orders");
});

router.post("/basket/add", requireLogin, async (req, res) => {
  const user = req.session.user!;
  if (user.role !== "customer") {
    req.flash("error", "Only customers can use the basket.");
    return res.redirect("/menu");
  }

  const branch = req.session.selectedBranch;
  if (!branch || !req.session.selectedBranchId) {
    req.flash("error", "Please choose a branch before ordering.");
    return res.redirect("/branches");
  }

  const menuItemId = Number(req.body.menuItemId);
  const quantity = Math.max(1, Number(req.body.quantity) || 1);
  const menuItem = await prisma.menuItem.findFirst({ where: { id: menuItemId, available: true } });
  if (!menuItem) {
    req.flash("error", "Menu item not found.");
    return res.redirect("/customer-menu");
  }

  await prisma.cartItem.upsert({
    where: {
      userId_menuItemId_branchId: {
        userId: user.id,
        menuItemId,
        branchId: req.session.selectedBranchId,
      },
    },
    update: { quantity: { increment: quantity } },
    create: {
      userId: user.id,
      menuItemId,
      branchId: req.session.selectedBranchId,
      quantity,
    },
  });
  req.flash("success", `${menuItem.name} added to basket.`);
  res.redirect("/basket");
});

router.get("/basket", requireLogin, async (req, res) => {
  const user = req.session.user!;
  if (user.role !== "customer") {
    return res.redirect("/orders");
  }

  const basket = await getBasketView(req);
  res.render("basket", {
    title: "Basket",
    selectedBranch: req.session.selectedBranch,
    basketItems: basket.items,
    basketSubtotal: basket.subtotal,
    serviceCharge: basket.serviceCharge,
    vat: basket.vat,
    basketTotal: basket.finalTotal,
  });
});

router.post("/basket/:menuItemId/increment", requireLogin, async (req, res) => {
  const user = req.session.user!;
  await prisma.cartItem.updateMany({
    where: { userId: user.id, menuItemId: Number(req.params.menuItemId) },
    data: { quantity: { increment: 1 } },
  });
  res.redirect("/basket");
});

router.post("/basket/:menuItemId/decrement", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const item = await prisma.cartItem.findFirst({ where: { userId: user.id, menuItemId: Number(req.params.menuItemId) } });
  if (item && item.quantity > 1) {
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: item.quantity - 1 } });
  } else if (item) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  }
  res.redirect("/basket");
});

router.post("/basket/:menuItemId/remove", requireLogin, async (req, res) => {
  const user = req.session.user!;
  await prisma.cartItem.deleteMany({ where: { userId: user.id, menuItemId: Number(req.params.menuItemId) } });
  req.flash("success", "Item removed from basket.");
  res.redirect("/basket");
});

router.post("/basket/submit", requireLogin, async (req, res) => {
  const user = req.session.user!;
  if (user.role !== "customer") {
    req.flash("error", "Only customers can submit basket orders.");
    return res.redirect("/orders");
  }

  const branch = req.session.selectedBranch;
  if (!branch || !req.session.selectedBranchId) {
    req.flash("error", "Please choose a branch before ordering.");
    return res.redirect("/branches");
  }

  const basket = await getBasketView(req);
  if (!basket.items.length) {
    req.flash("error", "Your basket is empty.");
    return res.redirect("/basket");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        customer: user.name,
        branch,
        branchId: req.session.selectedBranchId,
        status: "Pending",
        subtotal: basket.subtotal,
        serviceCharge: basket.serviceCharge,
        vat: basket.vat,
        total: basket.finalTotal,
        userId: user.id,
        items: {
          create: basket.items.map((item) => ({
            menuItemId: item.menuItem.id,
            quantity: item.quantity,
            price: item.menuItem.price,
          })),
        },
      },
    });
    await tx.cartItem.deleteMany({ where: { userId: user.id } });
  });

  req.flash("success", "Order submitted successfully.");
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
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
  res.render("inventory", { title: "Inventory", items, branches });
});

router.post("/inventory", requireRole(["head_office", "manager"]), async (req, res) => {
  const user = req.session.user!;
  const branchRecord = canSeeAllBranches(user)
    ? await prisma.branch.findUnique({ where: { id: Number(req.body.branchId) } })
    : await prisma.branch.findUnique({ where: { id: user.branchId || -1 } });
  if (!branchRecord) {
    req.flash("error", "Please choose a valid branch.");
    return res.redirect("/inventory");
  }
  await prisma.inventory.create({
    data: {
      itemName: req.body.itemName,
      branch: branchRecord.name,
      branchId: branchRecord.id,
      quantity: Math.max(0, Number(req.body.quantity) || 0),
      reorderLevel: Math.max(0, Number(req.body.reorderLevel) || 0),
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
  if (!canSeeAllBranches(user) && item.branchId !== user.branchId) {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "You cannot update stock from another branch.",
    });
  }

  const quantity = Math.max(0, item.quantity - Math.max(0, Number(req.body.used) || 0));
  await prisma.inventory.update({
    where: { id: item.id },
    data: {
      quantity,
      available: quantity > 0 ? item.available : false,
    },
  });

  req.flash("success", "Stock usage recorded.");
  res.redirect("/inventory");
});

router.post("/inventory/:id/add", requireRole(["head_office", "manager"]), async (req, res) => {
  const user = req.session.user!;
  const item = await prisma.inventory.findUnique({ where: { id: Number(req.params.id) } });
  if (!item || (!canSeeAllBranches(user) && item.branchId !== user.branchId)) {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "You cannot update stock from another branch.",
    });
  }

  const currentQuantity = item.available ? item.quantity : 0;
  await prisma.inventory.update({
    where: { id: item.id },
    data: {
      quantity: currentQuantity + Math.max(0, Number(req.body.added) || 0),
      available: true,
    },
  });
  req.flash("success", "Stock added.");
  res.redirect("/inventory");
});

router.post("/inventory/:id/set", requireRole(["head_office", "manager"]), async (req, res) => {
  const user = req.session.user!;
  const item = await prisma.inventory.findUnique({ where: { id: Number(req.params.id) } });
  if (!item || (!canSeeAllBranches(user) && item.branchId !== user.branchId)) {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "You cannot update stock from another branch.",
    });
  }

  const quantity = Math.max(0, Number(req.body.quantity) || 0);
  await prisma.inventory.update({
    where: { id: item.id },
    data: { quantity, available: quantity > 0 ? item.available : false },
  });
  req.flash("success", "Stock quantity updated.");
  res.redirect("/inventory");
});

router.post("/inventory/:id/availability", requireRole(["head_office", "manager"]), async (req, res) => {
  const user = req.session.user!;
  const item = await prisma.inventory.findUnique({ where: { id: Number(req.params.id) } });
  if (!item || (!canSeeAllBranches(user) && item.branchId !== user.branchId)) {
    return res.status(403).render("404", {
      title: "Access Denied",
      message: "You cannot update stock from another branch.",
    });
  }

  const available = req.body.available === "true";
  await prisma.inventory.update({
    where: { id: item.id },
    data: available
      ? { available: item.quantity > 0 }
      : { available: false, quantity: 0 },
  });
  req.flash("success", "Inventory availability updated.");
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
    where: canSeeAllBranches(user) ? {} : { branchId: user.branchId || -1 },
    orderBy: { name: "asc" },
  });
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
  res.render("users", { title: "Staff / Users", users, branches });
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
  const branchRecord = canSeeAllBranches(user) && req.body.branchId
    ? await prisma.branch.findUnique({ where: { id: Number(req.body.branchId) } })
    : user.branchId
      ? await prisma.branch.findUnique({ where: { id: user.branchId } })
      : null;
  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      role,
      branch: branchRecord?.name || null,
      branchId: branchRecord?.id || null,
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
  if (!target || (!canSeeAllBranches(user) && target.branchId !== user.branchId)) {
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
  const lowStock = inventory.filter((item) => item.quantity <= item.reorderLevel || !item.available);
  const visibleBranches = canSeeAllBranches(user)
    ? await prisma.branch.findMany({ orderBy: { name: "asc" } })
    : await prisma.branch.findMany({ where: { id: user.branchId || -1 } });
  const branches = visibleBranches.map((branch) => ({
    branch: branch.name,
    orders: orders.filter((order) => order.branchId === branch.id).length,
    sales: orders.filter((order) => order.branchId === branch.id).reduce((sum, order) => sum + order.total, 0),
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
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
  res.render("reservations", { title: "Reservations", reservations, branches });
});

router.post("/reservations", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const branchRecord = user.role === "customer" || canSeeAllBranches(user)
    ? await prisma.branch.findUnique({ where: { id: Number(req.body.branchId) } })
    : await prisma.branch.findUnique({ where: { id: user.branchId || -1 } });
  if (!branchRecord) {
    req.flash("error", "Please choose a valid branch.");
    return res.redirect("/reservations");
  }
  await prisma.reservation.create({
    data: {
      customer: user.role === "customer" ? user.name : req.body.customer,
      email: user.role === "customer" ? user.email : req.body.email,
      phone: req.body.phone,
      branch: branchRecord.name,
      branchId: branchRecord.id,
      guests: Number(req.body.guests),
      date: req.body.date,
      time: req.body.time,
      notes: req.body.notes || "",
      tableNumber: req.body.tableNumber || "",
      status: req.body.status || "requested",
      userId: user.id,
    },
  });
  req.flash("success", "Reservation saved.");
  res.redirect("/reservations");
});

router.post("/reservations/:id/update", requireLogin, async (req, res) => {
  const user = req.session.user!;
  const reservation = await prisma.reservation.findUnique({ where: { id: Number(req.params.id) } });
  if (!reservation || (!canSeeAllBranches(user) && reservation.branchId !== user.branchId)) {
    return res.status(403).render("404", { title: "Access Denied", message: "You cannot update another branch reservation." });
  }
  if (!["head_office", "manager", "waiter"].includes(user.role)) {
    return res.status(403).render("404", { title: "Access Denied", message: "Only managers, waiters, and head office can assign tables." });
  }
  const status = String(req.body.status);
  const allowedStatuses = ["requested", "confirmed", "seated", "completed", "cancelled"];
  await prisma.reservation.update({
    where: { id: reservation.id },
    data: {
      tableNumber: req.body.tableNumber || "",
      status: allowedStatuses.includes(status) ? status : reservation.status,
    },
  });
  req.flash("success", "Reservation updated.");
  res.redirect("/reservations");
});

router.post("/reviews", requireLogin, async (req, res) => {
  const user = req.session.user!;
  if (user.role !== "customer") {
    req.flash("error", "Only customers can leave reviews.");
    return res.redirect("/dashboard");
  }

  const rating = Math.min(5, Math.max(1, Number(req.body.rating) || 5));
  const orderId = req.body.orderId ? Number(req.body.orderId) : undefined;
  const reservationId = req.body.reservationId ? Number(req.body.reservationId) : undefined;
  const order = orderId ? await prisma.order.findUnique({ where: { id: orderId } }) : null;
  const reservation = reservationId ? await prisma.reservation.findUnique({ where: { id: reservationId } }) : null;

  if (order && (order.userId !== user.id || !["Served", "Completed"].includes(order.status))) {
    req.flash("error", "You can only review your completed orders.");
    return res.redirect("/orders");
  }
  if (reservation && (reservation.userId !== user.id || reservation.status !== "completed")) {
    req.flash("error", "You can only review your completed reservations.");
    return res.redirect("/reservations");
  }

  const branchId = order?.branchId || reservation?.branchId || req.session.selectedBranchId;
  if (!branchId) {
    req.flash("error", "Review needs a branch.");
    return res.redirect("/branches");
  }

  await prisma.review.create({
    data: {
      rating,
      comment: req.body.comment || "",
      customerId: user.id,
      branchId,
      orderId,
      reservationId,
    },
  });
  req.flash("success", "Review submitted.");
  res.redirect(order ? "/orders" : "/reservations");
});

export default router;
