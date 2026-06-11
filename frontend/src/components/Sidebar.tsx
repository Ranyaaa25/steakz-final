import type { Role, User } from "../lib/api";

type Props = {
  user: User;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

type Page = {
  id: string;
  label: string;
  roles: Role[];
};

const pages: Page[] = [
  { id: "dashboard", label: "Dashboard", roles: ["head_office", "manager", "chef", "waiter"] },
  { id: "menu", label: "Menu Items", roles: ["head_office", "manager", "chef", "waiter"] },
  { id: "orders", label: "Orders & Sales", roles: ["head_office", "manager", "chef", "waiter"] },
  { id: "inventory", label: "Inventory", roles: ["head_office", "manager"] },
  { id: "users", label: "Users & Roles", roles: ["head_office", "manager"] },
  { id: "reports", label: "Reports", roles: ["head_office", "manager"] }
];

export default function Sidebar({ user, activePage, onNavigate, onLogout }: Props) {
  return (
    <aside className="sidebar">
      <div>
        <h1>Steakz</h1>
        <p>{user.name}</p>
        <span>{user.role.replace("_", " ").toUpperCase()} {user.branch ? `- ${user.branch}` : ""}</span>
      </div>

      <nav>
        {pages
          .filter((page) => page.roles.includes(user.role))
          .map((page) => (
            <button
              key={page.id}
              className={activePage === page.id ? "active" : ""}
              onClick={() => onNavigate(page.id)}
            >
              {page.label}
            </button>
          ))}
      </nav>

      <button className="logout" onClick={onLogout}>
        Log out
      </button>
    </aside>
  );
}
