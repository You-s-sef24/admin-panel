import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { useGetOrders } from "@/hooks/orders/useGetOrders";

const statusStyles = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-purple-100 text-purple-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-CA"); // YYYY-MM-DD
}

export default function RecentOrdersTable() {
  const { data: orders, isLoading, isError } = useGetOrders();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading orders...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load orders</p>;

  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-semibold text-lg mb-4">Recent orders</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium text-indigo-600">
                ORD-{order.id}
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell className="text-gray-500">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    statusStyles[order.status] || "bg-gray-100 text-gray-700"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${order.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
