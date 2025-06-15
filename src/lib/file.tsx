//src/lib/file.tsx

export interface FileData {
    key: string;
    title: string;
    date: string;
    content: string;
    owner: string;
    likes: number;
}

export const runtime = 'edge';
/*
    * RemoteFile 类用于处理远程文件的加载、保存和删除操作
    * 
    * @class RemoteFile
    * @property {D1Database} db - 数据库实例
    * @property {string} key - 文件的唯一标识符
    * @property {string} title - 文件标题
    * @property {string} date - 文件日期
    * @property {string} content - 文件内容
    * @property {string} owner - 文件所有者
    * 
    * DB 表结构:
    * CREATE TABLE IF NOT EXISTS files (
    * key TEXT PRIMARY KEY,      -- 文件唯一标识符
    * title TEXT NOT NULL,       -- 文件标题
    * date TEXT NOT NULL,        -- 创建/修改日期
    * content TEXT NOT NULL,     -- 文件内容
    * owner TEXT NOT NULL,       -- 文件所有者
    * likes INTEGER DEFAULT 0,   -- 点赞数，默认为0
);
*/

class RemoteFile {
    public key: string;
    public title: string;
    public date: string;
    public content: string;
    public owner: string;
    public likes: number;

    constructor(key: string) {
        this.key = key;
        this.date = new Date().toLocaleDateString();
    }

    // 从数据库加载文件
    async load(): Promise<void> {
        console.log('Loading file with key:', this.key);
        const respone = await fetch(`/api/files/get?key=${this.key}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!respone.ok) {
            throw new Error(`Failed to load file: ${await respone.text()} (${respone.status})`);
        }
        const data: FileData = await respone.json();
        this.title = data.title;
        this.date = data.date;
        this.content = data.content;
        this.owner = data.owner;
        this.likes = data.likes;
        this.saveToLocalStorage();
    }

    // 保存到数据库(更新内容)
    async save(): Promise<void> {

        this.saveToLocalStorage();

        const response = await fetch('/api/files/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: this.key,
                title: this.title,
                content: this.content,
                date: new Date().toISOString()
            })
        });

        if(!response.ok)
        {
            throw new Error('更新请求失败: ' + await response.text() + ' (' + response.status + ')');
        }

        

    }

    //保存到浏览器localStorage
    saveToLocalStorage(): void {
        localStorage.setItem(this.key, JSON.stringify({
            title: this.title,
            date: this.date,
            content: this.content,
            owner: this.owner,
            likes: this.likes,
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
            this.owner = parsedData.owner;
            this.likes = parsedData.likes;
        }

        this.saveToLocalStorage();
    }

}

export default RemoteFile;