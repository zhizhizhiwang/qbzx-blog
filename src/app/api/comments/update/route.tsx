import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/binding";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
    const { userId } = await auth();
    if(!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, content } = await request.json();
    if(!id || !content) {
        return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }
    const date = new Date().toISOString();

    const result = await db.prepare("UPDATE comments SET content = ?, date = ? WHERE id = ? AND author = ?").bind(content, date, id, userId).run();
    if(!result.success || result.meta.changes === 0) {
        return NextResponse.json({ message: "Comment not found or not owned by user" }, { status: 403 });
    }

    return NextResponse.json({ message: "Comment updated" }, { status: 200 });


}