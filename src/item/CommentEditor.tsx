'use client';
import Markdown from "@/item/Markdown";
import React, { useState } from "react";
import Alert from "@/item/Alert";
import itemStyles from "@/css/item.module.css";
import { CommentData, CommentStruct } from "@/app/api/comments/init";

export default function CommentEditor({
    fileKey,
    replyTo,
    setReplyId,
    setComments,
    comments
}: {
    fileKey: string;
    replyTo: number | null;
    setReplyId: React.Dispatch<React.SetStateAction<number | null>>,
    setComments: React.Dispatch<React.SetStateAction<CommentStruct[]>>,
    comments: CommentStruct[]
}) {
    const [content, setContent] = useState("");
    const [alertMsg, setAlertMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            setAlertMsg("不能提交空评论");
            return;
        } else if (content.length > 1000) {
            setAlertMsg("评论内容过长，不能超过1000个字符");
            return;
        }

        const response = await fetch("/api/comments/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, file_key: fileKey, reply_to: replyTo }),
        });

        if (response.ok) {
            setAlertMsg("评论提交成功");
            setContent("");
            const newComment : CommentData= await response.json();
            const newCommentStruct : CommentStruct = { ...newComment, fullName: "yourself", likes: JSON.parse(newComment.likes) };
            setComments([...comments, newCommentStruct]); 
            setReplyId(null);
        } else {
            setAlertMsg("评论提交失败 :" + (response.statusText ?? "未知错误") + " (" + await response.text() + ")");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} onReset={() => { setReplyId(null); setContent("") }} className={itemStyles.comment_editor}>
                <textarea
                    className={itemStyles.left}
                    autoComplete="off"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your comment..."
                />
                <div className={`${itemStyles.right} ${itemStyles.comment_preview}`}>
                    <Markdown content={`Reply To #${replyTo ?? "top"}  \n${content}`} style={{ backgroundColor: 'transparent', wordBreak: 'break-all' }} convertOptions={{ allowDangerousHtml: false }} />
                </div>
                <div className={itemStyles.but} >
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                    <button type="button" onClick={() => setReplyId(null)}>Clear Reply</button>
                    <button type="button">?</button>
                </div>
            </form>
            {alertMsg && <Alert message={alertMsg} onClose={() => setAlertMsg(null)} />}
        </>
    );
}