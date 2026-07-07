import { updateProduct } from "@/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast.success("Product updated successfully");
        },
        onError: (error) => {
            toast.error("Failed to update product: " + error.message);
        }
    })
}