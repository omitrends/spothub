import React, { useState } from "react";
import { useAuth } from '../src/context/AuthContext';
import { addFoundItem } from '../src/api/api';
import { useNavigate } from 'react-router-dom';
import LocationAutocomplete from "../components/LocationAutocomplete";
import { toast } from 'react-toastify';

function ReportFound() {
  const [formData, setFormData] = useState({
    itemName: "",
    location: "",
    description: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const capitalizeInput = (value) =>
    value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "location" ? value : capitalizeInput(value),
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      itemName: "",
      location: "",
      description: "",
      photo: null,
    });
    setPhotoPreview(null);
    document.getElementById("photo").value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.itemName);
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('status', 'found');
    if (formData.photo) data.append('photo', formData.photo);

    try {
      await addFoundItem(data, authToken);
      toast.success('Found item reported successfully!');
      handleReset();
      navigate('/found-item');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report found item');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white">
      <main className="flex-grow flex items-center justify-center pt-16 sm:pt-20 pb-12 px-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-5 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg space-y-4 sm:space-y-6 border border-gray-200"
        >
          <h2 className="text-xl sm:text-3xl font-bold text-center text-gray-800">
            Report Found Item
          </h2>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Item Name
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Found Location
            </label>
            <LocationAutocomplete
              value={formData.location}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, location: val }))
              }
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Upload Photo
            </label>
            <label
              htmlFor="photo"
              className="cursor-pointer inline-block bg-blue-50 text-blue-700 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-blue-100"
            >
              Upload Photo
            </label>
            <input
              type="file"
              name="photo"
              id="photo"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />

            {photoPreview && (
              <div className="mt-2">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-blue-600 text-white py-2 rounded-lg shadow hover:scale-105 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 active:scale-95 transition-all duration-200"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-1/2 bg-red-500 text-white py-2 rounded-lg shadow hover:scale-105 hover:bg-red-600 focus:ring-2 focus:ring-red-400 active:scale-95 transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ReportFound;
