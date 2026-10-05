import { createContext, useEffect, useState } from "react";
import type { User } from "../features/auth/auth.types";
import { useGetUser } from "../features/auth/useAuth";
import LoadingScreen from "../components/LoadingScreen";

export type AuthContextType = {
   user: User | undefined;
   isLoading: boolean;
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

   if (isAuthLoading) return <LoadingScreen text='Loading...' />

   return (
      <AuthContext.Provider value={{ user, isLoading: isAuthLoading, setUser }}>
         { children }
      </AuthContext.Provider>
   );
};