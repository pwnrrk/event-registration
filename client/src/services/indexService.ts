import { AppContextValue } from "../contexts/AppContext";

export async function getInformation(): Promise<AppContextValue | undefined> {
  const res = await fetch("/api", { method: "GET" });
  if (res.ok) return res.json();
}
