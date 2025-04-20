import Title from "@/item/title";
import Link from "next/link";
import styles from "@/css/page.module.css";

const posts = [
    { id: 1, title: 'First Post', excerpt: 'This is the first post.' },
    { id: 2, title: 'Second Post', excerpt: 'This is the second post.' },
];

export default function Posts() {
    return (
        <>
            <Title text="文章列表" subtitle="所有文章" />
            <br />
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            <Link href={`/posts/${post.id}`}>
                                <h2>{post.title}</h2>
                            </Link>
                            <p>{post.excerpt}</p>
                        <br />
                        </li>
                    ))}
                </ul>
        </>
    );
}
