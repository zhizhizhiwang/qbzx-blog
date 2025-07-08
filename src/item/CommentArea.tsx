"use client";
import CommentEditor from "./CommentEditor";
import CommentItem from "./CommentItem";
import itemStyles from "@/css/item.module.css"
import { CommentStruct } from "@/app/api/comments/init";
import { useEffect, useState } from "react";
import Alert from "./Alert";

function renderComments(comments: CommentStruct[], parentId: number | null, setReplyId, userId, setComments: React.Dispatch<React.SetStateAction<CommentStruct[]>>,) {
    return comments
        .filter(comment => comment.reply_to === parentId)
        .map(comment => (
            <div key={comment.id} style={{ marginLeft: parentId ? "2rem" : 0 }}>
                <CommentItem comment={comment} setReplyId={setReplyId} userId={userId} setComments={setComments} comments={comments} />
                {renderComments(comments, comment.id, setReplyId, userId, setComments)}
            </div>
        ));
}

export default function CommentArea(
    {
        fileKey,
        userId,
    }: {
        fileKey: string;
        userId: string;
    }) {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [comments, setComments] = useState<CommentStruct[]>([]);
    const [replyId, setReplyId] = useState<number | null>(null);

    useEffect(() => {
        fetch(`/api/comments/get?file_key=${fileKey}`).then(res => res.json()).then(res => {
            if (res.error) {
                setAlertMessage(res.error);
            } else {
                setComments(res);
            }
        });
    }, [fileKey]);

    return (
        <div className={itemStyles.comment}>
            {
                comments[0] && renderComments(comments, null, setReplyId, userId, setComments)
            }
            <br />
            <CommentEditor fileKey={fileKey} replyTo={replyId} setReplyId={setReplyId} setComments={setComments} comments={comments} />
            {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
        </div>
    );
}
