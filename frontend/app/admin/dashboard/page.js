"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../../lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch posts");

      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approvePost = async (post_id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/posts/${post_id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to approve");
      }

      // Refresh posts after approval
      fetchPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Admin Dashboard</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.post_id}
            className="border border-gray-200 rounded-lg p-5 mb-4"
          >
            <div className="flex justify-between items-start">
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
                {post.approved ? (
                  <span className="text-green-600 text-sm font-semibold">
                    ✅ Approved
                  </span>
                ) : (
                  <button
                    onClick={() => approvePost(post.post_id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}