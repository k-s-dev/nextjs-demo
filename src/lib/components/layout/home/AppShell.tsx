import styles from "./AppShell.module.scss";

export default function AppShellHome({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.rootContainer}>
      <header className={styles.rootHeader}>{nav}</header>
      {children}
    </div>
  );
}
