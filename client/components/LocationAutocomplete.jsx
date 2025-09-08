// client/components/LocationAutocomplete.jsx
import React, { useState, useEffect } from "react";

const LocationAutocomplete = ({ value, onChange }) => {
  const [results, setResults] = useState([]);
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), 300);
    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }

    const fetchLocations = async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          debounced
        )}&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setResults(data);
    };

    fetchLocations();
  }, [debounced]);

  const handleSelect = (place) => {
    onChange(place.display_name);
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Enter location"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 shadow-lg max-h-48 overflow-y-auto">
          {results.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
