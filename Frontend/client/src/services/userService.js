import API from "./api";

export const getAllUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

export const getSingleUser = async (id) => {
  const response = await API.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await API.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};