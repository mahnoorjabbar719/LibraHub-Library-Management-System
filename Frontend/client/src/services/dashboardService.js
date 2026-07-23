import API from "./api";

export const getAdminDashboard = async () => {
  const response = await API.get("/dashboard/admin");
  return response.data;
};