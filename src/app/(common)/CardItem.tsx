import cardstyles from "@/css/cards.module.css";
import Link from "next/link";
import { FileListItem } from "@/app/api/files/list/route";
import Markdown from "@/lib/Markdown";
import { headers } from "next/headers";

const getOrigin = async () => {
    const headerList = await headers();
    const host = headerList.get('host');
    if (!host) throw new Error("无法获取请求源");
    const origin = `http${host.startsWith('localhost') ? '' : 's'}://${host}`;
    return origin;
};



async function useUserFullName(origin: string, userId: string) {
    let fullName = "匿名";

    if (!userId) return;
    const res = await fetch(`${origin}/api/user/${userId}`);
    const data = await res.json();
    fullName = data.fullName ?? "匿名";

    return fullName;
}

export default async function CardItem({ file, controlOptions }: {
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
    const origin = await getOrigin();

    return (
            <Link href={`/pagespace/${key}`} className={cardstyles.card}>
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
                {controlOptions?.showOwner && <div className={cardstyles.card_owner}>作者: {await useUserFullName(origin, owner)}</div>}
                {controlOptions?.showLikes && <div className={cardstyles.card_likes}>点赞数: {likes.length}</div>}
                {controlOptions?.showDate && <div className={cardstyles.card_date}>日期: {dateString}</div>}
            </Link>
    );
}
