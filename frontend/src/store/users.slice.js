import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "../helpers";

// create slice

const name = "users";
const initialState = createInitialState();
const extraActions = createExtraActions();

const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(extraActions.getAll.pending, (state) => {
        state.users = { loading: true };
      })
      .addCase(extraActions.getAll.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(extraActions.getAll.rejected, (state, action) => {
        state.users = { error: action.error };
      });
  },
});

// exports

export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;

// implementation

function createInitialState() {
  return {
    users: {},
  };
}

function createExtraActions() {
  const baseUrl = `${import.meta.env.VITE_API_URL}/v1/api/users/profile`;

  return {
    getAll: getAll(),
  };

  function getAll() {
    return createAsyncThunk(
      `${name}/getAll`,
      async () => await fetchWrapper.get(baseUrl)
    );
  }
}
