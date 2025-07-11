import Title from "@/item/title";
import styles from "@/css/page.module.css";
import Markdown from "@/item/Markdown";
import VoteButton from "@/item/VoteButton";
import { FileData } from "@/lib/file";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import matter from "gray-matter";

export const runtime = "edge"

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    

    const resolvedParams = await params;

    const headerList = await headers();
    const host = headerList.get('host');
    if (!host) throw new Error("无法获取请求源");
    const origin = `http${host.startsWith('localhost') ? '' : 's'}://${host}`;

    const res = await fetch(`${origin}/api/files/get?key=${resolvedParams.id}`);
    if (res.status === 404) {
        redirect(`/posts/${resolvedParams.id}`);
    } else if (!res.ok) {
        return NextResponse.json({ message: "获取文章失败" }, { status: 500 });
    }

    const data: FileData = await res.json();
    const { content, date, title, owner, likes } = data;
    const matterResult = matter(content);
    const tags: string[] = matterResult.data.tags || [];
    const dateObj = Date.parse(date);
    const dateString = new Date(dateObj).toLocaleDateString() + " " + new Date(dateObj).toLocaleTimeString();
    const useContent = matterResult.content.trim() || "";
    const username = await fetch(`${origin}/api/user/${owner}`);

    const userData = await username.json();
    const ownerName = userData.fullName || "匿名";
    const useLikes = (() => {
        try {
            const parsedLikes = JSON.parse(likes);
            return {
                upvote: parsedLikes.upvote || [],
                downvote: parsedLikes.downvote || []
            };
        } catch (error) {
            console.warn("解析 likes 字段失败:", error);
            return { upvote: [], downvote: [] };
        }
    })();

    return (
        <>
            <Title text={title} subtitle={`by ${ownerName}`} />

            <div className={styles.meta}>
                <span > {`更新时间 ${dateString} 标签: ${tags.join(", ")}`} </span>
                <div className={styles.meta_right}>
                    <VoteButton likes={useLikes} fileKey={resolvedParams.id} />
                </div>
            </div>

            <Markdown content={useContent} className={styles.content} />
            
        </>
    )



}