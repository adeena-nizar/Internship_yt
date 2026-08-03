"use client";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

const ActionButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
      >
        <ThumbsUp className="w-6 h-6 mr-2" />
        <span>1.2K</span>
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
      >
        <ThumbsDown className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
      >
        <Share className="w-6 h-6 mr-2" />
        <span>Share</span>
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
      >
        <Download className="w-6 h-6 mr-2" />
        <span>Download</span>
      </Button>
      <Button
        variant="ghost"
        className="rounded-full hover:bg-gray-200 px-4 py-2"
      >
        <Bookmark className="w-6 h-6 mr-2" />
        <span>Save</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-gray-200"
      >
        <MoreHorizontal className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default ActionButtons;