import Image from "next/image";
import styles from "@/css/page.module.css";
import Footer from "@/item/footer";
import Title from "@/item/title";

export default function Home() {
  return (
    <>

      <Title text="QBZX BBS" subtitle="欢迎来到QBbs" />
      <div className={styles.page}> 
        <main className={styles.main}>
          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="/posts"
              rel="noopener noreferrer"
            >
            文章列表
            </a>
            <a
              href="/about"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              关于
            </a>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
