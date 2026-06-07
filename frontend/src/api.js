const BASE = "http://localhost:8000";

// saves user to localStorage after login/signup
export function saveUser(user) {
  localStorage.setItem("userId",   String(user.id));
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userName", user.first_name);
}

export function getUser() {
  return {
    id:   localStorage.getItem("userId"),
    role: localStorage.getItem("userRole"),
    name: localStorage.getItem("userName"),
  };
}

export function clearUser() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
}

// ── Auth ──
export async function signup(formData) {
  const res = await fetch(`${BASE}/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Signup failed");
  return data; // returns the created user
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data; // { user, message }
}

// ── Dashboard data ──
export async function fetchUserData(userId) {
  const res = await fetch(`${BASE}/userdata/${userId}`);
  if (!res.ok) throw new Error("Failed to load data");
  return res.json();
}

export async function fetchTasks(userId) {
  const res = await fetch(`${BASE}/tasks/${userId}`);
  return res.json();
}

export async function fetchMessages(userId) {
  const res = await fetch(`${BASE}/messages/${userId}`);
  return res.json();
}

export async function fetchSales(userId, period = "weekly") {
  const res = await fetch(`${BASE}/sales/${userId}/${period}`);
  return res.json();
}

export async function fetchRevenue(userId, period = "weekly") {
  const res = await fetch(`${BASE}/revenue/${userId}/${period}`);
  return res.json();
}

export async function fetchExpenses(userId, period = "weekly") {
  const res = await fetch(`${BASE}/expenses/${userId}/${period}`);
  return res.json();
}

export async function fetchCommunities() {
  const res = await fetch(`${BASE}/communities`);
  return res.json();
}

export const API = {
  // ... existing ones
  directory: (params = {}) => {
    const query = new URLSearchParams();
    if (params.role)   query.append("role",   params.role);
    if (params.county) query.append("county", params.county);
    if (params.search) query.append("search", params.search);
    const str = query.toString();
    return `${BASE_URL}/directory${str ? `?${str}` : ""}`;
  },
};