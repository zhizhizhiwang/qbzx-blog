//src/lib/file.tsx
import { D1Database } from '@cloudflare/workers-types';

interface FileData {
    key: string;
    title: string;
    date: string;
    content: string;
}

/*
    * RemoteFile 类用于处理远程文件的加载、保存和删除操作
    * 
    * @class RemoteFile
    * @property {D1Database} db - 数据库实例
    * @property {string} key - 文件的唯一标识符
    * @property {string} title - 文件标题
    * @property {string} date - 文件日期
    * @property {string} content - 文件内容
    * 
    * DB 表结构:
    * CREATE TABLE IF NOT EXISTS files (
    * key TEXT PRIMARY KEY,      -- 文件唯一标识符
    * title TEXT NOT NULL,       -- 文件标题
    * date TEXT NOT NULL,        -- 创建/修改日期
    * content TEXT NOT NULL      -- 文件内容
);
*/

class RemoteFile {
    private db: D1Database;
    public key: string;
    public title: string;
    public date: string;
    public content: string;

    constructor(db: D1Database, key: string) {
        this.db = db;
        this.key = key;
        this.date = new Date().toLocaleDateString();
    }

    // 从数据库加载文件
    async load(): Promise<void> {
        const stmt = this.db.prepare(
            'SELECT title, date, content FROM files WHERE key = ?'
        );
        const result = await stmt.bind(this.key).first<FileData>();
        
        if (result) {
            this.title = result.title;
            this.date = result.date;
            this.content = result.content;
        } else {
            // 如果没有找到，初始化一个空文件
            const stat = await this.db.prepare('INSERT INTO files (key, title, date, content) VALUES (?, ?, ?, ?)')
                .bind(this.key, '', this.date, '')
                .run();
            if (stat.meta.changes === 0) {
                throw new Error('Failed to create a new file');
            }

            this.title = '';
            this.date = new Date().toLocaleDateString();
            this.content = '';
        }
    }

    // 保存到数据库
    async save(): Promise<void> {

        this.saveToLocalStorage();

        const stmt = this.db.prepare(`
            INSERT INTO files (key, title, date, content)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET
                title = excluded.title,
                date = excluded.date,
                content = excluded.content
        `);

        const result = await stmt.bind(
            this.key,
            this.title,
            this.date,
            this.content
        ).run();
        
        if (result.meta.changes === 0) {
            throw new Error('Failed to save the file');
        }
    }

    //保存到浏览器localStorage
    saveToLocalStorage(): void {
        localStorage.setItem(this.key, JSON.stringify({
            title: this.title,
            date: this.date,
            content: this.content
        }));
    }

    //从浏览器localStorage加载
    loadFromLocalStorage(): void {
        const data = localStorage.getItem(this.key);
        if (data) {
            const parsedData = JSON.parse(data);
            this.title = parsedData.title;
            this.date = parsedData.date;
            this.content = parsedData.content;
        } else {
            this.title = '';
            this.date = new Date().toLocaleDateString();
            this.content = '';
        }

        this.saveToLocalStorage();
    }

    // 从数据库删除
    async delete(): Promise<void> {
        const stmt = this.db.prepare('DELETE FROM files WHERE key = ?');
        await stmt.bind(this.key).run();
    }

    // 列出所有文件
    static async list(db: D1Database): Promise<FileData[]> {
        const stmt = db.prepare('SELECT key, title, date FROM files');
        return (await stmt.all<FileData>()).results;
    }
}

export default RemoteFile;