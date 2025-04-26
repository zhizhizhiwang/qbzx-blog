import Title from "@/item/title";
import { GetStaticProps, GetStaticPaths } from "next";
import Sidebar from "@/item/sidebar";
import styles from "@/css/page.module.css"
import matter from 'gray-matter';

interface PostData {
    [key: string]: any; // frontmatter 字段，如 title, date 等
}

interface TestPageProps {
    id: string;
    content: string;
    data: PostData;
}

// export const runtime = "edge";

export default function TestPage({ id, content, data }: TestPageProps) {
    return (
        <div>
            <div className={styles.container}>
                <Sidebar
                    page="主页"
                    title="Qbzx bbs"
                    author={[id]}
                    items={["文章列表", "关于"]}
                    hrefs={["/posts", "/about"]}
                />
                <div className={styles.content}>
                    <>
                        <Title text={id} />
                        {JSON.stringify(data)}
                    </>
                </div>
            </div>
        </div>
    );
}

export const getStaticProps: GetStaticProps<TestPageProps> = async ({ params }) => {
    const id = params?.id as string;

    const fs  = await require('fs');
    const path = await require('path');
    const fullPath = path.join('public', 'posts', `${id}.md`);

    const fileExists = fs.existsSync(fullPath);
    if (!fileExists) {
        throw new Error(`File not found: ${fullPath}`);
    }

    let fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
        props: {
            id: id,
            data: matterResult.data,
            content: matterResult.content,
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