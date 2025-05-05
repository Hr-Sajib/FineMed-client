
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { items } = useAppSelector((state) => state.cart);
  const cartItems = items.length;
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  console.log("user: ",user)

  const handleLogout = () => {
    dispatch(logout());
    toast("✅ Logged Out");
    setMenuOpen(false);
    setMegaMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop", isMegaMenu: true },
    { href: "/cart", label: "Cart" },
    { href: "/checkout", label: "Checkout" },
    { href: "/about", label: "About" },
    { href: "/review", label: "Reviews" },
    ...(user
      ? [
          user.role === "admin"
            ? { href: "/admin", label: "Dashboard" }
            : { href: "/profile", label: "Profile" },
        ]
      : []),
  ];

  // Categories aligned with AllMedicinesPage
  const shopCategories = [
    {
      title: "Medicine Categories",
      items: [
        { href: "/shop?category=Antibiotic", label: "Antibiotic" },
        { href: "/shop?category=Painkiller", label: "Painkiller" },
        { href: "/shop?category=Antacid", label: "Antacid" },
        { href: "/shop?category=Antiseptic", label: "Antiseptic" },
        { href: "/shop?category=Antiviral", label: "Antiviral" },
      ],
    },
  ];

  return (
    <nav className={`${user?.role == 'admin' ? 'bg-teal-50' : 'bg-white'} shadow-md sticky top-0 z-50 w-full`}>
      <div className=" mx-auto px-4 sm:px-6 lg:px-[8vw]">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <svg
              className="h-8 w-8 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            {
              (user?.role == 'admin' ? 
                <span className="font-bold text-xl text-teal-600">FineMed \ Admin</span>

                :
                <span className="font-bold text-xl text-teal-600">FineMed</span>
              )
            }
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.isMegaMenu ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`relative text-md font-medium ${
                      pathname === link.href
                        ? "text-teal-600 border-b-2 border-teal-600"
                        : "text-gray-700 hover:text-teal-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {megaMenuOpen && (
                    <div className="absolute left-0 mt-2 w-[300px] bg-teal-600  shadow-lg rounded-md z-50 p-6">
                      {shopCategories.map((category) => (
                        <div key={category.title}>
                          <h3 className="font-semibold text-white mb-2">
                            {category.title}
                          </h3>
                          <ul className="space-y-1">
                            {category.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="text-white hover:font-bold"
                                  onClick={() => setMegaMenuOpen(false)}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-md font-medium ${
                    pathname === link.href
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-700 hover:text-teal-600"
                  }`}
                >
                  {link.label}
                  {link.href === "/cart" && cartItems > 0 && (
                    <span className="absolute -top-2 -right-4 bg-teal-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </Link>
              )
            )}

            {/* Auth Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 font-bold bg-red-700 text-white rounded-full hover:bg-red-900 transition text-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-4 px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-teal-600 focus:outline-none"
            >
              {menuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navLinks.map((link) =>
              link.isMegaMenu ? (
                <div key={link.href}>
                  <button
                    onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      pathname === link.href
                        ? "bg-teal-600 text-white"
                        : "text-gray-700 hover:bg-teal-100 hover:text-teal-800"
                    }`}
                  >
                    {link.label}
                  </button>
                  {megaMenuOpen && (
                    <div className="pl-4 space-y-2">
                      {shopCategories.map((category) => (
                        <div key={category.title}>
                          <h3 className="font-semibold text-gray-800">
                            {category.title}
                          </h3>
                          <ul className="space-y-1">
                            {category.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="block px-3 py-1 text-gray-600 hover:text-teal-600"
                                  onClick={() => {
                                    setMenuOpen(false);
                                    setMegaMenuOpen(false);
                                  }}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? "bg-teal-600 text-white"
                      : "text-gray-700 hover:bg-teal-100 hover:text-teal-800"
                  }`}
                >
                  {link.label}
                  {link.href === "/cart" && cartItems > 0 && ` (${cartItems})`}
                </Link>
              )
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="font-bold block px-3 py-2 ml-2 mt-2 bg-red-900 text-white rounded-full text-base text-center hover:bg-red-900"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 mt-2 bg-teal-600 ml-2 text-white rounded-full text-base text-center hover:bg-teal-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
