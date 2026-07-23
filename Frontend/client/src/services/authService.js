import API from "./api";

export const registerUser = async (formData) => {
  const response = await API.post("/auth/register", formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await API.post("/auth/login", formData);
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get("/users/profile");
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};