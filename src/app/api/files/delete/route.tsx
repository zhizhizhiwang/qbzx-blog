//api/files/delete/route.tsx
import { create_file } from '@/app/(dashboard)/dashboard/finder';
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import { db } from '@/app/binding';

export const runtime = 'edge';

export async function POST(request: Request) {
    console.log('Create file request received');
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { key } = await request.json();
        if (!key) {
            return new NextResponse('Bad Request with key:' + key, { status: 400 });
        }

        const result = await db.prepare('DELETE FROM files WHERE key = ? and owner = ?').bind(key, userId).run();
        if (result.meta.changes === 0) {
            return new NextResponse('File not found or not owned by user', { status: 403 });
        }

        return new NextResponse('File deleted', { status: 200 });
    } catch (error) {
        console.error('Delete file error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}