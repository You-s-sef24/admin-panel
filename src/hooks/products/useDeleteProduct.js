import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteProduct } from "@/api/products";

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast("Product deleted");
        },
        onError: () => toast("Failed to delete product"),
    });
}