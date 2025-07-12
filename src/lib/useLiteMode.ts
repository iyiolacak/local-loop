import React from "react";
import { isLowEndDevice } from "./capabilities";

export const useLiteMode = () => {
    const [isLiteMode, setIsLiteMode] = React.useState(false);

    React.useEffect(() => {

        const result = isLowEndDevice();
            console.log(`[LiteMode] Device is ${result ? "LOW-END" : "capable"}`)
            setIsLiteMode(result);
    }, []);
        
    return isLiteMode;
}