import { create_file } from '@/app/(dashboard)/dashboard/finder';
import { auth, currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@/app/api/user/binding';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
    console.log('Create file request received');
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const userData = await clerkClient.users.getUser(userId);
        if (!userData) {
            return new NextResponse('Unauthorized| User not found', { status: 401 });
        }

        if(userData.publicMetadata && 
            Number(userData.publicMetadata.pagespace) > 10 && 
            !Boolean(userData.publicMetadata.pagespaceUnlimited)) {
            return new NextResponse('Forbidden| Page space limit exceeded', { status: 403 });
        }

        const newFileKey = await create_file(userId);

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                pagespace: (Number(userData.publicMetadata?.pagespace || 0) + 1),
            },
        });

        return NextResponse.json({ key: newFileKey });
    } catch (error) {
        console.error('Create file error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}