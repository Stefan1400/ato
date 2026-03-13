import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { registerUser, loginUser, getUser, logoutUser } from "./auth.api";
import { useContext } from "react";
import { AuthContext } from "../../app/AuthProvider";
import type { AuthContextType } from "../../app/AuthProvider";

export const useRegister = () => {   
    return useMutation({
       mutationFn: registerUser
   });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser
    });
};

export const useGetUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const data = await getUser();
            return data;
        },
        retry: false
    });
};

export const useLogout = () => {
    const { setUser } = useContext(AuthContext) as AuthContextType;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            setUser(undefined);
            queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    });
};