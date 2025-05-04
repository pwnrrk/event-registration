import { createContext, useContext } from "react";
import { Seat } from "../interfaces/seat";

export interface SeatContextValue {
  seats: Seat[];
  total: number;
  available: number;
  isLoading: boolean;
}

export const SeatContext = createContext<SeatContextValue>({
  seats: [],
  total: 0,
  available: 0,
  isLoading: false,
});

export function useSeatContext() {
  return useContext(SeatContext);
}
