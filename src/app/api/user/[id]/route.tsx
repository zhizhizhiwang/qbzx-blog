// 例如在 app/api/user/[id]/route.ts
import { clerkClient } from "../binding";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const ids = url.searchParams.get("id")?.split(",");
    const idmap = {};


    if (!ids) {
        return NextResponse.json({
            error: "缺少用户ID",
        }, { status: 400 });
    }

    if (ids.length === 1) {
        const id = ids[0];
        try {
            const user = await clerkClient.users.getUser(id);
            return NextResponse.json({
                fullName: user.username || id,
            });
        } catch (error) {
            return NextResponse.json({
                fullName: id,
            });
        }
    } else {
        /**
         * type = {  
         *  id: {fullName: name},  
         *  ...  
         * }  
         */
        const users: { [id: string]: { fullName: string } } = await Promise.all(
            ids.map(async (id) => {
                try {
                    if(idmap[id] === undefined) { 
                        idmap[id] = (await clerkClient.users.getUser(id)).username ?? id;
                    }
                    return { id, fullName: idmap[id] };
                } catch (error) {
                    idmap[id] = id;
                    return { id, fullName: id };
                }
            })
        ).then((results) => results.reduce((acc, { id, fullName }) => ({ ...acc, [id]: { fullName } }), {}));


        return NextResponse.json(users);
    }

}