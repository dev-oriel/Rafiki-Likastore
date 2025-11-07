import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Loader, Edit, Trash2 } from "lucide-react";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/users"); // Use admin route
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`); // Use admin route
        toast.success("User deleted");
        fetchUsers();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete user");
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
        Users
      </h1>
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Name
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Email
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Phone
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Admin
                </th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    {user.email}
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    {user.phone}
                  </td>
                  <td className="p-4 text-center">
                    {user.isAdmin ? (
                      <span className="text-green-500">✔</span>
                    ) : (
                      <span className="text-red-500">✖</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="text-zinc-500 hover:text-amber-600"
                        title="Edit"
                      >
                        <Edit className="size-5" />
                      </button>
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="text-zinc-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
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

export default AdminUserList;
