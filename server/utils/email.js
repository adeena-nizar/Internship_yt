import nodemailer from "nodemailer";

export const sendSubscriptionConfirmation = async (user, subscription, payment) => {
  try {
    // Create a test account on Ethereal
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Email content
    const mailOptions = {
      from: '"Yourtube" <noreply@yourtube.com>',
      to: user.email,
      subject: "Subscription Confirmation",
      html: `
        <h1>Subscription Confirmation</h1>
        <p>Hi ${user.name},</p>
        <p>Your subscription to the ${subscription.name} plan has been confirmed.</p>
        <h2>Invoice</h2>
        <p><strong>Payment ID:</strong> ${payment.razorpay_payment_id}</p>
        <p><strong>Amount:</strong> ₹${payment.amount}</p>
        <p><strong>Date:</strong> ${payment.createdAt.toDateString()}</p>
        <p>Your subscription is valid until ${user.subscription.expiresAt.toDateString()}.</p>
        <p>Thank you for choosing Yourtube!</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};