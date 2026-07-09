import { useQuery } from "@tanstack/react-query";
import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { getProducts } from "@/api/products";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea"];

function buildChartData(products) {
  const grouped = {};

  products.forEach((product) => {
    const type = product.frameType || "Unknown";
    grouped[type] = (grouped[type] || 0) + 1;
  });

  const entries = Object.entries(grouped).map(([frameType, count], i) => ({
    frameType,
    count,
    fill: COLORS[i % COLORS.length],
  }));

  if (entries.length > 5) {
    const sorted = [...entries].sort((a, b) => b.count - a.count);
    const top = sorted.slice(0, 4);
    const otherCount = sorted.slice(4).reduce((sum, e) => sum + e.count, 0);
    return [...top, { frameType: "Other", count: otherCount, fill: COLORS[4] }];
  }

  return entries;
}

export default function FrameTypeChart() {
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

  const chartConfig = chartData.reduce((config, item) => {
    config[item.frameType] = { label: item.frameType };
    return config;
  }, {});

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Frame Type Breakdown
      </h3>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[280px]"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="frameType"
            innerRadius={60}
          >
            {chartData.map((entry) => (
              <Cell key={entry.frameType} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent />}
            wrapperStyle={{ fontSize: "12px", flexWrap: "wrap" }}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
