import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyItems, deleteItemAPI } from "../src/api/api";

function User() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [activityItems, setActivityItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState("lost");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await getMyItems(token);
        const myItems = res.data;

        const sortedItems = [...myItems].sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0);
          const dateB = new Date(b.updatedAt || b.createdAt || 0);
          return dateB - dateA;
        });

        setLostItems(sortedItems.filter((item) => item.status === "lost"));
        setFoundItems(sortedItems.filter((item) => item.status === "found"));
        setActivityItems(sortedItems);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const deleteItem = async (id, type) => {
    const token = localStorage.getItem("authToken");
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItemAPI(id, token);
      if (type === "lost") setLostItems((prev) => prev.filter((item) => item._id !== id));
      else if (type === "found") setFoundItems((prev) => prev.filter((item) => item._id !== id));
      setActivityItems((prev) => prev.filter((item) => item._id !== id));
      alert("Item deleted successfully!");
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-item/${id}`);
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
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getBadge = (count) => (
    <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{count}</span>
  );

  const renderTable = (items, type = "all") => (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full text-sm sm:text-base">
        <thead className="bg-blue-100 text-gray-800">
          <tr>
            <th className="p-3 text-left">Item</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Photo</th>
            <th className="p-3 text-left">Status</th>
            {type === "all" && <th className="p-3 text-left">Last Updated</th>}
            {type !== "all" && <th className="p-3 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={type === "all" ? 6 : 6} className="text-center p-4 text-gray-500">
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
                    alt="Item"
                    className="h-16 w-16 object-cover rounded-lg border"
                  />
                </td>
                <td className={`p-3 capitalize ${getStatusClass(item.status)}`}>{item.status}</td>
                {type === "all" && (
                  <td className="p-3 text-gray-500">
                    {new Date(item.updatedAt || item.createdAt).toLocaleString()}
                  </td>
                )}
                {type !== "all" && (
                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item._id, type)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-lg p-5 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-gray-800">My Items Menu</h2>
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                selectedView === "lost"
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
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                selectedView === "found"
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
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                selectedView === "activity"
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

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg p-5 border-r border-gray-200 z-20 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800">My Items Menu</h2>
        <ul className="space-y-4">
          {["lost", "found", "activity"].map((view) => (
            <li key={view}>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                  selectedView === view
                    ? "bg-blue-600 text-white shadow"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
                onClick={() => {
                  setSelectedView(view);
                  setSidebarOpen(false);
                }}
              >
                {view === "activity"
                  ? `Activity Log ${getBadge(activityItems.length)}`
                  : `${view.charAt(0).toUpperCase() + view.slice(1)} Items ${
                      view === "lost"
                        ? getBadge(lostItems.length)
                        : getBadge(foundItems.length)
                    }`}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Toggle button */}
      <button
        className="md:hidden fixed top-20 left-4 z-30 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        Menu
      </button>

      <main className="flex-grow p-6 mt-16 md:mt-0 overflow-x-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          {selectedView === "lost"
            ? "Lost Items"
            : selectedView === "found"
            ? "Found Items"
            : "Activity Log"}
        </h1>

        {selectedView === "activity" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <input
              type="text"
              placeholder="Search by item or location..."
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
        )}

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : selectedView === "lost" ? (
          renderTable(lostItems, "lost")
        ) : selectedView === "found" ? (
          renderTable(foundItems, "found")
        ) : (
          renderTable(filterItems(activityItems), "all")
        )}
      </main>
    </div>
  );
}

export default User;
