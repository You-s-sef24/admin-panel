import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/api/orders";

export function useGetOrder(id) {
    return useQuery({
        queryKey: ["orders", id],
        queryFn: () => getOrder(id),
        enabled: Boolean(id),
    });
}