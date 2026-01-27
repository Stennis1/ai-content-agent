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

export function ContentList() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadContent = async () => {
    try {
      const data = await getContent();
      setContent(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch content");
    }
  };

  useEffect(() => {
    loadContent();
    const interval = setInterval(loadContent, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Content</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {content.length === 0 && <p>No content yet.</p>}

      {content.map(item => (
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
            <strong>{item.status}</strong>
          </p>

          <p>{item.caption || "(no caption yet)"}</p>

          {item.status === "DRAFT" && (
            <button onClick={() => submitForReview(item.id)}>
              Submit for review
            </button>
          )}

          {item.status === "UNDER_REVIEW" && (
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
        </div>
      ))}
    </div>
  );
}
