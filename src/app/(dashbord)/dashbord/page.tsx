import { auth, currentUser } from '@clerk/nextjs/server'
import Editor from "./editor";
import styles from "@/css/page.module.css";
import Title from "@/item/title";

export const runtime = 'edge';
export const metadata = {
  title: '文章编辑',
  description: '文章编辑',
  icons: {
    icon: '/qbbs.png',
  },
};

type PageProps = {
  params: Promise<{
    key?: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({
  params,
  searchParams,
}: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className={styles.container}>
        <Title text="请登录" subtitle="请登录以访问文章编辑功能" />
        <div className={styles.content}>
          <p>请先登录以访问文章编辑功能。</p>
        </div>
      </div>
    );
  }

  // 从 searchParams 获取 key
  const fileKey = (await params).key || (await searchParams).key as string;

  if (!fileKey) {
    return (
      <div className={styles.container}>
        <Title text="错误" subtitle="未指定文章" />
        <div className={styles.content}>
          <p>请指定要编辑的文章。</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Title text="文章编辑" subtitle="支持 Markdown 和 LaTeX" />
      <Editor initialKey={fileKey} />
    </div>
  );
}