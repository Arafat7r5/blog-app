"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyPosts = async () => {
    const token = user?.token;
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts/user/myposts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch your posts");

      setPendingPosts(data.filter((post) => !post.approved));
      setApprovedPosts(data.filter((post) => post.approved));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [user]);

  if (loading) return <p className="text-gray-500">Loading your posts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const PostCard = ({ post }) => (
    <div className="border border-gray-200 rounded-lg p-5 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-black">{post.title}</h2>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            {post.content.length > 150
              ? post.content.slice(0, 150) + "..."
              : post.content}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          {post.approved ? (
            <span className="text-green-600 text-sm font-semibold">Approved</span>
          ) : (
            <span className="text-yellow-500 text-sm font-semibold">Pending</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex gap-6 items-start">

        {/* Pending Posts */}
        <section className="flex-1">
          <h2 className="text-xl font-semibold text-black mb-4 border-b pb-2">
            Pending{" "}
            <span className="text-gray-400 text-base font-normal">
              ({pendingPosts.length})
            </span>
          </h2>
          {pendingPosts.length === 0 ? (
            <p className="text-gray-500">No pending posts.</p>
          ) : (
            pendingPosts.map((post) => (
              <PostCard key={post.post_id} post={post} />
            ))
          )}
        </section>

        {/* Divider */}
        <div className="w-px bg-gray-200 self-stretch"></div>

        {/* Approved Posts */}
        <section className="flex-1">
          <h2 className="text-xl font-semibold text-black mb-4 border-b pb-2">
            Approved{" "}
            <span className="text-gray-400 text-base font-normal">
              ({approvedPosts.length})
            </span>
          </h2>
          {approvedPosts.length === 0 ? (
            <p className="text-gray-500">No approved posts yet.</p>
          ) : (
            approvedPosts.map((post) => (
              <PostCard key={post.post_id} post={post} />
            ))
          )}
        </section>

      </div>
    </div>
  );
}