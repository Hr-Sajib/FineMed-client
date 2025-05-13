
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/protectedRoutes/ProtectedRouteProps";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Overview", path: "/admin/" },
    { name: "Medicines", path: "/admin/medicines" },
    { name: "Users", path: "/admin/users" },
    { name: "Orders", path: "/admin/orders" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-[100vh] flex flex-row">
        {/* Sidebar */}
        <nav
          className={`bg-green-50 text-black w-64 flex-shrink-0 shadow-md transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:sticky top-0 h-screen z-50 flex flex-col`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 ">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-3 px-6 rounded-lg ${
                  pathname === item.path
                    ? "bg-teal-700 text-white border-l-2 border-white"
                    : "text-black hover:bg-gray-100 "
                } transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboardLayout;
