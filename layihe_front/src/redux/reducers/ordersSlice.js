import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const successOrderThunk = createAsyncThunk(
  "order/succesOrder",
  async ({ orderData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token bulunamadı.");
      }

      const response = await axios.post(
        "http://localhost:5500/success/orders/",
        {
          order: orderData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

export const getAllSuccessOrdersThunk = createAsyncThunk(
  "order/getAllSuccessOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token bulunamadı.");
      }

      const response = await axios.get("http://localhost:5500/success/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const getUserSuccessOrdersThunk = createAsyncThunk(
  "order/getUserSuccessOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token bulunamadı.");
      }

      const response = await axios.get(
        `http://localhost:5500/success/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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



// Sipariş yaratmaq
export const createOrderThunk = createAsyncThunk(
  "order/createOrder",
  async ({ orderData, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5500/orders", {
        order: orderData,
        userId: userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Isdifadeci siparişlerini getirmek
export const getUserOrdersThunk = createAsyncThunk(
  "order/getUserOrders",
  async (userId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Token bulunamadı.");
    }

    try {
      const response = await axios.get(
        `http://localhost:5500/orders/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

// ID'ye göre sipariş getirmek
export const getOrderByIdThunk = createAsyncThunk(
  "order/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5500/orders/order/${orderId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

//Payment

export const postPaymentThunk = createAsyncThunk(
  "orders/payment",
  async ({ paymentMethodId, orderId }, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token"); 
      if (!token) throw new Error("No token found!");

      const response = await axios.post(
        "http://localhost:5500/orders/payment",
        { paymentMethodId, orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.data.success) {
        window.location.href = "http://localhost:3000/success"; 
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);


// Sipariş veziyyetini güncellemek
export const updateOrderStatusThunk = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5500/success/order/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

//deleteSuccessOrder
export const deleteSuccesOrderThunk = createAsyncThunk(
  "success/order/deleteOrder",
  async (itemId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5500/success/orders/order/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

// Sipariş silmek
export const deleteOrderThunk = createAsyncThunk(
  "order/deleteOrder",
  async (itemId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5500/orders/order/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

export const deleteAllOrdersThunk = createAsyncThunk(
  "order/deleteAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token bulunamadı.");
      }

      const response = await axios.delete(
        "http://localhost:5500/orders/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Silme işlemi başarılı:", response.data);
      return response.data;
    } catch (error) {
      console.error("Silme işlemi hatası:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data.message : error.message);
    }
  }
);

export const updateSuccesOrdersThunk = createAsyncThunk(
  "orders/updateSuccesOrders",
  async (updatedOrderData, { rejectWithValue }) => {
    try {
      const response = await axios.put("http://localhost:5500/success/update", updatedOrderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSuccesOrderAdminThunk = createAsyncThunk(
  "orders/deleteSuccesOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/orders/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    orderDetails: null,
    successOrders: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //POST
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(successOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(successOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successOrders.push(action.payload);
      })
      .addCase(successOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //GET
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //GET SUCCESS
      .addCase(getAllSuccessOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSuccessOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successOrders = action.payload;
      })
      .addCase(getAllSuccessOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SUCCESS USERID
      .addCase(getUserSuccessOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserSuccessOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successOrders = action.payload;
      })
      .addCase(getUserSuccessOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      //GET USERID
      .addCase(getOrderByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //POST PAYMENT

      .addCase(postPaymentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(postPaymentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(postPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  

      //PUT
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.successOrders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.successOrders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //DELETE
      .addCase(deleteOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload.orderId
        );
      })
      .addCase(deleteOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //DELETE
      .addCase(deleteSuccesOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSuccesOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successOrders = state.successOrders.filter(
          (order) => order._id !== action.payload.orderId
        );
      })
      .addCase(deleteSuccesOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAllOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllOrdersThunk.fulfilled, (state) => {
        state.loading = false;
        state.orders = [];
      })
      .addCase(deleteAllOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSuccesOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSuccesOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successOrders = state.successOrders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateSuccesOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSuccesOrderAdminThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSuccesOrderAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successOrders = state.successOrders.filter((order) => order._id !== action.payload);
      })
      .addCase(deleteSuccesOrderAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
