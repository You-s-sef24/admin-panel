import { updateProduct } from "@/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useUpdateProduct() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast.success(t("products.updateSuccess"));
        },
        onError: (error) => {
            toast.error(t("products.updateError", { message: error.message }));
        }
    })
}