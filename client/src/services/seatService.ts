import { Query } from "../interfaces/query";
import { Seat } from "../interfaces/seat";

export async function getSeats(
  query?: Record<string, string> & Query
): Promise<Seat[] | null> {
  const params = new URLSearchParams(query);
  const res = await fetch(`/api/users?${params.toString()}`, { method: "GET" });
  if (res.ok) return res.json();
  return null;
}
