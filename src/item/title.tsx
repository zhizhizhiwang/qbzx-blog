import style from "@/css/item.module.css";

interface TitleProps {
    text: string;
    subtitle?: string;
}

export default function Title({ text, subtitle = "" }: TitleProps) {
    return (
        <div className={style.title}>
            <h1>{text}</h1>
            <p>{subtitle}</p>
            <hr />
        </div>
    );
}