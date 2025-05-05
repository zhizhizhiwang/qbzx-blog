import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import Passkey from "next-auth/providers/passkey"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
 
const prisma = new PrismaClient()
 
export default {
  adapter: PrismaAdapter(prisma),
  providers: [Passkey],
  experimental: { enableWebAuthn: true },
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (credentials.username === 'admin' && credentials.password === 'admin') {
                    const user = {
                        name: credentials.username,
                    }
                    return user
                }
                return null
            },
        }),
    ],
})