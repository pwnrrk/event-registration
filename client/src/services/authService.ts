export async function login(username: string, password: string) {
  const res = await fetch("/api/auth", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(res.statusText);
}

export async function checkLogin(): Promise<{ username: string }> {
  const res = await fetch("/api/auth", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function logout() {
  const res = await fetch("/api/auth", {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(res.statusText);
}
