"use client";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Bookmark,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const ActionButtons = ({ video }: { video: any }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  useEffect(() => {
    const likedVideos = JSON.parse(localStorage.getItem("likedVideos") || "[]");
    const videoIsLiked = likedVideos.some((v: any) => v._id === video._id);
    setIsLiked(videoIsLiked);

    const watchLaterVideos = JSON.parse(
      localStorage.getItem("watchLaterVideos") || "[]"
    );
    const videoIsWatchLater = watchLaterVideos.some(
      (v: any) => v._id === video._id
    );
    setIsWatchLater(videoIsWatchLater);
  }, [video]);

  const convertRelativeDate = (relativeDate: string) => {
    const now = new Date();
    const parts = relativeDate.split(" ");
    if (parts.length !== 3 || parts[2] !== "ago") {
      return now.toISOString();
    }

    const quantity = parseInt(parts[0], 10);
    const unit = parts[1];

    switch (unit) {
      case "day":
      case "days":
        now.setDate(now.getDate() - quantity);
        break;
      case "week":
      case "weeks":
        now.setDate(now.getDate() - quantity * 7);
        break;
      case "month":
      case "months":
        now.setMonth(now.getMonth() - quantity);
        break;
      case "hour":
      case "hours":
        now.setHours(now.getHours() - quantity);
        break;
      default:
        break;
    }

    return now.toISOString();
  };

  const handleLike = () => {
    const likedVideos = JSON.parse(localStorage.getItem("likedVideos") || "[]");
    const videoIndex = likedVideos.findIndex((v: any) => v._id === video._id);

    if (videoIndex > -1) {
      likedVideos.splice(videoIndex, 1);
      setIsLiked(false);
    } else {
      const videoToStore = { ...video };
      if (
        typeof videoToStore.uploadedAt === "string" &&
        videoToStore.uploadedAt.endsWith("ago")
      ) {
        videoToStore.uploadedAt = convertRelativeDate(videoToStore.uploadedAt);
      }
      likedVideos.unshift(videoToStore);
      setIsLiked(true);
    }

    localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
  };

  const handleWatchLater = () => {
    const watchLaterVideos = JSON.parse(
      localStorage.getItem("watchLaterVideos") || "[]"
    );
    const videoIndex = watchLaterVideos.findIndex(
      (v: any) => v._id === video._id
    );

    if (videoIndex > -1) {
      watchLaterVideos.splice(videoIndex, 1);
      setIsWatchLater(false);
    } else {
      const videoToStore = { ...video };
      if (
        typeof videoToStore.uploadedAt === "string" &&
        videoToStore.uploadedAt.endsWith("ago")
      ) {
        videoToStore.uploadedAt = convertRelativeDate(videoToStore.uploadedAt);
      }
      watchLaterVideos.unshift(videoToStore);
      setIsWatchLater(true);
    }

    localStorage.setItem("watchLaterVideos", JSON.stringify(watchLaterVideos));
  };

  const handleDownload = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/download/${video._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        // This is a simplified download trigger. In a real app, you'd likely
        // get a download link from the backend and use it here.
        const link = document.createElement("a");
        link.href = video.videoUrl;
        link.setAttribute("download", video.title);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        alert("You have reached your daily download limit.");
      } else {
        console.error("Download failed", error);
        alert("Failed to download video.");
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
        onClick={handleLike}
      >
        <ThumbsUp
          className={`w-6 h-6 mr-2 ${isLiked ? "fill-current" : ""}`}
        />
        <span>{isLiked ? "Liked" : "Like"}</span>
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
      >
        <ThumbsDown className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
        onClick={handleDownload}
      >
        <Download className="w-6 h-6 mr-2" />
        <span>Download</span>
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
      >
        <Share className="w-6 h-6 mr-2" />
        <span>Share</span>
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
        onClick={handleWatchLater}
      >
        <Clock className={`w-6 h-6 mr-2 ${isWatchLater ? "fill-current" : ""}`} />
        <span>{isWatchLater ? "Added" : "Watch Later"}</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-gray-200"
      >
        <MoreHorizontal className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default ActionButtons;