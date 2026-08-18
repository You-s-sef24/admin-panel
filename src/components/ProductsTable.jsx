import { PencilIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteProductDialog } from "@/components/DeleteProductDialog";
import { useGetProducts } from "@/hooks/products/useGetProducts";
import EditProductDialog from "./EditProductDialog";
import { useLanguageStore } from "@/store/langStore";

export function ProductsTable({ search = "" }) {
  const language = useLanguageStore((s) => s.language);
  const { t } = useTranslation();
  const { data: products, isLoading, isError } = useGetProducts();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading products...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load products</p>;

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      (product.name.en || "").toLowerCase().includes(query) ||
      (product.name.ar || "").toLowerCase().includes(query) ||
      (product.category.en || "").toLowerCase().includes(query) ||
      (product.category.ar || "").toLowerCase().includes(query)
    );
  });

  return (
    <>
      <h1 className="mb-2">
        {filteredProducts.length} {t("products.productFound")}
      </h1>
      <div className="border rounded-2xl p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">
                {t("products.image")}
              </TableHead>
              <TableHead className="text-start">
                {t("products.product")}
              </TableHead>
              <TableHead className="text-start">
                {t("products.category")}
              </TableHead>
              <TableHead className="text-start">
                {t("products.price")}
              </TableHead>
              <TableHead className="text-start">
                {t("products.dimensions")}
              </TableHead>
              <TableHead className="text-end">
                {t("products.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-6"
                >
                  {t("products.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const displayName =
                  language === "en"
                    ? product.name.en
                    : product.name.ar || product.name.en;
                const displayCategory =
                  language === "en"
                    ? product.category.en
                    : product.category.ar || product.name.en;
                const thumbnail = product.images?.[0];

                return (
                  <TableRow key={product.id}>
                    <TableCell className="text-start">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={displayName}
                          className="object-cover rounded-md size-16"
                        />
                      ) : (
                        <div className="size-16 rounded-md bg-gray-100 dark:bg-zinc-800" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-start">
                      {displayName}
                    </TableCell>
                    <TableCell className="font-medium text-start">
                      {displayCategory}
                    </TableCell>
                    <TableCell className="text-start">
                      {product.price} L.E.
                    </TableCell>
                    <TableCell className="text-start">
                      {product.dimensions} {t("products.in")}
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-2">
                        <EditProductDialog
                          product={product}
                          show={
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8"
                            >
                              <PencilIcon className="size-4" />
                              <span className="sr-only">
                                {t("products.edit")}
                              </span>
                            </Button>
                          }
                        />
                        <DeleteProductDialog product={product} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
