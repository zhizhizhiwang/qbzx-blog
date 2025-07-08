import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/binding";

export const runtime = "edge";

export async function POST(request: Request) {
    console.log('Create file request received');
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        const { id } = await request.json();
        if (!id) {
            return new NextResponse('Bad Request', { status: 400 });
        }

        const result = await db.prepare('DELETE FROM comments WHERE id = ? AND author = ?').bind(id, userId).run();
        if (!result.success || result.meta.changes === 0) {
            return new NextResponse('Comment not found or not owned by user', { status: 403 });
        }

        return new NextResponse('Comment deleted', { status: 200 });

    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    };
}