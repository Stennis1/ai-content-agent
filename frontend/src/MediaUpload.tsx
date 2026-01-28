import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function MediaUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      setMessage(`Uploaded: ${data.originalName}`);
      setFile(null);
    } catch (err) {
      setError("File upload failed. Is the backend running?");
    }
  };

  return (
    <div>
      <h2>Media Upload</h2>

      <input
        type="file"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={upload}>Upload</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}