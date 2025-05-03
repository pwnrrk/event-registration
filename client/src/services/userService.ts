export async function getUsers() {
  const res = await fetch("/api/users", { method: "GET" });
  if (res.ok) return res.json();
}
