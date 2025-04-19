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
                        <center>本作品采用 <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0国际许可协议</a>进行许可。
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
                    <a href="" target="_blank" rel="noopener noreferrer">
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