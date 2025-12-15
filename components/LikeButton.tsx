"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  blogId: string;
  likes?: string[];
}

export default function LikeButton({ blogId, likes = [] }: Props) {
  const { data: session } = useSession();
  const [likesState, setLikesState] = useState<string[]>(likes);

  const likesCount = likesState.length;
  const liked = !!session?.user?.id && likesState.includes(session.user.id);

  const [loading, setLoading] = useState(false);
  // 👇 sync state AFTER data arrives

  const handleLike = async () => {
    if (!session) return alert("Login to like");
    console.log("Liking blog:", blogId);

    setLoading(true);

    const res = await fetch(`/api/blogs/${blogId}/likes`, {
      method: "POST",
    });

    const data = await res.json();
    setLikesState(data.likes);
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
        liked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
      }`}
    >
      <Heart
        className={`w-4 h-4 ${liked ? "fill-red-500 stroke-red-500" : ""}`}
      />
      {likesCount}
    </button>
  );
}
