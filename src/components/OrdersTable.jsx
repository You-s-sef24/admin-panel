import { useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  delivered:
    "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
};

export function OrdersTable({ search = "", status = "" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: orders, isLoading, isError } = useGetOrders();

  if (isLoading)
    return <p className="text-sm text-gray-500">{t("orders.loading")}</p>;
  if (isError)
    return <p className="text-sm text-red-500">{t("orders.loadError")}</p>;

  const filteredOrders = (orders ?? []).filter((order) => {
    const matchesSearch = (order.customerName || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = !status || order.status === status;
    return matchesSearch && matchesStatus;
  });

  function calculateTotalPrice(items) {
    return (items || []).reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
  }

  function calculateItems(items) {
    return (items || []).reduce((sum, item) => sum + item.quantity, 0);
  }

  return (
    <div className="border rounded-2xl p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-start">{t("orders.orderId")}</TableHead>
            <TableHead className="text-start">{t("orders.customer")}</TableHead>
            <TableHead className="text-start">{t("orders.date")}</TableHead>
            <TableHead className="text-start">{t("orders.items")}</TableHead>
            <TableHead className="text-start">{t("orders.total")}</TableHead>
            <TableHead className="text-start">{t("orders.status")}</TableHead>
            <TableHead className="text-end">{t("orders.view")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-6">
                {t("orders.noResults")}
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-indigo-600 dark:text-indigo-400 text-start">
                  ORD-{order.id}
                </TableCell>
                <TableCell className="font-medium text-start">
                  {order.customerName}
                </TableCell>
                <TableCell className="text-start">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-start">
                  {calculateItems(order.items)}
                </TableCell>
                <TableCell className="text-start">
                  {calculateTotalPrice(order.items)} L.E.
                </TableCell>
                <TableCell className="text-start">
                  <Badge
                    className={
                      statusStyles[order.status] ||
                      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }
                  >
                    {t(`orders.${order.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <EyeIcon className="size-4" />
                    <span className="sr-only">{t("orders.view")}</span>
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
