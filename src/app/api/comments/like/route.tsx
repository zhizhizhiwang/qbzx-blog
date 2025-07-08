import { NextResponse } from "next/server";
import { likesStruct } from "../../files/like/route";
import { db } from "@/app/binding";
import { auth } from "@clerk/nextjs/server";
import { CommentData } from "@/app/api/comments/init";
import { cache } from "react";

export const runtime = "edge";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("需要登录", { status: 401 });
        }

        const { id, opt } = await request.json();
        if (!id || !opt) {
            return new NextResponse("缺少必要参数", { status: 400 });
        }

        // 检查comment是否存在
        const comment = await db.prepare(`
            SELECT * FROM comments 
            WHERE id = ?
        `).bind(id).first<CommentData>();

        if (!comment) {
            return new NextResponse("评论未找到或无权限访问", { status: 404 });
        }

        const orilikes : likesStruct = comment.likes ? JSON.parse(comment.likes) : {upvote: [], downvote: []};
        if (!orilikes.upvote || !orilikes.downvote) {
            orilikes.upvote = [];
            orilikes.downvote = [];
        }

        let likes : likesStruct = {upvote: [], downvote: []};

        if(opt === "upvote" && !orilikes.upvote.includes(userId)) {
            likes = {
                upvote: [...orilikes.upvote, userId],
                downvote: orilikes.downvote.filter((user) => user != userId)
            }
        } else if(opt === "downvote" && !orilikes.downvote.includes(userId)) {
            likes = {
                upvote: orilikes.upvote.filter((user) => user != userId),
                downvote: [...orilikes.downvote, userId]
            }
        } else if(opt === "cancel") {
            likes = {
                upvote: orilikes.upvote.filter((user) => user != userId),
                downvote: orilikes.downvote.filter((user) => user != userId)
            };
        } else {
            return new NextResponse("未知操作符", { status: 400 });
        }
        
        if (likes) {
            const res = await db.prepare(`
                UPDATE comments 
                SET likes = ?
                WHERE id = ?
            `).bind(JSON.stringify(likes), id).run();

            if (res) {
                return NextResponse.json({ message: { upvote: "点赞成功", downvote: "点踩成功", cancel: "取消成功" }[opt], result: likes }, { status: 200 });
            }
        }

    } catch (error) {
        console.error(error);
        return new NextResponse("内部错误", { status: 500 });
    }
}