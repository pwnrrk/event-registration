export async function getInformation() {
  const res = await fetch("/api", { method: "GET" });
  if (res.ok) return res.json();
}
