import styles from "@/css/page.module.css";
import Link from "next/link";

interface SidebarProps {
    page: string;
    title: string;

    author: string[];
    items?: string[];
    hrefs?: string[];


}


export default function Sidebar({ page, title, author, items = [], hrefs = [] }: SidebarProps) {
    const actually_items: string[] = items.slice();
    const actually_href: string[] = hrefs.slice();
    actually_items.unshift("回到主页");
    actually_href.unshift("/"); 
    //在最开始插入回到主页的链接
    
    
    return (
        <div className={styles.sidebar}>
            <h2>{title}</h2>
            <p>作者: {author.join(", ")}</p>
            <br />
            <ul>
                {actually_items.map((item, index) => (
                    <li key={index}>
                        <Link href={actually_href[index]}>{item}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );

}

