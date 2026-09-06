"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchResult from "@/components/SearchResult";
import { mockVideos } from "@/data/mock-videos";
import { convertRelativeDate } from "@/lib/utils";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const uploadedVideos = JSON.parse(
      localStorage.getItem("uploadedVideos") || "[]"
    );

    const allVideos = [
      ...mockVideos.map((video) => ({
        ...video,
        uploadedAt: convertRelativeDate(video.uploadedAt),
      })),
      ...uploadedVideos,
    ];

    setVideos(allVideos);
  }, []);

  const filteredVideos = videos.filter((video) => {
    const searchTerm = query.toLowerCase().trim();
    const title = video.title?.toLowerCase() || "";
    const channelName = video.channelName?.toLowerCase() || "";
    const description = video.description?.toLowerCase() || "";

    return (
      title.includes(searchTerm) ||
      channelName.includes(searchTerm) ||
      description.includes(searchTerm)
    );
  });

  return <SearchResult videos={filteredVideos} query={query} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}