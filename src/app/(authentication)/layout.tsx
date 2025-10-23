import styles from "./layout.module.scss";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <aside></aside>
      <main className={styles.main}>{children}</main>
    </>
  );
}
