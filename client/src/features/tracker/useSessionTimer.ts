import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { addSession } from "./tracker.api";
import type { addSessionRequest, sessionResponse } from "./tracker.types";

export const useAddSession = (options?: UseMutationOptions<sessionResponse, Error, addSessionRequest>) => {   
    const queryClient = useQueryClient();
    
    return useMutation<sessionResponse, Error, addSessionRequest>({
       mutationFn: addSession,
       ...options,
       onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['feedback'] });
      }
   });
};