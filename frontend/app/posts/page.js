"use client";
import { useEffect, useState } from "react";
import PostCard from "../../components/PostCard";
import { API_BASE } from "../../lib/api";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/posts/`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p className="text-gray-500">Loading posts...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Approved Posts</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No approved posts yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post.post_id} post={post} />)
      )}
    </div>
  );
}