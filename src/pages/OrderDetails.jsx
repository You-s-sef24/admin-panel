import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { useLanguageStore } from "@/store/langStore";

export default function OrderDetails() {
  const language = useLanguageStore((s) => s.language);
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useGetOrder(id);
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  if (isLoading)
    return <p className="p-4 text-sm text-gray-500">Loading order...</p>;
  if (isError || !order)
    return (
      <p className="p-4 text-sm text-red-500">{t("orderDetails.notFound")}</p>
    );

  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function handleStatusChange(newStatus) {
    updateOrder({ id: order.id, ...order, status: newStatus });
  }

  return (
    <div>
      <Header title={`${t("orderDetails.title")} ORD-${order.id}`} />
      <div className="p-4 flex flex-col gap-4">
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeftIcon className="size-4 me-1" />
          {t("orderDetails.back")}
        </Button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("orderDetails.customer")}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {order.customerName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("orderDetails.email")}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {order.customerEmail}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("orderDetails.date")}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {t("orderDetails.status")}
            </p>
            <Select
              value={order.status}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Delivered">
                  {t("orderDetails.Delivered")}
                </SelectItem>
                <SelectItem value="Pending">
                  {t("orderDetails.Pending")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("orderDetails.shippingAddress")}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {order.shippingAddress}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("orderDetails.items")}
          </h3>
          <div className="flex flex-col gap-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {language === "en"
                      ? item.productName.en
                      : item.productName.ar || item.productName.en}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("orderDetails.qty")}: {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  ${item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 font-semibold text-gray-900 dark:text-gray-100">
            <p>{t("orderDetails.total")}</p>
            <p>${total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
