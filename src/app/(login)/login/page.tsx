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



export default function Login() {
    return (
        <>
            <header className={`${styles.page} `}>
                <main className={styles.main}>
                    <div>
                        
                    </div>
                </main>
                <Footer />
                <SignedOut>
                    <SignInButton> 登录 </SignInButton>
                    <SignUpButton> 注册 </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
            <p>
                login page
            </p>
        </>
    )
}