import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "./ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X } from "lucide-react";

const CATEGORY_OPTIONS = [
  { id: "accessories", en: "3D Accessories", ar: "إكسسوارات ثلاثية الأبعاد" },
  {
    id: "acrylic",
    en: "Acrylic Signs & Designs",
    ar: "لافتات وتصاميم من الأكريليك",
  }
];

const MAX_IMAGES = 3;

export default function EditProductDialog({ show, product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(
    product || {
      name: { en: "", ar: "" },
      desc: { en: "", ar: "" },
      price: "",
      dimensions: "",
      category: CATEGORY_OPTIONS[0],
      images: [],
      featured: false,
    },
  );
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setFormData({ ...product, images: product.images || [] });
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
    price: z.coerce.number().min(0, "Price must be a positive number"),
    dimensions: z.string().optional(),
    category: z.object({
      id: z.string().min(1, "Category is required"),
      en: z.string().min(1),
      ar: z.string().min(1),
    }),
    images: z
      .array(z.union([z.string(), z.instanceof(File)]))
      .min(1, "Please upload at least one image")
      .max(MAX_IMAGES, `You can upload up to ${MAX_IMAGES} images`),
    featured: z.boolean().optional(),
  });

  function handleImageChange(e) {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;

    const remainingSlots = MAX_IMAGES - formData.images.length;
    if (selected.length > remainingSlots) {
      toast.error(t("products.maxImagesError", `You can upload up to ${MAX_IMAGES} images`));
    }

    const accepted = selected.slice(0, remainingSlots);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...accepted] }));
    e.target.value = "";
  }

  function removeImage(index) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

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
        category: formData.category,
        images: formData.images,
        featured: formData.featured,
      },
      {
        onSuccess: () => {
          setOpen(false);
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="images">
                {t("products.image")} ({formData.images.length}/{MAX_IMAGES})
              </Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                disabled={formData.images.length >= MAX_IMAGES}
                onChange={handleImageChange}
              />
              {formData.images.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-1">
                  {formData.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-zinc-800"
                    >
                      <img
                        src={
                          typeof img === "string"
                            ? img
                            : URL.createObjectURL(img)
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">{t("products.category")}</Label>
              <Select
                value={formData.category?.id || ""}
                onValueChange={(value) => {
                  const selected = CATEGORY_OPTIONS.find((c) => c.id === value);
                  if (selected) {
                    setFormData({ ...formData, category: selected });
                  }
                }}
              >
                <SelectTrigger className="w-[200px] border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100">
                  <SelectValue
                    placeholder={t(
                      "products.categoryPlaceholder",
                      "Select category",
                    )}
                  >
                    {formData.category?.id &&
                      (lang === "en"
                        ? formData.category.en
                        : formData.category.ar)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {lang === "en" ? cat.en : cat.ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: checked === true })
              }
            />
            <Label htmlFor="featured" className="cursor-pointer">
              {t("products.featured", "Featured product")}
            </Label>
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