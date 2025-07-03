"use client";
import { useEffect, useState, useRef } from 'react';
import Convert from "@/lib/markdownConvert";
import { motion } from 'framer-motion';
// import wikiLinkPlugin from "@flowershow/remark-wiki-link";
import RemoteFile from '@/lib/file';
import styles from '@/css/editor.module.css';
import 'katex/dist/katex.min.css';
import "highlight.js/styles/github.css";
import 'github-markdown-css/github-markdown.css';
import matter from 'gray-matter';
import Alert from '@/item/Alert';

export const runtime = 'edge';


interface EditorProps {
    initialKey: string;
    username: string
}

export default function Editor({ initialKey, username }: EditorProps) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [preview, setPreview] = useState('');
    const [key, setKey] = useState(initialKey);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadSuccess, setLoadSuccess] = useState(false);
    const [isLocalSaving, setIsLocalSaving] = useState(false);
    const [localSaveSuccess, setLocalSaveSuccess] = useState(false);
    const [isLocalLoading, setIsLocalLoading] = useState(false);
    const [localLoadSuccess, setLocalLoadSuccess] = useState(false);
    const [alertMsg, setAlertMsg] = useState<string | null>(null);

    const file = new RemoteFile(key);

    // 实时预览
    useEffect(() => {
        const renderPreview = async () => {
            const html = await Convert(content);

            setPreview(html.toString());
        };

        renderPreview();
    }, [content]);

    // 加载已有内容
    useEffect(() => {
        const loadContent = async () => {
            if (initialKey) {
                try {
                    console.log('Loading file with key:', initialKey);
                    await file.load();

                    // 使用gray-matter解析内容
                    const { data, content: parsedContent } = matter(file.content);

                    // 设置标签
                    if (data.tags) {
                        setTags(typeof data.tags === 'string'
                            ? data.tags.split(',').map(tag => tag.trim())
                            : data.tags);
                    }

                    // 只显示正文内容
                    setContent(parsedContent.trim());
                    setTitle(file.title);
                } catch (error) {
                    console.error('Failed to load file:', error);
                }
            }
        };

        loadContent();
    }, [initialKey]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault(); // 阻止浏览器默认的保存行为
                handleSave();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // 清理函数
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [title, content]);

    // 保存内容
    const handleSave = async () => {
        setIsSaving(true);
        try {
            file.title = title;
            //合入author, tags, date元数据
            const metadata = [
                '---',
                `author: ${username}`,
                `date: '${new Date().toLocaleString()}'`,
                `tags: \[${tags.join(', ')}\]`,
                '---'
            ].join('\n');

            file.content = `${metadata}\n\n${content}`;
            file.date = new Date().toLocaleString();
            const result = await file.save();

            // 触发保存成功动画
            setIsSaving(false);
            setSaveSuccess(true);
            // 重置动画状态
            setTimeout(() => setSaveSuccess(false), 1000);
        } catch (error) {
            console.error('Failed to save:', error);
            setAlertMsg('保存失败：' + error.message);
            setIsSaving(false);
        }
    };

    //主动加载
    const handleLoad = async () => {
        setIsLoading(true);
        try {
            await file.load();

            // 使用gray-matter解析内容
            const { data, content: parsedContent } = matter(file.content);

            // 设置标签
            if (data.tags) {
                setTags(typeof data.tags === 'string'
                    ? data.tags.split(',').map(tag => tag.trim())
                    : data.tags);
            }

            // 只显示正文内容
            setContent(parsedContent.trim());
            setTitle(file.title);

            // 设置成功状态并触发动画
            setIsLoading(false);
            setLoadSuccess(true);
            setTimeout(() => setLoadSuccess(false), 1000);
        } catch (error) {
            console.error('加载失败:', error);
            setAlertMsg('加载失败：' + error.message);
            setIsLoading(false);
        }
    };


    return (
        <div className={styles.editorContainer}>
            <div className={styles.toolbar}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="文章标题"
                    className={styles.titleInput}
                />
                <motion.button
                    onClick={handleSave}
                    className={styles.saveButton}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                        backgroundColor: isSaving ? "#cccccc" : saveSuccess ? "#28a745" : "#007bff",
                        scale: saveSuccess ? 1.2 : 1,
                        transition: {
                            backgroundColor: { duration: 0.3 },
                            scale: {
                                type: "spring",
                                stiffness: 200,
                                duration: 0.3
                            }
                        }
                    }}
                >
                    {isSaving ? "上传中..." : saveSuccess ? "已上传!" : "上传 (Ctrl+S)"}
                </motion.button>
                <motion.button
                    onClick={handleLoad}
                    className={styles.saveButton}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                        backgroundColor: isLoading ? "#cccccc" : loadSuccess ? "#28a745" : "#4CAF50",
                        scale: loadSuccess ? 1.2 : 1,
                        transition: {
                            backgroundColor: { duration: 0.3 },
                            scale: {
                                type: "spring",
                                stiffness: 200,
                                duration: 0.3
                            }
                        }
                    }}
                >
                    {isLoading ? "拉取中..." : loadSuccess ? "已拉取!" : "拉取"}
                </motion.button>

                <input
                    type="text"
                    value={tags.join(', ')}
                    onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                    placeholder="文章标签(用逗号分隔)"
                    className={styles.titleInput}
                />

                {/* 本地保存按钮 */}
                <motion.button
                    onClick={() => {
                        setIsLocalSaving(true);
                        file.title = title;
                        //合入author, tags, date元数据
                        const metadata = [
                            '---',
                            `author: ${username}`,
                            `date: '${new Date().toLocaleString()}'`,
                            `tags: \[${tags.join(', ')}\]`,
                            '---'
                        ].join('\n');

                        file.content = `${metadata}\n\n${content}`;
                        file.date = new Date().toLocaleString();
                        file.saveToLocalStorage();
                        setIsLocalSaving(false);
                        setLocalSaveSuccess(true);
                        setTimeout(() => setLocalSaveSuccess(false), 1000);
                    }}
                    className={styles.saveButton}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                        backgroundColor: isLocalSaving ? "#cccccc" : localSaveSuccess ? "#28a745" : "#FF9800",
                        scale: localSaveSuccess ? 1.2 : 1,
                        transition: {
                            backgroundColor: { duration: 0.3 },
                            scale: {
                                type: "spring",
                                stiffness: 200,
                                duration: 0.3
                            }
                        }
                    }}
                >
                    {isLocalSaving ? "本地保存中..." : localSaveSuccess ? "已保存到本地!" : "保存到本地"}
                </motion.button>

                {/* 本地加载按钮 */}
                <motion.button
                    onClick={() => {
                        setIsLocalLoading(true);
                        file.loadFromLocalStorage();
                        setContent(file.content);
                        setTitle(file.title);
                        const { data, content: parsedContent } = matter(file.content);
                        if (data.tags) {
                            setTags(typeof data.tags === 'string'
                                ? data.tags.split(',').map(tag => tag.trim())
                                : data.tags);
                        }
                        setContent(parsedContent.trim());
                        setIsLocalLoading(false);
                        setLocalLoadSuccess(true);
                        setTimeout(() => setLocalLoadSuccess(false), 1000);
                    }}
                    className={styles.saveButton}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                        backgroundColor: isLocalLoading ? "#cccccc" : localLoadSuccess ? "#28a745" : "#9C27B0",
                        scale: localLoadSuccess ? 1.2 : 1,
                        transition: {
                            backgroundColor: { duration: 0.3 },
                            scale: {
                                type: "spring",
                                stiffness: 200,
                                duration: 0.3
                            }
                        }
                    }}
                >
                    {isLocalLoading ? "本地加载中..." : localLoadSuccess ? "已从本地加载!" : "从本地加载"}
                </motion.button>


            </div>
            <div className={styles.splitView}>
                <div className={styles.editor}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="在此输入 Markdown 内容..."
                        className={styles.textarea}
                    />
                </div>
                <div className={`${styles.preview} markdown-body markdown-edited`}>
                    <div dangerouslySetInnerHTML={{ __html: preview }} />
                </div>
            </div>
            {alertMsg && <Alert message={alertMsg} onClose={() => setAlertMsg(null)} />}
        </div>
    );
}