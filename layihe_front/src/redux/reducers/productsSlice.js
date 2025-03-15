import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllProductsThunk = createAsyncThunk(
  "api/allproducts",
  async () => {
    try {
      const response = await axios.get("http://localhost:5500/products");
      return response.data;
    } catch (error) {
      console.error("Backend error:", error);
      throw error;
    }
  }
);

// { GET ALL NAME}
export const getCategoryThunk = createAsyncThunk(
  "api/products/name/category",
  async ({ name }) => {
    try {
      const response = await axios.get(
        `http://localhost:5500/products/${name}`
      );
      return response.data;
    } catch (error) {
      console.error("Backend error:", error);
      throw error;
    }
  }
);

// { GET CATEGORY }
export const getNameCategoryThunk = createAsyncThunk(
  "api/products/name/category/",
  async ({ name, category }, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:5500/products/${name}/${category}`
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  "api/updateProduct",
  async ({ productId, updatedData }) => {
    try {
      const response = await axios.put(
        `http://localhost:5500/products/${productId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
);

//ADD PRODUCT
export const addProductThunk = createAsyncThunk(
  "api/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5500/products",
        productData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const deleteProductThunk = createAsyncThunk(
  "api/deleteproduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:5500/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProductsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // { GET NAME}
      .addCase(getCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(getCategoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // { GET JACKET CATEGORY }
      .addCase(getNameCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(getNameCategoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNameCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // { Update Product }
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product._id === updatedProduct._id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

      // deleteProductThunk
      .addCase(deleteProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.meta.arg 
        );
      })
      
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default productsSlice.reducer;
