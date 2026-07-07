import { useAddProduct } from "@/hooks/useAddProduct";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import z from "zod";
import { toast } from "sonner";

export default function AddProductDialog({ show }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    dimensions: "",
    frameType: "",
    image: null,
  });
  const { mutate: createProduct } = useAddProduct();

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    dimensions: z.string().optional(),
    frameType: z.enum(["Wood", "Metal", "None"]).optional(),
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
        price: formData.price,
        dimensions: formData.dimensions,
        frameType: formData.frameType,
        image: formData.image,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            name: "",
            price: "",
            dimensions: "",
            frameType: "",
            image: null,
          });
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={show} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add new artwork to your catalog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Golden Hour Portrait"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price ($)</Label>
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
            <Label htmlFor="image">Image</Label>
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
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              name="dimensions"
              placeholder="16x20 in"
              value={formData.dimensions || ""}
              onChange={(e) =>
                setFormData({ ...formData, dimensions: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="frameType">Frame Type</Label>
            <Select
              name="frameType"
              value={formData.frameType || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, frameType: value })
              }
            >
              <SelectTrigger id="frameType" className="w-full">
                <SelectValue placeholder="Select frame type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wood">Wood</SelectItem>
                <SelectItem value="Metal">Metal</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
