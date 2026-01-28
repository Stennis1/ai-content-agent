import { useEffect, useState } from "react";
import {
  getContent,
  submitForReview,
  approveContent,
  rejectContent
} from "./api";

interface ContentItem {
  id: string;
  platform?: string;
  caption?: string;
  status: string;
}

interface ScheduleInfo {
  platform: "linkedin" | "instagram";
  date: string;
  time: string;
}

export function ContentList() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [scheduleFor, setScheduleFor] = useState<string | null>(null);
  const [scheduled, setScheduled] = useState<Record<string, ScheduleInfo>>({});
  const [uiStatus, setUiStatus] = useState<Record<string, string>>({});

  const loadContent = async () => {
    try {
      const data = await getContent();
      setContent(data);
      setError(null);
    } catch {
      setError("Failed to fetch content");
    }
  };

  useEffect(() => {
    loadContent();
    const interval = setInterval(loadContent, 2000);
    return () => clearInterval(interval);
  }, []);

  const saveSchedule = (id: string, info: ScheduleInfo) => {
    setScheduled(prev => ({ ...prev, [id]: info }));
    setUiStatus(prev => ({ ...prev, [id]: "SCHEDULED" }));
    setScheduleFor(null);
  };

  return (
    <div>
      <h2>Content</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {content.length === 0 && <p>No content yet.</p>}

      {content.map(item => {
        const displayStatus = uiStatus[item.id] || item.status;

        return (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginBottom: 12
            }}
          >
            <p>
              <strong>{item.platform || "platform unknown"}</strong> —{" "}
              <strong>{displayStatus}</strong>
            </p>

            <p>{item.caption || "(no caption yet)"}</p>

            {/* DRAFT */}
            {displayStatus === "DRAFT" && (
              <button onClick={() => submitForReview(item.id)}>
                Submit for review
              </button>
            )}

            {/* UNDER_REVIEW */}
            {displayStatus === "UNDER_REVIEW" && (
              <>
                <button
                  onClick={() => approveContent(item.id)}
                  style={{ marginRight: 8 }}
                >
                  Approve
                </button>
                <button onClick={() => rejectContent(item.id)}>
                  Reject
                </button>
              </>
            )}

            {/* APPROVED → Schedule */}
            {displayStatus === "APPROVED" && (
              <>
                <button onClick={() => setScheduleFor(item.id)}>
                  Schedule Post
                </button>

                {scheduleFor === item.id && (
                  <ScheduleForm
                    onCancel={() => setScheduleFor(null)}
                    onSave={info => saveSchedule(item.id, info)}
                  />
                )}
              </>
            )}

            {/* SCHEDULED */}
            {displayStatus === "SCHEDULED" && scheduled[item.id] && (
              <p style={{ color: "green", marginTop: 8 }}>
                Scheduled for{" "}
                <strong>
                  {scheduled[item.id].platform === "linkedin"
                    ? "LinkedIn"
                    : "Instagram"}
                </strong>{" "}
                on {scheduled[item.id].date} at{" "}
                {scheduled[item.id].time}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -----------------------------
   Schedule Form (frontend-only)
   Modern + responsive
------------------------------ */

function ScheduleForm({
  onSave,
  onCancel
}: {
  onSave: (info: ScheduleInfo) => void;
  onCancel: () => void;
}) {
  const [platform, setPlatform] =
    useState<"linkedin" | "instagram">("linkedin");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 8,
        border: "1px solid #e0e0e0",
        background: "#fff",
        maxWidth: 340
      }}
    >
      {/* Platform */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>
          Platform
        </label>
        <select
          value={platform}
          onChange={e => setPlatform(e.target.value as any)}
          style={{
            width: "100%",
            marginTop: 4,
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        >
          <option value="linkedin">LinkedIn</option>
          <option value="instagram">Instagram</option>
        </select>
      </div>

      {/* Date & Time (NO OVERLAP FIXED) */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          flexWrap: "wrap"
        }}
      >
        <div style={{ flex: "1 1 150px" }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: "80%",
              marginTop: 4,
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div style={{ flex: "1 1 150px" }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              width: "80%",
              marginTop: 4,
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: "6px 10px",
            background: "transparent",
            border: "1px solid #ccc",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Cancel
        </button>

        <button
          onClick={() => onSave({ platform, date, time })}
          disabled={!date || !time}
          style={{
            padding: "6px 12px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: !date || !time ? "not-allowed" : "pointer",
            opacity: !date || !time ? 0.6 : 1
          }}
        >
          Schedule
        </button>
      </div>
    </div>
  );
}
