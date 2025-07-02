import { db } from "@/app/binding";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { FileData } from "@/lib/file";

export const runtime = "edge";

export interface likesStruct {
    upvote: string[];
    downvote: string[];
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("需要登录", { status: 401 });
        }

        const { key, opt } = await request.json();
        if (!key || !opt) {
            return new NextResponse("缺少必要参数", { status: 400 });
        }

        // 检查文件是否存在
        const file = await db.prepare(`
            SELECT * FROM files 
            WHERE key = ?
        `).bind(key).first<FileData>();

        if (!file) {
            return new NextResponse("文件未找到或无权限访问", { status: 404 });
        }

        const orilikes : likesStruct = file.likes ? JSON.parse(file.likes) : {upvote: [], downvote: []};
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
                UPDATE files
                SET likes = ?
                WHERE key = ?
            `).bind(JSON.stringify(likes), key).run();

            if (res) {
                return NextResponse.json({ message: { upvote: "点赞成功", downvote: "点踩成功", cancel: "取消成功" }[opt], result: likes }, { status: 200 });
            }
        }
        
    } catch (error) {
        console.error("点赞失败:", error);
        return new NextResponse("服务器错误", { status: 500 });
    }
}