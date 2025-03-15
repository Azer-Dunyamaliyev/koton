import mongoose from "mongoose";

const SubscribeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const subscribeModel = mongoose.model("Subscribe",SubscribeSchema)

export default subscribeModel;
