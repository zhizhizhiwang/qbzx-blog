import { auth, currentUser } from '@clerk/nextjs/server'
import Editor from "./editor";
import styles from "@/css/page.module.css";
import edit_styles from "@/css/editor.module.css";
import Title from "@/item/title";
import Link from 'next/link';
import { find_by_owner} from "./finder"
import CreateFileButton from './CreateFileButton';
import { FileData } from '@/lib/file';
import { NextResponse } from 'next/server'

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
  const user = await currentUser();

  if (!userId || !user || !user.username) {
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
    const filelist = await find_by_owner(userId);
  
  
    return (
      <div className={styles.container}>
        <Title text="文章列表" subtitle={"欢迎, " + user.username} />
        <div className={styles.content}>
          <p>请指定要编辑的文章。</p>
          <ul className={styles.postList}>
            {
              filelist.map((file) => (
                <li key={file.key} className={styles.fileItem}>
                  <Link href={`/dashboard?key=${file.key}`} className={styles.postLink}>
                    <div className={styles.block}>
                      {file.title}
                    </div>
                  </Link>
                </li>
              ))
            }
            <li>
              <CreateFileButton userId={userId} className={edit_styles.button} />
            </li>
          </ul>
      </div>
      </div >
    );
  }

  return (
    <div className={styles.container}>
      <Title text="文章编辑" subtitle="支持 Markdown 和 LaTeX" />
      <Editor initialKey={fileKey} username={user.username} />
    </div>
  );
}