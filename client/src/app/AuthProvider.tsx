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

   const { data, isLoading } = useGetUser();

   useEffect(() => {
      if (data) {
         setUser(data);
      }
   }, [data]);

   return (
      <AuthContext.Provider value={{ user, isLoading, setUser }}>
         { children }
      </AuthContext.Provider>
   );
};