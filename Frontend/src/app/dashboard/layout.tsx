"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/components/ui/Avatar";
import {
  FiLink,
  FiBarChart2,
  FiSettings,
  FiDroplet,
  FiLogOut,
  FiExternalLink,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Links", icon: <FiLink /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <FiBarChart2 /> },
  { href: "/dashboard/appearance", label: "Appearance", icon: <FiDroplet /> },
  { href: "/dashboard/settings", label: "Settings", icon: <FiSettings /> },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading, tenant, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className={styles.layout}>
      {/* Mobile header */}
      <header className={styles.mobileHeader}>
        <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
          {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        <Link href="/dashboard" className={styles.mobileLogo}>
          <span>⚡</span> LinkHub
        </Link>
        <Avatar name={tenant?.name || "User"} src={tenant?.avatar_url} size="sm" />
      </header>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarInner}>
          <Link href="/dashboard" className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>LinkHub</span>
          </Link>

          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ""}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            {tenant && (
              <a
                href={`/site/${tenant.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.previewLink}
              >
                <FiExternalLink size={14} />
                <span>View Live Page</span>
              </a>
            )}

            <div className={styles.userCard}>
              <Avatar name={tenant?.name || "User"} src={tenant?.avatar_url} size="sm" />
              <div className={styles.userInfo}>
                <span className={styles.userName}>{tenant?.name || "User"}</span>
                <span className={styles.userSlug}>/{tenant?.slug}</span>
              </div>
              <button className={styles.logoutBtn} onClick={logout} aria-label="Logout">
                <FiLogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
