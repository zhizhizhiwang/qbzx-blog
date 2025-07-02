import cardstyles from "@/css/cards.module.css";
import { FileListItem } from "@/app/api/files/list/route";
import Card from './CardItem';
import { headers } from "next/headers";

const runtime = 'edge';

interface FilterOptions {
    requiredTag?: string[];
    excludeTag?: string[];
}
interface OrderOptions {
    orderBy?: 'date' | 'likes' | 'title' | 'owner' | 'random';
    desc?: boolean;
}

type FilterType = FilterOptions | ((file: FileListItem) => boolean);
type OrderType = OrderOptions | ((a: FileListItem, b: FileListItem) => number);

interface FileListProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    controlOptions?: {
        showTitle?: boolean;
        showDate?: boolean;
        showLikes?: boolean;
        showOwner?: boolean;
        maxLineItem?: number;
    };
    order?: OrderType;
    filter?: FilterType;
    maxItemNum?: number;
}

/** 文件列表组件
 * 
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} [props.children] - 子组件, 会在每个cardhtml后面渲染
 * @param {string} props.origin - API请求的源地址, 用于获取文件列表
 * @param {string} [props.className] - 组件的CSS类名, 应用在顶层
 * @param {React.CSSProperties} [props.style] - 组件的内联样式, 应用在顶层
 * @param {Object} [props.controlOptions] - 控制选项
 * @param {boolean} [props.controlOptions.showTitle] - 是否显示标题
 * @param {boolean} [props.controlOptions.showDate] - 是否显示日期
 * @param {boolean} [props.controlOptions.showLikes] - 是否显示点赞数
 * @param {boolean} [props.controlOptions.showOwner] - 是否显示作者
 * @param {number} [props.controlOptions.maxLineItem] - 每行最大数量
 * @param {OrderType} [props.order] - 排序方式, 可以是函数或对象
 * @param {FilterType} [props.filter] - 过滤方式, 可以是函数或对象
 * @param {number} [props.maxItemNum] - 最大显示的文件数量, 如果不设置则显示所有文件
*/
export default async function FileList(props: FileListProps) {
    const {
        children,
        className,
        style,
        controlOptions,
        order,
        filter,
        maxItemNum,
    } = props;

    const headerList = await headers();
    const host = headerList.get('host');
    if (!host) throw new Error("无法获取请求源");
    const origin = `http${host.startsWith('localhost') ? '' : 's'}://${host}`;

    let files: FileListItem[] = [];
    
    // 生成排序函数（多态）
    let finalOrderFunc: (a: FileListItem, b: FileListItem) => number;
    if (typeof order === "function") {
        finalOrderFunc = order;
    } else if (order && typeof order === "object") {
        if (order.orderBy === 'likes') {
            finalOrderFunc = (a, b) => (order.desc ? b.likes.length - a.likes.length : a.likes.length - b.likes.length);
        } else if (order.orderBy === 'date') {
            finalOrderFunc = (a, b) => (order.desc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
        } else if (order.orderBy === 'title') {
            finalOrderFunc = (a, b) => (order.desc ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title));
        } else if (order.orderBy === 'owner') {
            finalOrderFunc = (a, b) => (order.desc ? b.owner.localeCompare(a.owner) : a.owner.localeCompare(b.owner));
        } else if (order.orderBy === 'random') {
            finalOrderFunc = () => Math.random() - 0.5;
        } else {
            finalOrderFunc = (a, b) => a.date.localeCompare(b.date);
        }
    } else {
        finalOrderFunc = (a, b) => a.date.localeCompare(b.date);
    }

    // 生成过滤函数（多态）
    let finalFilterFunc: (file: FileListItem) => boolean;
    if (typeof filter === "function") {
        finalFilterFunc = filter;
    } else if (filter && typeof filter === "object") {
        finalFilterFunc = (file) => {
            if (filter.excludeTag && file.tags?.some(tag => filter.excludeTag!.includes(tag))) return false;
            if (filter.requiredTag && filter.requiredTag.length > 0) {
                if (!file.tags?.some(tag => filter.requiredTag!.includes(tag))) return false;
            }
            return true;
        };
    } else {
        finalFilterFunc = () => true;
    }


    const req = await fetch(`${origin}/api/files/list`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!req.ok) throw new Error("获取文件列表失败");
    const data = await req.json();
    files = data as FileListItem[];

    const sortedFiles = files.slice().sort(finalOrderFunc);
    const filteredFiles = sortedFiles.filter(finalFilterFunc);

    if(filteredFiles.length === 0) {
        console.warn("没有符合条件的文件");
        return <div style={{ color: 'orange' }}>⚠ 没有符合条件的文件</div>;
    }

    const limitedFiles = maxItemNum ? filteredFiles.slice(0, maxItemNum) : filteredFiles;



    return (
        <div className={`${cardstyles.cards} ${className ?? ''}`} 
        style={{ 
            ...style, 
            ['--max-line-item' as any]: controlOptions?.maxLineItem || 3 
            }}>
            {limitedFiles.map((file) => (
                <div key={file.key} className={cardstyles.card_item}>
                    <Card file={file} controlOptions={controlOptions} />
                    {children}
                </div>
            ))}
        </div>
    );
}
