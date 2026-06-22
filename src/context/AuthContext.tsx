"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

type AuthContextType = {
  user: any;
  isLoggedIn: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  
  const value = {
    user: session?.user || null,
    isLoggedIn: !!session?.user,
    loading: status === "loading",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
