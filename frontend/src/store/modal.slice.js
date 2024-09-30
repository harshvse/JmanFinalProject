// src/redux/slices/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  currentEvent: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.isOpen = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
  },
});

export const { toggleModal, setCurrentEvent } = modalSlice.actions;

export default modalSlice.reducer;
