import VideoCard from "./videocard";
import VideoUploader from "./VideoUploader";
import { Button } from "./ui/button";
import { useState } from "react";

export default function ChannelVideos({ videos, onUpload }: any) {
  const [showUploader, setShowUploader] = useState(false);

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          You haven't uploaded any videos yet.
        </p>
        <Button onClick={() => setShowUploader(true)}>Upload Video</Button>
        {showUploader && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg">
              <VideoUploader onUpload={onUpload} />
              <Button
                variant="ghost"
                onClick={() => setShowUploader(false)}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Videos</h2>
        <Button onClick={() => setShowUploader(true)}>Upload Video</Button>
      </div>
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg">
            <VideoUploader onUpload={onUpload} />
            <Button
              variant="ghost"
              onClick={() => setShowUploader(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video: any) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}