import API from "./api";
export const getPublicDashboard = async () => {
  const response = await API.get("/dashboard/public");
  return response.data;
};
export const getAdminDashboard = async () => {
  const response = await API.get("/dashboard/admin");
  return response.data;
};