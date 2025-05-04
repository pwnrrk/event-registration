import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { SeatContext } from "../contexts/SeatContext";
import { Seat } from "../interfaces/seat";
import { getInformation } from "../services/indexService";
import { getSeats } from "../services/seatService";

export default function SeatContextProvider({ children }: PropsWithChildren) {
  const { data, isLoading } = useQuery<Seat[] | null>({
    queryKey: ["seats"],
    queryFn: () => getSeats(),
  });

  const info = useQuery({
    queryKey: ["index"],
    queryFn: getInformation,
  });

  return (
    <SeatContext.Provider
      value={{
        seats: data || [],
        isLoading,
        total: info.data?.totalSeat || 0,
        available: info.data?.available || 0,
      }}
    >
      {children}
    </SeatContext.Provider>
  );
}
