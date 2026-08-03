"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const Comment = ({
  comment,
  handleLike,
  handleDelete,
  handleReply,
}: any) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const onReply = () => {
    handleReply(comment.id, replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
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
          <button
            onClick={() => handleLike(comment.id)}
            className="flex items-center gap-1"
          >
            <ThumbsUp className="w-4 h-4" /> {comment.likes}
          </button>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="ml-2"
          >
            Reply
          </button>
          <button onClick={() => handleDelete(comment.id)} className="ml-2">
            Delete
          </button>
        </div>
        {showReplyInput && (
          <div className="flex items-center gap-2 mt-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add a reply..."
            />
            <Button onClick={onReply}>Reply</Button>
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply: any) => (
              <div key={reply.id} className="flex items-start gap-4 ml-8">
                <Avatar>
                  <Image
                    src={reply.avatar}
                    alt={reply.user}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <AvatarFallback>{reply.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold">{reply.user}</p>
                  <p>{reply.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentsSection = ({ videoId }: { videoId: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const storedComments = localStorage.getItem(`comments_${videoId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [videoId]);

  const saveComments = (updatedComments: any) => {
    setComments(updatedComments);
    localStorage.setItem(
      `comments_${videoId}`,
      JSON.stringify(updatedComments)
    );
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const newCommentObj = {
      id: Date.now(),
      user: "Guest",
      avatar: "/avatars/avatar-guest.png",
      comment: newComment,
      likes: 0,
      replies: [],
    };
    const updatedComments = [newCommentObj, ...comments];
    saveComments(updatedComments);
    setNewComment("");
  };

  const handleLike = (commentId: number) => {
    const updatedComments = comments.map((c) =>
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    );
    saveComments(updatedComments);
  };

  const handleDelete = (commentId: number) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    saveComments(updatedComments);
  };

  const handleReply = (commentId: number, replyText: string) => {
    const newReply = {
      id: Date.now(),
      user: "Guest",
      avatar: "/avatars/avatar-guest.png",
      comment: replyText,
    };
    const updatedComments = comments.map((c) =>
      c.id === commentId
        ? { ...c, replies: [...(c.replies || []), newReply] }
        : c
    );
    saveComments(updatedComments);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarFallback>G</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setNewComment("")}>
              Cancel
            </Button>
            <Button onClick={handleAddComment}>Comment</Button>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            handleLike={handleLike}
            handleDelete={handleDelete}
            handleReply={handleReply}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;