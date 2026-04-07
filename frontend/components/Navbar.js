"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-400">
        BlogApp
      </Link>
      <div className="flex gap-4 text-sm">
        <Link href="/posts" className="hover:text-blue-400 transition">
          Posts
        </Link>
        <Link href="/posts/create" className="hover:text-blue-400 transition">
          Write
        </Link>
        <Link href="/login" className="hover:text-blue-400 transition">
          Login
        </Link>
        <Link href="/register" className="hover:text-blue-400 transition">
          Register
        </Link>
        <button onClick={handleLogout} className="hover:text-red-400 transition">
          Logout
        </button>
      </div>
    </nav>
  );
}