// Alert.tsx
import { on } from "events";
import React from "react";
import itemStyles from "@/css/item.module.css"
import { title } from "process";

export default function Alert({ message, onClose, title, style, element }: 
    { message: string, onClose?: () => void , title?: string, style?: React.CSSProperties, element?: React.ReactNode }) 
    {
    if (!onClose) {
        onClose = () => {
            message = "";
        }
    }
    
    const useTitle = title ? title : "";
    return (
        <div className={`alert ${itemStyles.alert}`} style={style}>
            {title !== "" && <span className={itemStyles.alert_title}>{useTitle}</span>}
            <span>{message}</span>
            <div>
                {element && element}
                <button onClick={onClose}>关闭通知</button>
            </div>

        </div>
    );
}