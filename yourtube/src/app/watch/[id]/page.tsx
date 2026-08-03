"use client";
import ActionButtons from "@/components/ActionButtons";
import ChannelInfo from "@/components/ChannelInfo";
import CommentsSection from "@/components/CommentsSection";
import SuggestedVideos from "@/components/SuggestedVideos";
import VideoPlayer from "@/components/VideoPlayer";
import { mockVideos } from "@/data/mock-videos";
import { useParams } from "next/navigation";

const WatchPage = () => {
  const { id } = useParams();
  const video = mockVideos.find((v) => v._id === id);

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer video={video} />
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">{video.title}</h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-gray-500">
                {video.views} &bull; {video.uploadedAt}
              </p>
              <ActionButtons />
            </div>
            <div className="border-t border-b py-4">
              <ChannelInfo video={video} />
            </div>
            <div>
              <h2 className="font-bold text-xl mb-2">Description</h2>
              <p className="text-gray-600">
                This is a sample description for the video. It can be a bit longer to see how it looks in the layout.
              </p>
            </div>
            <CommentsSection />
          </div>
        </div>
        <div>
          <SuggestedVideos />
        </div>
      </div>
    </div>
  );
};

export default WatchPage;