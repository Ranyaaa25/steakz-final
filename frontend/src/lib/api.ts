export type Role = "head_office" | "manager" | "chef" | "waiter" | "customer";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  branch?: string;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  branch?: string;
};

export type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  status: string;
};

export type Order = {
  id: number;
  customer: string;
  branch: string;
  total: number;
  status: string;
  created_at: string;
};

export type CustomerOrder = {
  id: number;
  customer_id: number;
  branch: string;
  items: string;
  total: number;
  status: string;
  created_at: string;
};

export type Booking = {
  id: number;
  customer_id: number;
  branch: string;
  guests: number;
  booking_date: string;
  booking_time: string;
  status: string;
};

export type InventoryItem = {
  id: number;
  name: string;
  branch: string;
  quantity: number;
  unit: string;
  reorder_level: number;
};

export type Report = {
  totalSales: number;
  totalOrders: number;
  lowStock: number;
  topItem: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost/steakz.final/backend/api";

export const steakzBranches = [
  "Mayfair Prime Steakhouse",
  "Soho Flame Grill",
  "Kensington Steak Room",
  "Canary Wharf Grill House"
];

const sampleUsers: User[] = [
  { id: 1, name: "Head Office Manager", email: "admin@steakz.com", role: "head_office" },
  { id: 2, name: "Mayfair Prime Manager", email: "manager.mayfair-prime@steakz.com", role: "manager", branch: steakzBranches[0] },
  { id: 3, name: "Mayfair Prime Chef One", email: "chef1.mayfair-prime@steakz.com", role: "chef", branch: steakzBranches[0] },
  { id: 4, name: "Mayfair Prime Waiter One", email: "waiter1.mayfair-prime@steakz.com", role: "waiter", branch: steakzBranches[0] }
];

const sampleCustomers: Customer[] = [
  { id: 1, name: "Mayfair Customer", email: "customer.mayfair-prime@example.com", phone: "07123 456789", branch: steakzBranches[0] }
];

const sampleMenu: MenuItem[] = [
  { id: 1, name: "Caesar Salad", category: "Starters", price: 8.95, status: "Available" },
  { id: 2, name: "Garlic Bread", category: "Starters", price: 5.95, status: "Available" },
  { id: 3, name: "Ribeye Steak", category: "Steaks", price: 34.95, status: "Available" },
  { id: 4, name: "Sirloin Steak", category: "Steaks", price: 29.75, status: "Available" },
  { id: 5, name: "Fillet Steak", category: "Steaks", price: 39.5, status: "Available" },
  { id: 6, name: "T-Bone Steak", category: "Steaks", price: 42.95, status: "Available" },
  { id: 7, name: "Tomahawk Steak", category: "Steaks", price: 64.95, status: "Available" },
  { id: 8, name: "Steak Burger", category: "Burgers", price: 16.95, status: "Available" },
  { id: 9, name: "Fries", category: "Sides", price: 4.5, status: "Available" },
  { id: 10, name: "Mac and Cheese", category: "Sides", price: 6.5, status: "Available" },
  { id: 11, name: "Peppercorn Sauce", category: "Sauces", price: 2.5, status: "Available" },
  { id: 12, name: "Mushroom Sauce", category: "Sauces", price: 2.5, status: "Available" },
  { id: 13, name: "Coke", category: "Drinks", price: 3.25, status: "Available" },
  { id: 14, name: "Fresh Orange Juice", category: "Drinks", price: 4.25, status: "Available" },
  { id: 15, name: "Still Water", category: "Drinks", price: 2.5, status: "Available" },
  { id: 16, name: "Cheesecake", category: "Desserts", price: 8.75, status: "Available" },
  { id: 17, name: "Chocolate Brownie", category: "Desserts", price: 7.95, status: "Available" },
  { id: 18, name: "Ice Cream", category: "Desserts", price: 5.5, status: "Available" }
];

const sampleOrders: Order[] = [
  { id: 1, customer: "Table 4", branch: steakzBranches[0], total: 52.5, status: "served", created_at: "2026-06-10" },
  { id: 2, customer: "Table 7", branch: steakzBranches[1], total: 31.25, status: "preparing", created_at: "2026-06-10" }
];

const sampleInventory: InventoryItem[] = [
  { id: 1, name: "Ribeye Cuts", branch: steakzBranches[0], quantity: 24, unit: "cuts", reorder_level: 10 },
  { id: 2, name: "Fillet Cuts", branch: steakzBranches[1], quantity: 18, unit: "cuts", reorder_level: 8 },
  { id: 3, name: "Burger Buns", branch: steakzBranches[3], quantity: 48, unit: "pieces", reorder_level: 18 }
];

const sampleBookings: Booking[] = [
  {
    id: 1,
    customer_id: 1,
    branch: steakzBranches[0],
    guests: 4,
    booking_date: "2026-06-20",
    booking_time: "20:00",
    status: "Confirmed"
  }
];

const sampleCustomerOrders: CustomerOrder[] = [
  {
    id: 1,
    customer_id: 1,
    branch: steakzBranches[0],
    items: "Ribeye Steak, Fries, Peppercorn Sauce",
    total: 41.95,
    status: "pending",
    created_at: "2026-06-10"
  }
];

const sampleReport: Report = {
  totalSales: 1840.75,
  totalOrders: 86,
  lowStock: 1,
  topItem: "Ribeye Steak"
};

async function request<T>(path: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const staffUser = JSON.parse(sessionStorage.getItem("steakz_staff_user") || "null") as User | null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (staffUser) {
      headers["X-User-Role"] = staffUser.role;
      if (staffUser.branch) headers["X-User-Branch"] = staffUser.branch;
    }

    const response = await fetch(`${API_URL}/${path}`, {
      ...options,
      headers: { ...headers, ...(options?.headers as Record<string, string> | undefined) },
    });

    if (!response.ok) throw new Error("API request failed");
    return await response.json();
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error("The backend is not available.");
  }
}

export async function staffLogin(email: string, password: string): Promise<User | undefined> {
  const user = await request<User>(
    "login.php",
    { method: "POST", body: JSON.stringify({ email, password }) },
    undefined
  );

  if (user) sessionStorage.setItem("steakz_staff_user", JSON.stringify(user));
  return user;
}

export function clearStaffSession() {
  sessionStorage.removeItem("steakz_staff_user");
}

export async function customerLogin(email: string, password: string): Promise<Customer | undefined> {
  return request<Customer | undefined>(
    "customer_auth.php?action=login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    undefined
  );
}

export async function customerRegister(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  branch?: string;
}): Promise<Customer> {
  return request<Customer>(
    "customer_auth.php?action=register",
    { method: "POST", body: JSON.stringify(data) },
    { id: Date.now(), name: data.name, email: data.email, phone: data.phone, branch: data.branch }
  );
}

export const api = {
  getMenuItems: () => request<MenuItem[]>("menu_items.php", undefined, sampleMenu),
  getOrders: () => request<Order[]>("orders.php", undefined, sampleOrders),
  getInventory: () => request<InventoryItem[]>("inventory.php", undefined, sampleInventory),
  getUsers: () => request<User[]>("users.php", undefined, sampleUsers),
  getReports: () => request<Report>("reports.php", undefined, sampleReport),
  getCustomerBookings: (customerId: number) =>
    request<Booking[]>(
      `bookings.php?customer_id=${customerId}`,
      undefined,
      sampleBookings.filter((booking) => booking.customer_id === customerId)
    ),
  getCustomerOrders: (customerId: number) =>
    request<CustomerOrder[]>(
      `customer_orders.php?customer_id=${customerId}`,
      undefined,
      sampleCustomerOrders.filter((order) => order.customer_id === customerId)
    ),
  saveMenuItem: (item: Partial<MenuItem>) =>
    request<MenuItem>("menu_items.php", { method: "POST", body: JSON.stringify(item) }, item as MenuItem),
  saveOrder: (order: Partial<Order>) =>
    request<Order>("orders.php", { method: "POST", body: JSON.stringify(order) }, order as Order),
  saveCustomerBooking: (booking: Partial<Booking>) =>
    request<Booking>(
      "bookings.php",
      { method: "POST", body: JSON.stringify(booking) },
      { id: Date.now(), status: "Requested", ...booking } as Booking
    ),
  saveCustomerOrder: (order: Partial<CustomerOrder>) =>
    request<CustomerOrder>(
      "customer_orders.php",
      { method: "POST", body: JSON.stringify(order) },
      { id: Date.now(), status: "pending", created_at: new Date().toISOString().slice(0, 10), ...order } as CustomerOrder
    ),
  saveInventoryItem: (item: Partial<InventoryItem>) =>
    request<InventoryItem>("inventory.php", { method: "POST", body: JSON.stringify(item) }, item as InventoryItem),
  saveUser: (user: Partial<User>) =>
    request<User>("users.php", { method: "POST", body: JSON.stringify(user) }, user as User)
};
