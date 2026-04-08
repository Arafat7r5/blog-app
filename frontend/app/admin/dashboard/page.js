"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../../lib/api";
import { useAuth } from "../../../lib/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchPosts = async () => {
    const token = user?.token;
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      // Fetch pending posts (admin only endpoint)
      const pendingRes = await fetch(`${API_BASE}/posts/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pendingData = await pendingRes.json();
      if (!pendingRes.ok) throw new Error(pendingData.detail || "Failed to fetch pending posts");

      // Fetch approved posts (public endpoint)
      const approvedRes = await fetch(`${API_BASE}/posts/approved`);
      const approvedData = await approvedRes.json();
      if (!approvedRes.ok) throw new Error(approvedData.detail || "Failed to fetch approved posts");

      setPendingPosts(pendingData);
      setApprovedPosts(approvedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approvePost = async (post_id) => {
    const token = user?.token;
    try {
      const res = await fetch(`${API_BASE}/posts/${post_id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to approve");
      }

      fetchPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const PostCard = ({ post, showApproveButton }) => (
    <div className="border border-gray-200 rounded-lg p-5 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-black">{post.title}</h2>
          <p className="text-sm text-gray-500 mb-2">
            By {post.author.name} ·{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            {post.content.length > 150
              ? post.content.slice(0, 150) + "..."
              : post.content}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          {showApproveButton ? (
            <button
              onClick={() => approvePost(post.post_id)}
              className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Approve
            </button>
          ) : (
            <span className="text-green-600 text-sm font-semibold">
              Approved
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Two sections side by side */}
      <div className="flex gap-6 items-start">

        {/* Pending Posts Section */}
        <section className="flex-1">
          <h2 className="text-xl font-semibold text-black mb-4 border-b pb-2">
            Pending Posts{" "}
            <span className="text-gray-400 text-base font-normal">
              ({pendingPosts.length})
            </span>
          </h2>
          {pendingPosts.length === 0 ? (
            <p className="text-gray-500">No pending posts.</p>
          ) : (
            pendingPosts.map((post) => (
              <PostCard key={post.post_id} post={post} showApproveButton={true} />
            ))
          )}
        </section>

        {/* Divider */}
        <div className="w-px bg-gray-200 self-stretch"></div>

        {/* Approved Posts Section */}
        <section className="flex-1">
          <h2 className="text-xl font-semibold text-black mb-4 border-b pb-2">
            Approved Posts{" "}
            <span className="text-gray-400 text-base font-normal">
              ({approvedPosts.length})
            </span>
          </h2>
          {approvedPosts.length === 0 ? (
            <p className="text-gray-500">No approved posts yet.</p>
          ) : (
            approvedPosts.map((post) => (
              <PostCard key={post.post_id} post={post} showApproveButton={false} />
            ))
          )}
        </section>

      </div>
    </div>
  );
}