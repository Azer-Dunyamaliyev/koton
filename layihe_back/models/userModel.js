import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, default: "" },
    surname: { type: String, default: "" },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    countryCode: { type: String },
    address: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "" },
    town: { type: String, default: "" },
    role: {type: String, default: "user"}
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
