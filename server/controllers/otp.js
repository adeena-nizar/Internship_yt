import users from "../Modals/Auth.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });

  try {
    await users.findOneAndUpdate({ email }, { otp });

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    const mailOptions = {
      from: '"YourTube" <no-reply@yourtube.com>',
      to: email,
      subject: "Your OTP for YourTube",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Something went wrong" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await users.findOne({ email, otp });

    if (user) {
      await users.findOneAndUpdate({ email }, { $unset: { otp: 1 } });
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};