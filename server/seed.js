import "dotenv/config";
import mongoose from "mongoose";
import Subscription from "./Modals/Subscription.js";

const plans = [
  {
    name: "Free",
    price: 0,
    features: ["Access to basic videos", "Limited downloads per day"],
  },
  {
    name: "Bronze",
    price: 199,
    features: [
      "Access to all videos",
      "50 downloads per day",
      "Ad-free viewing",
    ],
  },
  {
    name: "Silver",
    price: 499,
    features: [
      "Access to all videos",
      "Unlimited downloads",
      "Ad-free viewing",
      "Early access to new content",
    ],
  },
  {
    name: "Gold",
    price: 999,
    features: [
      "Access to all videos",
      "Unlimited downloads",
      - "Ad-free viewing",
      "Early access to new content",
      "Exclusive content",
      "Priority support",
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to database");

    await Subscription.deleteMany({});
    console.log("Cleared existing subscriptions");

    await Subscription.insertMany(plans);
    console.log("Seeded subscription plans");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();