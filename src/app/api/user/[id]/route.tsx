// 例如在 app/api/user/[id]/route.ts
import { clerkClient } from "../binding";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
        return NextResponse.json({
            error: "缺少用户ID",
        }, { status: 400 });
    }

    try{
        const user = await clerkClient.users.getUser(id);
        return NextResponse.json({
            fullName: user.username || id,
        });
    } catch (error) {
        return NextResponse.json({
            fullName: id,
        });
    }


}