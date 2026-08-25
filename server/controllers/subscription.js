import Subscription from "../Modals/Subscription.js";
import User from "../Modals/Auth.js";
import Payment from "../Modals/Payment.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
    const options = {
      amount: subscription.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

import { sendSubscriptionConfirmation } from "../utils/email.js";

// ... (rest of the controller)

    if (expectedSignature === razorpay_signature) {
      const order = await razorpay.orders.fetch(razorpay_order_id);
      const subscription = await Subscription.findOne({ price: order.amount / 100 });
      const user = await User.findById(req.userId);

      user.subscription.plan = subscription.name;
      user.subscription.expiresAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      await user.save();

      const payment = new Payment({
        userId: req.userId,
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
// ... (rest of the controller)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};