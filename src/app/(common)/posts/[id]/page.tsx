import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Title from "@/item/title";
import { promises } from 'dns';

export const runtime = 'edge';

interface PostProps {
    params: Promise<{ id: string }>;
    post: {
        title: string;
        content: string;
    };
}

async function getPostContent(id: string) {
    const filePath = path.join(process.cwd(), 'posts', `${id}.md`);
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const matterResult = matter(fileContent);

        const processedContent = await remark()
            .use(html)
            .process(matterResult.content);
        const contentHtml = processedContent.toString();

        return {
            id,
            contentHtml,
            title: matterResult.data.title || id, // 使用文件名作为默认标题
        };
    } catch (error) {
        console.error(`Error reading or processing post ${id}:`, error);
        return null;
    }
}


export async function getStaticPaths() {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = await fs.readdir(postsDirectory);

    const paths = filenames
        .filter(filename => filename.endsWith('.md'))
        .map(filename => {
            const id = filename.replace(/\.md$/, '');
            return {
                params: {
                    id,
                },
            };
        });

    return {
        paths,
        fallback: false, // 如果路径不存在，显示 404 页面
    };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
    const post = await getPostContent(params.id);

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            post,
        },
    };
}

export default async function Post({ post }: { post: { title: string, content: string } }) {
    return (
        <>
            <Title text={`文章 ${post.title}`} subtitle={`文章详情 ${post.title}`} />
            <div>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </>
    );
}