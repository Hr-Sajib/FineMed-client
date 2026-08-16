"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faBars,
  faXmark,
  faChevronDown,
  faRightFromBracket,
  faCapsules,
  faPills,
  faShieldHeart,
  faStethoscope,
  faVirus,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import Button from "@/components/ui/Button";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { items } = useAppSelector((state) => state.cart);
  const cartItems = items.length;
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    setMenuOpen(false);
    setMegaMenuOpen(false);
    setProfileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop", isMegaMenu: true },
    ...(user
      ? [
          user.role === "admin"
            ? { href: "/admin", label: "Admin Dashboard" }
            : { href: "/profile", label: "Profile" },
        ]
      : []),
  ];

  const shopCategories = [
    { href: "/shop?category=Antibiotic", label: "Antibiotic", icon: faVirus },
    { href: "/shop?category=Painkiller", label: "Painkiller", icon: faPills },
    { href: "/shop?category=Antacid", label: "Antacid", icon: faCapsules },
    { href: "/shop?category=Antiseptic", label: "Antiseptic", icon: faShieldHeart },
    { href: "/shop?category=Antiviral", label: "Antiviral", icon: faStethoscope },
  ];

  const isShopPage = pathname === "/shop";
  const isAdmin = user?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto px-4 sm:px-6 lg:px-[6vw]">
        <div className="flex h-16 items-center justify-between">
          <Logo admin={isAdmin} />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.isMegaMenu && !isShopPage ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-pharmacy-light text-pharmacy-deep"
                        : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                    }`}
                  >
                    {link.label}
                    <FontAwesomeIcon icon={faChevronDown} className="h-2.5 w-2.5" />
                  </Link>
                  {megaMenuOpen && (
                    <div className="absolute left-0 mt-1 w-64 rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-card-hover)]">
                      <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Shop by category
                      </p>
                      <div className="space-y-0.5">
                        {shopCategories.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-ink-soft transition-colors hover:bg-pharmacy-light hover:text-pharmacy-deep"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-pharmacy-light text-pharmacy-deep"
                      : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

            <Link
              href="/cart"
              className={`relative ml-1 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                pathname === "/cart"
                  ? "bg-pharmacy-light text-pharmacy-deep"
                  : "text-ink-soft hover:bg-paper-deep hover:text-ink"
              }`}
              aria-label="Cart"
            >
              <FontAwesomeIcon icon={faCartShopping} className="h-4 w-4" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 min-w-4.5 items-center justify-center rounded-full bg-rx px-1 font-mono text-[10px] font-semibold text-white">
                  {cartItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative ml-1" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-pharmacy text-white transition-colors hover:bg-pharmacy-deep"
                  aria-label="Open profile menu"
                >
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-surface p-1.5 shadow-[var(--shadow-card-hover)]">
                    <p className="truncate px-3 pb-1.5 pt-1.5 text-xs text-muted">
                      {user.userEmail}
                    </p>
                    <Link
                      href={isAdmin ? "/admin" : "/profile"}
                      className="block rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      {isAdmin ? "Admin Dashboard" : "My Profile"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rx hover:bg-rx-light"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="h-3.5 w-3.5" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button href="/login" size="sm" className="ml-2">
                Log in
              </Button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-soft"
              aria-label="Cart"
            >
              <FontAwesomeIcon icon={faCartShopping} className="h-4 w-4" />
              {cartItems > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rx font-mono text-[9px] font-semibold text-white">
                  {cartItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-paper-deep"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-border bg-surface md:hidden">
          <div className="space-y-1 px-3 py-3">
            {navLinks.map((link) =>
              link.isMegaMenu && !isShopPage ? (
                <div key={link.href}>
                  <button
                    onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
                      pathname === link.href
                        ? "bg-pharmacy text-white"
                        : "text-ink-soft hover:bg-paper-deep"
                    }`}
                  >
                    {link.label}
                    <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
                  </button>
                  {megaMenuOpen && (
                    <div className="mt-1 space-y-0.5 pl-3">
                      {shopCategories.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep"
                          onClick={() => {
                            setMenuOpen(false);
                            setMegaMenuOpen(false);
                          }}
                        >
                          <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-medium ${
                    pathname === link.href
                      ? "bg-pharmacy text-white"
                      : "text-ink-soft hover:bg-paper-deep"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rx hover:bg-rx-light"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="h-3.5 w-3.5" />
                Log out
              </button>
            ) : (
              <Button href="/login" fullWidth onClick={() => setMenuOpen(false)} className="mt-1">
                Log in
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
