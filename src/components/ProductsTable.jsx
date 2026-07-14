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

export function ProductsTable({ search = "" }) {
  const { t } = useTranslation();
  const { data: products, isLoading, isError } = useGetProducts();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading products...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load products</p>;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="border rounded-2xl p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-start">{t("products.image")}</TableHead>
            <TableHead className="text-start">
              {t("products.product")}
            </TableHead>
            <TableHead className="text-start">{t("products.price")}</TableHead>
            <TableHead className="text-start">
              {t("products.dimensions")}
            </TableHead>
            <TableHead className="text-end">{t("products.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                {t("products.noResults")}
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="text-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover rounded-md size-16"
                  />
                </TableCell>
                <TableCell className="font-medium text-start">
                  {product.name}
                </TableCell>
                <TableCell className="text-start">${product.price}</TableCell>
                <TableCell className="text-start">
                  {product.dimensions} in
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
                          <span className="sr-only">{t("products.edit")}</span>
                        </Button>
                      }
                    />
                    <DeleteProductDialog product={product} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
