import { createContext, useContext } from "react";

export interface AppContextValue {
  totalSeat?: number;
  available?: number;
  totalUser?: number;
  refetch(): void;
}

export const AppContext = createContext<AppContextValue>({
  refetch: function (): void {
    throw new Error("Function not implemented.");
  },
});

export function useAppContext() {
  return useContext(AppContext);
}
