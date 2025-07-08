import { likesStruct } from "../files/like/route";

export const runtime = 'edge';

export type CommentData = {
    id: number;
    file_key: string;
    reply_to: number | null;
    content: string;
    author: string;
    date: string;
    likes: string; // JSON stringified likes
    status: string;
};

export type CommentStruct = {
    id: number;
    file_key: string;
    reply_to: number | null;
    content: string; // no metadata, markdown content
    author: string; // auth id
    fullName: string; // auth.fullName or callBack to id
    date: string; // ISO 8601 date string
    likes: likesStruct;
    status: "active" | "deleted" | string;
};
