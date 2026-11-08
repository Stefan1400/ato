import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { registerUser, loginUser, createGuestUser, convertGuestAccount, getUser, logoutUser, deleteUser, changePassword } from "./auth.api";
import { useContext } from "react";
import { AuthContext } from "../../app/AuthProvider";
import type { AuthContextType } from "../../app/AuthProvider";
import type { User } from "./auth.types";

const updateUserQuery = async (queryClient: ReturnType<typeof useQueryClient>, user: User) => {
    await queryClient.cancelQueries({ queryKey: ["user"] });
    queryClient.setQueryData(["user"], user);
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
       mutationFn: registerUser,
       onSuccess: ({ user }) => updateUserQuery(queryClient, user),
   });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: ({ user }) => updateUserQuery(queryClient, user),
    });
};

export const useCreateGuest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGuestUser,
        onSuccess: ({ user }) => updateUserQuery(queryClient, user),
    });
};

export const useConvertGuest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: convertGuestAccount,
        onSuccess: ({ user }) => updateUserQuery(queryClient, user),
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
            queryClient.removeQueries();
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

export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
    });
};