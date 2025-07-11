import { binding } from "cf-bindings-proxy";
import { D1Database } from '@cloudflare/workers-types';

class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}

function isCloudflareEnvironment(): boolean {
    return typeof globalThis.CF !== 'undefined' ||
        typeof process.env.CF_PAGES !== 'undefined' ||
        typeof process.env.CLOUDFLARE_WORKERS !== 'undefined';
}


function createDatabaseConnection(): D1Database {
    try {
        console.log("binding d1 database")
        const database = binding<D1Database>("DB");

        return database;
    } catch (error) {
        console.error("数据库初始化错误:", error);
        // return null as unknown as D1Database;
        if (isCloudflareEnvironment()) {
            throw new DatabaseError("数据库初始化失败: " + error.message);
        }
        return null as unknown as D1Database;
    }
}

export const db = createDatabaseConnection();

// 导出错误类以供其他模块使用
export { DatabaseError };
