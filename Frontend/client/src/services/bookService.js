import API from "./api";

export const getAllBooks = async () => {
  const response = await API.get("/books");
  return response.data;
};

export const getSingleBook = async (id) => {
  const response = await API.get(`/books/${id}`);
  return response.data;
};

// Add Book
export const addBook = async (bookData) => {
  const response = await API.post(
    "/books/add",
    bookData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Update Book
export const updateBook = async (id, bookData) => {
  const response = await API.put(
    `/books/${id}`,
    bookData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Delete Book
export const deleteBook = async (id) => {
  const response = await API.delete(`/books/${id}`);
  return response.data;
};