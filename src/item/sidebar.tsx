import styles from "@/css/page.module.css";
import itemstyle from "@/css/item.module.css";
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
            <h2 className={itemstyle.title}>{title}</h2>
            <div className={itemstyle.menu_item}>
                <span>菜单</span>
                <div className={itemstyle.arrow }></div>
                <ul className={itemstyle.submenu}>
                    {actually_items.map((item, index) => (
                        <li key={index} value={item} >
                            <Link href={actually_href[index]} className={itemstyle.menu_link} >{item}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <span>作者: {author.join(", ")}</span>
        </div>
    );

}

