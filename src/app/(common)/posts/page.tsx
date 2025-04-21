// src/app/(common)/blog/page.tsx (博客列表页面)
import Link from 'next/link';
import { getAllPostsMetadata } from '@/lib/posts'; // 导入获取元数据的函数

const BlogListPage = () => {
    const posts = getAllPostsMetadata(); // 在构建时/服务器端执行文件读取

    return (
        <div>
            <h1>所有文章</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <Link href={`/posts/${post.id}`}>
                            {post.title || post.id} {/* 显示标题，如果不存在则显示 ID */}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlogListPage;