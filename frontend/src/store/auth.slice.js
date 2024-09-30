import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper, history } from "../helpers";

// create slice

const name = "auth";
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();

const slice = createSlice({
  name,
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder
      .addCase(extraActions.login.pending, (state) => {
        state.error = null;
      })
      .addCase(extraActions.login.fulfilled, (state, action) => {
        const user = action.payload;

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(user));
        state.user = user;

        // get return url from location state or default to home page
        const { from } = history.location.state || { from: { pathname: "/" } };
        history.navigate(from);
      })
      .addCase(extraActions.login.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(extraActions.register.pending, (state) => {
        state.error = null;
      })
      .addCase(extraActions.register.fulfilled, (state, action) => {
        const user = action.payload;

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(user));
        state.user = user;

        // get return url from location state or default to home page
        const { from } = history.location.state || { from: { pathname: "/" } };
        history.navigate(from);
      })
      .addCase(extraActions.register.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(extraActions.registerAdmin.pending, (state) => {
        state.error = null;
      })
      .addCase(extraActions.registerAdmin.fulfilled, (state, action) => {
        const user = action.payload;

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(user));
        state.user = user;

        // get return url from location state or default to home page
        const { from } = history.location.state || { from: { pathname: "/" } };
        history.navigate(from);
      })
      .addCase(extraActions.registerAdmin.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});
// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem("user")),
    error: null,
  };
}

function createReducers() {
  return {
    logout,
  };

  function logout(state) {
    state.user = null;
    localStorage.removeItem("user");
    history.navigate("/login");
  }
}

function createExtraActions() {
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  return {
    login: login(),
    register: register(),
    registerAdmin: registerAdmin(),
  };

  function login() {
    return createAsyncThunk(
      `${name}/login`,
      async ({ username, password }) =>
        await fetchWrapper.post(`${baseUrl}/v1/api/auth/login`, {
          email: username,
          password,
        })
    );
  }

  function register() {
    return createAsyncThunk(
      `${name}/register`,
      async ({ email, password, firstName, lastName, photo }) =>
        await fetchWrapper.post(`${baseUrl}/v1/api/auth/register`, {
          email,
          password,
          firstName,
          lastName,
          photo,
        })
    );
  }
  function registerAdmin() {
    return createAsyncThunk(
      `${name}/registerAdmin`,
      async ({ email, password, firstName, lastName, photo }) =>
        await fetchWrapper.post(`${baseUrl}/v1/api/auth/registerAdmin`, {
          email,
          password,
          firstName,
          lastName,
          photo,
        })
    );
  }
}
