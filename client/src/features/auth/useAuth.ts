import { useMutation, useQuery } from "@tanstack/react-query";
import { registerUser, loginUser, getUser } from "./auth.api";

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