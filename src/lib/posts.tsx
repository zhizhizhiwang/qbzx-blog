// src/lib/posts.ts (一个处理文章数据的工具文件)
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // 需要安装 gray-matter
import { title } from 'process';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');

export function getAllPostSlugs() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map(fileName => ({
        params: {
            id: fileName.replace(/\.md$/, ''), // 假设文件名就是 slug，移除 .md 后缀
        },
    }));
}

export function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
        id,
        ...matterResult.data, // frontmatter data (如标题、日期)
        content: matterResult.content, // markdown 内容
        title: matterResult.data.title, // 假设 frontmatter 中有 title
    };
}

// 如果你需要获取所有文章的摘要或元数据用于列表页
export function getAllPostsMetadata() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, `${id}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        // 返回元数据和 id
        return {
            id,
            ...matterResult.data,
            title: matterResult.data.title, // 假设 frontmatter 中有 title
            // 可以选择在这里处理摘要或者不返回 content 以节省内存
        };
    });

    // 可以根据日期或其他属性排序
    // return allPostsData.sort((a, b) => { ... });

    return allPostsData;
}