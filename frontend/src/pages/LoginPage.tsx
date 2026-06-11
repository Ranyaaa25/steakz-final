import { FormEvent, useState } from "react";
import { staffLogin, type User } from "../lib/api";

type Props = {
  onLogin: (user: User) => void;
};

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const user = await staffLogin(email, password);
      if (!user) {
        setError("Invalid email or password.");
        return;
      }
      onLogin(user);
    } catch {
      setError("Login failed. Please try again.");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Steakz Staff</h1>
        <p>Head office, branch manager, chef, and waiter access only</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <div className="error">{error}</div>}
          <button type="submit">Log in</button>
        </form>
      </section>
    </main>
  );
}
