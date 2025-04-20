import Title from "@/item/title";

interface Props {
    params: { id: string };
}

export default function Post({ params }: Props) {
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
