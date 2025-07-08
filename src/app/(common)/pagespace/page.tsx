import { Metadata } from "next";
import FileList from "../FileList";
import { FileListItem } from "@/app/api/files/list/route";
import Title from "@/item/title";

export const runtime = 'edge';

export const metadata: Metadata = {
    title: "文章广场",
    description: "文章列表",
    icons: {
        icon: '/qbbs.png',
    },
}

export default function pageList() {
    return (
        <>
            <Title text="文章广场" />
            <FileList 
                controlOptions={{
                    showTitle: true,
                    showDate: true,
                    showLikes: true,
                    showOwner: true,
                    maxLineItem: 2
                }}

                filter={
                    (file: FileListItem) => {
                        return file.tags.includes("文章") || !file.tags.includes("--no-show");
                    }
                }
                order={{orderBy: "date", desc: false}}
            />
        </>
    )



}