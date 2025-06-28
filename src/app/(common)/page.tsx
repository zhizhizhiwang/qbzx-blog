'use client';
import Image from "next/image";
import styles from "@/css/page.module.css";
import Footer from "@/item/footer";
import Title from "@/item/title";
import Link from "next/link";
import FileList from "./FileList";

const runtime = 'edge'; 

export default function Home() {
  return (
    <>
      <Title text="QBBS" subtitle="qbzx bbs + qbzx blog" />
      <div className={styles.page}>
        <main className={styles.main}>
          <FileList maxItemNum={2}
            filterOptions={{
              requiredTag: ['文章'],
              excludeTag: ['--no-show']
            }}
          />
        </main>
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
        <Footer />
      </div>
    </>
  );
}
