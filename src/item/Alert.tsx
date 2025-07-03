// Alert.tsx
import { on } from "events";
import React from "react";
import itemStyles from "@/css/item.module.css"

export default function Alert({ message, onClose, title = "提示" }: { message: string, onClose?: () => void , title?: string }) {
    if (!onClose) {
        onClose = () => {
            message = "";
        }
    }
    return (
        <div className={`alert ${itemStyles.alert}`}>
            <title>{title}</title>
            <span>{message}</span>

            <button onClick={onClose}>确定</button>
        </div>
    );
}