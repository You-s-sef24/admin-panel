import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetOrders } from "@/hooks/orders/useGetOrders";

const chartConfig = {
  quantity: { label: "Units Sold", color: "#4f46e5" },
};

function buildTopProductsData(orders) {
  const totals = {};

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      totals[item.productName] =
        (totals[item.productName] || 0) + item.quantity;
    });
  });

  return Object.entries(totals)
    .map(([productName, quantity]) => ({ productName, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6);
}

export default function TopProductsChart() {
  const { data: orders, isLoading, isError } = useGetOrders();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading chart...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load order data</p>;

  const chartData = buildTopProductsData(orders);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-semibold text-lg mb-4">Top products by sales</h3>
      <ChartContainer
        config={chartConfig}
        className="w-full h-[280px] aspect-auto"
      >
        <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="productName"
            tickLine={false}
            axisLine={false}
            width={140}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="quantity"
            fill="#4f46e5"
            radius={[0, 4, 4, 0]}
            barSize={24}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
