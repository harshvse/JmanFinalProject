import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "../helpers";

// Define the slice name and initial state
const name = "book";
const initialState = {
  booking: null,
  orders: [],
  loading: false,
  error: null,
};

// Define the extra actions
const extraActions = createExtraActions();

const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle booking events
    builder
      .addCase(extraActions.bookEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extraActions.bookEvent.fulfilled, (state, action) => {
        state.booking = action.payload;
        state.loading = false;
      })
      .addCase(extraActions.bookEvent.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle fetching orders
      .addCase(extraActions.fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extraActions.fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(extraActions.fetchOrders.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

// Export the actions and reducer
export const bookActions = { ...extraActions };
export const bookReducer = slice.reducer;

// Define the extra actions for booking events and fetching orders
function createExtraActions() {
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  return {
    bookEvent: createAsyncThunk(
      `${name}/bookEvent`,
      async ({ eventId, quantity }) => {
        return await fetchWrapper.post(`${baseUrl}/api/book/add`, {
          eventId,
          quantity,
        });
      }
    ),
    fetchOrders: createAsyncThunk(`${name}/fetchOrders`, async () => {
      return await fetchWrapper.get(`${baseUrl}/api/book/orders`);
    }),
  };
}
