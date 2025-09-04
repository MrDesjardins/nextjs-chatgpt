import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Chat</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.chatMessages}></div>
          <div className={styles.chatInput}></div>
        </div>
      </main>
      <footer className={styles.footer}>Footer</footer>
    </div>
  );
}
