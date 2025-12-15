"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { set } from "mongoose";

interface CommentData {
  _id: string;
  blogId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId: string | null;
}

interface CommentsSectionProps {
  blogId: string;
}

const Comments = ({ blogId }: CommentsSectionProps) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null); // Which comment is being replied to
  const [replyText, setReplyText] = useState(""); // Text for the reply

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/blogs/${blogId}/comments`);
        const data = await res.json();
        console.log("Fetched comments:", data);

        // Set comments from the response array
        if (data.comments && Array.isArray(data.comments)) {
          setComments(data.comments);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
      }
    };

    if (blogId) {
      fetchComments();
    }
  }, [blogId]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (editingCommentId && editTextareaRef.current) {
      editTextareaRef.current.focus();
    }
  }, [editingCommentId]);

  const handlePostComments = async () => {
    if (!session) {
      setError("You must be logged in to comment.");
      console.log("User not logged in. Cannot post comment.");
      return;
    }

    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
      } else {
        setError(data.message || "Failed to post comment.");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  // Sample comments data for demonstration
  const handleSaveEdit = (commentId: string) => async () => {
    console.log("hello");

    if (!editedContent.trim()) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update comment");
      }

      // Update comment locally (important for fast UX)
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: editedContent }
            : comment
        )
      );
      console.log(data.message);
      // Exit edit mode
      setEditingCommentId(null);
      setEditedContent("");
    } catch (error) {
      console.error("Edit failed:", error);
      alert("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete comment");
      }

      // Remove comment from UI
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );

      // Cleanup UI states
      setActiveMenuId(null);
      setActiveReplyId(null);
      setEditingCommentId(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };
  const handlePostReply = async () => {
    if (!replyTo) return;

    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText,
          parentId: replyTo, // This makes it a reply
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, data.comment]); // Add reply to state
        setReplyText("");
        setReplyTo(null); // Close reply textarea
        setActiveReplyId(null);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const topLevelComments = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-7 h-7 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Comments
            </h2>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Join the discussion and share your thoughts on this article
          </p>
        </div>

        {/* Comments List */}
        <div className="space-y-4 mb-8">
          {topLevelComments.length > 0 ? (
            topLevelComments.map((comment, index) => (
              <div
                key={comment._id}
                className="relative group bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/30"
              >
                {/* Three Dots Menu */}
                <div className="absolute top-4 right-4" ref={menuRef}>
                  <button
                    onClick={() =>
                      setActiveMenuId(
                        activeMenuId === comment._id ? null : comment._id
                      )
                    }
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>

                  {/* Dropdown */}
                  {activeMenuId === comment._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-gray-700"
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditedContent(comment.content);
                          setActiveMenuId(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600"
                        onClick={() =>
                          handleDeleteComment(comment._id.toString())
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {comment.userName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {comment.createdAt
                        ? formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })
                        : "just now"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      onClick={() => {
                        setActiveReplyId(
                          activeReplyId === comment._id ? null : comment._id
                        );
                        setReplyTo(comment._id);
                      }}
                    >
                      Reply
                    </button>
                  </div>
                </div>

                {/* Comment Text */}
                {editingCommentId === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      ref={editTextareaRef}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                    />

                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={handleSaveEdit(comment._id.toString())}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {comment.content}
                  </p>
                )}

                {/* Reply Section */}
                {activeReplyId === comment._id && (
                  <div className="mt-4 ml-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-sm font-semibold mb-2">
                      Reply to {comment.userName}
                    </h4>

                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply here..."
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />

                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        onClick={handlePostReply}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
                {/* Replies Container */}
                <div className="mt-4 ml-6 space-y-3">
                  {replies
                    .filter((c) => c.parentId === comment._id)
                    .map((reply) => (
                      <div
                        key={reply._id}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <h4 className="font-semibold text-gray-900">
                          {reply.userName}
                        </h4>
                        <p className="text-gray-700 text-sm md:text-base">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                </div>
                {/* Separator */}
                {index < topLevelComments.length - 1 && (
                  <div className="mt-6 pt-6 border-t border-gray-100" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No comments yet</p>
              <p className="text-gray-500 text-sm">
                Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-200 my-8" />

        {/* Comment Input Section */}
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Leave a Comment
          </h3>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Share your thoughts and join the discussion. Your feedback is
            valuable to us.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!session && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">
                💡 You must be logged in to post a comment.
              </p>
            </div>
          )}

          <form className="space-y-4">
            {/* Comment Textarea */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Your Comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={5}
                disabled={!session}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">
                Be respectful and constructive in your comments.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={!session || submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              onClick={handlePostComments}
            >
              <Send className="w-4 h-4" />
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Comments;
