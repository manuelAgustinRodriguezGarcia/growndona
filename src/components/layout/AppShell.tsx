import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import styles from "./AppShell.module.scss";

type AppShellProps = {
  userName: string;
  userEmail: string;
  children: ReactNode;
};

export function AppShell({ userName, userEmail, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className={styles.main}>
        <div className={styles.inner}>{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
