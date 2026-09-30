"use client";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Script from "next/script";
import { UserContext } from "@/context/UserContext";

interface Subscription {
  _id: string;
  name: string;
  price: number;
  features: string[];
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const context = useContext(UserContext);
  const { user: currentUser } = context || {};

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/subscription");
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleUpgrade = async (subscription: Subscription) => {
    try {
      const { data: order } = await axios.post("http://localhost:5000/api/subscription/order", {
        subscriptionId: subscription._id,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Yourtube",
        description: `Upgrade to ${subscription.name}`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            await axios.post("http://localhost:5000/api/subscription/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Payment successful! Your subscription has been upgraded.");
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: currentUser?.name,
          email: currentUser?.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error creating the order. Please try again.");
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptions.map((subscription) => (
            <div key={subscription._id} className="border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{subscription.name}</h2>
              <p className="text-4xl font-bold mb-4">₹{subscription.price}</p>
              <ul className="mb-6">
                {subscription.features.map((feature, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {subscription.name !== "Free" && (
                <button
                  onClick={() => handleUpgrade(subscription)}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Upgrade
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SubscriptionsPage;