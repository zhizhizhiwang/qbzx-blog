import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';


console.log("prebuild script running...");
const postsDirectory = path.join('public', 'posts');


const filenames = fs.readdirSync(postsDirectory);

const allPosts = filenames.map((filename) => {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const tags = matterResult.data.tags || "";
    const tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());

    const fullData = {
        id: filename.replace(/\.md$/, ''),
        key: filename.replace(/\.md$/, ''),
        tags: tagsArray,
        title: matterResult.data.title || "无标题",
        date: matterResult.data.date || new Date().toISOString(),
        content: matterResult.content.trim() || "",
        owner: matterResult.data.author || "unkown",
    };

    return fullData;
});

fs.writeFileSync(
    path.join('public', 'posts.json'),
    JSON.stringify(allPosts)
);



console.log("prebuild script finished.");