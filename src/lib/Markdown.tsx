'use client';
import { useEffect, useRef, useState } from "react";
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
import 'katex/dist/katex.min.css';
import "highlight.js/styles/github.css";
import 'github-markdown-css/github-markdown.css';

interface MarkdownProps {
    content: string;
    className?: string;
}

export default function Markdown({ content, className }: MarkdownProps) {
    const [html, setHtml] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        const render = async () => {
            const result = await unified()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkMath)
                // 不用 remark-mermaidjs
                .use(remarkRehype, { allowDangerousHtml: true })
                .use(rehypeRaw)
                .use(rehypeHighlight)
                .use(rehypeMathJaxSvg)
                .use(rehypeFormat, { blanks: ['body', 'head'], indent: '\t' })
                .use(rehypeStringify)
                .process(content);
            if (!cancelled) setHtml(result.toString());
        };
        render();
        return () => { cancelled = true; };
    }, [content]);

    useEffect(() => {
        // 客户端渲染 mermaid
        if (ref.current && html.includes('class="mermaid"')) {
            import('mermaid').then((mermaid) => {
                mermaid.default.initialize({ startOnLoad: false });
                mermaid.default.init(undefined, ref.current!.querySelectorAll('.mermaid'));
            });
        }
    }, [html]);

    return (
        <div
            ref={ref}
            className={`markdown-body ${className || ''} markdown-edited`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}