import type { Metadata } from 'next'
import Sidebar from '@/item/sidebar';
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import Link from 'next/link';

import styles from "@/css/login.module.css";
import pagestyles from "@/css/page.module.css"


export const runtime = 'edge'

export default function Login() {
    return (
        <div className={`${styles.container}`}>
            <div  className={styles.position_fixed} >
                <Sidebar 
                    page="登录页面"
                    title="登录页面"
                    author={["contributor"]}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.loginBox}>
                    <h1 className={styles.title}>欢迎回来</h1>
                    <SignedOut>
                        <div className={styles.subtitle}>登录以继续访问</div>
                        <br/>
                        <div className={styles.buttonContainer}>
                            <SignInButton mode="modal">
                                <button className={`${styles.button} ${styles.loginButton}`}>
                                    登录
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className={`${styles.button} ${styles.registerButton}`}>
                                    注册
                                </button>
                            </SignUpButton>
                        </div>
                        <Link href="\posts\email-help">
                            <div className={styles.note}>
                                邮箱帮助
                            </div>
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <div>
                            <UserButton />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </div>
    )
}