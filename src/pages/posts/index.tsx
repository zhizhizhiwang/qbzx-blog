import Link from 'next/link';
import Title from '@/item/title';
import Sidebar from '@/item/sidebar';
import styles from '@/css/page.module.css';

interface PostItem {
    id: string;
    href: string;
    tags: string[];  // 添加 tags 字段
}

interface BlogListPageProps {
    allPostsData: PostItem[];
}

export default function BlogListPage({ allPostsData }: BlogListPageProps) {
    return (
        <>
            <div className={styles.container}>
                <Sidebar
                    page="主页"
                    title="Qbzx bbs"
                    author={["zhizhizhiwang"]}
                    items={["文章广场", "文章列表", "关于", "登录"]}
                    hrefs={["/pagespace", "/posts", "/about", "/login"]}
                />
                <div className={styles.content}>
                    <Title text='所有文章' subtitle='只有静态的收录文章可见'/>
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

    // 收集所有文章数据
    const allPostsData = fileNames.map((fileName: string) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const id = matterResult.data.title || fileName.replace(/\.md$/, '');
        const tags: string[] = matterResult.data.tags || ["未分类"];
        
        if (tags.includes('--no-show')) {
            return null;
        }

        return {
            id,
            href: `/posts/${fileName.replace(/\.md$/, '')}`,
            tags: tags.filter(tag => !tag.startsWith('--')),  // 过滤掉控制标签
        };
    }).filter((post: PostItem | null) => post !== null) as PostItem[];

    // 计算标签相似度并排序
    const sortedPosts = allPostsData.sort((a, b) => {
        // 找到与当前文章 a 标签匹配最多的其他文章
        const maxMatchingTagsWithA = allPostsData
            .filter(post => post.id !== a.id)
            .map(post => ({
                post,
                matchCount: post.tags.filter(tag => a.tags.includes(tag)).length
            }))
            .reduce((max, current) => current.matchCount > max ? current.matchCount : max, 0);

        // 找到与当前文章 b 标签匹配最多的其他文章
        const maxMatchingTagsWithB = allPostsData
            .filter(post => post.id !== b.id)
            .map(post => ({
                post,
                matchCount: post.tags.filter(tag => b.tags.includes(tag)).length
            }))
            .reduce((max, current) => current.matchCount > max ? current.matchCount : max, 0);

        // 比较匹配数量
        return maxMatchingTagsWithB - maxMatchingTagsWithA;
    });

    return {
        props: {
            allPostsData: sortedPosts,
        },
    };
}