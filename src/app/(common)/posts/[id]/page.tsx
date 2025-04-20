import Title from "@/item/title";
export const runtime = 'edge';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Post({ params }: PageProps) {
    const { id } = await params;

    return (
        <>
            <Title text={`文章 ${id}`} subtitle={`文章详情 ${id}`} />
            <div>
                <p>文章内容: {id}</p>
            </div>
        </>
    );
}
