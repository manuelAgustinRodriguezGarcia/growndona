"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { comfortaa } from "@/lib/fonts";
import { NAV_ITEMS, isActivePath } from "./navItems";
import styles from "./Sidebar.module.scss";

type SidebarProps = {
  userName: string;
  userEmail: string;
};

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className={styles.sidebar}>
      <Link
        href="/dashboard"
        className={`${styles.brand} ${comfortaa.className}`}
      >
        <Image
          src="/logo-ligth.png"
          alt=""
          width={40}
          height={40}
          className={styles.logo}
          priority
        />
        <span className={styles.name}>GROWNDONA</span>
      </Link>
      <nav className={styles.nav} aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${active ? styles.active : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={19} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.footer}>
        <div className={styles.user}>
          <span className={styles.userName}>{userName}</span>
          <span className={styles.userEmail}>{userEmail}</span>
        </div>
        <button type="button" className={styles.logout} onClick={handleLogout}>
          <LogOut size={18} aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
