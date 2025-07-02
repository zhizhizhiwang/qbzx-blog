import Image from "next/image";
import styles from "@/css/page.module.css";
import Footer from "@/item/footer";
import Title from "@/item/title";
import Link from "next/link";
import FileList from "./FileList";

export const runtime = 'edge'; 

export default function Home() {

  return (
    <>
      <Title text="QBBS" subtitle="qbzx bbs + qbzx blog" />
      <div className={styles.page}>
        <main className={styles.main}>
          <FileList 
            maxItemNum={2}
            filter={{
              requiredTag: ['文章'],
              excludeTag: ['--no-show']
            }}
            controlOptions={{
                showTitle: false,
                showDate: true,
                showLikes: true,
                showOwner: true,
                maxLineItem: 2
              }}
          />
        </main>
          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="/pagespace"
              rel="noopener noreferrer"
            >
              文章广场
            </a>
            <a
              href="/dashboard"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              文章编辑
            </a>
            
          </div>
          <Footer />
      </div>
    </>
  );
}
