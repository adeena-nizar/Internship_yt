"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Video {
  _id: string;
  videoUrl: string;
  title: string;
  description: string;
}

const WatchPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [video, setVideo] = useState<Video | null>(null);

  const handleCreateParty = async () => {
    try {
      const response = await axios.post("http://localhost:8000/party/create");
      const { partyId } = response.data;
      router.push(`/party/${partyId}`);
    } catch (error) {
      console.error("Failed to create party", error);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/videos/${id}`);
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
      <button
        onClick={handleCreateParty}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Start Watch Party
      </button>
    </div>
  );
};

export default WatchPage;