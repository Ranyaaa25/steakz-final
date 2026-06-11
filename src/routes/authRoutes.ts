import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { londonBranches } from "../lib/branches.js";
import { requireLogin } from "../middleware/auth.js";

const router = Router();

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  branch: string | null;
  branchId: number | null;
};

function serializeUser(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch,
    branchId: user.branchId,
  };
}

function createLabToken(user: AuthUser) {
  return Buffer.from(JSON.stringify(serializeUser(user)), "utf8").toString("base64url");
}

router.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const sessionUser = serializeUser(user);
  req.session.user = sessionUser;

  if (user.role === "customer" && user.branch) {
    const preferredBranch = await prisma.branch.findUnique({ where: { name: user.branch } });
    if (preferredBranch) {
      req.session.selectedBranch = preferredBranch.name;
      req.session.selectedBranchId = preferredBranch.id;
    }
  }

  return res.json({ user: sessionUser, token: createLabToken(user) });
});

router.post("/api/auth/register", async (req, res) => {
  const { name, email, phone, password, branch } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    branch?: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "An account already exists with that email." });
  }

  const preferredBranch = branch ? await prisma.branch.findUnique({ where: { name: branch } }) : null;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "customer",
      branch: preferredBranch?.name || branch || null,
      branchId: preferredBranch?.id || null,
    },
  });

  const sessionUser = serializeUser(user);
  req.session.user = sessionUser;
  if (preferredBranch) {
    req.session.selectedBranch = preferredBranch.name;
    req.session.selectedBranchId = preferredBranch.id;
  }

  return res.status(201).json({
    user: {
      ...sessionUser,
      phone,
    },
    token: createLabToken(user),
  });
});

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", async (req, res) => {
  const [featuredDishes, branches] = await Promise.all([
    prisma.menuItem.findMany({ where: { available: true, category: "Premium Steaks" }, take: 4, orderBy: { price: "desc" } }),
    prisma.branch.findMany({ orderBy: { name: "asc" }, take: 3 }),
  ]);
  res.render("home", { title: "Home", featuredDishes, branches });
});

router.get("/branches", async (req, res) => {
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
  res.render("branches", {
    title: "London Branches",
    branches,
    selectedBranch: req.session.selectedBranch,
  });
});

router.get("/branches/:slug", async (req, res) => {
  const branch = await prisma.branch.findUnique({ where: { slug: String(req.params.slug) } });
  if (!branch) {
    return res.status(404).render("404", {
      title: "Branch Not Found",
      message: "The Steakz branch you requested was not found.",
    });
  }

  res.render("branch-detail", {
    title: branch.name,
    branch: { ...branch, image: branch.imageUrl, galleryImages: branch.gallery.split("|") },
    reviews: await prisma.review.findMany({
      where: { branchId: branch.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { customer: true },
    }),
    selectedBranch: req.session.selectedBranch,
  });
});

router.post("/branches/:slug/select", requireLogin, async (req, res) => {
  const branch = await prisma.branch.findUnique({ where: { slug: String(req.params.slug) } });
  if (!branch) {
    req.flash("error", "Please choose a valid branch.");
    return res.redirect("/branches");
  }

  if (req.session.selectedBranch !== branch.name) {
    req.session.basket = [];
    await prisma.cartItem.deleteMany({ where: { userId: req.session.user!.id } });
  }
  req.session.selectedBranch = branch.name;
  req.session.selectedBranchId = branch.id;
  req.flash("success", `${branch.name} selected.`);
  res.redirect("/customer-menu");
});

router.get("/customer-menu", async (req, res) => {
  const customerMenu = await prisma.menuItem.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const categoryOrder = ["Starters", "Premium Steaks", "Burgers", "Sides", "Sauces", "Desserts", "Soft Drinks", "Juices", "Mocktails", "Hot Drinks"];
  const categories = categoryOrder.filter((category) => customerMenu.some((item) => item.category === category));

  res.render("customer-menu", {
    title: "Steakhouse Menu",
    customerMenu,
    categories,
    selectedBranch: req.session.selectedBranch,
  });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Create Customer Account", branches: londonBranches });
});

router.post("/register", async (req, res) => {
  const existing = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (existing) {
    req.flash("error", "An account already exists with that email.");
    return res.redirect("/register");
  }

  const preferredBranch = req.body.branch ? await prisma.branch.findUnique({ where: { name: req.body.branch } }) : null;
  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      role: "customer",
      branch: preferredBranch?.name || null,
      branchId: null,
    },
  });

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch,
    branchId: user.branchId,
  };
  if (preferredBranch) {
    req.session.selectedBranch = preferredBranch.name;
    req.session.selectedBranchId = preferredBranch.id;
  }

  res.redirect("/branches");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch,
    branchId: user.branchId,
  };

  if (user.role === "customer") {
    const preferredBranch = user.branch ? await prisma.branch.findUnique({ where: { name: user.branch } }) : null;
    if (preferredBranch) {
      req.session.selectedBranch = preferredBranch.name;
      req.session.selectedBranchId = preferredBranch.id;
    }
    return res.redirect("/branches");
  }

  res.redirect("/dashboard");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

export default router;
