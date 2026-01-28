import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function GenerateDraft() {
  const [objective, setObjective] = useState("");
  const [platform, setPlatform] = useState("linkedin");

  const generate = async () => {
    await fetch(`${API_BASE}/content/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        objective,
        brandVoice: {
          tone: "professional",
          style_notes: "clear, concise, confident",
          do_not: ["clickbait", "overpromising"]
        }
      })
    });

    setObjective("");
  };

  return (
    <div>
      <h2>Generate Draft</h2>

      <select
        value={platform}
        onChange={e => setPlatform(e.target.value)}
      >
        <option value="linkedin">LinkedIn</option>
        <option value="instagram">Instagram</option>
      </select>

      <br /><br />

      <input
        type="text"
        placeholder="Content objective"
        value={objective}
        onChange={e => setObjective(e.target.value)}
        style={{ width: 300 }}
      />

      <br /><br />

      <button onClick={generate}>Generate Draft</button>
    </div>
  );
}

