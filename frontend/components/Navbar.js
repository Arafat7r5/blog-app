"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
    setRole(localStorage.getItem("role"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setEmail(null);
    setRole(null);
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

        {email ? (
          <>
            <Link href={role === "admin" ? "/admin/dashboard" : "/user"} className="hover:text-blue-400 transition">
              {email}
            </Link>
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