import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000";

interface SystemStatus {
  SYSTEM_STATUS: "ACTIVE" | "PAUSED";
  AI_MODE: string;
  CRISIS_MODE: boolean;
}

export function SystemControls() {
  const [status, setStatus] = useState<SystemStatus>({
    SYSTEM_STATUS: "ACTIVE",   // sensible default
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
      setError(null);        // clear error on success
    } catch {
      setError("Unable to fetch system status (retrying…)"); // advisory only
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
      await loadStatus(); // refresh truth from backend
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

      {/* Feedback */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "orange" }}>{error}</p>}

      {/* System state display */}
      <div
        style={{
          marginTop: 12,
          padding: 10,
          border: "1px solid #ddd",
          background: "#fafafa"
        }}
      >
        <strong>Current System State</strong>

        {loading ? (
          <p style={{ marginTop: 6 }}>
            Waiting for system status… Default: <strong>ACTIVE</strong>
          </p>
        ) : (
          <pre style={{ marginTop: 6 }}>
            {JSON.stringify(status, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
