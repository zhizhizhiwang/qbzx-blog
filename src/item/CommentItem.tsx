import type { CommentStruct } from "@/app/api/comments/init";
import { useState } from "react";
import Markdown from "./Markdown";
import CommentOpthub from "./CommentOpthub";
import itemStyles from "@/css/item.module.css"
import Alert from "./Alert";

export default function CommentItem({ 
    comment, mode, userId, setReplyId, setComments, comments 
}: { 
    comment: CommentStruct, 
    setReplyId: React.Dispatch<React.SetStateAction<number | null>>, 
    mode?: string, userId: string,
    setComments: React.Dispatch<React.SetStateAction<CommentStruct[]>>,
    comments: CommentStruct[]
}) {
    const [useMode, setUseMode] = useState<string>(mode ?? "normal");
    const [content, setContent] = useState<string>(comment.content);
    const [AlertMsg, setAlertMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            setAlertMsg("不能提交空评论");
            return;
        } else if (content.length > 1000) {
            setAlertMsg("评论内容过长，不能超过1000个字符");
            return;
        }

        const response = await fetch("/api/comments/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, id : comment.id }),
        })

        if (response.ok) {
            setAlertMsg("评论提交成功");

            setUseMode('normal');
        } else {
            setAlertMsg("评论提交失败 :" + (response.statusText ?? "未知错误") + " (" + await response.status + ")");
            setContent(comment.content);
        }
    };

    if (comment.status === "delete") {
        return <div className={itemStyles.delete_comment}><span>该评论被删除</span></div>
    } else if (useMode === 'normal') {
        return (
            <>
                <div className={itemStyles.comment_item}>
                    <div className={itemStyles.comment_preview}>
                        <Markdown content={content} style={{ backgroundColor: 'transparent', wordBreak: 'break-all' }} convertOptions={{ allowDangerousHtml: false }} />
                    </div>
                    <CommentOpthub comment={comment} setReplyId={setReplyId} setUseMode={setUseMode} userId={userId} setComments={setComments} comments={comments}/>
                </div>

            </>
        )
    } /* else if (useMode === 'edit') {
        return (
            <>
            <div className={itemStyles.comment_item}>
                <form onSubmit={handleSubmit} onReset={() => { setContent(comment.content); setUseMode('normal'); }} className={itemStyles.comment_editor}>
                    <textarea
                        className={itemStyles.left}
                        autoComplete="off"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your comment..."
                    />
                    <div className={`${itemStyles.right} ${itemStyles.comment_preview}`}>
                        <Markdown content={`${content}`} style={{ backgroundColor: 'transparent', wordBreak: 'break-all' }} convertOptions={{ allowDangerousHtml: false }} />
                    </div>
                    <div className={itemStyles.but} >
                        <button type="submit">Submit</button>
                        <button type="reset">Cancel</button>
                    </div>
                </form>
                {AlertMsg && <Alert message={AlertMsg} onClose={() => setAlertMsg(null)} />}
            </div>
            </>
        )
    } */



    return <>a bug occurred</>

}