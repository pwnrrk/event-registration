import { Query } from "../interfaces/query";
import { Seat } from "../interfaces/seat";

export async function getSeats(
  query?: Query & Record<string, string>
): Promise<Seat[] | null> {
  const params = new URLSearchParams(query);
  const res = await fetch(`/api/seats?${params.toString()}`, { method: "GET" });
  if (res.ok) return res.json();
  return null;
}

export async function assignSeat(
  seatId: string,
  userId: string
): Promise<Seat | null> {
  const res = await fetch(`/api/seats/${seatId}/user/${userId}`, {
    method: "PUT",
    credentials: "include",
  });
  if (res.ok) return res.json();

  throw await res.json();
}

export async function removeUserFromSeat(id: string): Promise<Seat> {
  const res = await fetch(`/api/seats/${id}/user`, {
    method: "DELETE",
    credentials: "include",
  });
  if (res.ok) return res.json();

  throw await res.json();
}
