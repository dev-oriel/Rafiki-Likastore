import React from "react";
import { Users, Package, DollarSign, ListOrdered } from "lucide-react";

// You would fetch real stats from /api/admin/stats (a new endpoint)
const StatCard = ({ title, value, icon, colorClass }) => (
  <div
    className={`bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm rounded-lg p-6 flex items-center gap-4`}
  >
    <div
      className={`flex items-center justify-center size-12 rounded-full ${colorClass} bg-opacity-10`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {title}
      </p>
      <p className="text-3xl font-bold text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  // Mock stats
  const stats = {
    totalRevenue: 12500,
    totalOrders: 78,
    totalUsers: 32,
    totalProducts: 54,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          colorClass="text-green-500"
          icon={<DollarSign className="size-6 text-green-500" />}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          colorClass="text-amber-500"
          icon={<ListOrdered className="size-6 text-amber-500" />}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          colorClass="text-blue-500"
          icon={<Users className="size-6 text-blue-500" />}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          colorClass="text-purple-500"
          icon={<Package className="size-6 text-purple-500" />}
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Recent orders will be displayed here.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
