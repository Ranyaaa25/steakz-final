import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { api, type User } from "../lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.getUsers().then(setUsers);
  }, []);

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Staff & Users</h2>
          <p>Manage system accounts and role access.</p>
        </div>
        <button>Add User</button>
      </div>
      <DataTable<User>
        rows={users}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "branch", label: "Branch" }
        ]}
      />
    </section>
  );
}
