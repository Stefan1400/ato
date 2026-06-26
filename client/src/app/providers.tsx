import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./AuthProvider";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "../components/Toast";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
   return (
      <BrowserRouter>
         <QueryClientProvider client={queryClient}>
            <AuthProvider>
               <ToastProvider>
                  {children}
               </ToastProvider>
            </AuthProvider>
         </QueryClientProvider>
      </BrowserRouter>
   );
};