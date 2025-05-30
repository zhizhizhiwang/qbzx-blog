import { db } from "@/app/binding";
import { FileData } from "@/lib/file";
import { v6 } from "uuid";

export const runtime = "edge";
/**
 * 
 * database:
 * 
 * CREATE TABLE IF NOT EXISTS files (
 * key TEXT PRIMARY KEY,      -- 文件唯一标识符
 * title TEXT NOT NULL,       -- 文件标题
 * date TEXT NOT NULL,        -- 创建/修改日期
 * content TEXT NOT NULL,     -- 文件内容
 * owner TEXT NOT NULL,       -- 文件所有者
 * likes INTEGER DEFAULT 0,   -- 点赞数，默认为0
 */

export async function find_by_owner(owner: string) {
    const exec = await db.prepare(`SELECT key, title, date FROM files WHERE owner = ?`).bind(owner).all<FileData>();
    if (exec.error) {
        throw new Error("Failed to fetch files");
    }

    return exec.results;

}

export async function create_file(owner: string) {
    console.log("Creating file for owner:", owner);
    const uuid = v6();
    const stmt = db.prepare(`INSERT INTO files (key, title, date, content, owner, likes) VALUES (?, ?, ?, ?, ?, ?)`)
        .bind(uuid, "New File", new Date().toISOString(), "", owner, 0);
    const exec = await stmt.run();
    console.log("File creation executed:", exec, "UUID:", uuid);
    if (exec.error) {
        throw new Error("Failed to create file");
    }
    return uuid;
}