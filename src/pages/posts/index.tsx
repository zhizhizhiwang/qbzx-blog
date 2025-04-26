// src/app/(common)/blog/page.tsx (博客列表页面)
import Link from 'next/link';
import Title from '@/item/title';
import Sidebar from '@/item/sidebar';
import styles from '@/css/page.module.css';

interface PostItem {
    id: string;
    href: string;
}

interface BlogListPageProps {
    allPostsData: PostItem[];
}

export default function BlogListPage({ allPostsData }: BlogListPageProps) {
    return (
        <div>
            <div className={styles.container}>
                <Sidebar
                    page="主页"
                    title="Qbzx bbs"
                    author={["zhizhizhiwang"]}
                    items={["文章列表", "关于"]}
                    hrefs={["/posts", "/about"]}
                />
                <div>
                    <Title text='所有文章' />
                        <ul className={styles.postList}>
                            {allPostsData.map(({ id, href }) => (
                                <li key={id}>
                                    <Link href={href} className={styles.postLink}>
                                        <div className={styles.block}>
                                            {id}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                </div>
            </div>
        </div>
    );
};

export async function getStaticProps() {
    const fs = await require('fs');
    const path = await require('path');
    const postsDirectory = path.join('public', 'posts');
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName: string) => {
        const id = fileName.replace(/\.md$/, '');
        return {
            id,
            href: `/posts/${id}`,
        };
    });
    return {
        props: {
            allPostsData,
        },
    };
}