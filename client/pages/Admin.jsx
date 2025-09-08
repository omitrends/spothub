import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  fetchItems,
  deleteUser as deleteUserAPI,
  deleteItemAPI,
  updateItemStatus,
} from "../src/api/api";
import { toast } from "react-toastify"; // ✅ Removed ToastContainer import
import "react-toastify/dist/ReactToastify.css";

function Admin() {
  const [selectedView, setSelectedView] = useState("users");
  const [users, setUsers] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [activityItems, setActivityItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const usersRes = await getAllUsers(token);
      setUsers(usersRes.data);

      const itemsRes = await fetchItems();
      const allItems = itemsRes.data;

      const sortedItems = [...allItems].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB - dateA;
      });

      setLostItems(sortedItems.filter((item) => item.status === "lost"));
      setFoundItems(sortedItems.filter((item) => item.status === "found"));
      setActivityItems(sortedItems);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false); // ✅ THIS LINE FIXES THE ISSUE
    }
  };

  fetchData();
}, [token]);


  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUserAPI(id, token);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const deleteItem = async (id, type) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteItemAPI(id, token);
      if (type === "lost") {
        setLostItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        setFoundItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const markAsReturned = async (id, isLost) => {
    try {
      const res = await updateItemStatus(id, token);
      const updateStatus = (items) =>
        items.map((item) =>
          item._id === id ? { ...item, status: res.data.status } : item
        );

      if (isLost) setLostItems(updateStatus);
      else setFoundItems(updateStatus);
    } catch (err) {
      toast.error("Failed to update item status");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "lost":
        return "text-red-600 font-semibold";
      case "found":
        return "text-blue-600 font-semibold";
      case "returned":
        return "text-green-600 font-semibold";
      default:
        return "text-gray-700";
    }
  };

  const filterItems = (items) => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const renderTable = (items, isLost) => (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full text-sm sm:text-base">
        <thead className="bg-blue-100 text-gray-800">
          <tr>
            <th className="p-3 text-left">Item</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Photo</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                No items found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id} className="border-b hover:bg-blue-50 transition">
                <td className="p-3 font-medium text-gray-700">{item.title}</td>
                <td className="p-3 text-gray-600">{item.location}</td>
                <td className="p-3 text-gray-500">{item.description}</td>
                <td className="p-3">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/80x80?text=No+Image"}
                    alt={item.title || "Item"}
                    className="h-16 w-16 object-cover rounded-lg border"
                  />
                </td>
                <td className="p-3 text-gray-700">{item.user?.name || "N/A"}</td>
                <td className={`p-3 capitalize ${getStatusClass(item.status)}`}>
                  {item.status}
                </td>
                <td className="p-3 flex gap-2">
                  {item.status !== "returned" && (
                    <button
                      onClick={() => markAsReturned(item._id, isLost)}
                      className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
                    >
                      Mark Returned
                    </button>
                  )}
                  <button
                    onClick={() => deleteItem(item._id, isLost ? "lost" : "found")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderActivityLog = (items) => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by item, location, or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Statuses</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full text-sm sm:text-base">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filterItems(items).length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No matching items found.
                </td>
              </tr>
            ) : (
              filterItems(items).map((item) => (
                <tr key={item._id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3 font-medium text-gray-700">{item.title}</td>
                  <td className="p-3 text-gray-600">{item.location}</td>
                  <td className="p-3 text-gray-500">{item.description}</td>
                  <td className="p-3">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/80x80?text=No+Image"}
                      alt={item.title || "Item"}
                      className="h-16 w-16 object-cover rounded-lg border"
                    />
                  </td>
                  <td className="p-3 text-gray-700">{item.user?.name || "N/A"}</td>
                  <td className={`p-3 capitalize ${getStatusClass(item.status)}`}>
                    {item.status}
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(item.updatedAt || item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center text-gray-600">
          <p>Loading...</p>
          <p>Users: {users.length}</p>
          <p>Lost: {lostItems.length}</p>
          <p>Found: {foundItems.length}</p>
          <p>Activity: {activityItems.length}</p>
        </div>
      );

    }

    if (selectedView === "activity") {
      return (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
            Activity Log
          </h2>
          {renderActivityLog(activityItems)}
        </div>
      );
    }

    if (selectedView === "users") {
      const filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearch.toLowerCase())
      );

      return (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
              All Users
              <span className="ml-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                {filteredUsers.length}
              </span>
            </h2>
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-1/3"
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full text-sm sm:text-base">
              <thead className="bg-purple-100 text-gray-800">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center p-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-purple-50 transition`}
                    >
                      <td className="p-3 font-medium text-gray-700 flex items-center gap-2">
                        <div className="h-8 w-8 flex items-center justify-center bg-purple-200 text-purple-700 rounded-full font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </td>
                      <td className="p-3 text-gray-600">{user.email}</td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (selectedView === "lost") {
      return (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Lost Items</h2>
          {renderTable(lostItems, true)}
        </div>
      );
    }

    if (selectedView === "found") {
      return (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Found Items</h2>
          {renderTable(foundItems, false)}
        </div>
      );
    }

    return null;
  };

  const getBadge = (count) => (
    <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{count}</span>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* ✅ Removed <ToastContainer /> from here */}
      <aside className="hidden md:block w-64 bg-white shadow-lg p-5 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Menu</h2>
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${selectedView === "users"
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-blue-50 text-gray-700"
                }`}
              onClick={() => setSelectedView("users")}
            >
              View Users {getBadge(users.length)}
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${selectedView === "lost"
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-blue-50 text-gray-700"
                }`}
              onClick={() => setSelectedView("lost")}
            >
              Lost Items {getBadge(lostItems.length)}
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${selectedView === "found"
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-blue-50 text-gray-700"
                }`}
              onClick={() => setSelectedView("found")}
            >
              Found Items {getBadge(foundItems.length)}
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${selectedView === "activity"
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-blue-50 text-gray-700"
                }`}
              onClick={() => setSelectedView("activity")}
            >
              Activity Log {getBadge(activityItems.length)}
            </button>
          </li>
        </ul>
      </aside>

      <main className="flex-grow p-6 mt-16 md:mt-0 overflow-x-auto">{renderContent()}</main>
    </div>
  );
}

export default Admin;
