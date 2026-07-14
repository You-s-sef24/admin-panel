import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useGetOrders } from "@/hooks/orders/useGetOrders";
import { useTranslation } from "react-i18next";

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Delivered: "#22c55e",
};

const chartConfig = {
  Pending: { label: "Pending", color: STATUS_COLORS.Pending },
  Delivered: { label: "Delivered", color: STATUS_COLORS.Delivered },
};

export default function OrdersByStatusChart() {
  const { t } = useTranslation();
  const { data: orders, isLoading, isError } = useGetOrders();

  function buildStatusData(orders) {
    const totals = {};

    orders.forEach((order) => {
      const status = order.status || "Unknown";
      totals[status] = (totals[status] || 0) + 1;
    });

    return Object.entries(totals).map(([status, count]) => ({
      status,
      count,
      fill: STATUS_COLORS[status] || "#94a3b8",
    }));
  }

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading chart...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load order data</p>;

  const chartData = buildStatusData(orders);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6" dir="ltr">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
        {t("dashboard.ordersByStatus")}
      </h3>
      <ChartContainer
        config={chartConfig}
        className="w-full h-[280px] aspect-auto mx-auto"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="status" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
