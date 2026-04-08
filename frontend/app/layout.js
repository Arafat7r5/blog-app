import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../lib/AuthContext";

export const metadata = {
  title: "Blog App",
  description: "A simple blog application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <AuthProvider>
          <Navbar />
          <div className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}