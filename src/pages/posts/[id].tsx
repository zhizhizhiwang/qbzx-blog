import Title from "@/item/title";
import { GetStaticProps, GetStaticPaths } from "next";
import Sidebar from "@/item/sidebar";
import styles from "@/css/page.module.css";
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import Mermaid from 'react-mermaid2';

interface PostData {
    [key: string]: any; // frontmatter 字段，如 title, date 等
}

interface TestPageProps {
    id: string;
    content: string;
    title: string;
    date: string;
    author: string;
    tags: string[];
    data: PostData;
}

const mathJaxConfig = {
    tex: { packages: ['base', 'ams'] }
};

const markdownComponents = {
    code({ className, children, ...props }) {
        if (
            className?.includes('language-mermaid') ||
            className?.includes('language-flow') || 
            className?.includes('language-sequence')
        ) {
            return <Mermaid chart={String(children).replace(/\n$/, '')} />;
        }
        if (className?.includes('language-math')) {
            let formula = String(children).replace(/^\n+|\n+$/g, '');
            // 只对非 \begin 环境和非 \[ ... \] 自动加 \displaystyle
            if (!/^\\begin/.test(formula) && !/^\\\[/.test(formula)) {
                formula = '\\displaystyle ' + formula;
            }
            return <MathJax dynamic>{formula}</MathJax>;
        }
        return <code className={className} {...props}>{children}</code>;
    },
    inlineCode({ children, className, ...props }) {
        if (className?.includes('language-math')) {
            return <MathJax dynamic>{String(children)}</MathJax>;
        }
        if (typeof children[0] === 'string' && /^\$.*\$$/.test(children[0])) {
            return <MathJax dynamic>{children[0].slice(1, -1)}</MathJax>;
        }
        return <code className={className} {...props}>{children}</code>;
    }
} as Partial<Components>;

export default function TestPage({ id, content, title, date, author, tags, data }: TestPageProps) {
    return (
        <div>
            <div className={styles.container}>
                <Sidebar
                    page="主页"
                    title="Qbzx bbs"
                    author={[author]}
                    items={["文章列表", "关于"]}
                    hrefs={["/posts", "/about"]}
                />
                <div className={styles.content}>
                    <Title text={title} subtitle={"更新时间: " + date} />
                    <MathJaxContext config={{
                        tex: { packages: ['base', 'ams'] },
                        tex2jax: {
                            inlineMath: [ ['$','$'], ["\\(","\\)"] ],
                            displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
                            processEscapes: true
                        },
                    }}>
                        <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={markdownComponents}
                        >
                            {content}
                        </ReactMarkdown>
                    </MathJaxContext>
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

    let fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const stat = fs.statSync(fullPath);

    const title = matterResult.data.title || id;
    const date = matterResult.data.date || `${stat.mtime.toLocaleDateString()}  ${stat.mtime.toLocaleTimeString()}`;
    const author = matterResult.data.author || "匿名";
    const tags = matterResult.data.tags || ["未分类"];

    return {
        props: {
            id: id,
            content: matterResult.content,
            title: title,
            date: date,
            author: author,
            tags: tags,
            data: matterResult.data,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const fs = await require('fs');
    const path = await require('path');
    const postsDirectory = path.join('public', 'posts');
    const filenames = fs.readdirSync(postsDirectory);

    const paths = filenames.map((filename: string) => {
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