import dynamic from "next/dynamic";
import React, { FC, useRef } from "react";
import "suneditor/dist/css/suneditor.min.css";
import { PostRequest } from "@/plugins/https";
import axios from "axios";

interface CustomSunEditorProps {
    value: string;
    onChange: (content: string) => void;
    // setOptions?: any;
    additionalOptions?: any; // Define your additional options here
    error?: any;
    features?:any;

}

const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
});

const CustomSunEditor: FC<CustomSunEditorProps> = ({
    value,
    onChange,
    //   additionalOptions,
    features,
    error,
}) => {
    const editor = useRef("");
    
    const getSunEditorInstance = (sunEditor: any) => {
        editor.current = sunEditor;
    };

    const additionalOptions = {
        font: ["Arial", "tahoma", "Courier New,Courier", "Montserrat"],
        buttonList: [
            [
                "undo",
                "redo",
                "font",
                "fontSize",
                "formatBlock",
                "paragraphStyle",
                "blockquote",
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
                "fontColor",
                "hiliteColor",
                "textStyle",
                "removeFormat",
                "outdent",
                "indent",
                "align",
                "horizontalRule",
                "list",
                "lineHeight",
                "link",
                "fullScreen",
                "showBlocks",
                "codeView",
                "preview",
                ...features || [],
            ],
        ],
        colorList: ["#377737", "#F4B519", "#0096B7", "#FFF1CD", "#FFFFFF", "#000000"],

        tableResizable: true, // Enable table resizing
        imageResizable: true, // Enable image resizing
        setDefaultStyle: `
      body {
        font-family: 'Montserrat', sans-serif;
      }
    `,
    };

   
    return (
        <div className="flex flex-col gap-1">
            <SunEditor
                setContents={value}
                getSunEditorInstance={getSunEditorInstance}
                onChange={onChange}
                setOptions={{
                    ...additionalOptions,
                }}
            />
            {error && <p className="text-xs text-red-800">{error}</p>}
        </div>
    );
};

export default CustomSunEditor;
