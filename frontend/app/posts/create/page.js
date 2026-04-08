"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../../lib/api";
import { useAuth } from "../../../lib/AuthContext";

export default function CreatePostPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = user?.token;
    if (!token) {
      setError("You must be logged in to create a post.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create post");

      router.push("/posts");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Write a Post</h1>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <textarea
          name="content"
          placeholder="Write your post content here..."
          value={form.content}
          onChange={handleChange}
          required
          rows={8}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Post"}
        </button>
      </form>
    </div>
  );
}