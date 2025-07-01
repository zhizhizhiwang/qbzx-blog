import { createClerkClient } from '@clerk/backend'

export const runtime = 'edge'

export const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })