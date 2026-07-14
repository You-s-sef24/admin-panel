import { createProduct } from "@/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useAddProduct() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success(t("products.addSuccess"));
        },
        onError: () => {
            toast.error(t("products.addError"));
        }
    })
}