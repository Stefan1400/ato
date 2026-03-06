import { useMutation } from "@tanstack/react-query";
import { registerUser } from "./auth.api";

export const useRegister = () => {
   return useMutation({
       mutationFn: registerUser
   });
};