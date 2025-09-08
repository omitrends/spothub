import React from 'react';
import { FiBell, FiMapPin, FiFileText } from 'react-icons/fi';
import axios from 'axios';

// ✅ Toastify setup
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ItemCard({ item, type = 'found' }) {
  const dateLabel = type === 'found' ? 'Found on' : 'Lost on';
  const defaultImage = '../assets/HomeIcon.png';

  const notifyOwner = async (itemId, title) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error("You must be logged in to notify the owner.");
      return;
    }

    if (!itemId || !title) {
      toast.error("Missing item information.");
      return;
    }

    try {
      await axios.post(
        'https://spothub.onrender.com/api/items/notify-owner',
        {
          itemId,
          message: `Hi! I may have information about your item titled "${title}".`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Owner has been notified!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to notify owner.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden hover:shadow-xl transition duration-300">
      {/* ✅ ToastContainer renders here */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Image Section */}
      <div className="h-44 w-full overflow-hidden">
        <img
          src={item.imageUrl || defaultImage}
          alt={item.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 p-4 space-y-2">
        <h2 className="text-lg font-bold text-gray-800 truncate">{item.title}</h2>

        <div className="flex items-center text-gray-600 text-sm">
          <FiMapPin className="mr-2 text-blue-500" /> {item.location || 'Location not specified'}
        </div>

        <div className="flex items-start text-gray-600 text-sm">
          <FiFileText className="mr-2 mt-1 text-green-500 flex-shrink-0" />
          <span className="line-clamp-2">{item.description || 'No description provided.'}</span>
        </div>

        <p className="text-xs text-gray-400 mt-1">{dateLabel}: {item.date}</p>
      </div>

      {/* Notify Button */}
      <button
        onClick={() => notifyOwner(item._id, item.title)}
        className="bg-blue-600 text-white py-2 flex items-center justify-center gap-2 text-sm font-medium hover:bg-blue-700 transition">
        <FiBell size={18} /> Notify Owner
      </button>
    </div>
  );
}

export default ItemCard;
