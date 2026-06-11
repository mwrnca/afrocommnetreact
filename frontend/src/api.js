const BASE = "http://localhost:8000";

// ── Auth ──
export function saveUser(user) {
  localStorage.setItem("user",     JSON.stringify(user));
  localStorage.setItem("userId",   String(user.id));
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userName", user.first_name);
}

export function getUser() {
  const stored = localStorage.getItem("user");
  if (stored) return JSON.parse(stored);
  // fallback to individual keys
  return {
    id:         localStorage.getItem("userId"),
    role:       localStorage.getItem("userRole"),
    first_name: localStorage.getItem("userName"),
  };
}

export function clearUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
}

export async function signup(formData) {
  const res = await fetch(`${BASE}/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Signup failed");
  return data;
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

// export async function fetchRevenue(userId, period = "weekly") {
//   const res = await fetch(`${BASE}/revenue/${userId}/${period}`);
//   return res.json();
// }

export async function fetchExpenses(userId, period = "weekly") {
  const res = await fetch(`${BASE}/expenses/${userId}/${period}`);
  return res.json();
}

export async function fetchCommunities() {
  const res = await fetch(`${BASE}/communities`);
  return res.json();
}

export async function fetchDirectory(params = {}) {
  const query = new URLSearchParams();
  if (params.role)   query.append("role",   params.role);
  if (params.county) query.append("county", params.county);
  if (params.search) query.append("search", params.search);
  const str = query.toString();
  const res = await fetch(`${BASE}/directory${str ? `?${str}` : ""}`);
  return res.json();
}

export async function fetchEmployees(businessId) {
  const res = await fetch(`${BASE}/employees/${businessId}`);
  return res.json();
}

export async function fetchAssignedTasks(employeeId) {
  const res = await fetch(`${BASE}/assigned-tasks/employee/${employeeId}`);
  return res.json();
}

export async function fetchNotices(businessId) {
  const res = await fetch(`${BASE}/notice-board/${businessId}`);
  return res.json();
}

export async function fetchBusinessLogs(businessId) {
  const res = await fetch(`${BASE}/logs/business/${businessId}`);
  return res.json();
}

export async function fetchEmployeeLogs(employeeId) {
  const res = await fetch(`${BASE}/logs/employee/${employeeId}`);
  return res.json();
}