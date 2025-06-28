'use client';

import cardstyles from "@/css/cards.module.css";
import { FileListItem } from "@/app/api/files/list/route";
import { useEffect, useState } from "react";
import Card from './CardItem';

const runtime = 'edge';

interface FilterOptions {
    requiredTag?: string[];
    excludeTag?: string[];
}
interface OrderOptions {
    orderBy?: 'date' | 'likes' | 'title' | 'owner' | 'random';
    desc?: boolean;
}


/** 文件列表组件 
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} [props.children] - 子组件, 会在每个cardhtml后面渲染
 * @param {string} [props.className] - 组件的CSS类名, 应用在顶层
 * @param {React.CSSProperties} [props.style] - 组件的内联样式, 应用在顶层
 * @param {Object} [props.controlOptions] - 控制选项
 * @param {boolean} [props.controlOptions.showTitle] - 是否显示标题
 * @param {boolean} [props.controlOptions.showDate] - 是否显示日期
 * @param {boolean} [props.controlOptions.showLikes] - 是否显示点赞数
 * @param {boolean} [props.controlOptions.showOwner] - 是否显示作者
 * @param {number} [props.controlOptions.maxLineItem] - 每行最大数量
 * @param {(a: FileListItem, b: FileListItem) => number} [props.orderfunc] - 自定义排序函数
 * @param {(file: FileListItem) => boolean} [props.fliterfunc] - 自定义过滤函数
 * @param {number} [props.maxItemNum] - 最大显示的文件数量, 如果不设置则显示所有文件
 * @param {FilterOptions} [props.filterOptions] - 过滤选项, 会被自定义过滤函数覆盖
 * @param {OrderOptions} [props.orderOptions] - 排序选项, 会被自定义排序函数覆盖
*/
export default function FileList({
    children,
    className,
    style,
    controlOptions,
    orderfunc,
    fliterfunc,
    maxItemNum,
    filterOptions,
    orderOptions
}: {
    children?: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    controlOptions?: {
        showTitle?: boolean,
        showDate?: boolean,
        showLikes?: boolean,
        showOwner?: boolean,
        maxLineItem?: number,
    },
    orderfunc?: (a: FileListItem, b: FileListItem) => number,
    fliterfunc?: (file: FileListItem) => boolean,
    maxItemNum?: number,
    filterOptions?: FilterOptions,
    orderOptions?: OrderOptions
}) {
    const [files, setFiles] = useState<FileListItem[]>([]);
    const [loading, setLoading] = useState(true);

    // 生成排序函数
    let finalOrderFunc = orderfunc;
    if (!finalOrderFunc) {
        if (!orderOptions) {
            finalOrderFunc = (a, b) => a.date.localeCompare(b.date);
        } else if (orderOptions.orderBy === 'likes') {
            finalOrderFunc = (a, b) => (orderOptions.desc ? b.likes - a.likes : a.likes - b.likes);
        } else if (orderOptions.orderBy === 'date') {
            finalOrderFunc = (a, b) => (orderOptions.desc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
        } else if (orderOptions.orderBy === 'title') {
            finalOrderFunc = (a, b) => (orderOptions.desc ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title));
        } else if (orderOptions.orderBy === 'owner') {
            finalOrderFunc = (a, b) => (orderOptions.desc ? b.owner.localeCompare(a.owner) : a.owner.localeCompare(b.owner));
        } else if (orderOptions.orderBy === 'random') {
            finalOrderFunc = () => Math.random() - 0.5;
        }
    }

    // 生成过滤函数
    let finalFilterFunc = fliterfunc;
    if (!finalFilterFunc) {
        if(!filterOptions) finalFilterFunc = (file) => true;
        else finalFilterFunc = (file) => {
            if (filterOptions.excludeTag &&
                file.tags?.some(tag => (filterOptions.excludeTag ?? ['--no-show']).includes(tag))) return false;

            if (filterOptions.requiredTag && filterOptions.requiredTag.length > 0) 
                if( !file.tags?.some(tag => (filterOptions.requiredTag ?? []).includes(tag)) ) return false;
                // 这里必须要有 ?? [] , 我确信这是一个ts bug
                // 如果这个 [] 真的被选中, 就会把所有的都排除掉
            return true;
        };
    }

    useEffect(() => {
        fetch('/api/files/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("获取文件列表失败");
                return res.json();
            })
            .then(data => setFiles(data))
            .catch(err => alert(err.message))
            .finally(() => setLoading(false));
    }, []);

    const sortedFiles = files.slice().sort(finalOrderFunc);
    const filteredFiles = sortedFiles.filter(finalFilterFunc);

    if(filteredFiles.length === 0) {
        console.warn("没有符合条件的文件");
        return <div style={{ color: 'orange' }}>⚠ 没有符合条件的文件</div>;
    }

    const limitedFiles = maxItemNum ? filteredFiles.slice(0, maxItemNum) : filteredFiles;

    if (loading) return <div>加载中...</div>;

    return (
        <div className={`${cardstyles.cards} ${className}`} style={style}>
            {limitedFiles.map((file) => (
                <div key={file.key} className={cardstyles.card_item}>
                    <Card file={file} controlOptions={controlOptions} />
                    {children}
                </div>
            ))}
        </div>
    );
}
