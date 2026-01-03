import styles from "./AppShell.module.scss";

export default function AppShell({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>{nav}</header>
      <div className={styles.rest}>{children}</div>
    </div>
  );
}
