import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import Image from "next/image";

const ChannelHeader = ({ channel, videoCount, onEdit }: any) => {
  return (
    <div className="w-full">
      <div className="relative h-32 md:h-48 lg:h-64">
        <Image
          src={channel.banner}
          alt="Channel Banner"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="w-20 h-20 md:w-32 md:h-32">
            <Image
              src={channel.profilePicture}
              alt="Profile Picture"
              width={128}
              height={128}
              className="rounded-full"
            />
            <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold">{channel.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{channel.username}</span>
              <span>{channel.subscribers} subscribers</span>
              <span>{videoCount} videos</span>
            </div>
            <p className="text-sm text-gray-700 max-w-2xl">
              {channel.description}
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={onEdit}>Customize Channel</Button>
            <Button variant="outline">Manage Videos</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;