import { createProduct } from "@/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function useAddProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product added successfully!");
        },
        onError: () => {
            toast.error("Failed to add product. Please try again.");
        }
    })
}
