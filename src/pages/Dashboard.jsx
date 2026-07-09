import { getOrders } from "@/api/orders";
import { getProducts } from "@/api/products";
import { getUsers } from "@/api/users";
import AnalyticsCard from "@/components/AnalyticsCard";
import FrameTypeChart from "@/components/charts/FrameTypeChart";
import SalesTrendChart from "@/components/charts/PriceDistributionChart";
import RecentOrdersTable from "@/components/charts/ReecentOrdersTable";
import TopProductsChart from "@/components/charts/TopProductsChart";
import Header from "@/components/layout/Header";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCartIcon, TrendingUp, UsersIcon } from "lucide-react";

export default function Dashboard() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  const totalRevenue =
    orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen">
      <Header title="Dashboard" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <AnalyticsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<TrendingUp />}
        />
        <AnalyticsCard
          title="Total Users"
          value={users?.length || 0}
          icon={<UsersIcon />}
        />
        <AnalyticsCard
          title="Total Orders"
          value={orders?.length || 0}
          icon={<ShoppingCartIcon />}
        />
        <AnalyticsCard
          title="Total Products"
          value={products?.length || 0}
          icon={<Package />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <SalesTrendChart />
        <FrameTypeChart />
      </div>
      <div className="p-4">
        <TopProductsChart />
      </div>
      <div className="p-4">
        <RecentOrdersTable />
      </div>
    </div>
  );
}
