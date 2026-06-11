import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import { clearStaffSession, type Customer, type User } from "./lib/api";
import Dashboard from "./pages/Dashboard";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import MenuItemsPage from "./pages/MenuItemsPage";
import OrdersPage from "./pages/OrdersPage";
import PublicSite from "./pages/PublicSite";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";

type PublicPage = "home" | "menu" | "branches" | "book" | "cart" | "orders" | "customer-auth";
type StaffPage = "dashboard" | "menu" | "orders" | "inventory" | "users" | "reports";
type AppRoute = PublicPage | StaffPage | "admin-login";

const publicRoutes: Record<string, PublicPage> = {
  "/": "home",
  "/home": "home",
  "/customer-menu": "menu",
  "/branches": "branches",
  "/book": "book",
  "/basket": "cart",
  "/reservations": "book",
  "/customer-login": "customer-auth",
  "/customer-auth": "customer-auth",
};

const staffRoutes: Record<string, StaffPage> = {
  "/dashboard": "dashboard",
  "/inventory": "inventory",
  "/users": "users",
  "/reports": "reports",
};

function routeFromPath(pathname: string): AppRoute {
  if (pathname === "/login" || pathname === "/admin-login") return "admin-login";
  if (pathname === "/menu") return "menu";
  if (pathname === "/orders") return "orders";
  return staffRoutes[pathname] ?? publicRoutes[pathname] ?? "home";
}

function pathForRoute(route: AppRoute): string {
  const paths: Record<AppRoute, string> = {
    home: "/home",
    menu: "/menu",
    branches: "/branches",
    book: "/reservations",
    cart: "/basket",
    orders: "/orders",
    "customer-auth": "/customer-auth",
    "admin-login": "/login",
    dashboard: "/dashboard",
    inventory: "/inventory",
    users: "/users",
    reports: "/reports",
  };

  return paths[route];
}

function readStoredStaffUser() {
  try {
    return JSON.parse(sessionStorage.getItem("steakz_staff_user") || "null") as User | null;
  } catch {
    return null;
  }
}

function readStoredCustomer() {
  try {
    return JSON.parse(sessionStorage.getItem("steakz_customer_user") || "null") as Customer | null;
  } catch {
    return null;
  }
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => routeFromPath(window.location.pathname));
  const [staffUser, setStaffUser] = useState<User | null>(() => readStoredStaffUser());
  const [customer, setCustomer] = useState<Customer | null>(() => readStoredCustomer());

  useEffect(() => {
    if (window.location.pathname === "/") {
      window.history.replaceState({}, "", "/home");
      setRoute("home");
    }

    const onPopState = () => setRoute(routeFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const staffPage = useMemo<StaffPage | null>(() => {
    if (route === "dashboard" || route === "inventory" || route === "users" || route === "reports") return route;
    if (route === "menu" && staffUser) return "menu";
    if (route === "orders" && staffUser) return "orders";
    return null;
  }, [route, staffUser]);

  function navigate(nextRoute: AppRoute) {
    window.history.pushState({}, "", pathForRoute(nextRoute));
    setRoute(nextRoute);
  }

  function handleStaffLogin(user: User) {
    setStaffUser(user);
    navigate("dashboard");
  }

  function handleStaffLogout() {
    clearStaffSession();
    setStaffUser(null);
    navigate("home");
  }

  function handleCustomerLogin(nextCustomer: Customer) {
    sessionStorage.setItem("steakz_customer_user", JSON.stringify(nextCustomer));
    setCustomer(nextCustomer);
    navigate("home");
  }

  function handleCustomerLogout() {
    sessionStorage.removeItem("steakz_customer_user");
    setCustomer(null);
    navigate("home");
  }

  if (route === "admin-login") {
    return <LoginPage onLogin={handleStaffLogin} />;
  }

  if (staffPage) {
    if (!staffUser) {
      return <LoginPage onLogin={handleStaffLogin} />;
    }

    return (
      <div className="app-shell">
        <Sidebar
          user={staffUser}
          activePage={staffPage}
          onNavigate={(page) => navigate(page as AppRoute)}
          onLogout={handleStaffLogout}
        />
        <main className="content">
          {staffPage === "dashboard" && <Dashboard role={staffUser.role} />}
          {staffPage === "menu" && <MenuItemsPage />}
          {staffPage === "orders" && <OrdersPage />}
          {staffPage === "inventory" && <InventoryPage />}
          {staffPage === "users" && <UsersPage />}
          {staffPage === "reports" && <ReportsPage />}
        </main>
      </div>
    );
  }

  return (
    <PublicSite
      page={route as PublicPage}
      customer={customer}
      onNavigate={navigate}
      onCustomerLogin={handleCustomerLogin}
      onCustomerLogout={handleCustomerLogout}
    />
  );
}
