import { PropsWithChildren, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { User } from "../interfaces/user";
import { getUserById, getUsers } from "../services/userService";

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [userId, setUserId] = useState<string | null>(null);
  const { data, isLoading } = useQuery<User | null>({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId || undefined),
  });

  async function login(phone: string): Promise<boolean> {
    const users = await getUsers({ phone });
    if (!users || users.length === 0) return false;
    setUserId(users[0]._id);
    return true;
  }

  return (
    <AuthContext.Provider
      value={{
        user: data || null,
        isLoading,
        isLoggedIn: data !== null,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
