import { PencilIcon } from "lucide-react";
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
import { useGetProducts } from "@/hooks/useGetProducts";
import EditProductDialog from "./EditProductDialog";

export function ProductsTable({ search = "", frameType = "" }) {
  const { data: products, isLoading, isError } = useGetProducts();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading products...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load products</p>;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFrame = !frameType || product.frameType === frameType;
    return matchesSearch && matchesFrame;
  });

  return (
    <div className="border rounded-2xl p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Dimensions</TableHead>
            <TableHead>Frame</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover rounded-md size-16"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.dimensions} in</TableCell>
                <TableCell>{product.frameType}</TableCell>
                <TableCell className="text-right">
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
                          <span className="sr-only">Edit</span>
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
