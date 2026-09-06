import ChannelHeader from "@/components/ChannelHeader";
import Channeltabs from "@/components/Channeltabs";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";
import { useUser } from "@/lib/AuthContext";
import { useRouter } from "next/router";
import React from "react";

const ChannelPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const channel = user || {
    name: "YourTube IN Creator",
    username: "@yourtubeincreator",
    subscribers: "1.2M",
    description: "Welcome to the official channel of YourTube IN Creator!",
    profilePicture: "/avatars/avatar1.png",
    banner: "/banners/banner.jpg",
  };

  const videos = [
    {
      _id: "1",
      thumbnail: "https://source.unsplash.com/random/400x225?nature",
      videoUrl: "/video/vdo.mp4",
      duration: "10:30",
      channelAvatar: "/avatars/avatar1.png",
      title: "Amazing Nature Documentary",
      channelName: "Nature Channel",
      isVerified: true,
      views: "45K views",
      uploadedAt: "Today",
    },
    {
      _id: "2",
      thumbnail: "https://source.unsplash.com/random/400x225?cooking",
      videoUrl: "/video/vdo.mp4",
      duration: "8:12",
      channelAvatar: "/avatars/avatar2.png",
      title: "Cooking Tutorial: Perfect Pasta",
      channelName: "Chef's Kitchen",
      isVerified: false,
      views: "23K views",
      uploadedAt: "1 day ago",
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-white">
      <div className="max-w-full mx-auto">
        <ChannelHeader channel={channel} user={user} />
        <Channeltabs />
        <div className="px-4 pb-8">
          <VideoUploader channelId={id} channelName={channel.channelname} />
        </div>
        <div className="px-4 pb-8">
          <ChannelVideos videos={videos} />
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;