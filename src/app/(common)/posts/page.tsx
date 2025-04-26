// src/app/(common)/blog/page.tsx (博客列表页面)
import Link from 'next/link';
import { getAllPostsMetadata } from '@/lib/posts'; // 导入获取元数据的函数
import Title from '@/item/title';
// export const runtime = 'edge';

const  BlogListPage = async () =>  {
    const posts = await getAllPostsMetadata(); // 在构建时/服务器端执行文件读取

    return (
        <div>
            <Title text='所有文章'/>
            <ul>
                
            </ul>
        </div>
    );
};

export default BlogListPage;