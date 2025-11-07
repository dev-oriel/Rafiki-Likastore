import React, { useState, useEffect } from "react";
import { Users, Package, DollarSign, ListOrdered, Loader } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

// Helper to format currency to KES
const formatCurrency = (amount) => {
  return `KES ${Number(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Stat Card Component
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

// Recent Orders Table Component
const RecentOrders = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400">
        No recent orders found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
              Order ID
            </th>
            <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
              User
            </th>
            <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
              Total
            </th>
            <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <td className="p-4 font-medium text-zinc-900 dark:text-white">
                ...{order._id.substring(18)}
              </td>
              <td className="p-4 text-zinc-600 dark:text-zinc-400">
                {order.user?.name || "N/A"}
              </td>
              <td className="p-4 text-zinc-600 dark:text-zinc-400">
                {formatCurrency(order.totalPrice)}
              </td>
              <td className="p-4">
                {order.isDelivered ? (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                    Delivered
                  </span>
                ) : order.isPaid ? (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Processing
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch all dashboard data from our new endpoint
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="size-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-red-500">Could not load dashboard data.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
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
        <RecentOrders orders={stats.recentOrders} />
      </div>
    </div>
  );
};

export default AdminDashboard;
