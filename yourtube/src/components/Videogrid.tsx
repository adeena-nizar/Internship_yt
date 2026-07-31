"use client";
import React, { useEffect, useState } from "react";
import VideoCard from "./videocard";
import Categories from "./Categories";
import { mockVideos } from "@/data/mock-videos";
import SkeletonLoader from "./SkeletonLoader";

const Videogrid = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const filteredVideos =
        selectedCategory === "All"
          ? mockVideos
          : mockVideos.filter((video) =>
              video.title.toLowerCase().includes(selectedCategory.toLowerCase())
            );
      setVideos(filteredVideos);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8 mt-8">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : videos.map((video) => <VideoCard key={video._id} video={video} />)}
      </div>
    </div>
  );
};

export default Videogrid;