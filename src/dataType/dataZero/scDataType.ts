import { ScDataType } from "../types/scDataType";
export function getDefaultDataType(): ScDataType {
    const dataType: ScDataType = {
        id: 301,
        code: "ScTextInput",
        name: "text",
        dataType: "string",
        frontDb: "",
        inputMode: "Input"
    }
    return dataType;
}