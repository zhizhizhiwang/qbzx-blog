'use clinet';

import itemStyles from "@/css/item.module.css";
import React, { useState, useEffect } from "react";
import { CommentStruct } from "@/app/api/comments/init";
import { likesStruct } from "@/app/api/files/like/route";
import { SetStateAction } from "react";
import { ElementType } from "react";
import Alert from "./Alert";

const runtime = "edge";

interface input {
    id: string;
    setLikes: React.Dispatch<SetStateAction<likesStruct>>;
    setAlertMessage: React.Dispatch<SetStateAction<string | null>>;
}

async function upvote({ id, setLikes, setAlertMessage }: input) {

    const res = await fetch("/api/comments/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, opt: "upvote" })
    });
    if (!res.ok) {
        if (res.status === 400) {
            setAlertMessage("你已经评价过了");
            return;
        }
        setAlertMessage(res.statusText);
        return;
    }
    const resolveRes = (await res.json());
    const likes = resolveRes.result;
    setLikes(likes);
}

async function downvote({ id, setLikes, setAlertMessage }: input) {
    const res = await fetch("/api/comments/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, opt: "downvote" })
    });

    if (!res.ok) {
        if (res.status === 400) {
            setAlertMessage("你已经评价过了");
            return;
        }
        setAlertMessage(res.statusText);
        return;
    }
    const resolveRes = (await res.json());
    const likes = resolveRes.result;
    setLikes(likes);
}


async function cancelVote({ id, setLikes, setAlertMessage }: input) {
    const res = await fetch("/api/comments/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, opt: "cancel" })
    });

    if (!res.ok) {
        setAlertMessage(res.statusText);
        return;
    }

    const resolveRes = (await res.json());
    const likes = resolveRes.result;
    setAlertMessage(resolveRes.message);
    setLikes(likes);
}

async function deleteComment({id, setAlertMessage, comments, setComments}: {id: string, setAlertMessage: React.Dispatch<SetStateAction<string | null>>, comments: CommentStruct[], setComments: React.Dispatch<React.SetStateAction<CommentStruct[]>>}) {
    const result = await fetch("/api/comments/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    });

    if(!result.ok) {
        setAlertMessage(`删除失败: ${result.statusText}`);
        return;
    }
    setAlertMessage("删除成功");
    setComments(comments.filter(comment => comment.id.toString() !== id));
}

async function showInfo({ likes, setAlertMessage }: { likes: likesStruct, setAlertMessage: React.Dispatch<SetStateAction<string | null>> }) {
    setAlertMessage("upvote: " + likes.upvote.length + ", downvote: " + likes.downvote.length);
}


export default function CommentOpthub({ 
    comment, 
    userId,  
    setReplyId,
    setUseMode,
    setComments,
    comments
}: { 
    comment: CommentStruct, 
    userId: string,
    setReplyId: React.Dispatch<React.SetStateAction<number | null>> ,
    setUseMode: React.Dispatch<React.SetStateAction<string>>,
    setComments: React.Dispatch<React.SetStateAction<CommentStruct[]>>,
    comments: CommentStruct[]
}) {
    
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertElement, setAlertElement] = useState<React.ReactNode>(null);
    const DateObj = new Date(comment.date);
    const dateString = DateObj.toLocaleDateString() + " " + DateObj.toLocaleTimeString();
    const [userLikes, setLikes] = useState<likesStruct>(comment.likes);
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(() => {
        setScreenWidth(window.innerWidth);

        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!userLikes || !userLikes.upvote || !userLikes.downvote) {
        setLikes({
            upvote: [],
            downvote: []
        });
    }

    const id = comment.id;
    const likeCount = userLikes.upvote.length - userLikes.downvote.length;

    return (
        <>
            <div className={itemStyles.comment_info}>
                <div className={itemStyles.left}>
                    <span>id: {comment.id} | {comment.fullName} at {dateString}</span>
                </div>
                <div className={itemStyles.right}>
                    <span className={itemStyles.vote_button}>
                        <span style={{ borderRightStyle: "solid", fontSize: "1rem" }}>{likeCount >= 0 ? `+${likeCount}` : `${likeCount}`}   </span>
                        <button onClick={() => upvote({ id: id.toString(), setLikes, setAlertMessage })}><span> + </span></button>
                        <button onClick={() => downvote({ id: id.toString(), setLikes, setAlertMessage })}><span> - </span></button>
                        <button onClick={() => cancelVote({ id: id.toString(), setLikes, setAlertMessage })}><span> x </span></button>
                        <button onClick={() => showInfo({ likes: userLikes, setAlertMessage })}><span> i </span></button>
                    </span>
                    
                    <span className={itemStyles.vote_button}>
                        {userId === comment.author && 
                            <>
                                {/* <button style={{paddingLeft: "1rem"}} onClick={() => setUseMode("edit")}>
                                    <span style={{fontSize: "1rem"}}>Edit</span>
                                </button> */}
                                <button style={{paddingLeft: "1rem"}} onClick={() => {
                                    setAlertMessage("你确定要删除该评论吗? (无法恢复)");
                                    setAlertElement(<>
                                        <button onClick={() => {setAlertMessage(null);setAlertElement(null);deleteComment({ id: id.toString(), setAlertMessage , comments, setComments})}}>确定</button>
                                    </>)
                                }}>
                                    <span style={{fontSize: "1rem"}}>Delete</span>
                                </button>
                            </>
                        }
                        <button style={{paddingLeft: "1rem"}} onClick={() => setReplyId(id)}>
                            <span style={{fontSize: "1rem"}}>Reply</span>
                        </button>
                    </span>
                </div>
            </div>
            {alertMessage && <Alert message={alertMessage} element={alertElement} onClose={() => {setAlertMessage(null);setAlertElement(null)}} />}
        </>
    )


}