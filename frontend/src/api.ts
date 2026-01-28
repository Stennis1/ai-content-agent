const API_BASE = "https://ai-content-agent-o702.onrender.com"; // Production Url
// const API_BASE = "http://localhost:4000";  // Local Development environment 


export async function getContent() {
  const res = await fetch(`${API_BASE}/content`);
  return res.json();
}

export async function approveContent(id: string) {
  return fetch(`${API_BASE}/content/${id}/approve`, { method: "POST" });
}

export async function rejectContent(id: string) {
  return fetch(`${API_BASE}/content/${id}/reject`, { method: "POST" });
}

export async function pauseSystem() {
  return fetch(`${API_BASE}/admin/pause`, { method: "POST" });
}

export async function resumeSystem() {
  return fetch(`${API_BASE}/admin/resume`, { method: "POST" });
}

export async function crisisMode() {
  return fetch(`${API_BASE}/admin/crisis`, { method: "POST" });
}

export async function resolveCrisis() {
  return fetch(`${API_BASE}/admin/crisis/resolve`, { method: "POST" });
}

export async function submitForReview(id: string) {
  return fetch(`${API_BASE}/content/${id}/submit`, {
    method: "POST"
  });
}
