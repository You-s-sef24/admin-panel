"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useGetProducts } from "@/hooks/products/useGetProducts";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/langStore";

const CATEGORY_COLORS = {
  frames: "#4f46e5",
  decorations: "#f59e0b",
  boards: "#22c55e",
};

export default function ProductsByCategoryChart() {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const { data: products, isLoading, isError } = useGetProducts();

  function getCategoryLabel(category) {
    if (!category) return t("dashboard.unknownCategory", "Unknown");
    return (
      (language === "en" ? category.en : category.ar) ||
      category.en ||
      category.id
    );
  }

  function buildCategoryData(products) {
    const totals = {};
    const labels = {};

    (products ?? []).forEach((product) => {
      const key = product.category?.id || "unknown";
      totals[key] = (totals[key] || 0) + 1;
      labels[key] = getCategoryLabel(product.category);
    });

    return Object.entries(totals).map(([key, count]) => ({
      category: key,
      label: labels[key],
      count,
      fill: CATEGORY_COLORS[key] || "#94a3b8",
    }));
  }

  const chartData = buildCategoryData(products);

  const chartConfig = Object.fromEntries(
    chartData.map((item) => [
      item.category,
      {
        label: item.label,
        color: item.fill,
      },
    ]),
  );

  if (isLoading)
    return (
      <p className="text-sm text-gray-500">{t("dashboard.loadingChart")}</p>
    );
  if (isError)
    return <p className="text-sm text-red-500">{t("dashboard.chartError")}</p>;

  if (chartData.length === 0)
    return (
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
        dir="ltr"
      >
        <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
          {t("dashboard.productsByCategory")}
        </h3>
        <p className="text-sm text-gray-500">{t("products.noResults")}</p>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6" dir="ltr">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
        {t("dashboard.productsByCategory")}
      </h3>
      <ChartContainer
        config={chartConfig}
        className="w-full h-[280px] aspect-auto mx-auto"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="category"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.category} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="category" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
