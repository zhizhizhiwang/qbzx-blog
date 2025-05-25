"use client";
import { db } from "@/app/binding";
import { FileData } from "@/lib/file";

export const runtime = "edge";

export async function find_by_owner(owner: string)
{
    const exec = await db.prepare(`SELECT * FROM files WHERE owner = ?`).bind(owner).all<FileData>();
    if (exec.error) {
        throw new Error("Failed to fetch files");
    }

    return exec.results;

}