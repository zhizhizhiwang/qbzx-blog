import { binding } from "cf-bindings-proxy";
import { D1Database } from '@cloudflare/workers-types';

function createDatabaseConnection(): D1Database {
    try {
        console.log("binding d1 database")
        const database = binding<D1Database>("DB");
        return database;
    } catch (error) {
        console.error("数据库初始化错误:", error);
        return null as unknown as D1Database;
    }
}

export const db = createDatabaseConnection();


