import { db } from "@/app/binding";
import { NextResponse } from "next/server";
import { FileData } from "@/lib/file";
export const runtime = "edge";

export async function GET(request: Request) {
    try {

        const url = new URL(request.url);
        const key = url.searchParams.get("key");
        if (!key) {
            return new NextResponse("参数错误", { status: 400 });
        }

        const result = await db.prepare(`
            SELECT * FROM files 
            WHERE key = ?
        `).bind(key).first<FileData>();

        if (!result) {
            return new NextResponse("文件未找到或无权限访问", { status: 404 });
        }

        const fileData: FileData = {
            key: result.key,
            title: result.title,
            content: result.content,
            date: result.date,
            owner: result.owner,
            likes: result.likes
        };

        return NextResponse.json(fileData);

    } catch (error) {
        console.error("获取文件失败:", error);
        return new NextResponse("服务器错误", { status: 500 });
    }
}


