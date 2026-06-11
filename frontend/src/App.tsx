import { useEffect } from "react";

const upgradedAppUrl = "/home";

export default function App() {
  useEffect(() => {
    window.location.replace(upgradedAppUrl);
  }, []);

  return (
    <main className="redirect-page">
      <section className="redirect-card">
        <span className="brand-mark">S</span>
        <p className="eyebrow">Steakz upgraded app</p>
        <h1>Opening the premium Steakz website</h1>
        <p>
          The full Steakz website and management system is loading through this Vite dev server.
        </p>
        <a href={upgradedAppUrl}>Open Steakz Premium</a>
      </section>
    </main>
  );
}
