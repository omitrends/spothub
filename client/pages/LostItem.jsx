import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { fetchLostItems } from '../src/api/api';
import { toast } from 'react-toastify';

function LostItem() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      setLoading(true);
      const params = {
        status: 'lost',
        ...(filterLocation && { location: filterLocation }),
        ...(filterDate && { date: filterDate }),
      };

      const res = await fetchLostItems(params);
      let items = res.data;

      if (searchTerm) {
        items = items.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
      }

      setLostItems(items);
    } catch (error) {
      toast.error('Failed to fetch lost items. Try again later.');
      console.error('Failed to fetch lost items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [searchTerm, filterDate, filterLocation]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white">
      <main className="flex-grow pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 text-gray-800 drop-shadow">
          Lost Items
        </h1>

        {/* Search, filters, and button */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
          <div className="relative w-full lg:w-1/4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by item name..."
              className="w-full py-2 sm:py-3 px-3 sm:px-4 pr-10 rounded-xl border border-gray-300 shadow-sm bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
            />
            <FiSearch className="absolute top-1/2 right-3 sm:right-4 transform -translate-y-1/2 text-gray-500 text-lg sm:text-xl" />
          </div>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full lg:w-1/4 py-2 sm:py-3 px-3 sm:px-4 rounded-xl border border-gray-300 shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
          />

          <input
            type="text"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            placeholder="Filter by location..."
            className="w-full lg:w-1/4 py-2 sm:py-3 px-3 sm:px-4 rounded-xl border border-gray-300 shadow-sm bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
          />

          <button
            onClick={() => navigate('/report-lost')}
            className="w-full lg:w-1/4 bg-red-600 text-white py-2 sm:py-3 rounded-xl shadow hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none transition duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Report Lost Item
          </button>
        </div>

        {/* Items grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <p className="text-center col-span-full text-gray-500">Loading...</p>
          ) : lostItems.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No lost items found.</p>
          ) : (
            lostItems.map((item) => (
              <ItemCard key={item._id} item={item} type="lost" />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default LostItem;
