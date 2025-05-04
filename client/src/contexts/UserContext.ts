import { createContext, useContext } from "react";
import { User } from "../interfaces/user";

export interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login(phone: string): Promise<boolean>;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: false,
  isLoggedIn: false,
  login() {
    throw new Error("Function not implemented");
  },
});

export function useUserContext() {
  return useContext(UserContext);
}
