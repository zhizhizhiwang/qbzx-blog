"use client";
import itemStyle from "@/css/item.module.css";
import { likesStruct } from "@/app/api/files/like/route";
import { useState, useEffect } from "react";
import { SetStateAction } from "react";
import Alert from "@/item/Alert";

interface input {
    fileKey: string;
    setLikes: React.Dispatch<SetStateAction<likesStruct>>;
    setAlertMsg: React.Dispatch<SetStateAction<string | null>>;
}

async function upvote({fileKey, setLikes, setAlertMsg} : input) {
    const res = await fetch("/api/files/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ key: fileKey, opt: "upvote" })
    });

    if(!res.ok) {
        if(res.status === 400) {
            setAlertMsg("你已经评价过了")
            return;
        }
        setAlertMsg(res.statusText);
        return;
    }
    const resolveRes = (await res.json());
    const likes = resolveRes.result;
    setLikes(likes);
    
}

async function downvote({fileKey, setLikes, setAlertMsg} : input) {
    const res = await fetch("/api/files/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ key: fileKey, opt: "downvote" })
    });
    
    if (!res.ok) {
        if (res.status === 400) {
            setAlertMsg("你已经评价过了");
            return;
        }
        setAlertMsg(res.statusText);
        return;
    }
    const resolveRes = (await res.json());
    const likes = resolveRes.result;
    setLikes(likes);
}


async function cancelVote({fileKey, setLikes, setAlertMsg} : input) {
    const res = await fetch("/api/files/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ key: fileKey, opt: "cancel" })
    });

    if (!res.ok) {
        setAlertMsg(res.statusText);
        return;
    }

    const resolveRes = (await res.json());
    const likes = resolveRes.result;
    setAlertMsg(resolveRes.message);
    setLikes(likes);
}

async function showInfo({likes, setAlertMsg} : {likes: likesStruct, setAlertMsg: React.Dispatch<SetStateAction<string | null>>}) {
    setAlertMsg("upvote: " + likes.upvote.length + ", downvote: " + likes.downvote.length);
}

export default function VoteButton({likes, fileKey} : {likes: likesStruct, fileKey: string}) {
    const [alertMsg, setAlertMsg] = useState<string | null>(null);
    const [userLikes, setLikes] = useState<likesStruct>(likes);
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
    

    if (!likes || !likes.upvote || !likes.downvote) {
        likes = {
            upvote: [],
            downvote: []
        }
    }

    
    const likeCount = userLikes.upvote.length - userLikes.downvote.length;

    return <>
    {screenWidth < 768 && <br />}
        <div>
            <span className={itemStyle.vote_button}>
                <span style={{ borderRightStyle: "solid"}}>评分: {likeCount >= 0 ? `+${likeCount}` : `${likeCount}`} </span>
                {screenWidth < 768 && <br />}
                <button onClick={() => upvote({ fileKey, setLikes , setAlertMsg })}><span> + </span></button>
                <button onClick={() => downvote({ fileKey, setLikes , setAlertMsg })}><span> - </span></button>
                <button onClick={() => cancelVote({ fileKey, setLikes , setAlertMsg })}><span> x </span></button>
                <button onClick={() => showInfo({ likes: userLikes , setAlertMsg })}><span> i </span></button>
            </span>
        </div>
        {alertMsg && <Alert message={alertMsg} onClose={() => setAlertMsg(null)} />}
    </>
}