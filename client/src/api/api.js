import axios from 'axios';

const API = axios.create({
  baseURL: 'https://spothub.onrender.com/api', // Proxy will forward to http://localhost:5000
  withCredentials: false,
});

export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);

export const addLostItem = (itemData, token) => {
  return API.post('/items', itemData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addFoundItem = (itemData, token) => {
  return API.post('/items', itemData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMyItems = (token) =>
  API.get('/items/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteItemAPI = (id, token) =>
  API.delete(`/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const fetchLostItems = (params) => API.get('/items', { params });

export const fetchItems = (filters) =>
  API.get('/items', { params: filters });

export const getAllUsers = (token) =>
  API.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteUser = (id, token) =>
  API.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getItemById = (id, token) =>
  API.get(`/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateItemAPI = (id, updatedData, token) =>
  API.put(`/items/${id}`, updatedData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

// Correct function to update status from "pending" → "returned"
export const updateItemStatus = (id, token) =>
  API.patch(`/items/${id}/status`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
