import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
});

export default mongoose.model("Subscription", subscriptionSchema);