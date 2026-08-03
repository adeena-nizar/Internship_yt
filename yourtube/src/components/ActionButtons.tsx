"use client";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";

const ActionButtons = ({ video }: { video: any }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const likedVideos = JSON.parse(localStorage.getItem("likedVideos") || "[]");
    const videoIsLiked = likedVideos.some((v: any) => v._id === video._id);
    setIsLiked(videoIsLiked);
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
      >
        <Share className="w-6 h-6 mr-2" />
        <span>Share</span>
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
      >
        <Download className="w-6 h-6 mr-2" />
        <span>Download</span>
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
      >
        <Bookmark className="w-6 h-6 mr-2" />
        <span>Save</span>
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