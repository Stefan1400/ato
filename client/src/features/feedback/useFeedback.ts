import { getFeedback } from "./feedback.api";
import { useMutation } from "@tanstack/react-query";

export const useGetFeedback = () => {
   return useMutation({
        mutationFn: getFeedback,
    });
};