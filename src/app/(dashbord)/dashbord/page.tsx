import { auth, currentUser } from '@clerk/nextjs/server'
import Editor from "./editor";
import styles from "@/css/page.module.css";
import Title from "@/item/title";


export default async function DashboardPage({ params }: { params: { key?: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return <div>请先登录</div>;
  }

  return (
    <div className={styles.container}>
      <Title text="文章编辑" subtitle="支持 Markdown 和 LaTeX" />
      <Editor initialKey={params.key}/>
    </div>
  );
}