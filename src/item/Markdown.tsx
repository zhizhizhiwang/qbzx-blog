'use client';
import { useEffect, useRef, useState } from "react";
import { unified } from 'unified';
import markdownConvert from "@/lib/markdownConvert";
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
            const result = await markdownConvert(content);
            if (cancelled) return;
            setHtml(result);
        };
        render();
        return () => { cancelled = true; };
    }, [content]);

    return (
        <div
            ref={ref}
            className={`markdown-body ${className || ''} markdown-edited`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}