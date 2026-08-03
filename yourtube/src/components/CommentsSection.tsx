"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";

const sampleComments = [
  {
    id: 1,
    user: "Alex",
    avatar: "/avatars/avatar1.png",
    comment: "This is an amazing video! Thanks for sharing.",
    likes: 12,
    dislikes: 1,
    replies: [
      {
        id: 3,
        user: "Maria",
        avatar: "/avatars/avatar3.png",
        comment: "I agree! I learned a lot.",
        likes: 3,
        dislikes: 0,
      },
    ],
  },
  {
    id: 2,
    user: "Jane",
    avatar: "/avatars/avatar2.png",
    comment: "Great content, but the audio could be better.",
    likes: 5,
    dislikes: 2,
    replies: [],
  },
];

const Comment = ({ comment }: any) => (
  <div className="flex items-start gap-4">
    <Avatar>
      <Image
        src={comment.avatar}
        alt={comment.user}
        width={40}
        height={40}
        className="rounded-full"
      />
      <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <p className="font-bold">{comment.user}</p>
      <p>{comment.comment}</p>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
        <button className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" /> {comment.likes}
        </button>
        <button className="flex items-center gap-1">
          <ThumbsDown className="w-4 h-4" /> {comment.dislikes}
        </button>
        <button>Reply</button>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply: any) => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  </div>
);

const CommentsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Input placeholder="Add a comment..." className="mb-2" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button>Comment</Button>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {sampleComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;