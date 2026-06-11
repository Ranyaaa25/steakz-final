import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { londonBranches } from "../lib/branches.js";

const router = Router();

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  branch: string | null;
  branchId?: number | null;
};

function serializeUser(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch,
    branchId: user.branchId ?? null,
  };
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
  return res.json({ user: sessionUser });
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

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "customer",
      branch: branch || null,
    },
  });

  const sessionUser = serializeUser(user);
  req.session.user = sessionUser;
  return res.status(201).json({
    user: {
      ...sessionUser,
      phone,
    },
  });
});

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  res.render("home", { title: "Home" });
});

router.get("/home", (req, res) => {
  res.render("home", { title: "Home" });
});

router.get("/customer-menu", (req, res) => {
  const customerMenu = [
    {
      name: "Dry-Aged Ribeye Steak",
      category: "Signature Steaks",
      price: 34.95,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
      description: "A rich, marbled ribeye grilled over high heat and rested with herb butter.",
      plate: [
        "300g dry-aged ribeye steak",
        "Garlic and rosemary butter",
        "Triple-cooked chips",
        "Grilled vine tomatoes",
        "Watercress salad",
        "Peppercorn sauce",
      ],
    },
    {
      name: "Prime Fillet Mignon",
      category: "Signature Steaks",
      price: 39.50,
      image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80",
      description: "A tender centre-cut fillet cooked to order with a polished steakhouse finish.",
      plate: [
        "220g fillet mignon",
        "Dauphinoise potatoes",
        "Sauteed tenderstem broccoli",
        "Roasted shallots",
        "Red wine jus",
        "Sea salt flakes",
      ],
    },
    {
      name: "Chargrilled Sirloin",
      category: "Grill",
      price: 29.75,
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=80",
      description: "Classic sirloin with a deep grill crust and clean beef flavour.",
      plate: [
        "280g sirloin steak",
        "Skin-on fries",
        "Charred mushrooms",
        "Grilled asparagus",
        "House steak glaze",
        "Rocket and parmesan salad",
      ],
    },
    {
      name: "Steakz House Burger",
      category: "Burgers",
      price: 16.95,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
      description: "A steakhouse burger made with ground beef, smoked cheese, and house sauce.",
      plate: [
        "Double beef patty",
        "Smoked cheddar",
        "Brioche bun",
        "Lettuce, tomato, pickles, and onion",
        "Steakz burger sauce",
        "Fries and coleslaw",
      ],
    },
    {
      name: "Garlic Butter Prawns",
      category: "Starters",
      price: 13.50,
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80",
      description: "Pan-seared prawns with garlic butter, lemon, and fresh herbs.",
      plate: [
        "King prawns",
        "Garlic and parsley butter",
        "Lemon wedge",
        "Toasted sourdough",
        "Chilli flakes",
        "Mixed leaf garnish",
      ],
    },
    {
      name: "BBQ Beef Short Rib",
      category: "Slow Cooked",
      price: 31.95,
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80",
      description: "Slow-cooked beef short rib finished with a smoky barbecue glaze.",
      plate: [
        "Beef short rib",
        "Smoky barbecue glaze",
        "Buttery mashed potatoes",
        "Roasted carrots",
        "Crispy onions",
        "Beef gravy",
      ],
    },
    {
      name: "Grilled Chicken Supreme",
      category: "Chicken",
      price: 22.95,
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80",
      description: "Chargrilled chicken breast with steakhouse sides and creamy sauce.",
      plate: [
        "Grilled chicken breast",
        "Creamy mushroom sauce",
        "Herb roasted potatoes",
        "Seasonal vegetables",
        "Crispy shallots",
        "Mixed herb garnish",
      ],
    },
    {
      name: "New York Cheesecake",
      category: "Desserts",
      price: 8.75,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
      description: "A classic chilled cheesecake with berry compote.",
      plate: [
        "Vanilla cheesecake slice",
        "Digestive biscuit base",
        "Berry compote",
        "Fresh strawberries",
        "Whipped cream",
        "Mint garnish",
      ],
    },
  ];

  res.render("customer-menu", { title: "Steakhouse Menu", customerMenu });
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

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      role: "customer",
      branch: req.body.branch,
    },
  });

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch,
  };

  res.redirect("/reservations");
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
  };

  res.redirect("/dashboard");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
