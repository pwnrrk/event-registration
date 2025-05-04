import { Query } from "../interfaces/query";
import { User } from "../interfaces/user";

type UserQuery = Query & {
  phone?: string;
} & Record<string, string>;

export async function getUsers(query?: UserQuery): Promise<User[] | null> {
  const params = new URLSearchParams(query);
  const res = await fetch(`/api/users?${params.toString()}`, { method: "GET" });
  if (res.ok) return res.json();
  return null;
}

export async function getUserById(id?: string): Promise<User | null> {
  if (!id) return null;
  const res = await fetch(`/api/users/${id}`, { method: "GET" });
  if (res.ok) return res.json();
  return null;
}

export async function createUser(input: Partial<User>): Promise<User> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (res.ok) return res.json();

  throw new Error(res.statusText);
}
