import { useState } from "react";
import Header from "@/components/layout/Header";
import { ProductsTable } from "@/components/ProductsTable";
import { Button } from "@/components/ui/button";
import AddProductDialog from "@/components/AddProductDialog";

export default function Products() {
  const [search, setSearch] = useState("");
  const [frameType, setFrameType] = useState("");

  return (
    <div>
      <Header title="Products" />
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div>
            <input
              placeholder="Search products..."
              type="search"
              className="border border-gray-300 rounded-md p-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-md p-2 ml-2"
              value={frameType}
              onChange={(e) => setFrameType(e.target.value)}
            >
              <option value="">All Frame Types</option>
              <option value="Metal">Metal</option>
              <option value="Wood">Wood</option>
              <option value="None">None</option>
            </select>
          </div>
          <AddProductDialog
            show={
              <Button className="bg-blue-600 text-white hover:bg-blue-800 transition-all cursor-pointer">
                + Add Product
              </Button>
            }
          />
        </div>

        <ProductsTable search={search} frameType={frameType} />
      </div>
    </div>
  );
}
