// src/lib/posts.ts (一个处理文章数据的工具文件)
import matter from 'gray-matter'; // 需要安装 gray-matter

export async function getAllPostSlugs() {

}

export async function getPostData(id: string) {

    const fileContents = await fetch(`/posts/${id}.md`).then(res => res.text());

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
export async function getAllPostsMetadata() {
    
}