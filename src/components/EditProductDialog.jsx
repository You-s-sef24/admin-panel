import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const [formData, setFormData] = useState(
    product || {
      name: { en: "", ar: "" },
      desc: { en: "", ar: "" },
      price: "",
      dimensions: "",
      image: null,
    },
  );
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product, open]);

  const formSchema = z.object({
    name: z.object({
      en: z.string().min(1, "English name is required"),
      ar: z.string().min(1, "Arabic name is required"),
    }),
    desc: z.object({
      en: z.string().min(1, "English description is required"),
      ar: z.string().min(1, "Arabic description is required"),
    }),
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
        desc: formData.desc,
        price: formData.price,
        dimensions: formData.dimensions,
        image: formData.image,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            name: { en: "", ar: "" },
            desc: { en: "", ar: "" },
            price: "",
            dimensions: "",
            image: null,
          });
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={show} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("products.editProductTitle")}</DialogTitle>
          <DialogDescription>
            {t("products.editProductDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name-en">{t("products.name")}</Label>
              <Input
                id="name-en"
                name="name-en"
                placeholder={t("products.englishNamePlaceholder")}
                value={formData.name?.en || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: { ...formData.name, en: e.target.value },
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name-ar">{t("products.arabicName")}</Label>
              <Input
                id="name-ar"
                name="name-ar"
                placeholder={t("products.arabicNamePlaceholder")}
                value={formData.name?.ar || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: { ...formData.name, ar: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="desc-en">{t("products.desc")}</Label>
              <Textarea
                id="desc-en"
                name="desc-en"
                className="resize-none h-25"
                placeholder={t("products.englishDescPlaceholder")}
                value={formData.desc?.en || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    desc: { ...formData.desc, en: e.target.value },
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="desc-ar">{t("products.descArabic")}</Label>
              <Textarea
                id="desc-ar"
                name="desc-ar"
                className="resize-none h-25"
                placeholder={t("products.arabicDescPlaceholder")}
                value={formData.desc?.ar || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    desc: { ...formData.desc, ar: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="dimensions">
                {t("products.dimensionsLabel")}
              </Label>
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
