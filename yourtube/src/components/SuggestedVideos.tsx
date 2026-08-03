"use client";
import { mockVideos } from "@/data/mock-videos";
import Image from "next/image";
import Link from "next/link";

const SuggestedVideos = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Up next</h2>
      {mockVideos.slice(0, 15).map((video) => (
        <Link href={`/watch/${video._id}`} key={video._id}>
          <div className="flex gap-4 group">
            <div className="relative w-40 aspect-video rounded-lg overflow-hidden">
              <Image
                src={video.thumbnail}
                alt={video.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold line-clamp-2">{video.title}</h3>
              <p className="text-xs text-gray-500">{video.channelName}</p>
              <p className="text-xs text-gray-500">
                {video.views} &bull; {video.uploadedAt}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SuggestedVideos;