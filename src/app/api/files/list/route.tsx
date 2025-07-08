import { db } from "@/app/binding";
import { D1Result } from '@cloudflare/workers-types';
import { NextResponse } from "next/server";
import { FileData } from "@/lib/file";
import matter from "gray-matter";
import { likesStruct } from "../like/route";

export const runtime = 'edge';

export async function GET(request: Request) {

    const url = new URL(request.url);
    const owner = url.searchParams.get("owner");
    const from = url.searchParams.get("from");
    const offset = url.searchParams.get("offset");

    let files: D1Result<FileData>;
    if (from && offset) {
        files = await db.prepare(`
        SELECT * FROM files ORDER BY date LIMIT ? OFFSET ? 
        `).bind(from, offset).all<FileData>();
    } else {
        files = await db.prepare(`
        SELECT * FROM files
        `).all<FileData>();
    } 

    if (!files.success || files.meta.rows_read === 0) {
        return NextResponse.json({ message: "查询出错" }, { status: 500 });
    }

    const LocalFile = await fetch(`${url.origin}/posts.json`);
    if (!LocalFile.ok) {
        return NextResponse.json({ message: "获取本地文件列表失败" }, { status: 500 });
    }

    const LocalFileJson = await LocalFile.json();
    const LocalfileList: FileListItem[] = LocalFileJson.map(file => {
        const { id, key, title, date, content, owner, tags } = file;
        const dateObj = Date.parse(date);
        const dateString = new Date(dateObj).toLocaleDateString() + " " + new Date(dateObj).toLocaleTimeString();
        const useContent = content.trim() || "";

        return {
            key,
            title,
            date: dateString,
            content: useContent,
            owner: owner || "unkown",
            likes: [],
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : [])
        };
    });

    const RemotefileList = files.results.map(file => {
        const { content, date, key, title, owner, likes } = file;
        const matterResult = matter(content);
        const tags: string[] = matterResult.data.tags || [];
        const dateObj = Date.parse(date);
        const dateString = new Date(dateObj).toLocaleDateString() + " " + new Date(dateObj).toLocaleTimeString();
        const useContent = matterResult.content.trim() || "";

        return {
            key,
            title,
            date: dateString,
            content: useContent,
            owner: owner,
            likes: JSON.parse(likes || '{upvote: [], downvote: []}') as likesStruct,
            tags: tags.filter(tag => !tag.startsWith('--')) // 过滤掉控制标签
        };
    });

    const fileList: FileListItem[] = [...LocalfileList, ...RemotefileList];

    const finalFileList = fileList.filter(file => {
        // 如果指定了 owner，则只返回该用户的文件
        if (owner && file.owner !== owner) {
            return false;
        }
        return true;
    });

    return NextResponse.json(finalFileList);

}

export type FileListItem = {
    key: string;
    title: string;
    date: string;
    content: string;
    owner: string;
    likes: likesStruct;
    tags: string[];
};
