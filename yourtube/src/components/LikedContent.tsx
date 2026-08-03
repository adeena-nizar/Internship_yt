"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, ThumbsUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LikedVideosContent() {
  const [likedVideos, setLikedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikedVideos();
  }, []);

  const loadLikedVideos = () => {
    setLoading(true);
    const likedData = JSON.parse(localStorage.getItem("likedVideos") || "[]");
    setLikedVideos(likedData);
    setLoading(false);
  };

  const handleUnlikeVideo = (videoId: string) => {
    const updatedLikedVideos = likedVideos.filter((v) => v._id !== videoId);
    setLikedVideos(updatedLikedVideos);
    localStorage.setItem("likedVideos", JSON.stringify(updatedLikedVideos));
  };

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

  if (loading) {
    return <div>Loading liked videos...</div>;
  }

  if (likedVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <ThumbsUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No liked videos yet</h2>
        <p className="text-gray-600">Videos you like will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{likedVideos.length} videos</p>
        <Button className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          Play all
        </Button>
      </div>

      <div className="space-y-4">
        {likedVideos.map((video) => (
          <div key={video._id} className="flex gap-4 group">
            <Link href={`/watch/${video._id}`} className="flex-shrink-0">
              <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  layout="fill"
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/watch/${video._id}`}>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">
                  {video.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600">{video.channelName}</p>
              <p className="text-sm text-gray-600">
                {video.views} &bull;{" "}
                {formatDistanceToNow(
                  new Date(
                    typeof video.uploadedAt === "string" &&
                      video.uploadedAt.endsWith("ago")
                      ? convertRelativeDate(video.uploadedAt)
                      : video.uploadedAt
                  )
                )}{" "}
                ago
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleUnlikeVideo(video._id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove from liked videos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}