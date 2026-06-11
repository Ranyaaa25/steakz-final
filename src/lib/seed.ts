import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { branchAccounts, branchProfiles } from "./branches.js";

const prisma = new PrismaClient();

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
const localMenuImage = (name: string) =>
  `/images/menu/${name.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.jpg`;

const menuItems = [
  ["Starters", "Garlic Butter Prawns", "King prawns in garlic parsley butter with lemon, toasted sourdough, chilli, and dressed leaves.", 13.5, img("photo-1565680018434-b513d5e5fd47")],
  ["Starters", "Smoked Bone Marrow Toast", "Roasted bone marrow with parsley salad, sourdough toast, pickled shallots, and sea salt.", 12.25, img("photo-1504674900247-0877df9cc836")],
  ["Starters", "Burrata & Charred Tomato", "Creamy burrata with coal-roasted tomatoes, basil oil, aged balsamic, and toasted seeds.", 11.95, img("photo-1565299585323-38d6b0865b47")],
  ["Starters", "Crispy Calamari", "Lightly fried calamari with lemon aioli, chilli salt, parsley, and fresh lemon.", 10.95, img("photo-1599487488170-d11ec9c172f0")],
  ["Premium Steaks", "Dry-Aged Ribeye Steak", "300g dry-aged ribeye with rosemary butter, peppercorn sauce, triple-cooked chips, and vine tomatoes.", 34.95, img("photo-1546833999-b9f581a1996d")],
  ["Premium Steaks", "Prime Fillet Mignon", "Centre-cut fillet with dauphinoise potatoes, roasted shallots, tenderstem broccoli, and red wine jus.", 39.5, img("photo-1558030006-450675393462")],
  ["Premium Steaks", "Chargrilled Sirloin", "280g sirloin with skin-on fries, asparagus, charred mushrooms, rocket salad, and steak glaze.", 29.75, img("photo-1600891964092-4316c288032e")],
  ["Premium Steaks", "Porterhouse for One", "Large porterhouse grilled on the bone with roasted garlic, beef dripping chips, and bone marrow jus.", 42.95, img("photo-1504973960431-1c467e159aa4")],
  ["Premium Steaks", "T-Bone Flame Cut", "Flame-grilled T-bone with smoked sea salt, grilled onions, house fries, and classic bearnaise.", 41.5, img("photo-1615937657715-bc7b4b7962c1")],
  ["Premium Steaks", "Wagyu Rump Cap", "Rich rump cap with chimichurri, crispy potatoes, roasted peppers, and watercress.", 45.0, img("photo-1529692236671-f1f6cf9683ba")],
  ["Premium Steaks", "Black Pepper Striploin", "New York striploin crusted with black pepper, mash, greens, and brandy peppercorn sauce.", 32.95, img("photo-1612871689353-cccf05445eaf")],
  ["Premium Steaks", "Surf and Turf Fillet", "Fillet steak with garlic prawns, lobster butter, skinny fries, asparagus, and lemon.", 48.5, img("photo-1565299624946-b28f40a0ae38")],
  ["Burgers", "Steakz House Burger", "Double beef patty, smoked cheddar, pickles, house sauce, brioche bun, fries, and coleslaw.", 16.95, img("photo-1550547660-d9450f859349")],
  ["Burgers", "Truffle Steak Burger", "Steak mince patty with truffle mayo, gruyere, rocket, caramelised onion, and fries.", 18.95, img("photo-1568901346375-23c9450c58cd")],
  ["Sides", "Truffle Mac and Cheese", "Creamy macaroni with mature cheddar, truffle oil, crisp crumbs, and chives.", 7.95, img("photo-1543339494-b4cd4f7ba686")],
  ["Sides", "Creamed Spinach", "Classic creamed spinach with nutmeg, parmesan, toasted crumbs, and black pepper.", 6.5, img("photo-1546069901-ba9599a7e63c")],
  ["Sides", "Beef Dripping Chips", "Triple-cooked chips finished in beef dripping with smoked salt and roasted garlic aioli.", 5.95, img("photo-1573080496219-bb080dd4f877")],
  ["Sides", "Charred Hispi Cabbage", "Coal-roasted hispi with lemon butter, parmesan, toasted hazelnuts, and herbs.", 6.95, img("photo-1625944230945-1b7dd3b949ab")],
  ["Sides", "Grilled Field Mushrooms", "Garlic roasted mushrooms with thyme, parsley, and house steak glaze.", 6.25, img("photo-1504545102780-26774c1bb073")],
  ["Sauces", "Peppercorn Sauce", "Classic brandy peppercorn sauce for steak.", 3.25, img("photo-1472476443507-c7a5948772fc")],
  ["Sauces", "Bearnaise Sauce", "Tarragon bearnaise with a silky steakhouse finish.", 3.25, img("photo-1600891964599-f61ba0e24092")],
  ["Sauces", "Red Wine Jus", "Slow-reduced red wine jus with beef stock and shallots.", 3.5, img("photo-1565299507177-b0ac66763828")],
  ["Sauces", "Chimichurri", "Bright parsley, garlic, chilli, oregano, and olive oil sauce.", 3.0, img("photo-1572449043416-55f4685c9bb7")],
  ["Desserts", "New York Cheesecake", "Vanilla cheesecake with biscuit base, berry compote, fresh strawberries, cream, and mint.", 8.75, img("photo-1533134242443-d4fd215305ad")],
  ["Desserts", "Sticky Toffee Pudding", "Warm date sponge with salted toffee sauce, clotted cream, and candied pecans.", 8.95, img("photo-1464305795204-6f5bbfc7fb81")],
  ["Desserts", "Chocolate Fondant", "Dark chocolate fondant with vanilla ice cream, cocoa nibs, and espresso caramel.", 9.5, img("photo-1606313564200-e75d5e30476c")],
  ["Desserts", "Creme Brulee", "Vanilla custard, crisp caramelised sugar, shortbread, and fresh berries.", 8.5, img("photo-1470124182917-cc6e71b22ecc")],
  ["Desserts", "Salted Caramel Sundae", "Vanilla ice cream, caramel sauce, brownie pieces, cream, and toasted nuts.", 8.25, img("photo-1563805042-7684c019e1cb")],
  ["Soft Drinks", "Still Mineral Water", "Chilled still mineral water served tableside.", 3.5, img("photo-1523362628745-0c100150b504")],
  ["Soft Drinks", "Sparkling Mineral Water", "Crisp sparkling water with fresh lemon on request.", 3.75, img("photo-1564419320461-6870880221ad")],
  ["Soft Drinks", "Classic Cola", "Ice-cold cola served with lime.", 3.95, img("photo-1622483767028-3f66f32aef97")],
  ["Soft Drinks", "Elderflower Presse", "Floral elderflower presse with mint and citrus.", 4.5, img("photo-1497534446932-c925b458314e")],
  ["Juices", "Fresh Orange Juice", "Pressed orange juice served chilled.", 4.75, img("photo-1600271886742-f049cd451bba")],
  ["Juices", "Apple & Ginger Juice", "Cloudy apple juice with fresh ginger and lemon.", 4.95, img("photo-1622597467836-f3285f2131b8")],
  ["Mocktails", "Nojito", "Mint, lime, sugar, soda, and crushed ice.", 6.95, img("photo-1551538827-9c037cb4f32a")],
  ["Mocktails", "Pomegranate Fizz", "Pomegranate, cranberry, lime, rosemary, and sparkling water.", 7.25, img("photo-1536935338788-846bb9981813")],
  ["Hot Drinks", "Espresso", "Rich single-origin espresso.", 3.25, img("photo-1514432324607-a09d9b4aefdd")],
  ["Hot Drinks", "Cappuccino", "Espresso with steamed milk and velvet foam.", 4.25, img("photo-1572442388796-11668a67e53d")],
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.branch.deleteMany();

  const branchMap = new Map<string, { id: number; name: string }>();
  for (const branch of branchProfiles) {
    const created = await prisma.branch.create({
      data: {
        name: branch.name,
        slug: branch.slug,
        area: branch.area,
        address: branch.address,
        phone: branch.phone,
        hours: branch.hours,
        imageUrl: branch.image,
        gallery: branch.gallery.join("|"),
        description: branch.description,
      },
    });
    branchMap.set(branch.name, created);
  }

  const admin = await prisma.user.create({
    data: {
      name: "Head Office Admin",
      email: "admin@steakz.com",
      password: await bcrypt.hash("admin123", 10),
      role: "head_office",
      branch: null,
      branchId: null,
    },
  });

  const branchUsers = [];
  for (const account of branchAccounts) {
    const branch = branchMap.get(account.branch)!;
    branchUsers.push(
      await prisma.user.create({
        data: {
          name: account.managerName,
          email: account.managerEmail,
          password: await bcrypt.hash(account.managerPassword, 10),
          role: "manager",
          branch: branch.name,
          branchId: branch.id,
        },
      })
    );

    for (const chef of account.chefs) {
      branchUsers.push(
        await prisma.user.create({
          data: { name: chef.name, email: chef.email, password: await bcrypt.hash(chef.password, 10), role: "chef", branch: branch.name, branchId: branch.id },
        })
      );
    }

    for (const waiter of account.waiters) {
      branchUsers.push(
        await prisma.user.create({
          data: { name: waiter.name, email: waiter.email, password: await bcrypt.hash(waiter.password, 10), role: "waiter", branch: branch.name, branchId: branch.id },
        })
      );
    }
  }

  const customer = await prisma.user.create({
    data: {
      name: "Demo Customer",
      email: "customer@steakz.com",
      password: await bcrypt.hash("customer123", 10),
      role: "customer",
      branch: null,
      branchId: null,
    },
  });

  const createdMenu = [];
  for (const [category, name, description, price] of menuItems) {
    createdMenu.push(
      await prisma.menuItem.create({
        data: { category: String(category), name: String(name), description: String(description), price: Number(price), imageUrl: localMenuImage(String(name)), available: true },
      })
    );
  }

  for (const branch of branchMap.values()) {
    await prisma.inventory.createMany({
      data: [
        { itemName: "Dry-Aged Beef Cuts", branch: branch.name, branchId: branch.id, quantity: 24, reorderLevel: 10, supplier: "London Prime Butchers" },
        { itemName: "Fresh Seafood", branch: branch.name, branchId: branch.id, quantity: 18, reorderLevel: 8, supplier: "Billingsgate Select" },
        { itemName: "Dessert Prep", branch: branch.name, branchId: branch.id, quantity: 30, reorderLevel: 12, supplier: "Covent Bakery Supply" },
        { itemName: "Drinks Cases", branch: branch.name, branchId: branch.id, quantity: 42, reorderLevel: 18, supplier: "City Drinks Co." },
      ],
    });
  }

  const branches = [...branchMap.values()];
  const waiters = branchUsers.filter((user) => user.role === "waiter");
  for (let index = 0; index < branches.length; index += 1) {
    const branch = branches[index];
    const steak = createdMenu.find((item) => item.category === "Premium Steaks")!;
    const side = createdMenu.find((item) => item.category === "Sides")!;
    const drink = createdMenu.find((item) => item.category === "Mocktails")!;
    const subtotal = steak.price + side.price + drink.price;
    const serviceCharge = subtotal * 0.125;
    const vat = subtotal * 0.2;
    await prisma.order.create({
      data: {
        customer: index === 0 ? customer.name : `Walk-in Table ${index + 4}`,
        branch: branch.name,
        branchId: branch.id,
        status: index % 2 === 0 ? "Ready" : "Preparing",
        subtotal,
        serviceCharge,
        vat,
        total: subtotal + serviceCharge + vat,
        userId: index === 0 ? customer.id : waiters[index * 2]?.id,
        items: {
          create: [
            { menuItemId: steak.id, quantity: 1, price: steak.price },
            { menuItemId: side.id, quantity: 1, price: side.price },
            { menuItemId: drink.id, quantity: 1, price: drink.price },
          ],
        },
      },
    });
  }

  const mayfair = branchMap.get("Mayfair Prime Steakhouse")!;
  await prisma.reservation.create({
    data: {
      customer: customer.name,
      email: customer.email,
      phone: "07123 456789",
      branch: mayfair.name,
      branchId: mayfair.id,
      guests: 4,
      date: "2026-06-20",
      time: "19:30",
      notes: "Window table if available.",
      tableNumber: "M12",
      status: "confirmed",
      userId: customer.id,
    },
  });

  console.log("Database seeded successfully.");
  console.log(`Head office: ${admin.email} / admin123`);
  console.log("Customer: customer@steakz.com / customer123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
