import cardstyles from "@/css/cards.module.css";
import Link from "next/link";
import { FileListItem } from "@/app/api/files/list/route";
import { useEffect, useState } from "react";
import Markdown from "@/lib/Markdown";

export default function CardItem({ file, controlOptions }: { 
        file: FileListItem, 
        controlOptions?: { 
                showTitle?: boolean, 
                showDate?: boolean, 
                showLikes?: boolean, 
                showOwner?: boolean, 
                maxLineItem?: number 
            } 
        }) {
    const { content, date, tags, title, likes, key, owner } = file;
    const dateObj = Date.parse(date);
    const dateString = new Date(dateObj).toLocaleDateString() + " " + new Date(dateObj).toLocaleTimeString();


    return (
        <div className={cardstyles.card}>
            <Link href="/posts/">
                
                {controlOptions?.showTitle && <div className={cardstyles.card_title}>{title}</div>}
                
                <div className={`${cardstyles.card_content}`}>
                    <Markdown content={content} />
                </div>
                
                <div className={cardstyles.card_tags}>
                    {tags.map((tag) => (
                        <div key={tag} className={cardstyles.card_tag}>
                            {tag}
                        </div>
                    ))}
                </div>
                {controlOptions?.showOwner && <div className={cardstyles.card_owner}>作者: {owner}</div>}
                {controlOptions?.showLikes && <div className={cardstyles.card_likes}>点赞数: {likes}</div>}
                {controlOptions?.showDate && <div className={cardstyles.card_date}>日期: {dateString}</div>}
            </Link>
        </div>
    );
}
