import Title from "@/item/title";
import { GetStaticProps, GetStaticPaths } from "next";
import Sidebar from "@/item/sidebar";
import styles from "@/css/page.module.css";
import 'katex/dist/katex.min.css';
import "highlight.js/styles/github.css";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight'
import rehypeFormat from 'rehype-format';
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm';
import rehypeMathJaxSvg from 'rehype-mathjax/svg';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import wikiLinkPlugin from "@flowershow/remark-wiki-link";

interface TestPageProps {
    id: string;
    content: string;
    title: string;
    date: string;
    author: string;
    tags: string[];
}


export default function TestPage({ id, content, title, date, author, tags }: TestPageProps) {
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
                    <Title text={title} subtitle={"by: " + author} />
                    <span>更新时间: {date} 标签: {tags}</span>
                    <div className={`${styles.content} markdown-body`} dangerouslySetInnerHTML={{ __html: content }} />
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

    const html_content = await unified()
    .use(remarkParse)   
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeMathJaxSvg)
    .use(rehypeFormat, {blanks: ['body', 'head'], indent: '\t'})
    .use(rehypeStringify)
    .use(wikiLinkPlugin)
    .process(matterResult.content);

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
    const matter = await require('gray-matter');
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