'use client';
import { useState } from 'react';
import styles from "@/css/page.module.css";
import { useRouter } from 'next/navigation';
import Alert from '@/item/Alert';

interface DeleteFileButtonProps {
    fileKey: string;
    className?: string;
}

export default function DeleteFileButton({ fileKey, className: originClassName }: DeleteFileButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm('确定要删除该文件吗？')) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/files/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key: fileKey }),
            });

            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg);
            }

            setAlertMsg('删除成功');
            router.refresh();
        } catch (error: any) {
            setAlertMsg('删除失败: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleDelete}
                disabled={isLoading}
                className={`${styles.saveButton} ${originClassName || ''}`}
            >
                {isLoading ? '删除中...' : '删除文件'}
            </button>
            {alertMsg && <Alert message={alertMsg} onClose={() => setAlertMsg(null)} />}
        </>
    );
}