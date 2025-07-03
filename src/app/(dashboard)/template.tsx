import styles from '@/css/page.module.css';
import Sidebar from "@/item/sidebar";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className={styles.container}>
                <Sidebar
                    page="主页"
                    title="Qbzx bbs"
                    author={["contributor"]}
                    items={["文章列表", "关于"]}
                    hrefs={["/posts", "/about"]}
                />
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    )
}