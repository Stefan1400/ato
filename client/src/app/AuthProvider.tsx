import { createContext, useState } from "react";
import type { User } from "../features/auth/auth.types";

export type AuthContextType = {
   user: User | undefined;
   setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   
   const [user, setUser] = useState<User>();

   return (
      <AuthContext.Provider value={{ user, setUser }}>
         { children }
      </AuthContext.Provider>
   );
};