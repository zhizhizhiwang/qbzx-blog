import Title from "@/item/title";

export const runtime = 'edge'

export default function About() {
    return (
        <>
            <Title text="关于" subtitle="关于本站"/>
            <div>
                <p>这是一个使用 Next.js 搭建的简单博客站点。</p>
            </div>
        </>
    );
}
