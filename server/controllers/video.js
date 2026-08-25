import video from "../Modals/video.js";

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "plz upload a mp4 video file only" });
  } else {
    try {
      const file = new video({
        videotitle: req.body.videotitle,
        filename: req.file.originalname,
        filepath: req.file.path,
        filetype: req.file.mimetype,
        filesize: req.file.size,
        videochanel: req.body.videochanel,
        uploader: req.body.uploader,
      });
      await file.save();
      return res.status(201).json("file uploaded successfully");
    } catch (error) {
      console.error(" error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};
export const getallvideo = async (req, res) => {
  const mockVideos = [
    {
      _id: "1",
      videotitle: "Example Video 1",
      filename: "example1.mp4",
      filepath: "/path/to/video1.mp4",
      filetype: "video/mp4",
      filesize: "123456",
      videochanel: "Mock Channel 1",
      uploader: "Mock Uploader 1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    },
    {
      _id: "2",
      videotitle: "Example Video 2",
      filename: "example2.mp4",
      filepath: "/path/to/video2.mp4",
      filetype: "video/mp4",
      filesize: "789012",
      videochanel: "Mock Channel 2",
      uploader: "Mock Uploader 2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    }
  ];

  try {
    return res.status(200).send(mockVideos);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};