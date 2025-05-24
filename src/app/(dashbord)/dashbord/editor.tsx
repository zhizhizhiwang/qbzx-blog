"use client";
import { useEffect, useState } from 'react';
import { unified } from 'unified';
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
import { useUser } from "@clerk/nextjs";
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
    const [key, setKey] = useState(initialKey || new Date().getTime().toString());
    const { user } = useUser();
    const file = new RemoteFile(key);

    // 实时预览
    useEffect(() => {
        const renderPreview = async () => {
            const html = await unified()
                .use(remarkParse)   
                .use(remarkGfm)
                .use(remarkMath)
                .use(remarkRehype, {allowDangerousHtml: true})
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

    // 保存内容
    const handleSave = async () => {
        try {
            file.title = title;
            file.content = content;
            file.date = new Date().toLocaleString();
            await file.save();
            alert('保存成功！');
        } catch (error) {
            console.error('Failed to save:', error);
            alert('保存失败：' + error.message);
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
                <button onClick={handleSave} className={styles.saveButton}>
                    保存
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