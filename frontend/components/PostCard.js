export default function PostCard({ post }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 mb-4 hover:shadow-md transition">
      <h2 className="text-xl font-bold text-blue-600 mb-1">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-3">
        By {post.author.name} · {new Date(post.created_at).toLocaleDateString()}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {post.content.length > 200
          ? post.content.slice(0, 200) + "..."
          : post.content}
      </p>
    </div>
  );
}