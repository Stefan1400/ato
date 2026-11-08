import { createContext, useEffect, useState } from "react";
import type { User } from "../features/auth/auth.types";
import { useGetUser } from "../features/auth/useAuth";

export type AuthContextType = {
   user: User | undefined;
   isLoading: boolean;
   isInitialized?: boolean;
   setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   
   const [user, setUser] = useState<User>();
   const [isInitialized, setIsInitialized] = useState(false);

   const { data, isLoading } = useGetUser();

   useEffect(() => {
      if (isLoading) return;

      if (data) {
         setUser(data);
      }
      setIsInitialized(true);
   }, [data, isLoading]);

   const isAuthLoading = isLoading || !isInitialized;

   return (
      <AuthContext.Provider value={{ user, isLoading: isAuthLoading, isInitialized, setUser }}>
         { children }
      </AuthContext.Provider>
   );
};