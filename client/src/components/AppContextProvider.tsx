import { PropsWithChildren } from "react";
import { AppContext } from "../contexts/AppContext";
import { useQuery } from "@tanstack/react-query";
import { getInformation } from "../services/indexService";

export default function AppContextProvider({ children }: PropsWithChildren) {
  const { data, refetch } = useQuery({
    queryKey: ["index"],
    queryFn: getInformation,
  });

  return (
    <AppContext.Provider value={{ ...data, refetch }}>
      {children}
    </AppContext.Provider>
  );
}
