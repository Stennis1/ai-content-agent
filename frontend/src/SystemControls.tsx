import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

interface SystemStatus {
  SYSTEM_STATUS: "ACTIVE" | "PAUSED";
  AI_MODE: string;
  CRISIS_MODE: boolean;
}

export function SystemControls() {
  const [status, setStatus] = useState<SystemStatus>({
    SYSTEM_STATUS: "ACTIVE",
    AI_MODE: "DRAFT_ONLY",
    CRISIS_MODE: false
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/status`);
      if (!res.ok) throw new Error("Status fetch failed");

      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch {
      setError("Unable to fetch system status (retrying…)");
    } finally {
      setLoading(false);
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