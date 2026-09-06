"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Video {
  _id: string;
  videoUrl: string;
  title: string;
  description: string;
}

const WatchPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/videos/${id}`);
          setVideo(response.data);
        } catch (error) {
          console.error("Failed to fetch video", error);
        }
      };

      fetchVideo();
    }
  }, [id]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <video src={video.videoUrl} controls className="w-full rounded-lg"></video>
      <h1 className="text-2xl md:text-3xl font-bold mt-4">{video.title}</h1>
      <p className="text-gray-600 mt-2">{video.description}</p>
    </div>
  );
};

export default WatchPage;