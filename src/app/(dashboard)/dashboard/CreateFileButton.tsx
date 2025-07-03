'use client';
import { useState } from 'react';
import styles from "@/css/page.module.css";
import { useRouter } from 'next/navigation';
import Alert from '@/item/Alert';

interface CreateFileButtonProps {
    userId: string;
    className?: string; 
}

export default function CreateFileButton({ userId, className: originClassName}: CreateFileButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState<string | null>(null);
    const router = useRouter();

    const handleClick = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/files/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('创建文件失败');
            }

            const { key } = await response.json();
            router.push(`/dashboard?key=${key}`);
        } catch (error) {
            console.error('创建文件失败:', error);
            setAlertMsg('创建文件失败: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={handleClick} 
                disabled={isLoading}
                className={`${styles.saveButton} ${originClassName || ''}`}
            >
                {isLoading ? '创建中...' : '新建文件'}
            </button>
            {alertMsg && <Alert message={alertMsg} onClose={() => setAlertMsg(null)} />}
        </>
    );
}