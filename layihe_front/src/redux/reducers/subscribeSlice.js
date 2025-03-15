import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addSubscriber = createAsyncThunk(
  "subscribe/addSubscriber",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5500/subscribe", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const subscribeSlice = createSlice({
  name: "subscribe",
  initialState: {
    subscribe: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addSubscriber.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubscriber.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribe.push(action.payload);
      })
      .addCase(addSubscriber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default subscribeSlice.reducer;
