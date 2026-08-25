"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

const Comment = ({
  comment,
  handleLike,
  handleDislike,
  handleReport,
  handleDelete,
  handleReply,
  handleTranslate,
  translatedComment,
}: any) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const onReply = () => {
    handleReply(comment._id, replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarFallback>{comment.usercommented?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold">{comment.usercommented}</p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </p>
          <p className="text-xs text-gray-500">{comment.userLocation}</p>
        </div>
        <p>{comment.commentbody}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <button
            onClick={() => handleLike(comment._id)}
            className="flex items-center gap-1"
          >
            <ThumbsUp className="w-4 h-4" /> {comment.likes?.length || 0}
          </button>
          <button
            onClick={() => handleDislike(comment._id)}
            className="flex items-center gap-1"
          >
            <ThumbsDown className="w-4 h-4" /> {comment.dislikes?.length || 0}
          </button>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="ml-2"
          >
            Reply
          </button>
          <button onClick={() => handleDelete(comment._id)} className="ml-2">
            Delete
          </button>
          <button
            onClick={() => handleReport(comment._id)}
            className="ml-2 flex items-center gap-1"
          >
            <Flag className="w-4 h-4" /> Report
          </button>
          <button
            onClick={() => handleTranslate(comment._id, comment.commentbody)}
            className="ml-2"
          >
            Translate
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
        {translatedComment && translatedComment.id === comment._id && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p className="text-sm text-gray-700">{translatedComment.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CommentsSection = ({ videoId }: { videoId: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [translatedComment, setTranslatedComment] = useState(null);
  const [targetLang, setTargetLang] = useState("en");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/comment/${videoId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "" || !user) return;
    const newCommentObj = {
      videoid: videoId,
      userid: user.result._id,
      commentbody: newComment,
      usercommented: user.result.name,
    };
    try {
      await axios.post(
        "http://localhost:5000/comment/postcomment",
        newCommentObj
      );
      setNewComment("");
      fetchComments();
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Error posting comment:", error);
      }
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:5000/comment/like/${commentId}`, {
        userid: user.result._id,
      });
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async (commentId: string) => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:5000/comment/dislike/${commentId}`, {
        userid: user.result._id,
      });
      fetchComments();
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const handleReport = async (commentId: string) => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:5000/comment/report/${commentId}`, {
        userid: user.result._id,
      });
      alert("Comment reported");
      fetchComments();
    } catch (error) {
      console.error("Error reporting comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/comment/deletecomment/${commentId}`
      );
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReply = (commentId: number, replyText: string) => {
    // Reply functionality to be implemented
  };

  const handleTranslate = async (commentId, commentBody) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/comment/translate/${commentId}`,
        {
          targetLang,
        }
      );
      setTranslatedComment({
        id: commentId,
        text: response.data.translatedText,
      });
    } catch (error) {
      console.error("Error translating comment:", error);
      alert("Failed to translate comment.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="language-select" className="text-sm font-medium">
          Translate to:
        </label>
        <select
          id="language-select"
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
        </select>
      </div>
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarFallback>{user?.result.name.charAt(0)}</AvatarFallback>
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
            key={comment._id}
            comment={comment}
            handleLike={handleLike}
            handleDislike={handleDislike}
            handleReport={handleReport}
            handleDelete={handleDelete}
            handleReply={handleReply}
            handleTranslate={handleTranslate}
            translatedComment={translatedComment}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;