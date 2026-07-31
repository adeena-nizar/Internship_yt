"use client";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CheckCircle, MoreVertical } from "lucide-react";

export default function VideoCard({ video }: any) {
  return (
    <Link href={`/watch/${video?._id}`} className="group">
      <div className="flex flex-col space-y-3">
        <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
          <Image
            src={video.thumbnail}
            alt={video.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full">
            {video.duration}
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <Image
              src={video.channelAvatar}
              alt={video.channelName}
              width={40}
              height={40}
              className="rounded-full"
            />
            <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold leading-tight text-gray-800 line-clamp-2 group-hover:text-blue-600">
              {video.title}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
              <span>{video.channelName}</span>
              {video.isVerified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">
              {video.views} &bull; {video.uploadedAt}
            </p>
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </Link>
  );
}