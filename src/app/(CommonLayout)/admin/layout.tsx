
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/protectedRoutes/ProtectedRouteProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faCapsules,
  faUserGroup,
  faTruckMedical,
  faMortarPestle,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Overview", path: "/admin/", icon: faGauge },
    { name: "Medicines", path: "/admin/medicines", icon: faCapsules },
    { name: "Users", path: "/admin/users", icon: faUserGroup },
    { name: "Orders", path: "/admin/orders", icon: faTruckMedical },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-[100vh] flex flex-row bg-paper">
        {/* Sidebar */}
        <nav
          className={`bg-ink text-white w-64 flex-shrink-0 shadow-[var(--shadow-card)] transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:sticky top-0 h-screen z-50 flex flex-col`}
        >
          <div className="flex items-center justify-between gap-2 p-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pharmacy text-white">
                <FontAwesomeIcon icon={faMortarPestle} className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold text-white">FineMed</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Admin Console</p>
              </div>
            </div>
            <button
              className="md:hidden text-white/70 hover:text-white focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-pharmacy text-white shadow-[0_1px_2px_rgba(16,35,29,0.08)]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="p-4 border-t border-white/10">
            <p className="text-[11px] text-white/40">
              Digital Apothecary &middot; Clinical Ops
            </p>
          </div>
        </nav>

        {/* Mobile Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-ink/50 z-40 md:hidden"
            onClick={toggleMenu}
          ></div>
        )}

        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between bg-surface border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pharmacy text-white">
              <FontAwesomeIcon icon={faMortarPestle} className="h-3.5 w-3.5" />
            </span>
            <span className="font-display text-base font-semibold text-ink">FineMed Admin</span>
          </div>
          <button
            className="text-ink-soft hover:text-pharmacy-deep focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 pt-20 md:p-8 md:pt-8 bg-paper">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboardLayout;
