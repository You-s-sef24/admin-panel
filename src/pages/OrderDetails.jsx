import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetOrder } from "@/hooks/orders/useGetOrder";
import { useUpdateOrder } from "@/hooks/orders/useUpdateOrder";
import Header from "@/components/layout/Header";
import { formatDate } from "@/lib/formatDate";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useGetOrder(id);
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  if (isLoading)
    return <p className="p-4 text-sm text-gray-500">Loading order...</p>;
  if (isError || !order)
    return <p className="p-4 text-sm text-red-500">Order not found</p>;

  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function handleStatusChange(newStatus) {
    updateOrder({ id: order.id, ...order, status: newStatus });
  }

  return (
    <div>
      <Header title={`Order ORD-${order.id}`} />
      <div className="p-4 flex flex-col gap-4">
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeftIcon className="size-4 mr-1" />
          Back to Orders
        </Button>

        <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{order.customerEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <Select
              value={order.status}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500">Shipping Address</p>
            <p className="font-medium">{order.shippingAddress}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4">Items</h3>
          <div className="flex flex-col gap-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b pb-2 last:border-b-0"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t font-semibold">
            <p>Total</p>
            <p>${total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
