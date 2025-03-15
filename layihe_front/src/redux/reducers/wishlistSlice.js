import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getWishList = createAsyncThunk("wishlist/get", async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token bulunamadı!");
    }

    const response = await axios.get("https://koton.onrender.com/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API response:", response);
    return response.data; 
  } catch (error) {
    console.error("API error:", error); 
    throw error; 
  }
});




export const wishlistStatus = createAsyncThunk(
  "wishlist/status",
  async ({ productId, selectedColor }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const isFavorite = favorites.some(
        (fav) =>
          fav.productId === productId && fav.selectedColor === selectedColor
      );
      return isFavorite; 
    }

    try {
      const response = await axios.get(
        `https://koton.onrender.com/favorites/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { selectedColor }, 
        }
      );
      return response.data.isFavorite;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);


export const addFavoriteThunk = createAsyncThunk(
  "favorites/addFavorite",
  async ({ productId, selectedColor }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://koton.onrender.com/favorites",
        { productId, selectedColor },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API YANITI:", response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const deleteFavoriteThunk = createAsyncThunk(
  "favorites/deleteFavorite",
  async ({ productId, selectedColor }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `https://koton.onrender.com/favorites/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { selectedColor },
        }
      );

      
      dispatch(getWishList());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Redux slice
export const wishListSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
    status: {}, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishList.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload
      })
      .addCase(getWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // STATUS
      .addCase(wishlistStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(wishlistStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, selectedColor } = action.meta.arg;
        state.status[`${productId}-${selectedColor}`] = action.payload; 
      })
      .addCase(wishlistStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // { POST } 
      .addCase(addFavoriteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites.push(action.payload);
      })
      .addCase(addFavoriteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // { DELETE } 
      .addCase(deleteFavoriteThunk.fulfilled, (state, action) => {
        console.log("Delete payload:", action.payload); 
        const { productId, selectedColor } = action.payload;
        console.log(action.payload);
        
        state.favorites = state.favorites.filter(
          (favorite) =>
            favorite.productId !== productId || 
            favorite.selectedColor !== selectedColor
        );
      
        
        state.status[`${productId}-${selectedColor}`] = false;
      })
      
      .addCase(deleteFavoriteThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFavoriteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishListSlice.reducer;
