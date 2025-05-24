'use client'
import style from '@/css/page.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';



export default function Footer() {
    const [githubIconSrc, setGithubIconSrc] = useState('/github-mark.svg');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.matches) {
            setGithubIconSrc('/github-mark-white.svg');
        } else {
            setGithubIconSrc('/github-mark.svg');
        }

        const handleChange = (e: MediaQueryListEvent) => {
            setGithubIconSrc(e.matches ? '/github-mark-white.svg' : '/github-mark.svg');
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return (
        <footer className={style.footer}>

            <ul>
                <li>

                    <center>
                        此网站完全由学生运营
                        <br />
                        本网站默认  采用
                        <br />
                        <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                            <Image
                            src="/by-nc-sa.svg"
                            alt="BY-NC-SA"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: '10rem', height: 'auto' }}
                        /></a>进行许可。
                    </center>
                </li>
                <li>
                    <a href="https://github.com/zhizhizhiwang/qbzx-blog" target="_blank" rel="noopener noreferrer">
                        <Image
                            src={githubIconSrc}
                            className={style.githubIcon}
                            alt="GitHub"
                            width={20}
                            height={20}
                        />
                        想要加入或者提出建议?
                    </a>
                    <a href="/supporters" target="_blank" rel="noopener noreferrer">
                        <Image
                            src="/Git-Icon.svg"
                            alt='git'
                            width={20}
                            height={20}
                        />
                        查看网页的贡献者!
                    </a>
                </li>

            </ul>

        </footer>
    );
}