import { db } from "@/app/binding";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function PUT(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("未授权访问", { status: 401 });
        }

        const { key, title, content } = await request.json();
        if (!key) {
            return new NextResponse("缺少必要参数", { status: 400 });
        }

        // 设置上传文章长度上限
        if (content && new TextEncoder().encode(content).length > 1024 * 20) {
            return new NextResponse("内容过大", { status: 413 });
        }

        const result = await db.prepare(`
            UPDATE files 
            SET title = ?, content = ?, date = ?
            WHERE key = ? AND owner = ?
        `).bind(
            title,
            content,
            new Date().toISOString(),
            key,
            userId
        ).run();

        if (result.meta.changes === 0) {
            return new NextResponse("文件未找到或无权限更新", { status: 403 });
        }


        return NextResponse.json({ message: "更新成功" });

    } catch (error) {
        console.error("更新文件失败:", error);
        return new NextResponse("服务器错误", { status: 500 });
    }
}