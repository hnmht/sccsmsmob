import { ScDataType, VoucherFile } from "../types/public";
import { getEmptyFile } from "./file";
import { getEmptyPerson } from "./person";

export function getEmptyQueryParams<T>(ts: string): T {
    const emptyParam = {
        queryTs: ts,
        resultNumber: 0,
        delItems: [],
        updateItems: [],
        newItems: [],
        resultTs: ts
    } as T;
    return emptyParam;
}

export function getDefaultDataType(): ScDataType {
    const dataType: ScDataType = {
        id: 301,
        code: "ScTextInput",
        name: "text",
        dataType: "string",
        frontDb: "",
        inputMode: "Input"
    }
    return dataType
}

export function getEmptyVoucherFile(): VoucherFile {
    const vFile: VoucherFile = {
        id: 0,
        billBID: 0,
        billHID: 0,
        file: getEmptyFile(),
        createDate: "",
        creator: getEmptyPerson(),
        modifyDate: "",
        modifier: getEmptyPerson(),
        ts: "",
        dr: 0,
    }

    return vFile
}