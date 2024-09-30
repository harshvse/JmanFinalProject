import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./auth.slice";
import { usersReducer } from "./users.slice";
import modalReducer from "./modal.slice";
import { bookReducer } from "./book.slice";

export * from "./auth.slice";
export * from "./users.slice";
export * from "./modal.slice";
export * from "./book.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    modal: modalReducer,
    book: bookReducer,
  },
});
