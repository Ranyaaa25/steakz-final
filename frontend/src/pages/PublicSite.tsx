import { FormEvent, useEffect, useState } from "react";
import {
  api,
  customerLogin,
  customerRegister,
  steakzBranches,
  type Booking,
  type Customer,
  type CustomerOrder,
  type MenuItem
} from "../lib/api";

type PublicPage = "home" | "menu" | "branches" | "book" | "cart" | "orders" | "customer-auth";

type CartItem = MenuItem & { quantity: number };

type Props = {
  page: PublicPage;
  customer: Customer | null;
  onNavigate: (page: PublicPage | "admin-login") => void;
  onCustomerLogin: (customer: Customer) => void;
  onCustomerLogout: () => void;
};

const branches = [
  {
    name: "Mayfair Prime Steakhouse",
    city: "Mayfair",
    detail: "Private booths, open grill counter, and late evening reservations.",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Soho Flame Grill",
    city: "Soho",
    detail: "Premium steaks, mocktail bar, and sunset table service.",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kensington Steak Room",
    city: "Kensington",
    detail: "Quiet tables, fine steak cuts, and polished family service.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Canary Wharf Grill House",
    city: "Canary Wharf",
    detail: "Business dining, fast lunch service, and evening grill specials.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80"
  }
];

export default function PublicSite({
  page,
  customer,
  onNavigate,
  onCustomerLogin,
  onCustomerLogout
}: Props) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState(steakzBranches[0]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    api.getMenuItems().then(setMenu);
  }, []);

  return (
    <div className="public-site">
      <PublicHeader
        activePage={page}
        customer={customer}
        onNavigate={onNavigate}
        onCustomerLogout={onCustomerLogout}
      />

      {page === "home" && <HomeSection menu={menu} onNavigate={onNavigate} />}
      {page === "menu" && (
        <PublicMenu
          menu={menu}
          customer={customer}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          onNavigate={onNavigate}
          onAddToCart={(item) => {
            setCart((current) => {
              const existing = current.find((cartItem) => cartItem.id === item.id);
              if (existing) {
                return current.map((cartItem) =>
                  cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
              }
              return [...current, { ...item, quantity: 1 }];
            });
          }}
        />
      )}
      {page === "branches" && <BranchesSection />}
      {page === "book" && (
        <BookingSection customer={customer} onNavigate={onNavigate} />
      )}
      {page === "cart" && (
        <CartPage
          customer={customer}
          selectedBranch={selectedBranch}
          cart={cart}
          onNavigate={onNavigate}
          onClearCart={() => setCart([])}
        />
      )}
      {page === "orders" && <MyOrdersPage customer={customer} onNavigate={onNavigate} />}
      {page === "customer-auth" && (
        <CustomerAuth
          customer={customer}
          onCustomerLogin={onCustomerLogin}
          onCustomerLogout={onCustomerLogout}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

function PublicHeader({
  activePage,
  customer,
  onNavigate,
  onCustomerLogout
}: {
  activePage: PublicPage;
  customer: Customer | null;
  onNavigate: (page: PublicPage | "admin-login") => void;
  onCustomerLogout: () => void;
}) {
  const links: { id: PublicPage; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "menu", label: "Menu" },
    { id: "branches", label: "Branches" },
    { id: "book", label: "Book a Table" },
    { id: "cart", label: "Basket" },
    { id: "orders", label: "My Orders" },
    { id: "customer-auth", label: customer ? "My Account" : "Customer Login" }
  ];

  return (
    <header className="public-header">
      <button className="brand-mark" onClick={() => onNavigate("home")} aria-label="Steakz home">
        S
      </button>
      <div className="brand-copy">
        <strong>Steakz</strong>
        <span>Restaurant Management System</span>
      </div>
      <nav>
        {links.map((link) => (
          <button
            key={link.id}
            className={activePage === link.id ? "active" : ""}
            onClick={() => onNavigate(link.id)}
          >
            {link.label}
          </button>
        ))}
        <button onClick={() => onNavigate("admin-login")}>Admin Login</button>
        {customer && <button onClick={onCustomerLogout}>Logout</button>}
      </nav>
    </header>
  );
}

function HomeSection({
  menu,
  onNavigate
}: {
  menu: MenuItem[];
  onNavigate: (page: PublicPage | "admin-login") => void;
}) {
  return (
    <>
      <section className="luxury-hero">
        <div className="hero-copy">
          <span className="eyebrow">Steakz Digital Dining</span>
          <h1>Restaurant reservations, orders, and staff data in one polished system.</h1>
          <p>
            A professional MIS portal for guests and staff, built around table booking, menu
            browsing, online orders, stock control, and management reporting.
          </p>
          <div className="hero-actions">
            <button onClick={() => onNavigate("book")}>Book a Table</button>
            <button className="secondary-button" onClick={() => onNavigate("menu")}>
              View Menu
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <img
            src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80"
            alt="Premium steak plate"
          />
          <div>
            <span>Chef Recommendation</span>
            <strong>{menu.find((item) => item.name.includes("Ribeye"))?.name ?? "Ribeye Steak"}</strong>
            <p>Served with smoked potatoes, herb butter, and fast guest-side ordering.</p>
          </div>
        </div>
      </section>

      <section className="public-band">
        <div className="section-title">
          <span className="eyebrow">Assignment-ready MIS</span>
          <h2>One restaurant system, two clear entrances</h2>
        </div>
        <div className="feature-grid">
          <article>
            <h3>Guest Website</h3>
            <p>Customers can register, log in, book tables, place orders, and view history.</p>
          </article>
          <article>
            <h3>Staff Dashboard</h3>
            <p>Head office, managers, chefs, and waiters keep branch-safe dashboards.</p>
          </article>
          <article>
            <h3>Restaurant Data</h3>
            <p>Menu, orders, inventory, users, bookings, and reports connect to API data.</p>
          </article>
        </div>
      </section>
    </>
  );
}

function PublicMenu({
  menu,
  customer,
  selectedBranch,
  onBranchChange,
  onNavigate,
  onAddToCart
}: {
  menu: MenuItem[];
  customer: Customer | null;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  onNavigate: (page: PublicPage | "admin-login") => void;
  onAddToCart: (item: MenuItem) => void;
}) {
  const categories = ["Starters", "Steaks", "Burgers", "Sides", "Sauces", "Drinks", "Desserts"];

  return (
    <section className="public-page-section">
      <div className="section-title">
        <span className="eyebrow">Steakz Menu</span>
        <h2>Choose your London branch, add steakhouse items to basket, then submit your order</h2>
      </div>
      {!customer && (
        <div className="mini-login">
          <strong>Login required</strong>
          <p>Customers must create an account or login before placing an order.</p>
          <button onClick={() => onNavigate("customer-auth")}>Customer Login</button>
        </div>
      )}
      <label className="branch-picker">
        London Branch
        <select value={selectedBranch} onChange={(event) => onBranchChange(event.target.value)}>
          {steakzBranches.map((branch) => (
            <option key={branch}>{branch}</option>
          ))}
        </select>
      </label>
      {categories.map((category) => {
        const categoryItems = menu.filter((item) => item.category === category);
        if (!categoryItems.length) return null;
        return (
          <div key={category} className="menu-category-section">
            <h3>{category}</h3>
            <div className="menu-card-grid">
              {categoryItems.map((item) => (
                <article key={item.id} className="menu-card">
                  <span>{item.category}</span>
                  <h4>{item.name}</h4>
                  <p>{item.status}</p>
                  <strong>£{Number(item.price).toFixed(2)}</strong>
                  <button
                    disabled={!customer}
                    onClick={() => {
                      onAddToCart(item);
                      onNavigate("cart");
                    }}
                  >
                    Add to Basket
                  </button>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function BranchesSection() {
  return (
    <section className="public-page-section">
      <div className="section-title">
        <span className="eyebrow">Branches</span>
        <h2>Four London Steakz dining rooms connected through one MIS</h2>
      </div>
      <div className="branch-grid">
        {branches.map((branch) => (
          <article key={branch.name}>
            <img src={branch.image} alt={`${branch.name} dining room`} />
            <span>{branch.city}</span>
            <h3>{branch.name}</h3>
            <p>{branch.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BookingSection({
  customer,
  onNavigate
}: {
  customer: Customer | null;
  onNavigate: (page: PublicPage | "admin-login") => void;
}) {
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    branch: steakzBranches[0],
    guests: "2",
    booking_date: "2026-06-20",
    booking_time: "20:00"
  });

  async function submitBooking(event: FormEvent) {
    event.preventDefault();
    if (!customer) {
      setMessage("Please log in as a customer before booking a table.");
      onNavigate("customer-auth");
      return;
    }

    await api.saveCustomerBooking({
      customer_id: customer.id,
      branch: form.branch,
      guests: Number(form.guests),
      booking_date: form.booking_date,
      booking_time: form.booking_time,
      status: "Requested"
    });
    setMessage("Booking request saved. You can view it in your customer account.");
  }

  return (
    <section className="public-page-section two-column">
      <div className="section-title">
        <span className="eyebrow">Reservations</span>
        <h2>Book a Steakz table</h2>
        <p>Customer login keeps every reservation connected to the right guest account.</p>
      </div>

      <form className="dark-form" onSubmit={submitBooking}>
        {!customer && (
          <div className="mini-login">
            <strong>Customer account required</strong>
            <p>Use the customer login/register page before submitting a reservation.</p>
          </div>
        )}
        <label>
          Branch
          <select value={form.branch} onChange={(event) => setForm({ ...form, branch: event.target.value })}>
            {branches.map((branch) => (
              <option key={branch.name}>{branch.name}</option>
            ))}
          </select>
        </label>
        <label>
          Guests
          <input
            type="number"
            min="1"
            max="12"
            value={form.guests}
            onChange={(event) => setForm({ ...form, guests: event.target.value })}
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={form.booking_date}
            onChange={(event) => setForm({ ...form, booking_date: event.target.value })}
          />
        </label>
        <label>
          Time
          <input
            type="time"
            value={form.booking_time}
            onChange={(event) => setForm({ ...form, booking_time: event.target.value })}
          />
        </label>
        {message && <div className="dark-message">{message}</div>}
        <button type="submit">Send Booking Request</button>
      </form>
    </section>
  );
}

function CustomerAuth({
  customer,
  onCustomerLogin,
  onCustomerLogout,
  onNavigate
}: {
  customer: Customer | null;
  onCustomerLogin: (customer: Customer) => void;
  onCustomerLogout: () => void;
  onNavigate: (page: PublicPage | "admin-login") => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");

  if (customer) {
    return (
      <CustomerPortal customer={customer} onCustomerLogout={onCustomerLogout} onNavigate={onNavigate} />
    );
  }

  return (
    <section className="public-page-section two-column">
      <div className="section-title">
        <span className="eyebrow">Customer Area</span>
        <h2>{mode === "login" ? "Welcome back to Steakz" : "Create your guest account"}</h2>
        <p>Customers use this separate area for bookings, orders, and history.</p>
      </div>
      <div className="auth-panel">
        <div className="segmented">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Login
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Register
          </button>
        </div>
        {mode === "login" ? (
          <CustomerLoginForm onCustomerLogin={onCustomerLogin} />
        ) : (
          <CustomerRegisterForm onCustomerLogin={onCustomerLogin} />
        )}
      </div>
    </section>
  );
}

function CustomerLoginForm({
  onCustomerLogin,
  compact = false
}: {
  onCustomerLogin: (customer: Customer) => void;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const customer = await customerLogin(email, password);
    if (!customer) {
      setError("Customer login failed.");
      return;
    }
    onCustomerLogin(customer);
  }

  return (
    <form className={compact ? "dark-form compact-form" : "dark-form"} onSubmit={submit}>
      <label>
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {error && <div className="dark-message">{error}</div>}
      <button type="submit">Customer Login</button>
    </form>
  );
}

function CustomerRegisterForm({ onCustomerLogin }: { onCustomerLogin: (customer: Customer) => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    branch: steakzBranches[0]
  });

  async function submit(event: FormEvent) {
    event.preventDefault();
    const customer = await customerRegister(form);
    onCustomerLogin(customer);
  }

  return (
    <form className="dark-form" onSubmit={submit}>
      <label>
        Name
        <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
      </label>
      <label>
        Email
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
      </label>
      <label>
        Phone
        <input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
      </label>
      <label>
        Password
        <input
          required
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
      </label>
      <label>
        Preferred London Branch
        <select value={form.branch} onChange={(event) => setForm({ ...form, branch: event.target.value })}>
          {steakzBranches.map((branch) => (
            <option key={branch}>{branch}</option>
          ))}
        </select>
      </label>
      <button type="submit">Create Customer Account</button>
    </form>
  );
}

function CustomerPortal({
  customer,
  onCustomerLogout,
  onNavigate
}: {
  customer: Customer;
  onCustomerLogout: () => void;
  onNavigate: (page: PublicPage | "admin-login") => void;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    api.getCustomerBookings(customer.id).then(setBookings);
    api.getCustomerOrders(customer.id).then(setOrders);
  }, [customer.id]);

  return (
    <section className="public-page-section">
      <div className="page-header dark-page-header">
        <div>
          <span className="eyebrow">Customer Account</span>
          <h2>Hello, {customer.name}</h2>
          <p>View your bookings and orders from the Steakz guest portal.</p>
        </div>
        <button className="secondary-button" onClick={onCustomerLogout}>
          Logout
        </button>
      </div>

      <div className="customer-actions">
        <article>
          <h3>Order from the Menu</h3>
          <p>Choose a branch, add steakhouse items to your basket, then submit your order.</p>
          <button onClick={() => onNavigate("menu")}>Open Menu</button>
        </article>
        <article>
          <h3>Reserve a Table</h3>
          <p>Reservations are saved to one London branch and visible only to that branch.</p>
          <button onClick={() => onNavigate("book")}>Book a Table</button>
        </article>
      </div>

      <div className="history-grid">
        <HistoryList title="Booking History" rows={bookings} empty="No bookings yet." />
        <HistoryList title="Order History" rows={orders} empty="No customer orders yet." />
      </div>
    </section>
  );
}

function CartPage({
  customer,
  selectedBranch,
  cart,
  onNavigate,
  onClearCart
}: {
  customer: Customer | null;
  selectedBranch: string;
  cart: CartItem[];
  onNavigate: (page: PublicPage | "admin-login") => void;
  onClearCart: () => void;
}) {
  const [message, setMessage] = useState("");
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  async function submitOrder() {
    if (!customer) {
      setMessage("Please log in as a customer before placing an order.");
      onNavigate("customer-auth");
      return;
    }

    if (!cart.length) {
      setMessage("Your basket is empty.");
      return;
    }

    await api.saveCustomerOrder({
      customer_id: customer.id,
      branch: selectedBranch,
      items: cart.map((item) => `${item.quantity}x ${item.name}`).join(", "),
      total: Number(total.toFixed(2)),
      status: "pending"
    });
    onClearCart();
    setMessage(`Order submitted to ${selectedBranch}. Other branches cannot see this order.`);
  }

  return (
    <section className="public-page-section">
      <div className="section-title">
        <span className="eyebrow">Basket</span>
        <h2>Your steakhouse order for {selectedBranch}</h2>
      </div>
      {!customer && (
        <div className="mini-login">
          <strong>Customer login required</strong>
          <p>Create an account or login before submitting your basket.</p>
        </div>
      )}
      <article className="history-card">
        {cart.length === 0 ? (
          <p>Your basket is empty.</p>
        ) : (
          cart.map((item) => (
            <div className="history-row" key={item.id}>
              <span><strong>{item.name}</strong></span>
              <span>Qty: {item.quantity}</span>
              <span>£{(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))
        )}
        <h3>Total: £{total.toFixed(2)}</h3>
        {message && <div className="dark-message">{message}</div>}
        <div className="hero-actions">
          <button onClick={() => onNavigate("menu")}>Add More Items</button>
          <button onClick={submitOrder}>Submit Order</button>
        </div>
      </article>
    </section>
  );
}

function MyOrdersPage({
  customer,
  onNavigate
}: {
  customer: Customer | null;
  onNavigate: (page: PublicPage | "admin-login") => void;
}) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    if (customer) api.getCustomerOrders(customer.id).then(setOrders);
  }, [customer]);

  if (!customer) {
    return (
      <section className="public-page-section">
        <div className="mini-login">
          <strong>Customer login required</strong>
          <p>Login to view your own orders.</p>
          <button onClick={() => onNavigate("customer-auth")}>Customer Login</button>
        </div>
      </section>
    );
  }

  return (
    <section className="public-page-section">
      <div className="section-title">
        <span className="eyebrow">My Orders</span>
        <h2>Orders for {customer.name}</h2>
      </div>
      <HistoryList title="Order History" rows={orders} empty="No customer orders yet." />
    </section>
  );
}

function HistoryList<T extends Record<string, unknown>>({
  title,
  rows,
  empty
}: {
  title: string;
  rows: T[];
  empty: string;
}) {
  return (
    <article className="history-card">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p>{empty}</p>
      ) : (
        rows.map((row, index) => (
          <div className="history-row" key={index}>
            {Object.entries(row)
              .filter(([key]) => !key.includes("customer_id"))
              .map(([key, value]) => (
                <span key={key}>
                <strong>{key.replace(/_/g, " ")}:</strong> {String(value)}
                </span>
              ))}
          </div>
        ))
      )}
    </article>
  );
}
