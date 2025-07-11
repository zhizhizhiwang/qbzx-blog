import Title from "@/item/title";
import { GetStaticProps, GetStaticPaths } from "next";
import Sidebar from "@/item/sidebar";
import styles from "@/css/page.module.css";
import 'katex/dist/katex.min.css';
import "highlight.js/styles/github.css";
import convert from "@/lib/markdownConvert";
import type { Metadata } from 'next'

interface TestPageProps {
    id: string;
    content: string;
    title: string;
    date: string;
    author: string;
    tags: string[];
}

export let metadata: Metadata

export const runtime = "nodejs";

export default function TestPage({ id, content, title, date, author, tags }: TestPageProps) {
    // 生成 metadata
    metadata = {
        title: title,
        description: "文章面板",
        icons: {
            icon: '/qbbs.png',
        },
        openGraph: {
            title: title,
            description: "文章面板",
            url: `/posts/${id}`,
            siteName: 'Qbzx bbs',
            images: [
                {
                    url: '/qbbs.png',
                    width: 800,
                    height: 600,
                },
            ],
            locale: 'zh-Hans',
            type: 'article',
        },
    };
    return (
        <div>
            <div className={styles.container}>
                <Sidebar
                    page="主页"
                    title="Qbzx bbs"
                    author={["contributor"]}
                    items={["文章广场", "文章列表", "关于", "登录"]}
                    hrefs={["/pagespace", "/posts", "/about", "/login"]}
                />
                <div className={styles.content}>
                    <Title text={title} subtitle={"by: " + author} />
                    <span>更新时间: {date} 标签: {tags.join(" ")}</span>
                    <div className={`${styles.content} markdown-body markdown-edited`} dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div>
        </div>
    );
}

export const getStaticProps: GetStaticProps<TestPageProps> = async ({ params }) => {
    const id = params?.id as string;

    const fs = await require('fs');
    const path = await require('path');
    const matter = await require('gray-matter');

    const fullPath = path.join('public', 'posts', `${id}.md`);

    const fileExists = fs.existsSync(fullPath);
    if (!fileExists) {
        throw new Error(`File not found: ${fullPath}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const stat = fs.statSync(fullPath);
    const title = matterResult.data.title || id;
    const dateObj = matterResult.data.date || stat.mtime;
    const date = new Date(dateObj);
    const dateString = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    const author = matterResult.data.author || "匿名";
    const tags: string[] = matterResult.data.tags || ["未分类"];;

    const result_tags = tags.filter(tag => !tag.startsWith('--'));

    const html_content = await convert(matterResult.content);

    return {
        props: {
            id: id,
            content: html_content.toString(),
            title: title,
            date: dateString,
            author: author,
            tags: result_tags,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const fs = await require('fs');
    const path = await require('path');
    const postsDirectory = path.join('public', 'posts');
    const filenames = fs.readdirSync(postsDirectory) as string[];

    const paths = filenames.filter(filename => filename.endsWith('.md')).map((filename: string) => {

        return {
            params: {
                id: filename.replace(/\.md$/, ''),
            },
        };
        
    });

    return {
        paths,
        fallback: false,
    };
};