import 'katex/dist/katex.min.css';
import "highlight.js/styles/github.css";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight'
import rehypeFormat from 'rehype-format';
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm';
import rehypeMathJaxSvg from 'rehype-mathjax/svg';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import remarkMermaid from 'remark-mermaidjs';

export const runtime = "edge";

export default async function markdownConvert(markdown: string): Promise<string> {
    const html_content = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkMermaid)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeMathJaxSvg)
        .use(rehypeFormat, { blanks: ['body', 'head'], indent: '\t' })
        .use(rehypeStringify)
        .process(markdown);

    return String(html_content);
}