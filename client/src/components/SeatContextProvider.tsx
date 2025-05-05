import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { SeatContext } from "../contexts/SeatContext";
import { Seat } from "../interfaces/seat";
import { getSeats } from "../services/seatService";

export default function SeatContextProvider({ children }: PropsWithChildren) {
  const { data, isLoading, refetch } = useQuery<Seat[] | null>({
    queryKey: ["seats"],
    queryFn: () => getSeats(),
  });

  return (
    <SeatContext.Provider
      value={{
        seats: data || [],
        isLoading,
        refetch,
      }}
    >
      {children}
    </SeatContext.Provider>
  );
}
