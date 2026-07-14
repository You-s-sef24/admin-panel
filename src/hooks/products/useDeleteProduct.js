import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { deleteProduct } from "@/api/products";

export function useDeleteProduct() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast(t("products.deleteSuccess"));
        },
        onError: () => toast(t("products.deleteError")),
    });
}