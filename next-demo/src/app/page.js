import styles from "./page.module.css";
import HooksDemo from "./hooksDemo/page";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <HooksDemo/>
        </div>
      </main>
    </div>
  );
}
