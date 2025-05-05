import { createContext, useContext } from "react";
import { Seat } from "../interfaces/seat";

export interface SeatContextValue {
  seats: Seat[];
  isLoading: boolean;
  refetch(): void;
}

export const SeatContext = createContext<SeatContextValue>({
  seats: [],
  isLoading: false,
  refetch: function (): void {
    throw new Error("Function not implemented.");
  },
});

export function useSeatContext() {
  return useContext(SeatContext);
}
