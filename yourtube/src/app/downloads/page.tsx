"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/downloads", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDownloads(response.data);
      } catch (error) {
        console.error("Failed to fetch downloads", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Downloads</h1>
      {downloads.length === 0 ? (
        <p>You haven't downloaded any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {downloads.map((download) => (
            <Link href={`/watch/${download.videoId._id}`} key={download._id}>
              <div className="cursor-pointer">
                <img
                  src={download.videoId.thumbnailUrl}
                  alt={download.videoId.title}
                  className="w-full h-auto rounded-lg"
                />
                <h3 className="font-semibold mt-2">{download.videoId.title}</h3>
                <p className="text-sm text-gray-500">
                  Downloaded on {new Date(download.downloadDate).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadsPage;