"use client";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CheckCircle, MoreVertical, Clock } from "lucide-react";
import { Button } from "./ui/button";

export default function VideoCard({ video }: any) {
  const handleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const watchLaterVideos = JSON.parse(
      localStorage.getItem("watchLaterVideos") || "[]"
    );
    const videoIndex = watchLaterVideos.findIndex(
      (v: any) => v._id === video._id
    );

    if (videoIndex === -1) {
      watchLaterVideos.unshift(video);
      localStorage.setItem(
        "watchLaterVideos",
        JSON.stringify(watchLaterVideos)
      );
      alert("Added to Watch Later");
    } else {
      alert("Already in Watch Later");
    }
  };

  return (
    <Link href={`/watch/${video?._id}`} className="group block">
      <div className="flex flex-col space-y-3">
        <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
          <Image
            src={video.thumbnail}
            alt={video.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
          <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {video.duration}
          </div>
          <Button
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleWatchLater}
          >
            <Clock className="w-4 h-4 mr-1" />
            Watch Later
          </Button>
        </div>
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <Image
              src={video.channelAvatar}
              alt={video.channelName}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold leading-tight text-gray-900 line-clamp-2">
              {video.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <span>{video.channelName}</span>
              {video.isVerified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">
              {`${video.views} views`} &bull; {video.uploadedAt}
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
    </Link>
  );
}