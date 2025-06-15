import { currentUser } from '@clerk/nextjs/server';

export async function requireAdmin() {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== 'admin') {
        throw new Error('Unauthorized: Admins only');
    }
    return user;
}