"use client";
import { useEffect, useState, useRef } from 'react';
import { unified } from 'unified';
import { motion } from 'framer-motion';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeFormat from 'rehype-format';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeMathJaxSvg from 'rehype-mathjax/svg';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
// import wikiLinkPlugin from "@flowershow/remark-wiki-link";
import RemoteFile from '@/lib/file';
import styles from '@/css/editor.module.css';
import 'katex/dist/katex.min.css';
import "highlight.js/styles/github.css";
import 'github-markdown-css/github-markdown.css';

export const runtime = 'edge';

interface EditorProps {
    initialKey: string;
}

export default function Editor({ initialKey }: EditorProps) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [preview, setPreview] = useState('');
    const [key, setKey] = useState(initialKey);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);


    const file = new RemoteFile(key);

    // 实时预览
    useEffect(() => {
        const renderPreview = async () => {
            const html = await unified()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkMath)
                .use(remarkRehype, { allowDangerousHtml: true })
                .use(rehypeRaw)
                .use(rehypeHighlight)
                .use(rehypeMathJaxSvg)
                .use(rehypeFormat)
                .use(rehypeStringify)
                //                .use(wikiLinkPlugin)
                .process(content);

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
                    setContent(file.content);
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
            file.content = content;
            file.date = new Date().toLocaleString();
            const result = await file.save();

            // 触发保存成功动画
            setIsSaving(false);
            setSaveSuccess(true);
            // 重置动画状态
            setTimeout(() => setSaveSuccess(false), 1000);
        } catch (error) {
            console.error('Failed to save:', error);
            alert('保存失败：' + error.message);
            setIsSaving(false);
        }
    };

    //主动加载
    const handleLoad = async () => {
        try {
            await file.load();
            setContent(file.content);
            setTitle(file.title);
            alert('加载成功！');
        } catch (error) {
            console.error('加载失败:', error);
            alert('加载失败：' + error.message);
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
                    {isSaving ? "保存中..." : saveSuccess ? "已保存!" : "保存"}
                </motion.button>
                <button onClick={handleLoad} className={styles.saveButton} >
                    加载
                </button>
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
                <div className={`${styles.preview} markdown-body`}>
                    <div dangerouslySetInnerHTML={{ __html: preview }} />
                </div>
            </div>
        </div>
    );
}