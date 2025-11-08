import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { formatCurrency } from "../utils/formatCurrency"; // Import the KES formatter

// Helper functions
const getStatus = (order) => {
  if (order.isDelivered)
    return { text: "Delivered", class: "bg-green-100 text-green-700" };
  if (order.isPaid)
    return { text: "Processing", class: "bg-blue-100 text-blue-700" };
  // We filter out failed, so this is just for pending
  return { text: "Pending Payment", class: "bg-yellow-100 text-yellow-700" };
};

// Component for a single order row
const OrderRow = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const status = getStatus(order);

  return (
    <React.Fragment>
      <tr className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
        <td className="p-4 text-zinc-800 dark:text-zinc-200 font-medium">
          #{order._id.substring(18)}
        </td>
        <td className="p-4 text-zinc-600 dark:text-zinc-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </td>
        <td className="p-4 text-zinc-800 dark:text-zinc-200 font-medium">
          {formatCurrency(order.totalPrice)}
        </td>
        <td className="p-4">
          <span
            className={`${status.class} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
          >
            {status.text}
          </span>
        </td>
        <td className="p-4 text-right">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="font-medium text-amber-600 hover:underline"
          >
            {isOpen ? "Hide" : "View Details"}
          </button>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan="5" className="p-4 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                Items Ordered
              </h4>
              <ul className="space-y-1">
                {order.orderItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                <p>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    Address:
                  </span>{" "}
                  {order.deliveryLocation}
                </p>
                <p>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    Payment:
                  </span>{" "}
                  {order.isPaid
                    ? `Paid (${new Date(order.paidAt).toLocaleDateString()})`
                    : "Pending"}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

// Main Page Component
const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/orders/myorders");

        // --- THIS IS THE FIX ---
        // Filter out any order that has a 'Failed' status
        const visibleOrders = data.filter(
          (order) =>
            !(order.paymentResult && order.paymentResult.status === "Failed")
        );
        // --- END OF FIX ---

        setOrders(
          visibleOrders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        ); // Show newest first
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  let content;
  if (loading) {
    content = (
      <div className="text-center py-10 text-zinc-600 dark:text-zinc-400">
        Loading your orders...
      </div>
    );
  } else if (error) {
    content = <div className="text-center py-10 text-red-500">{error}</div>;
  } else if (orders.length === 0) {
    content = (
      <div className="text-center py-10 text-zinc-600 dark:text-zinc-400">
        You haven't placed any orders yet.
      </div>
    );
  } else {
    content = (
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Order ID
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Date
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Total
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Status
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order._id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8">
        My Orders
      </h1>
      {content}
    </div>
  );
};

export default MyOrdersPage;
