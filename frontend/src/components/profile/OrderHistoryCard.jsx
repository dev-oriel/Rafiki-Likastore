import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { formatCurrency } from "../../utils/formatCurrency";

const OrderHistoryCard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        console.error("Error fetching profile orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  // FIX: Retained "Pending Payment" exactly as requested
  const getStatus = (order) => {
    if (order.isDelivered)
      return { text: "Delivered", class: "bg-green-100 text-green-700" };
    if (order.isPaid)
      return { text: "Processing", class: "bg-blue-100 text-blue-700" };
    return { text: "Pending Payment", class: "bg-yellow-100 text-yellow-700" };
  };

  const toggleDetails = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 scroll-mt-24"
      id="order-history"
    >
      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">
        Order History
      </h3>

      {loading ? (
        <div className="text-center py-6 text-zinc-500 text-sm">
          Loading history...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-lg">
          <span className="material-symbols-outlined text-3xl text-zinc-300 mb-2">
            history
          </span>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 text-xs uppercase text-zinc-500">
                <th className="p-3 font-semibold">Order ID</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((r) => {
                const status = getStatus(r);
                return (
                  <React.Fragment key={r._id}>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="p-3 text-zinc-900 dark:text-zinc-200 font-mono">
                        #{r._id.substring(18)}
                      </td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-zinc-900 dark:text-zinc-200 font-bold">
                        {formatCurrency(r.totalPrice)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`${status.class} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => toggleDetails(r._id)}
                          className="font-medium text-amber-600 hover:text-amber-700 text-xs sm:text-sm"
                        >
                          {openRow === r._id ? "Close" : "View"}
                        </button>
                      </td>
                    </tr>
                    {openRow === r._id && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-4 bg-zinc-50 dark:bg-zinc-800/30"
                        >
                          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 sm:p-4 text-sm bg-white dark:bg-zinc-900">
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-2">
                              Items Ordered
                            </h4>
                            <ul className="space-y-1 mb-3">
                              {r.orderItems.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex justify-between text-zinc-600 dark:text-zinc-400"
                                >
                                  <span>
                                    {item.qty}x {item.name}
                                  </span>
                                  <span className="font-medium text-zinc-900 dark:text-zinc-300">
                                    {formatCurrency(item.price * item.qty)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                              <p>
                                Delivered to:{" "}
                                <span className="text-zinc-700 dark:text-zinc-300">
                                  {r.deliveryLocation}
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryCard;
