import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/orders"); // Use admin route
      setOrders(data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    if (window.confirm("Mark this order as delivered?")) {
      try {
        await api.put(`/admin/orders/${id}/deliver`); // Use admin route
        toast.success("Order marked as delivered");
        fetchOrders();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to update order");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Orders
      </h1>
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  ID
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  User
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Date
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Total
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Paid
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Delivered
                </th>
                <th className="p-4"></th>
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
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    {order.isPaid ? (
                      <span className="text-green-500">✔</span>
                    ) : (
                      <span className="text-red-500">✖</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {order.isDelivered ? (
                      <span className="text-green-500">✔</span>
                    ) : (
                      <button
                        className="bg-green-500 text-white text-xs px-2 py-1 rounded-md hover:bg-green-600"
                        onClick={() => deliverHandler(order._id)}
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {/* Future: <button className="text-zinc-500 hover:text-amber-600"><Edit className="size-5" /></button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderList;
