import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { fetchItems } from '../src/api/api';
import ItemCard from '../components/ItemCard';
import { toast } from 'react-toastify';

function FoundItem() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        const filters = { status: 'found' };
        if (filterLocation) filters.location = filterLocation;
        if (filterDate) filters.date = filterDate;

        const response = await fetchItems(filters);
        setItems(response.data);
      } catch (error) {
        toast.error('Failed to fetch found items. Please try again later.');
        console.error('Fetch error:', error);
      }
    };

    fetchFoundItems();
  }, [filterDate, filterLocation]);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white">
      <main className="flex-grow pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 text-gray-800 drop-shadow">
          Found Items
        </h1>

        {/* Filters */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
          {/* Search by item name */}
          <div className="relative w-full lg:w-1/4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by item name..."
              className="w-full py-2 sm:py-3 px-3 sm:px-4 pr-10 rounded-md border border-gray-300 bg-white shadow focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
            />
            <FiSearch className="absolute top-1/2 right-3 sm:right-4 transform -translate-y-1/2 text-gray-500 text-lg sm:text-xl" />
          </div>

          {/* Filter by date */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full lg:w-1/4 py-2 sm:py-3 px-3 sm:px-4 rounded-md border border-gray-300 bg-white shadow focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
          />

          {/* Filter by location */}
          <input
            type="text"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            placeholder="Filter by location..."
            className="w-full lg:w-1/4 py-2 sm:py-3 px-3 sm:px-4 rounded-md border border-gray-300 bg-white shadow focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
          />

          {/* Report found item button */}
          <button
            onClick={() => navigate('/report-found')}
            className="w-full lg:w-1/4 bg-green-600 text-white py-2 sm:py-3 rounded-md shadow hover:scale-105 hover:bg-green-700 focus:ring-2 focus:ring-green-400 active:scale-95 transition-all duration-200"
          >
            Report Found Item
          </button>
        </div>

        {/* Item cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No found items available.</p>
          ) : (
            filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} type="found" />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default FoundItem;
