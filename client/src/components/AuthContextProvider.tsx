import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { AuthContext } from "../contexts/AuthContext";
import * as AuthService from "../services/authService";

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const auth = useQuery({
    queryKey: ["auth"],
    queryFn: AuthService.checkLogin,
  });

  async function login(username: string, password: string) {
    try {
      await AuthService.login(username, password);
      auth.refetch();
      return true;
    } catch (err) {
      if (err instanceof Error) {
        window.alert(err.message);
      }
      return false;
    }
  }

  async function logout() {
    try {
      await AuthService.logout();
      window.location.href = "/";
    } catch (err) {
      if (err instanceof Error) {
        window.alert(err.message);
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        username: auth.data?.username,
        isLoggedIn: auth.data !== undefined && !auth.error,
        login,
        logout,
        isLoading: auth.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
