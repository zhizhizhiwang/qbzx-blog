'use client';
import { useEffect, useRef, useState } from "react";
import markdownConvert from "@/lib/markdownConvert";
import 'katex/dist/katex.min.css';
import "highlight.js/styles/github.css";
import 'github-markdown-css/github-markdown.css';

export const runtime = "edge";

interface MarkdownProps {
    content: string;
    convertOptions?: { [key: string]: any };
    className?: string;
    style?: React.CSSProperties;
}

export default function Markdown({ content, className, style, convertOptions }: MarkdownProps) {
    const [html, setHtml] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        const render = async () => {
            const result = await markdownConvert(content, { ...convertOptions });
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
            style={style}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}