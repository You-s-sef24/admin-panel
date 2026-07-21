import { useAddProduct } from "@/hooks/products/useAddProduct";
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
import { useState } from "react";
import z from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CATEGORY_OPTIONS = [
  { id: "frames", en: "Frames", ar: "إطارات" },
  { id: "decorations", en: "Decorations", ar: "ديكورات" },
  { id: "boards", en: "Boards", ar: "لوحات" },
];

export default function AddProductDialog({ show }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: {
      en: "",
      ar: "",
    },
    desc: {
      ar: "",
      en: "",
    },
    price: "",
    dimensions: "",
    category: CATEGORY_OPTIONS[0],
    image: null,
  });
  const { mutate: createProduct, isPending } = useAddProduct();

  const formSchema = z.object({
    name: z.object({
      en: z.string().min(1, "English name is required"),
    }),
    desc: z.object({
      en: z.string().min(1, "English description is required"),
    }),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    dimensions: z.string().optional(),
    category: z.object({
      id: z.string().min(1, "Category is required"),
      en: z.string().min(1),
      ar: z.string().min(1),
    }),
    image: z.instanceof(File, { message: "Please upload an image" }),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const parsedData = formSchema.safeParse(formData);
    if (!parsedData.success) {
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError || "Please check your input");
      return;
    }

    createProduct(
      {
        name: formData.name,
        desc: formData.desc,
        price: formData.price,
        dimensions: formData.dimensions,
        category: formData.category,
        image: formData.image,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            name: {
              en: "",
              ar: "",
            },
            desc: {
              en: "",
              ar: "",
            },
            price: "",
            dimensions: "",
            category: CATEGORY_OPTIONS[0],
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
          <DialogTitle>{t("products.addProductTitle")}</DialogTitle>
          <DialogDescription>
            {t("products.addProductDescription")}
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
                value={formData.name.en || ""}
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
                value={formData.name.ar || ""}
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
                value={formData.desc.en || ""}
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
                value={formData.desc.ar || ""}
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
              <Label htmlFor="category">{t("products.category")}</Label>
              <Select
                value={formData.category.id}
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
                    {lang === "en"
                      ? formData.category.en
                      : formData.category.ar}
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

          <DialogFooter>
            <DialogClose
              disabled={isPending}
              render={<Button variant="outline">{t("products.cancel")}</Button>}
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
