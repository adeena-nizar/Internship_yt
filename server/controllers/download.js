import User from "../Modals/Auth.js";
import Download from "../Modals/Download.js";
import moment from "moment";

export const downloadVideo = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = moment().startOf("day");
    const downloadLimit = user.isPremium ? 10 : 1;

    if (
      user.lastDownloadDate &&
      moment(user.lastDownloadDate).isSame(today, "day") &&
      user.dailyDownloadCount >= downloadLimit
    ) {
      return res
        .status(403)
        .json({ message: "Daily download limit reached" });
    }

    if (
      !user.lastDownloadDate ||
      !moment(user.lastDownloadDate).isSame(today, "day")
    ) {
      user.dailyDownloadCount = 0;
    }

    user.dailyDownloadCount += 1;
    user.lastDownloadDate = new Date();

    await user.save();

    const download = new Download({
      userId,
      videoId,
    });

    await download.save();

    res.status(200).json({ message: "Download successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDownloadedVideos = async (req, res) => {
  const userId = req.user.id;

  try {
    const downloads = await Download.find({ userId }).populate("videoId");
    res.status(200).json(downloads);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};