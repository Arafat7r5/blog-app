"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-400">
        BlogApp
      </Link>
      <div className="flex gap-4 text-sm items-center">
        <Link href="/posts" className="hover:text-blue-400 transition">
          Posts
        </Link>
        <Link href="/posts/create" className="hover:text-blue-400 transition">
          Write
        </Link>

        {user ? (
          <>
            <Link href = {user.role === "admin" ? "/admin/dashboard" : "/user"} className="text-blue-400">{user.email}</Link>
            <button onClick={handleLogout} className="hover:text-red-400 transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-400 transition">
              Login
            </Link>
            <Link href="/register" className="hover:text-blue-400 transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}