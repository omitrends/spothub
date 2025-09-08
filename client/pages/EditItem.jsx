import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateItemAPI, getItemById } from "../src/api/api";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { toast } from "react-toastify";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    status: "lost",
    imageUrl: "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await getItemById(id, token);
        setFormData(res.data);
        setPreview(res.data.imageUrl);
      } catch (err) {
        toast.error("Failed to load item.");
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : formData.imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const data = new FormData();
    data.append("title", formData.title);
    data.append("location", formData.location);
    data.append("description", formData.description);
    data.append("status", formData.status);
    if (photo) data.append("photo", photo);

    try {
      await updateItemAPI(id, data, token);
      toast.success("Item updated successfully!");
      setTimeout(() => {
        navigate("/user");
      }, 1000);
    } catch (err) {
      toast.error("Failed to update item.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold mb-4">Edit Item</h2>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Item Name"
          className="w-full mb-3 p-2 border rounded"
        />

        <div className="mb-3">
          <LocationAutocomplete
            value={formData.location}
            onChange={(val) => setFormData((prev) => ({ ...prev, location: val }))}
          />
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full mb-3 p-2 border rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <div>
          <label className="block mb-2 font-medium">Upload New Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="mb-3" />
          {preview && <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded-md border" />}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Item
        </button>
      </form>
    </div>
  );
}

export default EditItem;
