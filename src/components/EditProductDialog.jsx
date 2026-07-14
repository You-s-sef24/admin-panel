import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";
import z from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function EditProductDialog({ show, product }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(product || {});
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product, open]);

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0, "Price must be a positive number"),
    dimensions: z.string().optional(),
    image: z.union([z.string(), z.instanceof(File)]).optional(),
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!product) {
      toast.error(t("products.missingProductError"));
      return;
    }
    const validationResult = formSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      toast.error(firstError || "Please check your input");
      return;
    }

    updateProduct(
      {
        id: product.id,
        name: formData.name,
        price: formData.price,
        dimensions: formData.dimensions,
        image: formData.image,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({});
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={show} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("products.editProductTitle")}</DialogTitle>
          <DialogDescription>
            {t("products.editProductDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t("products.name")}</Label>
            <Input
              id="name"
              name="name"
              placeholder={t("products.namePlaceholder")}
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">{t("products.priceLabel")}</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="145"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="image">{t("products.image")}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFormData({ ...formData, image: e.target.files[0] });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dimensions">{t("products.dimensionsLabel")}</Label>
            <Input
              id="dimensions"
              name="dimensions"
              placeholder={t("products.dimensionsPlaceholder")}
              value={formData.dimensions || ""}
              onChange={(e) =>
                setFormData({ ...formData, dimensions: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">{t("products.cancel")}</Button>}
              disabled={isPending}
            />
            <Button
              className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-800 dark:hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50"
              type="submit"
              disabled={isPending}
            >
              {isPending ? t("products.saving") : t("products.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
