import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to BlogApp</h1>
      <p className="text-gray-600 mb-8 text-lg">
        Read approved posts, share your thoughts, or manage content as an admin.
      </p>
      <div className="flex gap-4">
        <Link
          href="/posts"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Posts
        </Link>
        <Link
          href="/register"
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}