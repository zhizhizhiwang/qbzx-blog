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
    return {
        id: filename.replace(/\.md$/, ''),
        ...matterResult.data,
    };
});

fs.writeFileSync(
    path.join('public', 'posts.json'),
    JSON.stringify(allPosts)
);



console.log("prebuild script finished.");