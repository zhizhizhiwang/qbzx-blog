// src/app/(common)/posts/[id]/page.tsx (动态路由页面)
import { getPostData } from '@/lib/posts'; // 导入上面创建的函数
import { notFound } from 'next/navigation'; // 用于处理未找到文章的情况

// PageProps 类型定义 (如果需要的话，通常可以直接在函数签名中定义)
interface PageProps {
    params: {
        id: string;
    };
}

// Server Component
const PostPage = async ({ params }: PageProps) => {
    const post = getPostData(params.id); // 在构建时/服务器端执行文件读取

    if (!post) {
        notFound(); // 如果文章不存在，返回 404
    }

    return (
        <div>
            <h1>{post.title}</h1> {/* 假设 frontmatter 中有 title */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} /> {/* 渲染 markdown 内容 (注意安全风险，通常会先将 markdown 转为 HTML) */}
        </div>
    );
};

export default PostPage;


// src/app/(common)/posts/[id]/generateStaticParams.ts (生成静态参数)
import { getAllPostSlugs } from '@/lib/posts'; // 导入获取 slug 的函数

export async function generateStaticParams() {
    // 这个函数在构建时运行，用于确定要静态生成的动态路由
    return getAllPostSlugs(); // 返回一个数组，每个元素是 { params: { id: string } }
}