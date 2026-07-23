import API from "./api";

export const borrowBook = async (borrowData) => {
  const response = await API.post("/borrow", borrowData);
  return response.data;
};
export const issueBookByAdmin = async (issueData) => {
  const response = await API.post(
    "/borrow/admin-issue",
    issueData
  );

  return response.data;
};
export const getMyBorrowedBooks = async () => {
  const response = await API.get("/borrow/my-books");
  return response.data;
};

export const returnBorrowedBook = async (borrowId) => {
  const response = await API.put(`/borrow/return/${borrowId}`);
  return response.data;
};

export const getAllBorrowRecords = async () => {
  const response = await API.get("/borrow");
  return response.data;
};