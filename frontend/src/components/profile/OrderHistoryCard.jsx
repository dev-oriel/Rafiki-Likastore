import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const formatCurrency = (amount) => `$${Number(amount).toLocaleString()}`;

const OrderHistoryCard = () => {
  const navigate = useNavigate();
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
        const { data } = await api.get("/orders/myorders"); // Use our API
        setOrders(data);
      } catch (err) {
        console.error("Error fetching profile orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

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
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border dark:border-zinc-800"
      id="order-history"
    >
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
        Order History
      </h3>

      {loading ? (
        <div className="text-center py-6 text-zinc-600 dark:text-zinc-400">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-6 text-zinc-600 dark:text-zinc-400">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
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
              {orders.map((r) => {
                const status = getStatus(r);
                return (
                  <React.Fragment key={r._id}>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4 text-zinc-800 dark:text-zinc-200">
                        #{r._id.substring(18)}
                      </td>
                      <td className="p-4 text-zinc-600 dark:text-zinc-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-zinc-800 dark:text-zinc-200 font-medium">
                        {formatCurrency(r.totalPrice)}
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
                          onClick={() => toggleDetails(r._id)}
                          className="font-medium text-amber-600 hover:underline"
                        >
                          {openRow === r._id ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>
                    {openRow === r._id && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-4 bg-zinc-50 dark:bg-zinc-800/50"
                        >
                          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 space-y-3">
                            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                              Items Ordered
                            </h4>
                            <ul className="space-y-1">
                              {r.orderItems.map((item, idx) => (
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
                                {r.deliveryLocation}
                              </p>
                              <p>
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                  Payment:
                                </span>{" "}
                                {r.isPaid
                                  ? `Paid (${new Date(
                                      r.paidAt
                                    ).toLocaleDateString()})`
                                  : "Pending"}
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
