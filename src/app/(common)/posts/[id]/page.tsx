import Title from "@/item/title";
import { getPostData } from "@/lib/posts"; // 导入获取文章数据的函数

export const runtime = 'edge'; // 让这个页面在边缘计算上运行

export default async function PostPage({ params }) {
    const { id } = await params;

    return (
        <>
            <Title text={id} />
            <p>文章 ID: {id}</p>
            {await getPostData(id).then((data) => {
                return (
                    <div>
                        <h2>{data.title}</h2> {/* 显示文章标题 */}
                        <div dangerouslySetInnerHTML={{ __html: data.content }} />
                    </div>
                );
            })};
            
        </>
    )
}