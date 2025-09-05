import { ChatSection } from "./_components/ChatSection";
import { Author, AuthorType } from "./_models/chat";
import styles from "./page.module.css";

export default function Home() {
  const authenticatedUser: Author = {
    id: "user-1",
    name: "User 1",
    avatar: "U1",
    type: AuthorType.HUMAN,
  };
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>ChatGPT</h1>
      </header>
      <main className={styles.main}>
        <ChatSection author={authenticatedUser} />
      </main>
      <footer className={styles.footer}>Footer</footer>
    </div>
  );
}
