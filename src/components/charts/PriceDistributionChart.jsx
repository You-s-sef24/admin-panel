import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getProducts } from "@/api/products";

const RANGES = [
  { label: "$0-50", min: 0, max: 50 },
  { label: "$50-100", min: 50, max: 100 },
  { label: "$100-200", min: 100, max: 200 },
  { label: "$200-500", min: 200, max: 500 },
  { label: "$500+", min: 500, max: Infinity },
];

function buildChartData(products) {
  return RANGES.map((range) => ({
    range: range.label,
    count: products.filter((p) => p.price >= range.min && p.price < range.max)
      .length,
  }));
}

const chartConfig = {
  count: { label: "Products", color: "#2563eb" },
};

export default function PriceDistributionChart() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading chart...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load product data</p>;

  const chartData = buildChartData(products);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">Price Distribution</h3>
      <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="range" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
