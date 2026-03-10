import { useMutation } from "@tanstack/react-query";
import { addSession } from "./tracker.api";

export const useAddSession = () => {   
    return useMutation({
       mutationFn: addSession
   });
};