import Header from "@/components/layout/Header";
import { OrdersTable } from "@/components/OrdersTable";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div>
      <Header title={t("sidebar.orders")} />
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <input
              placeholder={t("orders.searchPlaceholder", "Search orders...")}
              type="search"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md p-2 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md p-2 h-10"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">{t("orders.allStatus", "All Status")}</option>
              <option value="Pending">{t("orders.Pending")}</option>
              <option value="Delivered">
                {t("orders.Delivered")}
              </option>
            </select>
          </div>
        </div>
        <OrdersTable search={search} status={status} />
      </div>
    </div>
  );
}
