import axios from "axios";

const digitalBookApi = axios.create({
  baseURL: "http://localhost:5000/api/digital-books",
});

export const getAllDigitalBooks = async () => {
  const response = await digitalBookApi.get("/");
  return response.data;
};

export const addDigitalBook = async (
  formData,
  onUploadProgress
) => {
  const response = await digitalBookApi.post(
    "/add",
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round(
          (progressEvent.loaded * 100) /
            progressEvent.total
        );

        onUploadProgress?.(percent);
      },
    }
  );

  return response.data;
};

export const updateDigitalBook = async (id, formData) => {
  const response = await digitalBookApi.put(
    `/update/${id}`,
    formData
  );

  return response.data;
};

export const deleteDigitalBook = async (id) => {
  const response = await digitalBookApi.delete(`/delete/${id}`);
  return response.data;
};

export default digitalBookApi;