"use client";
import styles from "@/css/page.module.css";
import itemstyle from "@/css/item.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SidebarProps {
    page: string;
    title: string;
    author: string[];
    items?: string[];
    hrefs?: string[];
}

export default function Sidebar({ page, title, author, items = [], hrefs = [] }: SidebarProps) {
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(() => {
        // 初始化屏幕宽度
        setScreenWidth(window.innerWidth);

        // 监听窗口大小变化
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // 清理函数
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const actually_items: string[] = ["回到主页", ...items];
    const actually_href: string[] = ["/", ...hrefs];

    // 移动端渲染
    if (screenWidth <= 768) {
        return (
            <>
                <div className={`${styles.sidebar}`}>
                    <div className={styles.sidebar_left}>
                        <h4 className={`${itemstyle.title} ${itemstyle.fs1}`}>{title}</h4>
                    </div>
                    <div className={styles.sidebar_right}>
                        <div className={itemstyle.menu_item}>
                            <span>菜单</span>
                            <div className={itemstyle.arrow}></div>
                            <ul className={itemstyle.submenu}>
                                <li className={itemstyle.menu_link}>
                                    <span className={itemstyle.author}>作者: {author.join(", ")}</span>
                                </li>
                                {actually_items.map((item, index) => (
                                    <li key={index}>
                                        <Link href={actually_href[index]} className={itemstyle.menu_link}>
                                            {item}
                                        </Link>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // 桌面端渲染
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_left}>
                <h2 className={`${itemstyle.title} ${itemstyle.fs2}`}>{title}</h2>
            </div>
            <div className={styles.sidebar_right}>
                <div className={itemstyle.menu_item}>
                    <span>菜单</span>
                    <div className={itemstyle.arrow}></div>
                    <ul className={itemstyle.submenu}>
                        {actually_items.map((item, index) => (
                            <li key={index}>
                                <Link href={actually_href[index]} className={itemstyle.menu_link}>
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <span className={itemstyle.author}>作者: {author.join(", ")}</span>
        </div>
    );
}