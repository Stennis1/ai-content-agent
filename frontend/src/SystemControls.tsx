import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function SystemControls() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/status`);
      if (!res.ok) throw new Error("Status fetch failed");
      // intentionally ignore response
    } catch {
      setError("Unable to reach system status endpoint");
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const action = async (
    endpoint: string,
    successMessage: string
  ) => {
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
        method: "POST"
      });

      if (!res.ok) throw new Error("Action failed");

      setMessage(successMessage);
      await loadStatus();
    } catch {
      setError("System action failed");
    }
  };

  return (
    <div>
      <h2>System Controls</h2>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => action("pause", "System paused. Automation halted.")}>
          Pause
        </button>{" "}
        <button onClick={() => action("resume", "System resumed. Automation active.")}>
          Resume
        </button>{" "}
        <button onClick={() => action("crisis", "🚨 Crisis mode enabled.")}>
          Crisis Mode
        </button>{" "}
        <button onClick={() => action("crisis/resolve", "Crisis resolved.")}>
          Resolve Crisis
        </button>
      </div>

      {/* Feedback only */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "orange" }}>{error}</p>}
    </div>
  );
}
