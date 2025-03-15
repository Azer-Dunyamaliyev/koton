import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserOrders = createAsyncThunk(
  "basket/getUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.get(
        `http://localhost:5500/orders/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Sipariş ekleme thunk
export const addToBasketThunk = createAsyncThunk(
  "basket/addToBasket",
  async ({ products, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("User not authenticated");
      }

      const orderData = {
        products,
        userId,
      };
      const response = await axios.post(
        "http://localhost:5500/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data; // Siparişi başarıyla gönderiyoruz
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const basketSlice = createSlice({
  name: "basket",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      //GET
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.flatMap(order => order.orders);
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //POST
      .addCase(addToBasketThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToBasketThunk.fulfilled, (state, action) => {
        state.loading = false;
        const incomingOrders = action.payload.order.orders;
        incomingOrders.forEach((newOrder) => {
          const existingOrderIndex = state.orders.findIndex(
            (order) =>
              order.productId === newOrder.productId &&
              order.selectedColor === newOrder.selectedColor &&
              order.selectedSize === newOrder.selectedSize
          );
          
          if (existingOrderIndex !== -1) {
            state.orders[existingOrderIndex].quantity += newOrder.quantity;
          } else {
            state.orders.push(newOrder);
          }
        });
      })
      .addCase(addToBasketThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = basketSlice.actions;
export default basketSlice.reducer;
