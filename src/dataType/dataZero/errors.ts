import { ToErrorType } from "../types/errors";
import { ErrMsg } from "../types/scInput";

export function getFieldErrMsg<T extends object>(
    obj: T,
    defaultValue: ErrMsg
): ToErrorType<T> {
    const result = {} as ToErrorType<T>;
    for (const key of Object.keys(obj) as Array<keyof T>) {
        result[key] = { ...defaultValue };
    }
    return result;
}