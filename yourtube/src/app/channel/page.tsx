"use client";
import { useState, useEffect } from "react";
import ChannelHeader from "@/components/ChannelHeader";
import Channeltabs from "@/components/Channeltabs";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";

export default function ChannelPage() {
  const [channelData, setChannelData] = useState({
    name: "YourTube IN Creator",
    username: "@yourtubeincreator",
    subscribers: "1.2M",
    description: "Welcome to the official channel of YourTube IN Creator!",
    profilePicture: "/avatars/avatar1.png",
    banner: "/banners/banner.jpg",
  });
  const [videos, setVideos] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedChannelData = localStorage.getItem("channelData");
    if (storedChannelData) {
      setChannelData(JSON.parse(storedChannelData));
    }
    const storedVideos = localStorage.getItem("uploadedVideos");
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    }
  }, []);

  const handleChannelUpdate = (newData: any) => {
    localStorage.setItem("channelData", JSON.stringify(newData));
    setChannelData(newData);
    setIsEditing(false);
  };

  const handleVideoUpload = (newVideo: any) => {
    const updatedVideos = [newVideo, ...videos];
    localStorage.setItem("uploadedVideos", JSON.stringify(updatedVideos));
    setVideos(updatedVideos);
  };

  return (
    <div className="w-full">
      <ChannelHeader
        channel={channelData}
        videoCount={videos.length}
        onEdit={() => setIsEditing(true)}
      />
      <Channeltabs />
      <div className="p-4">
        {isEditing ? (
          <EditChannelForm
            channelData={channelData}
            onSave={handleChannelUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ChannelVideos videos={videos} onUpload={handleVideoUpload} />
        )}
      </div>
    </div>
  );
}

const EditChannelForm = ({ channelData, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(channelData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev: any) => ({
          ...prev,
          [name]: event.target?.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Channel Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>Profile Picture</label>
        <input
          type="file"
          name="profilePicture"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>
      <div>
        <label>Banner</label>
        <input
          type="file"
          name="banner"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};