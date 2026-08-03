"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WatchLaterContent() {
  const [watchLater, setWatchLater] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchLater();
  }, []);

  const loadWatchLater = () => {
    setLoading(true);
    const watchLaterData = JSON.parse(
      localStorage.getItem("watchLaterVideos") || "[]"
    );
    setWatchLater(watchLaterData);
    setLoading(false);
  };

  const handleRemoveFromWatchLater = (videoId: string) => {
    const updatedWatchLater = watchLater.filter((item) => item._id !== videoId);
    setWatchLater(updatedWatchLater);
    localStorage.setItem("watchLaterVideos", JSON.stringify(updatedWatchLater));
  };

  const handleClearWatchLater = () => {
    setWatchLater([]);
    localStorage.removeItem("watchLaterVideos");
  };

  if (loading) {
    return <div>Loading watch later...</div>;
  }

  if (watchLater.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No videos saved</h2>
        <p className="text-gray-600">
          Videos you save for later will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{watchLater.length} videos</p>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Play all
          </Button>
          <Button variant="ghost" onClick={handleClearWatchLater}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {watchLater.map((video) => (
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
                {formatDistanceToNow(new Date(video.uploadedAt))} ago
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
                  onClick={() => handleRemoveFromWatchLater(video._id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove from Watch later
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}