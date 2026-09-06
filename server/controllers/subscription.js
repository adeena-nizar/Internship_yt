import "dotenv/config";
import Subscription from "../Modals/Subscription.js";
import User from "../Modals/Auth.js";
import Payment from "../Modals/Payment.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendSubscriptionConfirmation } from "../utils/email.js";

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay API keys are not configured");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.body.subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    const options = {
      amount: subscription.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    const order = await getRazorpay().orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await getRazorpay().orders.fetch(razorpay_order_id);
      const subscription = await Subscription.findOne({ price: order.amount / 100 });
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.subscription.plan = subscription.name;
      user.subscription.expiresAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      await user.save();

      const payment = new Payment({
        userId,
        subscriptionId: subscription._id,
        razorpay_payment_id,
        amount: order.amount / 100,
      });
      await payment.save();

      await sendSubscriptionConfirmation(user, subscription, payment);

      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};