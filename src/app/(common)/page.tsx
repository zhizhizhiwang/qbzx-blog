import Image from "next/image";
import styles from "@/css/page.module.css";
import Footer from "@/item/footer";
import Title from "@/item/title";
import Link from "next/link";

export default function Home() {
  return (
    <>

      <Title text="QBBS" subtitle="qbzx bbs by zhizhiwang" />
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
