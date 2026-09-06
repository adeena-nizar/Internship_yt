import mongoose from "mongoose";
import users from "../Modals/Auth.js";

export const login = async (req, res) => {
  const { email, name, image, device, city, state } = req.body;

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      const newUser = await users.create({
        email,
        name,
        image,
        lastLogin: { device, city, state },
      });
      return res.status(201).json({ result: newUser });
    } else {
      const now = new Date();
      const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const hours = istTime.getHours();
      const theme = hours >= 10 && hours < 12 ? "light" : "dark";

      let otpRequired = false;
      if (
        existingUser.lastLogin.device !== device ||
        existingUser.lastLogin.city !== city ||
        existingUser.lastLogin.state !== state
      ) {
        otpRequired = true;
      }

      existingUser.lastLogin = { device, city, state };
      existingUser.theme = theme;
      await existingUser.save();

      return res.status(200).json({ result: existingUser, otpRequired });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ message: "User unavailable..." });
  }
  try {
    const updatedata = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname: channelname,
          description: description,
        },
      },
      { new: true }
    );
    return res.status(201).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateTheme = async (req, res) => {
  const { id: _id } = req.params;
  const { theme } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("User unavailable.");
  }

  try {
    const updatedUser = await users.findByIdAndUpdate(
      _id,
      { $set: { theme: theme } },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};