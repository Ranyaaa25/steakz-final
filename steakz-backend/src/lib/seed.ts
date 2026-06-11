import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { branchAccounts, londonBranches } from "./branches.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Head Office Manager",
      email: "admin@steakz.com",
      password: await bcrypt.hash("admin123", 10),
      role: "head_office",
      branch: null,
    },
  });

  const branchUsers = await Promise.all(
    branchAccounts.flatMap((account) => {
      return [
        prisma.user.create({
          data: {
            name: `${account.branch} Manager`,
            email: account.managerEmail,
            password: bcrypt.hashSync(account.managerPassword, 10),
            role: "manager",
            branch: account.branch,
          },
        }),
        ...account.chefs.map((chef) =>
          prisma.user.create({
            data: {
              name: chef.name,
              email: chef.email,
              password: bcrypt.hashSync(chef.password, 10),
              role: "chef",
              branch: account.branch,
            },
          })
        ),
        ...account.waiters.map((waiter) =>
          prisma.user.create({
            data: {
              name: waiter.name,
              email: waiter.email,
              password: bcrypt.hashSync(waiter.password, 10),
              role: "waiter",
              branch: account.branch,
            },
          })
        ),
        ...account.customers.map((customer) =>
          prisma.user.create({
            data: {
              name: customer.name,
              email: customer.email,
              password: bcrypt.hashSync(customer.password, 10),
              role: "customer",
              branch: account.branch,
            },
          })
        ),
      ];
    })
  );
  const firstWaiter = branchUsers.find((user) => user.role === "waiter")!;
  const firstManager = branchUsers.find((user) => user.role === "manager")!;
  const firstCustomer = branchUsers.find((user) => user.role === "customer")!;

  const ribeye = await prisma.menuItem.create({
    data: { name: "Dry-Aged Ribeye Steak", category: "Signature Steaks", price: 34.95, available: true },
  });
  const fillet = await prisma.menuItem.create({
    data: { name: "Prime Fillet Mignon", category: "Signature Steaks", price: 39.5, available: true },
  });
  const sirloin = await prisma.menuItem.create({
    data: { name: "Chargrilled Sirloin", category: "Grill", price: 29.75, available: true },
  });
  const burger = await prisma.menuItem.create({
    data: { name: "Steakz House Burger", category: "Burgers", price: 16.95, available: true },
  });
  const prawns = await prisma.menuItem.create({
    data: { name: "Garlic Butter Prawns", category: "Starters", price: 13.5, available: true },
  });
  const cheesecake = await prisma.menuItem.create({
    data: { name: "New York Cheesecake", category: "Desserts", price: 8.75, available: true },
  });

  await prisma.inventory.createMany({
    data: [
      { itemName: "Dry-Aged Ribeye Cuts", branch: londonBranches[0], quantity: 24, reorderLevel: 10, supplier: "London Prime Butchers" },
      { itemName: "Fillet Mignon Cuts", branch: londonBranches[1], quantity: 18, reorderLevel: 8, supplier: "Premium Beef Supply" },
      { itemName: "Sirloin Cuts", branch: londonBranches[2], quantity: 22, reorderLevel: 9, supplier: "Heritage Meat Co." },
      { itemName: "Brioche Burger Buns", branch: londonBranches[3], quantity: 48, reorderLevel: 18, supplier: "City Bakery Supply" },
    ],
  });

  const order1 = await prisma.order.create({
    data: {
      customer: "Walk-in Customer",
      branch: londonBranches[0],
      status: "Completed",
      total: 57.2,
      userId: firstWaiter.id,
      items: {
        create: [
          { menuItemId: ribeye.id, quantity: 1, price: ribeye.price },
          { menuItemId: prawns.id, quantity: 1, price: prawns.price },
          { menuItemId: cheesecake.id, quantity: 1, price: cheesecake.price },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      customer: "Online Order",
      branch: londonBranches[1],
      status: "Completed",
      total: 69.25,
      userId: firstManager.id,
      items: {
        create: [
          { menuItemId: fillet.id, quantity: 1, price: fillet.price },
          { menuItemId: sirloin.id, quantity: 1, price: sirloin.price },
        ],
      },
    },
  });

  await prisma.reservation.create({
    data: {
      customer: firstCustomer.name,
      email: firstCustomer.email,
      phone: "07123 456789",
      branch: firstCustomer.branch || londonBranches[0],
      guests: 4,
      date: "2026-06-20",
      time: "19:30",
      status: "Confirmed",
      userId: firstCustomer.id,
    },
  });

  console.log("Database seeded successfully.");
  console.log(`Head office account created by ${admin.email}. First sample order ID: ${order1.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
