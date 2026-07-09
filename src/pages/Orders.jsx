import Header from "@/components/layout/Header";
import { OrdersTable } from "@/components/OrdersTable";
import { useState } from "react";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  return (
    <div>
      <Header title="Orders" />
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div>
            <input
              placeholder="Search orders..."
              type="search"
              className="border border-gray-300 rounded-md p-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-md p-2 ml-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
        <OrdersTable search={search} status={status} />
      </div>
    </div>
  );
}
