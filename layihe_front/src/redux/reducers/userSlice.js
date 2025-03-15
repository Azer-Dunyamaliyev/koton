import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { clearOrders } from "./basketSlice";



//{ USER }
export const getUserThunk = createAsyncThunk("users/fetchUsers", async (_, { getState }) => {
  const token = localStorage.getItem("token"); 
  const response = await axios.get("http://localhost:5500/users", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
});


//{ ME }
export const getMeThunk = createAsyncThunk("api/users/me", async (_) => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5500/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
});

//{ REGISTER }
export const postRegisterThunk = createAsyncThunk(
  "user/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5500/users/register",
        userData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : "An error occurred"
      );
    }
  }
);

//{ LOGIN }
export const postLoginThunk = createAsyncThunk(
  "api/users/login",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5500/users/login",
        data
      );
      const { token, username } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : "An error occurred"
      );
    }
  }
);

//{ LOGOUT }

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  dispatch(setUser(null));
  dispatch(clearOrders());
};


// { UPDATE USER - USERNAME}
export const updateUsernameThunk = createAsyncThunk(
  "users/updateUsername",
  async (username, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5500/users/update/username",
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token gönderme
          },
          withCredentials: true,
        }
      );
      return response.data; // Yeni kullanıcı verisi
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); // Hata durumunda
    }
  }
);

// { UPDATE USER - NAME}
export const updateNameThunk = createAsyncThunk(
  "users/updateName",
  async (name, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5500/users/update/name",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token gönderme
          },
          withCredentials: true,
        }
      );
      return response.data; // Yeni kullanıcı verisi
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); // Hata durumunda
    }
  }
);

// { UPDATE USER - SURNAME}
export const updateSurNameThunk = createAsyncThunk(
  "users/updateSurName",
  async (surname, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5500/users/update/surname",
        { surname },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token gönderme
          },
          withCredentials: true,
        }
      );
      return response.data; // Yeni kullanıcı verisi
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); // Hata durumunda
    }
  }
);

// { UPDATE USER - USER INFO }
export const updateUserInfoThunk = createAsyncThunk(
  "user/updateUserInfo",
  async (userData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5500/users/update",  // Endpoint
        userData,  // Yeni kullanıcı bilgileri
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Token ekleme
          },
        }
      );

      return response.data;  // Backend'den dönen yeni kullanıcı verisi
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : "An error occurred"
      );
    }
  }
);


// { UPDATE USER - EMAIL}

export const updateEmailThunk = createAsyncThunk(
  "user/updateEmail",
  async ({ email, password }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5500/users/update/email",
        { email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

// { UPDATE PASSWORD }
export const updatePasswordThunk = createAsyncThunk(
  "user/updatePassword",
  async ({ oldPassword, newPassword }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5500/users/update/password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      // Hata mesajını döndürmek
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : "An error occurred"
      );
    }
  }
);

// { UPDATE PHONE }

export const updatePhoneThunk = createAsyncThunk(
  "user/updatePhone",
  async (userData, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5500/users/update/phone",
        {
          phone: userData.phone,
          countryCode: userData.countryCode,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`, 
          },
        }
      );

      return response.data; 
    } catch (error) {
      console.error("Phone update error:", error);
      return rejectWithValue(
        error.response ? error.response.data : "Phone update failed."
      );
    }
  }
);

// { UPDATE ADDRESS }

export const updateAddressThunk = createAsyncThunk(
  "users/updateAddress",
  async (address, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5500/users/update/address",
        { address },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        }
      );
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); 
    }
  }
);

// { UPDATE TOWN }

export const updateTownThunk = createAsyncThunk(
  "users/updateTown",
  async (town, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5500/users/update/town",
        { town },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        }
      );
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); 
    }
  }
);

export const updateUserAdminThunk = createAsyncThunk(
  "adminUser/update",
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5500/users/update-user/${userId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : "An error occurred");
    }
  }
);


//{ DELETE USER}

export const deleteUserThunk = createAsyncThunk(
  'user/delete', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete("http://localhost:5500/users/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : "An error occurred");
    }
  }
);

export const deleteUserAdminThunk = createAsyncThunk(
  "adminUser/delete",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:5500/users/delete-user/${userId}`);
      return userId; 
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : "An error occurred");
    }
  }
);


export const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    error: null,
    users: [],
    me: {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      countryCode: "",
      address: "",
      country: "",
      town: "",
      cards: "",
    },
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
  },
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      state.token = null;
      state.username = null;
    },
    setUser: (state, action) => {
      state.token = action.payload;
    },
    setMe: (state, action) => {
      state.me = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // { USER }
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // { ME }
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.me = action.payload;
      })
      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // { USER REGISTER }
      .addCase(postRegisterThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postRegisterThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(postRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // { USER LOGIN }
      .addCase(postLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
      })
      .addCase(postLoginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(postLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // { UPDATE USERNAME }
      .addCase(updateUsernameThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.me = action.payload; 
      })
      .addCase(updateUsernameThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUsernameThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

       // { UPDATE NAME }
       .addCase(updateNameThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload; 
      })
      .addCase(updateNameThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNameThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

       // { UPDATE SURNAME }
       .addCase(updateSurNameThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.surname = action.payload; 
      })
      .addCase(updateSurNameThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSurNameThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // { UPDATE USER ADDRESS }
      .addCase(updateAddressThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload; 
      })
      .addCase(updateAddressThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // { UPDATE USER TOWN }
      .addCase(updateTownThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.town = action.payload; 
      })
      .addCase(updateTownThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTownThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // { EMAIL UPDATE }
      .addCase(updateEmailThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.me.email = action.payload.email;
        state.loading = false;
      })
      .addCase(updateEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // { UPDATE USER INFO }
      .addCase(updateUserInfoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.me = { ...state.me, ...action.payload };
      })
      .addCase(updateUserInfoThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserInfoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // { PASSWORD UPDATE }
      .addCase(updatePasswordThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.me.password = action.payload.password;
      })
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // { PHONE UPDATE }

      .addCase(updatePhoneThunk.fulfilled, (state, action) => {
        state.loading = false
        state.me.phone = action.payload.phone;
      })
      .addCase(updatePhoneThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Phone update failed.";
      })
      .addCase(updatePhoneThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.token = null; 
        state.username = null;  
        state.me = {};  
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
      })
      
      .addCase(updateUserAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(updateUserAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //DELETE
      .addCase(deleteUserAdminThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload); 
      })
      .addCase(deleteUserAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, setUser, setMe, setLoading, setError } =
  userSlice.actions;
export default userSlice.reducer;
