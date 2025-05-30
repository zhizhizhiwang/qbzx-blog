import { create_file } from '@/app/(dashboard)/dashboard/finder';
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
    console.log('Create file request received');
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const newFileKey = await create_file(userId);

        return NextResponse.json({ key: newFileKey });
    } catch (error) {
        console.error('Create file error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}