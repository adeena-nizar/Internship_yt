"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ChannelInfo = ({ video }: any) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <Image
            src={video.channelAvatar}
            alt={video.channelName}
            width={48}
            height={48}
            className="rounded-full"
          />
          <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-lg">{video.channelName}</h3>
          <p className="text-sm text-gray-500">1.2M subscribers</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setIsSubscribed(!isSubscribed)}
          className={`${
            isSubscribed
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-black text-white hover:bg-gray-800"
          } rounded-full px-4 py-2 font-bold`}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
        {isSubscribed && (
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChannelInfo;