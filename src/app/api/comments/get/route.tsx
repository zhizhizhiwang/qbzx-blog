import { NextResponse } from "next/server";
import { db } from "@/app/binding";
import { likesStruct } from "@/app/api/files/like/route";
import { CommentData, CommentStruct } from "@/app/api/comments/init";

export const runtime = 'edge';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const file_key = url.searchParams.get("file_key");

    if (!file_key) {
        return NextResponse.json({
            error: "缺少评论区ID",
        }, { status: 400 });
    }

    const result = await db.prepare(`
        SELECT * FROM comments 
        WHERE file_key = ?
    `).bind(file_key).all<CommentData>();

    if (!result.success) {
        return NextResponse.json({ message: "查询错误" }, { status: 500 });
    }

    const commentData = result.results;

    const comments: CommentStruct[] = commentData.map(comment => {
        return {
            id: comment.id,
            file_key: comment.file_key,
            reply_to: comment.reply_to,
            content: comment.content,
            author: comment.author,
            fullName: comment.author,
            date: comment.date,
            likes: JSON.parse(comment.likes) as likesStruct,
            status: comment.status
        }
    })

    if(comments.length === 0) {
        return NextResponse.json({});
    }

    //处理fullName
    const usernames = await fetch(`${url.origin}/api/user/${comments.map(comment => comment.author).join(",")}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .catch((error) => {
        return NextResponse.json({ message: "查询错误 " + error }, { status: 500 });
    });

    if(comments.length === 1) 
    {
        comments[0].fullName = usernames.fullName;
    } else {
        for(let i = 0; i < comments.length; i++) {
            comments[i].fullName = usernames[comments[i].author].fullName ?? comments[i].author;
        }
    }

    return NextResponse.json(comments);
}