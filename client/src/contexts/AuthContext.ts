import { createContext, useContext } from "react";
import { User } from "../interfaces/user";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login(phone: string): Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: false,
  isLoggedIn: false,
  login() {
    throw new Error("Function not implemented");
  },
});

export function useAuthContext() {
  return useContext(AuthContext);
}
