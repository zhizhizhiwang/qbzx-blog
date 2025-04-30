import { useEffect } from 'react';
import Link from 'next/link';
import Title from '@/item/title';
import Sidebar from '@/item/sidebar';
import styles from '@/css/page.module.css';
import Script from 'next/script';

export default function Qbzx() {
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .comment { margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; }
            .reply { margin-left: 20px; }
        `;
        document.head.appendChild(style);

        // Cleanup function to remove the style tag when the component unmounts
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div>
            <div className={styles.container}>
                <Sidebar
                    page="主页"
                    title="Qbzx bbs"
                    author={["zhizhizhiwang"]}
                    items={["文章列表", "关于"]}
                    hrefs={["/posts", "/about"]}
                />
                <div className={styles.content}>
                    <Title text="讨论区" />
                    <div className={styles.nav}>
                        <ul>
                            <li>
                                <div className={`${styles.block} ${styles.quote}`}>
                                    <div>
                                        <div id="comment-section" data-comment-section-id="forum">
                                            <h2>发表评论</h2>
                                            <textarea id="comment-input" placeholder="在此输入您的评论..."></textarea><br />
                                            <input type="text" id="commenter-id" placeholder="用户 ID" /><br />
                                            <button id="submit-comment">提交评论</button>
                                        </div>
                                        <Script src="/js/comments1.0.js"></Script>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className={styles.block}>
                                    <div id="qbzx-list">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}