import Title from "@/item/title";

interface PageProps {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined }
}

export default function Post({ params, searchParams }: PageProps) {
    const { id } = params;

    return (
        <>
            <Title text={`文章 ${id}`} subtitle={`文章详情 ${id}`} />
            <div>
                <p>文章内容: {id}</p>
            </div>
        </>
    );
}
