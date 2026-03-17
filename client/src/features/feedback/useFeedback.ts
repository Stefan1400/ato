import { getFeedback } from "./feedback.api";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedback = () => {
    return useQuery({
        queryKey: ["feedback"],
        queryFn: getFeedback,
        staleTime: 60 * 1000,
    });
};