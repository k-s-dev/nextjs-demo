import Intro from "@/lib/features/org/components/homePage/Intro";
import styles from "./page.module.scss";
import Features from "@/lib/features/org/components/homePage/Features";

export default function Page() {
  return (
    <main className={styles.main}>
      <Intro />
      <Features />
    </main>
  );
}
