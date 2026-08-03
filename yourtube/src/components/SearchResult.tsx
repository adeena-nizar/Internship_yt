import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const SearchResult = ({ videos, query }: any) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">
          No results found for "{query}"
        </h2>
        <p className="text-gray-600">
          Try checking your spelling or using different keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {videos.map((video: any) => (
        <div key={video._id} className="flex flex-col md:flex-row gap-4 group">
          <Link href={`/watch/${video._id}`} className="flex-shrink-0">
            <div className="relative w-full md:w-80 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={video.thumbnail}
                alt={video.title}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                {video.duration}
              </div>
            </div>
          </Link>

          <div className="flex-1 min-w-0 py-1">
            <Link href={`/watch/${video._id}`}>
              <h3 className="font-medium text-lg line-clamp-2 group-hover:text-blue-600 mb-2">
                {video.title}
              </h3>
            </Link>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span>{video.views.toLocaleString()} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.uploadedAt))} ago</span>
            </div>

            <Link
              href={`/channel`}
              className="flex items-center gap-2 mb-2 hover:text-blue-600"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={video.channel?.avatar} />
                <AvatarFallback className="text-xs">
                  {video.channelName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{video.channelName}</span>
            </Link>

            <p className="text-sm text-gray-700 line-clamp-2">
              {video.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;