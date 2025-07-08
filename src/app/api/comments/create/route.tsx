import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@/app/api/user/binding";
import { db } from "@/app/binding";
import { likesStruct } from "@/app/api/files/like/route";
import { CommentData, CommentStruct } from "@/app/api/comments/init";

export const runtime = 'edge';

export async function POST(request: Request) {

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    const { content, file_key, reply_to } = await request.json();
    if (!content || !file_key) {
        return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    const likes: likesStruct = {
        upvote: [],
        downvote: [],
    };

    const date = new Date().toISOString();
    
    const result = await db.prepare(`
        INSERT INTO comments (file_key, reply_to, content, author, date, likes, status)
        VALUES (?, ?, ?, ?, ?, ?, 'active')
    `).bind(
        file_key,
        reply_to || null,
        content,
        userId,
        date,
        JSON.stringify(likes)
    ).run();

    if(!result.success || result.meta.changes === 0) {
        return NextResponse.json({ message: "Failed to create comment" }, { status: 500 });
    }

    const commentId = result.meta.last_row_id;
    const commentData: CommentData = {
        id: commentId,
        file_key,
        reply_to: reply_to || null,
        content,
        author: userId,
        date,
        likes: JSON.stringify(likes),
        status: "active"
    };

    return NextResponse.json(commentData, { status: 201 });
}