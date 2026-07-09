import { useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetOrders } from "@/hooks/orders/useGetOrders";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/formatDate";

const statusStyles = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
};
export function OrdersTable({ search = "", status = "" }) {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError } = useGetOrders();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading orders...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load orders</p>;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customerName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = !status || order.status === status;
    return matchesSearch && matchesStatus;
  });

  function calculateTotalPrice(items) {
    return items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
  }

  function calculateItems(items) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  return (
    <div className="border rounded-2xl p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-6">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-indigo-600 dark:text-indigo-400">
                  ORD-{order.id}
                </TableCell>
                <TableCell className="font-medium">
                  {order.customerName}
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{calculateItems(order.items)}</TableCell>
                <TableCell>${calculateTotalPrice(order.items)}</TableCell>
                <TableCell>
                  {" "}
                  <Badge
                    className={
                      statusStyles[order.status] || "bg-gray-100 text-gray-700"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <EyeIcon className="size-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
