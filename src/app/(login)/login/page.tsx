import type { Metadata } from 'next'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import Footer from '@/item/footer';
import styles from "@/css/login.module.css";

export const runtime = 'edge'

export default function Login() {
    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>欢迎回来</h1>
                <div className={styles.subtitle}>登录以继续访问</div>
                <div className={styles.buttonContainer}>
                    <SignedOut>
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
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
            
        </div>
    )
}