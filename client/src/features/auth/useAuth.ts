import { QueryClient, useMutation, useQuery, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { registerUser, loginUser, getUser, logoutUser, deleteUser } from "./auth.api";
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

export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
    const { setUser } = useContext(AuthContext) as AuthContextType;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,
        ...options,
        onSuccess: () => {
            setUser(undefined);
            queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    });
};

export const useDeleteUser = () => {
    const { setUser } = useContext(AuthContext) as AuthContextType;
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            setUser(undefined);
            queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    });
};