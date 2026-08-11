"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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
      <Link href="/dashboard" className={styles.brand}>
        <span className={styles.logo}>
          <Sprout size={22} aria-hidden="true" />
        </span>
        <span className={styles.name}>Growndona</span>
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
