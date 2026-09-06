import mongoose from "mongoose";
const userschema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  channelname: { type: String },
  description: { type: String },
  image: { type: String },
  joinedon: { type: Date, default: Date.now },
  isPremium: {
    type: Boolean,
    default: false,
  },
  lastDownloadDate: {
    type: Date,
  },
  dailyDownloadCount: {
    type: Number,
    default: 0,
  },
  subscription: {
    plan: {
      type: String,
      default: "Free",
    },
    expiresAt: {
      type: Date,
    },
  },
  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "dark",
  },
  lastLogin: {
    device: { type: String },
    city: { type: String },
    state: { type: String },
  },
});

export default mongoose.model("user", userschema);