import { createContext, useContext } from "react";

export interface AuthContextValue {
  username?: string;
  isLoading: boolean;
  isLoggedIn: boolean;
  login(username: string, password: string): Promise<boolean>;
  logout(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  isLoading: false,
  isLoggedIn: false,
  login() {
    throw new Error("Function not implemented");
  },
  logout: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
});

export function useAuthContext() {
  return useContext(AuthContext);
}
