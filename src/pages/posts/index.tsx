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

export const runtime = "edge";

export default function BlogListPage({ allPostsData }: BlogListPageProps) {
    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    page="主页"
                    title="Qbzx bbs"
                    author={["zhizhizhiwang"]}
                    items={["文章列表", "关于"]}
                    hrefs={["/posts", "/about"]}
                />
                <div className={styles.content}>
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
        </>
    );
};

export async function getStaticProps() {
    const fs = await require('fs');
    const path = await require('path');
    const matter = await require('gray-matter');

    const postsDirectory = path.join('public', 'posts');
    const fileNames = fs.readdirSync(postsDirectory);


    const allPostsData = fileNames.map((fileName: string) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const id =  matterResult.data.title || fileName.replace(/\.md$/, '');
        return {
            id,
            href: `/posts/${fileName.replace(/\.md$/, '')}`,
        };
    });

    return {
        props: {
            allPostsData: allPostsData,
        },
    };
}