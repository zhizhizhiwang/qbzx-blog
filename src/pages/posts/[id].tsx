import Title from "@/item/title";
import { useRouter } from 'next/router'
import Sidebar from "@/item/sidebar";
import styles from "@/css/page.module.css"


export const runtime = "edge";

export default function TestPage({ params }) {
    const router = useRouter()
    const id = router.query.id as string; // 获取动态路由参数

    return (
        <div>
            <div className={styles.container}>
                <Sidebar
                    page="主页"
                    title="Qbzx bbs"
                    author={[id]}
                    items={["文章列表", "关于"]}
                    hrefs={["/posts", "/about"]}
                />
                <div className={styles.content}>
                    
                </div>
            </div>
        </div>
    );
}