import API from "./api";

export const getAllDigitalBooks = async () => {
  const response = await API.get("/digital-books");
  return response.data;
};

export const addDigitalBook = async (
  formData,
  onUploadProgress
) => {
  const response = await API.post(
    "/digital-books/add",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percentage = Math.round(
          (progressEvent.loaded * 100) /
            progressEvent.total
        );

        onUploadProgress?.(percentage);
      },
    }
  );

  return response.data;
};

export const updateDigitalBook = async (
  id,
  formData,
  onUploadProgress
) => {
  const response = await API.put(
    `/digital-books/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percentage = Math.round(
          (progressEvent.loaded * 100) /
            progressEvent.total
        );

        onUploadProgress?.(percentage);
      },
    }
  );

  return response.data;
};

export const deleteDigitalBook = async (id) => {
  const response = await API.delete(
    `/digital-books/delete/${id}`
  );

  return response.data;
};