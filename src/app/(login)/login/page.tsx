import type { Metadata } from 'next'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import Footer from '@/item/footer';
import styles from "@/css/page.module.css";
import { run } from 'node:test';

export const runtime = 'edge'



export default function Login() {
    return (
        <>
            <header className={`${styles.page} `}>
                <main className={styles.main}>
                    <div className={styles.content}>
                        <SignedOut>
                            
                            <SignInButton> 登录 </SignInButton>
                            <SignUpButton> 注册 </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        
                    </div>
                </main>
                <Footer />
            </header>
        </>
    )
}